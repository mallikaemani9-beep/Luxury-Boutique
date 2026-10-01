from fastapi import APIRouter, HTTPException, status, Depends

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.schemas.schemas import CartItemAdd, CartItemUpdate
    from backend.app.auth.jwt_handler import get_current_user
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.schemas.schemas import CartItemAdd, CartItemUpdate
    from app.auth.jwt_handler import get_current_user

router = APIRouter(prefix="/api/cart", tags=["Cart"])

@router.get("")
def get_cart(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT c.id as cart_id, c.product_id, c.size, c.color, c.quantity,
                   p.name, p.slug, p.original_price, p.discounted_price, p.discount_percent, p.stock,
                   (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as product_image
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
            ORDER BY c.id DESC
        """, (user_id,))
        items = dicts_from_rows(cursor.fetchall())
        
        subtotal = sum(item["original_price"] * item["quantity"] for item in items)
        net_subtotal = sum(item["discounted_price"] * item["quantity"] for item in items)
        discount = subtotal - net_subtotal
        delivery = 0.0 if (net_subtotal >= 999 or len(items) == 0) else 99.0
        total = net_subtotal + delivery
        
        return {
            "items": items,
            "summary": {
                "item_count": sum(i["quantity"] for i in items),
                "original_subtotal": round(subtotal, 2),
                "discount_amount": round(discount, 2),
                "subtotal": round(net_subtotal, 2),
                "delivery_charge": round(delivery, 2),
                "total": round(total, 2)
            }
        }

@router.post("")
@router.post("/add")
def add_to_cart(data: CartItemAdd, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, stock, name FROM products WHERE id = ?", (data.product_id,))
        prod = cursor.fetchone()
        if not prod:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
            
        cursor.execute("""
            SELECT id, quantity FROM cart
            WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?
        """, (user_id, data.product_id, data.size, data.color))
        existing = cursor.fetchone()
        
        if existing:
            new_qty = existing["quantity"] + data.quantity
            cursor.execute("UPDATE cart SET quantity = ? WHERE id = ?", (new_qty, existing["id"]))
            cart_id = existing["id"]
        else:
            cursor.execute("""
                INSERT INTO cart (user_id, product_id, size, color, quantity)
                VALUES (?, ?, ?, ?, ?)
            """, (user_id, data.product_id, data.size, data.color, data.quantity))
            cart_id = cursor.lastrowid
            
        return {"cart_id": cart_id, "message": f"Added '{prod['name']}' to cart"}

@router.put("/{cart_id}")
def update_cart_item(cart_id: int, data: CartItemUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM cart WHERE id = ? AND user_id = ?", (cart_id, user_id))
        if not cursor.fetchone():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Cart item not found")
            
        if data.quantity <= 0:
            cursor.execute("DELETE FROM cart WHERE id = ?", (cart_id,))
            return {"message": "Item removed from cart"}
        else:
            cursor.execute("UPDATE cart SET quantity = ? WHERE id = ?", (data.quantity, cart_id))
            return {"message": "Cart updated"}

@router.delete("/{cart_id}")
def delete_cart_item(cart_id: int, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cart WHERE id = ? AND user_id = ?", (cart_id, user_id))
        return {"message": "Item removed"}

@router.delete("/clear/all")
def clear_cart(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM cart WHERE user_id = ?", (user_id,))
        return {"message": "Cart cleared"}
