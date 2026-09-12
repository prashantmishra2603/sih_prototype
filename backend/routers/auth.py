import json
import uuid
from fastapi import APIRouter, HTTPException
from models.schemas import LoginRequest, UserResponse

router = APIRouter(prefix="/auth", tags=["auth"])

DATA_PATH = "data/users.json"


def load_users():
    with open(DATA_PATH, "r") as f:
        return json.load(f)


@router.post("/login", response_model=UserResponse)
def login(request: LoginRequest):
    users = load_users()
    user = next((u for u in users if u["email"] == request.email and u["password"] == request.password), None)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {
        **user,
        "token": f"mock_token_{user['id']}_{uuid.uuid4().hex[:8]}"
    }


@router.get("/me")
def get_me(email: str):
    users = load_users()
    user = next((u for u in users if u["email"] == email), None)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
