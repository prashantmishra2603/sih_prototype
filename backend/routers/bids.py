import json
import logging
import uuid
from datetime import date, datetime
from fastapi import APIRouter, HTTPException
from models.schemas import BidSubmit, PreBidCheckRequest
from services.ai_analysis import generate_prebid_analysis

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/bids", tags=["bids"])

BIDS_PATH = "data/bids.json"
TENDERS_PATH = "data/tenders.json"
NOTIFICATIONS_PATH = "data/notifications.json"


def load_bids():
    with open(BIDS_PATH, "r") as f:
        return json.load(f)


def save_bids(data):
    with open(BIDS_PATH, "w") as f:
        json.dump(data, f, indent=2)


def load_tenders():
    with open(TENDERS_PATH, "r") as f:
        return json.load(f)


def load_notifications():
    try:
        with open(NOTIFICATIONS_PATH, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_notifications(data):
    with open(NOTIFICATIONS_PATH, "w") as f:
        json.dump(data, f, indent=2)


def create_high_risk_notification(tender: dict, bid: dict, analysis: dict):
    try:
        provider_id = tender.get("provider_id")
        if not provider_id:
            return

        notifications = load_notifications()
        bid_id = bid.get("id")

        # Duplicate protection
        for n in notifications:
            if (
                n.get("user_id") == provider_id
                and n.get("bid_id") == bid_id
                and n.get("severity") == "HIGH"
            ):
                return

        critical_issues = analysis.get("critical_issues") or []
        reason = (
            critical_issues[0]
            if critical_issues
            else f"Bid compliance score ({analysis.get('overall_score', 0)}%) indicates high risk factors."
        )

        tender_id = tender.get("id", bid.get("tender_id"))
        new_notification = {
            "id": f"notif_{uuid.uuid4().hex[:6]}",
            "user_id": provider_id,
            "tender_id": tender_id,
            "bid_id": bid_id,
            "type": "critical",
            "severity": "HIGH",
            "title": "High Risk Bid Detected",
            "message": f"Bid {bid_id} for Tender {tender_id} has been classified as HIGH risk.",
            "reason": reason,
            "read": False,
            "created_at": datetime.now().isoformat()
        }
        notifications.append(new_notification)
        save_notifications(notifications)
    except Exception as e:
        logger.error(f"Failed to create high risk notification: {e}")


@router.get("/")
def get_bids(contractor_id: str = None):
    bids = load_bids()
    if contractor_id:
        bids = [b for b in bids if b.get("contractor_id") == contractor_id]
    return bids


@router.get("/{bid_id}")
def get_bid(bid_id: str):
    bids = load_bids()
    bid = next((b for b in bids if b["id"] == bid_id), None)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    return bid


@router.get("/{bid_id}/analysis")
def get_bid_analysis(bid_id: str):
    bids = load_bids()
    bid = next((b for b in bids if b["id"] == bid_id), None)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    if not bid.get("analysis"):
        raise HTTPException(status_code=404, detail="Analysis not available")
    return bid["analysis"]


@router.post("/submit")
def submit_bid(bid: BidSubmit, contractor_id: str, contractor_name: str):
    bids = load_bids()
    tenders = load_tenders()

    tender = next((t for t in tenders if t["id"] == bid.tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    # Auto-run AI analysis on submission so contractor sees results immediately
    analysis = None
    if tender.get("requirements"):
        try:
            analysis = generate_prebid_analysis(tender["requirements"], bid.documents)
        except Exception:
            analysis = None

    new_bid = {
        "id": f"bid_{uuid.uuid4().hex[:6]}",
        "tender_id": bid.tender_id,
        "contractor_id": contractor_id,
        "contractor_name": contractor_name,
        "submitted_at": str(date.today()),
        "status": "submitted",
        "documents": bid.documents,
        "analysis": analysis
    }
    bids.append(new_bid)
    save_bids(bids)

    # Risk trigger: create persistent notification for tender provider if bid is HIGH risk
    if analysis and analysis.get("risk_level") == "HIGH":
        create_high_risk_notification(tender, new_bid, analysis)

    return new_bid


@router.post("/precheck")
def pre_bid_check(request: PreBidCheckRequest):
    tenders = load_tenders()
    tender = next((t for t in tenders if t["id"] == request.tender_id), None)
    if not tender:
        raise HTTPException(status_code=404, detail="Tender not found")

    analysis = generate_prebid_analysis(tender["requirements"], request.documents)
    return {
        "tender_id": request.tender_id,
        "tender_title": tender["title"],
        "analysis": analysis
    }


@router.post("/{bid_id}/decision")
def update_decision(bid_id: str, decision: str, officer_note: str = ""):
    bids = load_bids()
    bid = next((b for b in bids if b["id"] == bid_id), None)
    if not bid:
        raise HTTPException(status_code=404, detail="Bid not found")
    bid["officer_decision"] = decision
    bid["officer_note"] = officer_note
    bid["status"] = decision.lower()
    save_bids(bids)
    return {"message": f"Decision '{decision}' recorded", "bid_id": bid_id}
