from fastapi import APIRouter, HTTPException, status, Depends

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.auth.jwt_handler import get_current_user
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.auth.jwt_handler import get_current_user

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM notifications WHERE user_id = ? ORDER BY id DESC LIMIT 30", (user_id,))
        notifs = dicts_from_rows(cursor.fetchall())
        unread_count = sum(1 for n in notifs if not n["is_read"])
        return {"notifications": notifs, "unread_count": unread_count}

@router.put("/{notif_id}/read")
def mark_read(notif_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?", (notif_id, user_id))
        return {"message": "Notification marked as read"}

@router.put("/read-all")
def mark_all_read(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("UPDATE notifications SET is_read = 1 WHERE user_id = ?", (user_id,))
        return {"message": "All notifications marked as read"}
