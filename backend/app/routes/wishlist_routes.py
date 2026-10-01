from fastapi import APIRouter, HTTPException, status, Depends

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.auth.jwt_handler import get_current_user
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.auth.jwt_handler import get_current_user

router = APIRouter(prefix="/api/wishlist", tags=["Wishlist"])

@router.get("")
def get_wishlist(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT w.id as wishlist_id, w.created_at,
                   p.id, p.name, p.slug, p.original_price, p.discounted_price, p.discount_percent,
                   p.rating, p.reviews_count, p.stock,
                   (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as primary_image
            FROM wishlist w
            JOIN products p ON w.product_id = p.id
            WHERE w.user_id = ?
            ORDER BY w.id DESC
        """, (user_id,))
        items = dicts_from_rows(cursor.fetchall())
        return items

@router.post("/toggle/{product_id}")
def toggle_wishlist(product_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?", (user_id, product_id))
        existing = cursor.fetchone()
        
        if existing:
            cursor.execute("DELETE FROM wishlist WHERE id = ?", (existing["id"],))
            return {"in_wishlist": False, "message": "Removed from Wishlist"}
        else:
            cursor.execute("INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)", (user_id, product_id))
            return {"in_wishlist": True, "message": "Added to Wishlist"}

@router.delete("/{product_id}")
def remove_from_wishlist(product_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM wishlist WHERE user_id = ? AND product_id = ?", (user_id, product_id))
        return {"message": "Removed from Wishlist"}
