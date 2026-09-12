"""
AI Analysis Service — Simulates intelligent compliance checking
for the BidShield AI prototype.
"""
import random
from typing import List, Dict, Any


def generate_prebid_analysis(tender_requirements: List[Dict], documents: List[str]) -> Dict:
    """
    Simulate pre-bid compliance check for a contractor.
    Returns structured analysis based on uploaded documents vs requirements.
    """
    doc_names_lower = [d.lower() for d in documents]

    def has_doc_type(keywords):
        return any(any(kw in doc for kw in keywords) for doc in doc_names_lower)

    requirements_analysis = []

    doc_map = {
        "Financial": has_doc_type(["turnover", "financial", "balance", "ca_cert", "audited"]),
        "Eligibility_Exp": has_doc_type(["experience", "exp", "work_order", "completion"]),
        "Technical_ISO": has_doc_type(["iso", "certificate", "cert"]),
        "Technical_Spec": has_doc_type(["spec", "technical", "product", "brochure"]),
        "GST": has_doc_type(["gst", "tax"]),
        "Company": has_doc_type(["incorporation", "company", "registration", "cin"]),
        "EMD": has_doc_type(["emd", "bid_security", "bank_guarantee", "earnest"]),
        "GeM": has_doc_type(["gem", "marketplace"]),
    }

    for req in tender_requirements:
        cat = req["category"]
        title = req["title"].lower()
        status = "REVIEW"
        found_value = "Not clearly identified"
        reason = "Document found but specific value could not be extracted automatically."
        risk = "MEDIUM"
        evidence_doc = None
        evidence_page = None

        if cat == "Financial":
            if doc_map["Financial"]:
                r = random.random()
                if r > 0.3:
                    status = "PASS"
                    found_value = f"₹{random.randint(10, 25)}.{random.randint(0,9)} Crore"
                    reason = f"Turnover certificate found. Extracted value {found_value} meets/exceeds requirement."
                    risk = None
                    evidence_doc = next((d for d in documents if any(k in d.lower() for k in ["turnover", "financial", "balance"])), documents[0])
                    evidence_page = random.randint(2, 6)
                else:
                    status = "REVIEW"
                    found_value = f"₹{random.randint(5, 9)}.{random.randint(0,9)} Crore"
                    reason = "Turnover appears below requirement. Manual verification recommended."
                    risk = "HIGH"
                    evidence_doc = documents[0]
                    evidence_page = random.randint(1, 4)
            else:
                status = "FAIL"
                found_value = "Not Found"
                reason = "No financial/turnover document detected in uploaded files."
                risk = "HIGH"

        elif cat == "Eligibility":
            if "experience" in title or "years" in title:
                if doc_map["Eligibility_Exp"]:
                    r = random.random()
                    if r > 0.4:
                        yrs = random.randint(5, 10)
                        status = "PASS"
                        found_value = f"{yrs} years"
                        reason = f"Experience certificate shows {yrs} years of relevant experience."
                        risk = None
                        evidence_doc = next((d for d in documents if any(k in d.lower() for k in ["exp", "experience", "completion"])), documents[0])
                        evidence_page = random.randint(3, 9)
                    else:
                        yrs = random.randint(2, 4)
                        status = "FAIL"
                        found_value = f"{yrs} years"
                        reason = f"Experience certificate shows only {yrs} years, below required threshold."
                        risk = "HIGH"
                        evidence_doc = documents[0]
                        evidence_page = random.randint(5, 10)
                else:
                    status = "FAIL"
                    found_value = "Not Found"
                    reason = "No experience certificate found in submitted documents."
                    risk = "HIGH"
            elif "government" in title or "project" in title:
                if doc_map["Eligibility_Exp"]:
                    proj = random.randint(2, 6)
                    status = "PASS"
                    found_value = f"{proj} government projects"
                    reason = f"Work orders/completion certificates for {proj} government projects found."
                    risk = None
                    evidence_doc = next((d for d in documents if "exp" in d.lower() or "work" in d.lower()), documents[0])
                    evidence_page = random.randint(4, 8)
                else:
                    status = "REVIEW"
                    found_value = "Unclear"
                    reason = "Government project evidence not clearly identified."
                    risk = "MEDIUM"
            elif "gem" in title:
                if doc_map["GeM"]:
                    status = "PASS"
                    found_value = f"GeM Seller ID: GEM-TMP-{random.randint(1000,9999)}"
                    reason = "GeM registration document found with active seller ID."
                    risk = None
                    evidence_doc = next((d for d in documents if "gem" in d.lower()), documents[-1])
                    evidence_page = 1
                else:
                    status = "FAIL"
                    found_value = "Not Found"
                    reason = "GeM registration document not uploaded."
                    risk = "HIGH"

        elif cat == "Technical":
            if "iso 9001" in title.lower():
                if doc_map["Technical_ISO"]:
                    status = "PASS"
                    found_value = "Valid till 2027"
                    reason = "ISO 9001:2015 certificate found and appears valid."
                    risk = None
                    evidence_doc = next((d for d in documents if "iso" in d.lower() or "cert" in d.lower()), documents[0])
                    evidence_page = 1
                else:
                    status = "FAIL"
                    found_value = "Not Found"
                    reason = "ISO 9001:2015 certificate not found in submitted documents."
                    risk = "HIGH"
            elif "iso 27001" in title.lower():
                if doc_map["Technical_ISO"] and random.random() > 0.5:
                    status = "PASS"
                    found_value = "Valid till 2028"
                    reason = "ISO 27001 certificate identified."
                    risk = None
                    evidence_doc = next((d for d in documents if "iso" in d.lower() or "cert" in d.lower()), documents[0])
                    evidence_page = 2
                else:
                    status = "REVIEW"
                    found_value = "Not Provided"
                    reason = "ISO 27001 not found. Non-mandatory but impacts scoring."
                    risk = "LOW"
            elif "warranty" in title.lower():
                if doc_map["Technical_Spec"]:
                    warranty = random.choice(["2 years", "3 years", "5 years"])
                    if "3" in warranty or "5" in warranty:
                        status = "PASS"
                        reason = f"{warranty} warranty offered, meets/exceeds requirement."
                        risk = None
                    else:
                        status = "REVIEW"
                        reason = "Warranty period appears to be 2 years. Clarification needed for 3rd year coverage."
                        risk = "MEDIUM"
                    found_value = warranty
                    evidence_doc = next((d for d in documents if any(k in d.lower() for k in ["spec", "technical"])), documents[0])
                    evidence_page = random.randint(10, 15)
                else:
                    status = "REVIEW"
                    found_value = "Not specified"
                    reason = "Warranty terms not clearly specified in submitted documents."
                    risk = "MEDIUM"
            else:
                if doc_map["Technical_Spec"]:
                    status = "PASS"
                    found_value = "Specifications provided"
                    reason = "Technical specifications document found and appears compliant."
                    risk = None
                    evidence_doc = next((d for d in documents if any(k in d.lower() for k in ["spec", "technical"])), documents[0])
                    evidence_page = random.randint(3, 8)
                else:
                    status = "REVIEW"
                    found_value = "Not Found"
                    reason = "Technical specification document missing."
                    risk = "MEDIUM"

        elif cat == "Documentation":
            if "gst" in title.lower():
                if doc_map["GST"]:
                    status = "PASS"
                    found_value = f"GSTIN: {random.randint(10,35)}XXXXX{random.randint(1000,9999)}B1Z1"
                    reason = "Valid GST registration certificate found."
                    risk = None
                    evidence_doc = next((d for d in documents if "gst" in d.lower() or "tax" in d.lower()), documents[0])
                    evidence_page = 1
                else:
                    status = "FAIL"
                    found_value = "Not Found"
                    reason = "GST certificate not uploaded."
                    risk = "HIGH"
            elif "company" in title.lower() or "registration" in title.lower():
                if doc_map["Company"]:
                    status = "PASS"
                    found_value = f"CIN: U72900MH{random.randint(2015,2023)}PTC{random.randint(100000,999999)}"
                    reason = "Certificate of Incorporation found and verified."
                    risk = None
                    evidence_doc = next((d for d in documents if any(k in d.lower() for k in ["company", "inc", "reg"])), documents[0])
                    evidence_page = 1
                else:
                    status = "FAIL"
                    found_value = "Not Found"
                    reason = "Company registration document not uploaded."
                    risk = "HIGH"
            elif "emd" in title.lower() or "bid security" in title.lower():
                if doc_map["EMD"]:
                    status = "PASS"
                    found_value = "₹2.5 Lakh EMD submitted"
                    reason = "EMD/Bid security document found."
                    risk = None
                    evidence_doc = next((d for d in documents if any(k in d.lower() for k in ["emd", "bid", "bank", "earnest"])), documents[0])
                    evidence_page = 1
                else:
                    status = "FAIL"
                    found_value = "Not Found"
                    reason = "EMD/Bid security document not found. This is a critical mandatory requirement."
                    risk = "HIGH"

        requirements_analysis.append({
            "req_id": req["id"],
            "status": status,
            "found_value": found_value,
            "required_value": req["required_value"],
            "evidence_doc": evidence_doc,
            "evidence_page": evidence_page,
            "reason": reason,
            "risk": risk,
            "req_title": req["title"],
            "req_category": req["category"],
            "mandatory": req["mandatory"]
        })

    pass_count = sum(1 for r in requirements_analysis if r["status"] == "PASS")
    review_count = sum(1 for r in requirements_analysis if r["status"] == "REVIEW")
    fail_count = sum(1 for r in requirements_analysis if r["status"] == "FAIL")
    total = len(requirements_analysis)

    overall_score = int((pass_count / total) * 100) if total > 0 else 0

    # Breakdown by category
    cat_scores = {}
    cats = ["Financial", "Eligibility", "Technical", "Documentation"]
    for cat in cats:
        cat_reqs = [r for r in requirements_analysis if r["req_category"] == cat]
        if cat_reqs:
            cat_pass = sum(1 for r in cat_reqs if r["status"] == "PASS")
            cat_scores[cat.lower()] = int((cat_pass / len(cat_reqs)) * 100)
        else:
            cat_scores[cat.lower()] = 0

    risk_level = "LOW"
    high_risk_count = sum(1 for r in requirements_analysis if r.get("risk") == "HIGH")
    if high_risk_count >= 3 or fail_count >= 2:
        risk_level = "HIGH"
    elif high_risk_count >= 1 or fail_count >= 1 or review_count >= 3:
        risk_level = "MEDIUM"

    critical_issues = [
        r["reason"] for r in requirements_analysis
        if r["status"] == "FAIL" or r.get("risk") == "HIGH"
    ]

    if risk_level == "HIGH" or fail_count >= 2:
        recommendation = "NOT READY — Critical issues must be resolved before submission."
    elif review_count >= 3 or fail_count >= 1:
        recommendation = "NEEDS IMPROVEMENT — Address highlighted issues to strengthen bid."
    else:
        recommendation = "READY TO SUBMIT — Bid appears compliant. Review flagged items."

    return {
        "overall_score": overall_score,
        "scores": cat_scores,
        "risk_level": risk_level,
        "pass_count": pass_count,
        "review_count": review_count,
        "fail_count": fail_count,
        "evidence_coverage": min(97, overall_score + 10),
        "recommendation": recommendation,
        "critical_issues": critical_issues[:3],
        "requirements_analysis": requirements_analysis
    }
