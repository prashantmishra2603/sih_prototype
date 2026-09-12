import json
import uuid
from datetime import date
from fastapi import APIRouter, HTTPException
from models.schemas import BidSubmit, PreBidCheckRequest
from services.ai_analysis import generate_prebid_analysis

router = APIRouter(prefix="/bids", tags=["bids"])

BIDS_PATH = "data/bids.json"
TENDERS_PATH = "data/tenders.json"


def load_bids():
    with open(BIDS_PATH, "r") as f:
        return json.load(f)


def save_bids(data):
    with open(BIDS_PATH, "w") as f:
        json.dump(data, f, indent=2)


def load_tenders():
    with open(TENDERS_PATH, "r") as f:
        return json.load(f)


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
