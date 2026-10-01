import json
from fastapi import APIRouter, HTTPException, status, Depends

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.schemas.schemas import ReviewCreate
    from backend.app.auth.jwt_handler import get_current_user, get_current_admin
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.schemas.schemas import ReviewCreate
    from app.auth.jwt_handler import get_current_user, get_current_admin

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])

@router.get("/product/{product_id}")
def get_product_reviews(product_id: int):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC", (product_id,))
        reviews = dicts_from_rows(cursor.fetchall())
        for r in reviews:
            if r.get("images_json"):
                try:
                    r["images"] = json.loads(r["images_json"])
                except Exception:
                    r["images"] = []
            else:
                r["images"] = []
        return reviews

@router.post("", status_code=status.HTTP_201_CREATED)
def add_review(data: ReviewCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM products WHERE id = ?", (data.product_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
            
        # Check if verified purchaser
        cursor.execute("""
            SELECT o.id FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            WHERE o.user_id = ? AND oi.product_id = ?
        """, (user_id, data.product_id))
        is_verified = 1 if cursor.fetchone() else 0
        
        images_json = json.dumps(data.images) if data.images else "[]"
        
        cursor.execute("""
            INSERT INTO reviews (product_id, user_id, user_name, rating, comment, images_json, verified_purchase)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (data.product_id, user_id, current_user["name"], data.rating, data.comment, images_json, is_verified))
        
        # Update product average rating & reviews_count
        cursor.execute("SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = ?", (data.product_id,))
        stats = cursor.fetchone()
        count = stats["count"]
        avg_rating = round(stats["avg_rating"], 1) if stats["avg_rating"] else data.rating
        
        cursor.execute("UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?", (avg_rating, count, data.product_id))
        
        return {"message": "Thank you! Your review has been submitted.", "avg_rating": avg_rating, "reviews_count": count}

# --- Admin Reviews ---
@router.get("/admin/all")
def get_admin_reviews(admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT r.*, p.name as product_name, p.slug as product_slug,
                   (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as product_image
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            ORDER BY r.id DESC
        """)
        reviews = dicts_from_rows(cursor.fetchall())
        for r in reviews:
            if r.get("images_json"):
                try:
                    r["images"] = json.loads(r["images_json"])
                except Exception:
                    r["images"] = []
            else:
                r["images"] = []
        return reviews

@router.delete("/admin/{review_id}")
def delete_admin_review(review_id: int, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT product_id FROM reviews WHERE id = ?", (review_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
        product_id = row["product_id"]
        
        cursor.execute("DELETE FROM reviews WHERE id = ?", (review_id,))
        
        # Recalculate
        cursor.execute("SELECT COUNT(*) as count, AVG(rating) as avg_rating FROM reviews WHERE product_id = ?", (product_id,))
        stats = cursor.fetchone()
        count = stats["count"]
        avg_rating = round(stats["avg_rating"], 1) if stats["avg_rating"] else 5.0
        cursor.execute("UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?", (avg_rating, count, product_id))
        
        return {"message": "Review deleted"}
