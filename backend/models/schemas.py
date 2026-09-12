from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    organization: str
    designation: Optional[str] = None
    gstin: Optional[str] = None
    token: str


class RequirementModel(BaseModel):
    id: str
    category: str
    title: str
    description: str
    required_value: str
    mandatory: bool


class TenderCreate(BaseModel):
    title: str
    gem_id: str
    department: str
    category: str
    value: str
    deadline: str
    description: str


class TenderResponse(BaseModel):
    id: str
    provider_id: str
    title: str
    gem_id: str
    department: str
    category: str
    value: str
    deadline: str
    status: str
    created_at: str
    description: str
    requirements: List[RequirementModel] = []


class RequirementAnalysis(BaseModel):
    req_id: str
    status: str  # PASS | FAIL | REVIEW
    found_value: Optional[str]
    required_value: str
    evidence_doc: Optional[str]
    evidence_page: Optional[int]
    reason: str
    risk: Optional[str]


class AnalysisResult(BaseModel):
    overall_score: int
    scores: dict
    risk_level: str
    pass_count: int
    review_count: int
    fail_count: int
    evidence_coverage: int
    recommendation: str
    critical_issues: List[str]
    requirements_analysis: List[RequirementAnalysis]


class BidResponse(BaseModel):
    id: str
    tender_id: str
    contractor_id: str
    contractor_name: str
    submitted_at: str
    status: str
    documents: List[str]
    analysis: Optional[AnalysisResult]


class BidSubmit(BaseModel):
    tender_id: str
    documents: List[str]


class PreBidCheckRequest(BaseModel):
    tender_id: str
    documents: List[str]
