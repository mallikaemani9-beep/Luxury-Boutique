import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends

try:
    from backend.app.database.db import get_db, dict_from_row
    from backend.app.schemas.schemas import PaymentSimulation
    from backend.app.auth.jwt_handler import get_current_user
except ImportError:
    from app.database.db import get_db, dict_from_row
    from app.schemas.schemas import PaymentSimulation
    from app.auth.jwt_handler import get_current_user

router = APIRouter(prefix="/api/payments", tags=["Payments"])

@router.post("/process-simulation")
def process_payment(data: PaymentSimulation, current_user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id, user_id, order_number, net_amount FROM orders WHERE id = ?", (data.order_id,))
        order = cursor.fetchone()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
            
        order_dict = dict_from_row(order)
        if order_dict["user_id"] != current_user["id"] and current_user.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
            
        payment_id = f"pay_{uuid.uuid4().hex[:14]}"
        txn_ref = data.transaction_ref or f"TXN_{datetime.now().strftime('%Y%m%d%H%M%S')}_{uuid.uuid4().hex[:6].upper()}"
        
        # Record payment
        cursor.execute("""
            INSERT INTO payments (order_id, payment_id, method, amount, status, transaction_ref)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (data.order_id, payment_id, data.method, data.amount, data.status, txn_ref))
        
        # Update order status
        if data.status.lower() in ["paid", "completed", "success"]:
            cursor.execute("UPDATE orders SET payment_status = 'Paid', order_status = 'Order Confirmed', updated_at = CURRENT_TIMESTAMP WHERE id = ?", (data.order_id,))
            cursor.execute("""
                INSERT INTO order_tracking (order_id, status, description, location)
                VALUES (?, ?, ?, ?)
            """, (data.order_id, "Order Confirmed", f"Payment verified via {data.method}. Order sent for tailoring inspection.", "Boutique Fulfillment"))
            
        return {
            "payment_id": payment_id,
            "transaction_ref": txn_ref,
            "status": "SUCCESS" if data.status.lower() in ["paid", "completed", "success"] else "FAILED",
            "message": "Payment processed successfully"
        }
