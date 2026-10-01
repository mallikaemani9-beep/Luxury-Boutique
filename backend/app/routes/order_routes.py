import json
import random
import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, HTTPException, status, Depends, Query

try:
    from backend.app.database.db import get_db, dict_from_row, dicts_from_rows
    from backend.app.schemas.schemas import OrderCreate, OrderStatusUpdate
    from backend.app.auth.jwt_handler import get_current_user, get_current_admin
except ImportError:
    from app.database.db import get_db, dict_from_row, dicts_from_rows
    from app.schemas.schemas import OrderCreate, OrderStatusUpdate
    from app.auth.jwt_handler import get_current_user, get_current_admin

router = APIRouter(prefix="/api/orders", tags=["Orders"])

ORDER_STATUSES = [
    "Order Placed",
    "Order Confirmed",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
    "Return Requested",
    "Returned"
]

@router.post("", status_code=status.HTTP_201_CREATED)
def place_order(data: OrderCreate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    
    with get_db() as conn:
        cursor = conn.cursor()
        
        # 1. Resolve Shipping Address
        shipping_addr_dict = None
        if data.shipping_address_id:
            cursor.execute("SELECT * FROM addresses WHERE id = ? AND user_id = ?", (data.shipping_address_id, user_id))
            addr = cursor.fetchone()
            if addr:
                shipping_addr_dict = dict_from_row(addr)
        
        if not shipping_addr_dict and data.shipping_address_custom:
            shipping_addr_dict = data.shipping_address_custom.dict()
            
        if not shipping_addr_dict:
            # Fallback to default address
            cursor.execute("SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC LIMIT 1", (user_id,))
            addr = cursor.fetchone()
            if addr:
                shipping_addr_dict = dict_from_row(addr)
            else:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Shipping address is required")
                
        # 2. Resolve Items
        order_items = []
        if data.items and len(data.items) > 0:
            for itm in data.items:
                order_items.append(itm.dict())
        else:
            # Get items from user cart
            cursor.execute("""
                SELECT c.product_id, c.size, c.color, c.quantity,
                       p.name as product_name, p.discounted_price as unit_price, p.stock,
                       (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY is_primary DESC LIMIT 1) as product_image
                FROM cart c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = ?
            """, (user_id,))
            cart_rows = dicts_from_rows(cursor.fetchall())
            if not cart_rows:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cart is empty")
                
            for cr in cart_rows:
                cr["total_price"] = cr["unit_price"] * cr["quantity"]
                order_items.append(cr)

        # 3. Calculate Amounts
        subtotal = sum(i["unit_price"] * i["quantity"] for i in order_items)
        discount_amount = 0.0
        
        # Apply coupon if given
        if data.coupon_code:
            cursor.execute("SELECT * FROM coupons WHERE code = ? AND is_active = 1", (data.coupon_code.upper().strip(),))
            coupon = cursor.fetchone()
            if coupon:
                c = dict_from_row(coupon)
                if subtotal >= c["min_order_value"]:
                    if c["discount_type"] == "percentage":
                        disc = (subtotal * c["discount_value"]) / 100
                        if c.get("max_discount"):
                            disc = min(disc, c["max_discount"])
                        discount_amount = disc
                    else:
                        discount_amount = min(c["discount_value"], subtotal)
                    cursor.execute("UPDATE coupons SET usage_count = usage_count + 1 WHERE id = ?", (c["id"],))

        delivery_charge = data.delivery_charge
        if subtotal - discount_amount >= 999:
            delivery_charge = 0.0
            
        net_amount = max(0.0, (subtotal - discount_amount) + delivery_charge)
        
        # 4. Generate Order Number
        rand_suffix = random.randint(1000, 9999)
        order_number = f"AUR-{datetime.now().strftime('%y%m%d')}-{rand_suffix}"
        
        # Estimated Delivery: 3 to 5 days
        est_date = (datetime.now() + timedelta(days=4)).strftime("%A, %d %B %Y")
        
        # 5. Insert Order
        cursor.execute("""
            INSERT INTO orders (
                order_number, user_id, customer_name, customer_email, customer_phone,
                total_amount, discount_amount, delivery_charge, net_amount, payment_method,
                payment_status, order_status, shipping_address_json, estimated_delivery,
                tracking_number, courier_name
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            order_number, user_id, shipping_addr_dict.get("full_name", current_user["name"]),
            current_user["email"], shipping_addr_dict.get("mobile_number", current_user.get("phone")),
            subtotal, discount_amount, delivery_charge, net_amount, data.payment_method,
            "Paid" if data.payment_method != "COD" else "Pending",
            "Order Placed", json.dumps(shipping_addr_dict), est_date,
            f"BD-{uuid.uuid4().hex[:10].upper()}", "Bluedart Express"
        ))
        order_id = cursor.lastrowid
        
        # 6. Insert Order Items & Deduct Inventory
        for itm in order_items:
            cursor.execute("""
                INSERT INTO order_items (
                    order_id, product_id, product_name, product_image, size, color, quantity, unit_price, total_price
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                order_id, itm["product_id"], itm["product_name"], itm.get("product_image"),
                itm["size"], itm["color"], itm["quantity"], itm["unit_price"], itm["total_price"]
            ))
            # Decrement stock
            cursor.execute("UPDATE products SET stock = MAX(0, stock - ?) WHERE id = ?", (itm["quantity"], itm["product_id"]))
            cursor.execute("""
                UPDATE product_variants
                SET stock = MAX(0, stock - ?)
                WHERE product_id = ? AND size = ?
            """, (itm["quantity"], itm["product_id"], itm["size"]))
            
        # 7. Initial Tracking Step
        cursor.execute("""
            INSERT INTO order_tracking (order_id, status, description, location)
            VALUES (?, ?, ?, ?)
        """, (order_id, "Order Placed", "Your order has been placed and received by Aura Atelier.", "Boutique HQ - Mumbai"))
        
        # 8. Record Payment Entry
        pay_status = "Completed" if data.payment_method != "COD" else "Pending"
        cursor.execute("""
            INSERT INTO payments (order_id, payment_id, method, amount, status, transaction_ref)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (order_id, f"pay_{uuid.uuid4().hex[:12]}", data.payment_method, net_amount, pay_status, f"TXN-{uuid.uuid4().hex[:8].upper()}"))
        
        # 9. Send Notification
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (?, ?, ?, ?, ?)
        """, (user_id, "Order Confirmed!", f"Your order #{order_number} for ₹{net_amount:.2f} has been placed successfully.", "order", f"/orders/{order_id}"))
        
        # 10. Clear Cart
        cursor.execute("DELETE FROM cart WHERE user_id = ?", (user_id,))
        
        return {
            "id": order_id,
            "order_id": order_id,
            "order_number": order_number,
            "net_amount": net_amount,
            "estimated_delivery": est_date,
            "message": "Order placed successfully!"
        }

@router.get("/my-orders")
def get_my_orders(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT * FROM orders
            WHERE user_id = ?
            ORDER BY id DESC
        """, (user_id,))
        orders = dicts_from_rows(cursor.fetchall())
        
        for o in orders:
            try:
                o["shipping_address"] = json.loads(o["shipping_address_json"])
            except Exception:
                o["shipping_address"] = {}
                
            cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (o["id"],))
            o["items"] = dicts_from_rows(cursor.fetchall())
            
        return orders

# --- Admin Orders Routes ---
@router.get("/admin/all")
def get_admin_orders(
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    admin: dict = Depends(get_current_admin)
):
    with get_db() as conn:
        cursor = conn.cursor()
        query = "SELECT * FROM orders WHERE 1=1"
        params = []
        
        if status_filter and status_filter.lower() != "all":
            query += " AND order_status = ?"
            params.append(status_filter)
            
        if search:
            query += " AND (order_number LIKE ? OR customer_name LIKE ? OR customer_email LIKE ?)"
            s_param = f"%{search}%"
            params.extend([s_param, s_param, s_param])
            
        query += " ORDER BY id DESC"
        cursor.execute(query, tuple(params))
        orders = dicts_from_rows(cursor.fetchall())
        
        for o in orders:
            try:
                o["shipping_address"] = json.loads(o["shipping_address_json"])
            except Exception:
                o["shipping_address"] = {}
            cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (o["id"],))
            o["items"] = dicts_from_rows(cursor.fetchall())
            
        return orders

@router.put("/admin/{order_id}/status")
def update_admin_order_status(order_id: int, data: OrderStatusUpdate, admin: dict = Depends(get_current_admin)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        order = cursor.fetchone()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
            
        order_dict = dict_from_row(order)
        
        updates = ["order_status = ?", "updated_at = CURRENT_TIMESTAMP"]
        params = [data.order_status]
        
        if data.courier_name:
            updates.append("courier_name = ?")
            params.append(data.courier_name)
        if data.tracking_number:
            updates.append("tracking_number = ?")
            params.append(data.tracking_number)
            
        params.append(order_id)
        cursor.execute(f"UPDATE orders SET {', '.join(updates)} WHERE id = ?", tuple(params))
        
        # Append Tracking Step
        desc = data.description or f"Status updated to {data.order_status}"
        loc = data.location or "Boutique Hub"
        cursor.execute("""
            INSERT INTO order_tracking (order_id, status, description, location)
            VALUES (?, ?, ?, ?)
        """, (order_id, data.order_status, desc, loc))
        
        # Notify User
        cursor.execute("""
            INSERT INTO notifications (user_id, title, message, type, link)
            VALUES (?, ?, ?, ?, ?)
        """, (order_dict["user_id"], f"Order Update: {data.order_status}", f"Order #{order_dict['order_number']} is now {data.order_status}.", "order", f"/orders/{order_id}"))
        
        return {"message": f"Order status updated to {data.order_status}"}

@router.get("/{order_id}")
def get_order_by_id(order_id: int, current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        order_row = cursor.fetchone()
        if not order_row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
            
        order = dict_from_row(order_row)
        if order["user_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            
        try:
            order["shipping_address"] = json.loads(order["shipping_address_json"])
        except Exception:
            order["shipping_address"] = {}
            
        cursor.execute("SELECT * FROM order_items WHERE order_id = ?", (order_id,))
        order["items"] = dicts_from_rows(cursor.fetchall())
        
        cursor.execute("SELECT * FROM order_tracking WHERE order_id = ? ORDER BY id ASC", (order_id,))
        order["tracking"] = dicts_from_rows(cursor.fetchall())
        
        cursor.execute("SELECT * FROM payments WHERE order_id = ?", (order_id,))
        order["payment"] = dict_from_row(cursor.fetchone())
        
        return order

@router.get("/{order_id}/track")
def track_order(order_id: int, current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, order_number, order_status, estimated_delivery, tracking_number, courier_name, created_at, user_id FROM orders WHERE id = ?", (order_id,))
        order = cursor.fetchone()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
            
        order_dict = dict_from_row(order)
        if order_dict["user_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            
        cursor.execute("SELECT * FROM order_tracking WHERE order_id = ? ORDER BY id ASC", (order_id,))
        timeline = dicts_from_rows(cursor.fetchall())
        
        # Check current active step index in standard progression
        all_steps = ["Order Placed", "Order Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"]
        current_status = order_dict["order_status"]
        current_step_idx = 0
        if current_status in all_steps:
            current_step_idx = all_steps.index(current_status)
        elif current_status == "Cancelled":
            current_step_idx = -1
            
        return {
            "order": order_dict,
            "timeline": timeline,
            "standard_steps": all_steps,
            "current_step_index": current_step_idx
        }

@router.post("/{order_id}/cancel")
def cancel_order(order_id: int, current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM orders WHERE id = ?", (order_id,))
        order = cursor.fetchone()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
            
        order_dict = dict_from_row(order)
        if order_dict["user_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            
        if order_dict["order_status"] in ["Shipped", "Out for Delivery", "Delivered", "Cancelled"]:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Cannot cancel order when status is '{order_dict['order_status']}'")
            
        cursor.execute("UPDATE orders SET order_status = 'Cancelled', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (order_id,))
        
        # Restore stock
        cursor.execute("SELECT product_id, quantity, size FROM order_items WHERE order_id = ?", (order_id,))
        items = cursor.fetchall()
        for itm in items:
            cursor.execute("UPDATE products SET stock = stock + ? WHERE id = ?", (itm["quantity"], itm["product_id"]))
            cursor.execute("UPDATE product_variants SET stock = stock + ? WHERE product_id = ? AND size = ?", (itm["quantity"], itm["product_id"], itm["size"]))
            
        # Add tracking step
        cursor.execute("""
            INSERT INTO order_tracking (order_id, status, description, location)
            VALUES (?, ?, ?, ?)
        """, (order_id, "Cancelled", "Order was cancelled by the customer.", "Customer Request"))
        
        return {"message": "Order cancelled successfully"}
