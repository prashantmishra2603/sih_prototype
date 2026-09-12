import json
import uuid
from datetime import date
from fastapi import APIRouter, HTTPException
from models.schemas import TenderCreate, TenderResponse
from typing import List

router = APIRouter(prefix="/tenders", tags=["tenders"])

DATA_PATH = "data/tenders.json"
BIDS_PATH = "data/bids.json"


def load_tenders():
    with open(DATA_PATH, "r") as f:
        return json.load(f)


def save_tenders(data):
    with open(DATA_PATH, "w") as f:
        json.dump(data, f, indent=2)


def load_bids():
    with open(BIDS_PATH, "r") as f:
        return json.load(f)


@router.get("/", response_model=List[TenderResponse])
def get_tenders(provider_id: str = None):
    tenders = load_tenders()
    if provider_id:
        tenders = [t for t in tenders if t["provider_id"] == provider_id]
    return tenders


@router.get("/{tender_id}", response_model=TenderResponse)
def get_tender(tender_id: str):
    tenders = load_tenders()
    tender = next((t for t in tenders if t["id"] == tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")
    return tender


@router.post("/", response_model=TenderResponse)
def create_tender(tender: TenderCreate, provider_id: str):
    tenders = load_tenders()
    new_tender = {
        "id": f"tender_{uuid.uuid4().hex[:6]}",
        "provider_id": provider_id,
        "title": tender.title,
        "gem_id": tender.gem_id,
        "department": tender.department,
        "category": tender.category,
        "value": tender.value,
        "deadline": tender.deadline,
        "status": "open",
        "created_at": str(date.today()),
        "description": tender.description,
        "requirements": []
    }
    tenders.append(new_tender)
    save_tenders(tenders)
    return new_tender


@router.get("/{tender_id}/bids")
def get_tender_bids(tender_id: str):
    bids = load_bids()
    return [b for b in bids if b["tender_id"] == tender_id]


@router.get("/{tender_id}/compare")
def compare_bidders(tender_id: str):
    bids = load_bids()
    tender_bids = [b for b in bids if b["tender_id"] == tender_id]
    comparison = []
    for bid in tender_bids:
        if bid.get("analysis"):
            analysis = bid["analysis"]
            comparison.append({
                "bid_id": bid["id"],
                "contractor_name": bid["contractor_name"],
                "overall_score": analysis["overall_score"],
                "risk_level": analysis["risk_level"],
                "pass_count": analysis["pass_count"],
                "review_count": analysis["review_count"],
                "fail_count": analysis["fail_count"],
                "recommendation": analysis["recommendation"],
                "scores": analysis["scores"],
                "evidence_coverage": analysis["evidence_coverage"],
                "submitted_at": bid["submitted_at"]
            })
    comparison.sort(key=lambda x: x["overall_score"], reverse=True)
    return comparison
