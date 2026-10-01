import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

# Ensure proper package paths
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)

for p in [PROJECT_ROOT, BACKEND_DIR, CURRENT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

try:
    from backend.app.models.models import init_db
    from backend.app.services.seed_data import seed_database
    from backend.app.routes import (
        auth_routes,
        category_routes,
        product_routes,
        cart_routes,
        wishlist_routes,
        address_routes,
        order_routes,
        payment_routes,
        review_routes,
        coupon_routes,
        notification_routes,
        admin_routes,
    )
except ImportError:
    from app.models.models import init_db
    from app.services.seed_data import seed_database
    from app.routes import (
        auth_routes,
        category_routes,
        product_routes,
        cart_routes,
        wishlist_routes,
        address_routes,
        order_routes,
        payment_routes,
        review_routes,
        coupon_routes,
        notification_routes,
        admin_routes,
    )

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database & Seed Sample Products
    init_db()
    seed_database()
    yield

app = FastAPI(
    title="Aura Atelier Boutique API",
    description="Modern Luxury Boutique Clothing E-Commerce REST API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Uploads directory
UPLOAD_DIR = os.path.abspath(os.path.join(BACKEND_DIR, "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/api/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_routes.router)
app.include_router(category_routes.router)
app.include_router(product_routes.router)
app.include_router(cart_routes.router)
app.include_router(wishlist_routes.router)
app.include_router(address_routes.router)
app.include_router(order_routes.router)
app.include_router(payment_routes.router)
app.include_router(review_routes.router)
app.include_router(coupon_routes.router)
app.include_router(notification_routes.router)
app.include_router(admin_routes.router)

@app.get("/api/health")
@app.get("/")
def health_check():
    return {
        "status": "online",
        "app": "Aura Atelier Boutique API",
        "version": "1.0.0",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
