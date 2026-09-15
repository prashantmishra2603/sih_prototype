import json
from fastapi import APIRouter, HTTPException
from models.schemas import NotificationResponse
from typing import List

router = APIRouter(prefix="/notifications", tags=["notifications"])

DATA_PATH = "data/notifications.json"


def load_notifications():
    try:
        with open(DATA_PATH, "r") as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def save_notifications(data):
    with open(DATA_PATH, "w") as f:
        json.dump(data, f, indent=2)


@router.get("/", response_model=List[NotificationResponse])
def get_notifications(user_id: str, unread_only: bool = False):
    notifications = load_notifications()
    filtered = [n for n in notifications if n["user_id"] == user_id]
    if unread_only:
        filtered = [n for n in filtered if n["read"] is False]
    filtered.sort(key=lambda n: n["created_at"], reverse=True)
    return filtered


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_notification_read(notification_id: str, user_id: str):
    notifications = load_notifications()
    notification = next((n for n in notifications if n["id"] == notification_id), None)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to update this notification")
    notification["read"] = True
    save_notifications(notifications)
    return notification


@router.patch("/read-all")
def mark_all_read(user_id: str):
    notifications = load_notifications()
    updated = 0
    for n in notifications:
        if n["user_id"] == user_id and n["read"] is False:
            n["read"] = True
            updated += 1
    save_notifications(notifications)
    return {"updated": updated}
