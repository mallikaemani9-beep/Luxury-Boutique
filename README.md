# 👑 Aura Atelier - Luxury Boutique E-Commerce Application

An end-to-end, high-performance, mobile-first **Boutique Clothing E-Commerce Marketplace** crafted for high-end fashion, ethnic couture, and contemporary designer wear. 

Aura Atelier delivers a seamless shopping experience inspired by leading platforms like Meesho and Amazon, enriched with a bespoke luxury boutique aesthetic (Burgundy, Subtle Gold, Warm Cream, and Espresso tones) and its own proprietary architecture.

---

## 🌟 Key Application Highlights

### 🛍️ Customer Experience (20 Features & Pages)
1. **Interactive Splash Screen:** Smooth branded intro animation transitioning into the storefront.
2. **Hero Showcase & Announcement Banners:** Curated editorial carousels for new season drops and festival discounts.
3. **Product Categories Grid:** Visual category cards for *Sarees, Kurtis, Lehengas, Salwar Suits, Dresses, Tops, Ethnic Wear, Western Fusion, Kids Wear, and Accessories*.
4. **Faceted Search & Multi-Attribute Filters:** Instant search by name, category, fabric, color, price range slider, star rating, discount percentage, and stock status.
5. **Interactive Sorting:** Price: Low to High, Price: High to Low, Newest Arrivals, Most Popular, and Highest Rated.
6. **Product Cards with Quick Select:** Shows original & discounted price, discount percentage badge, star ratings, review count, in-stock sizes, and 1-click wishlist toggle.
7. **Rich Product Details Page:** Multi-angle image gallery with full-resolution viewer, color swatches, size buttons, interactive Size Chart Modal, live PIN code delivery estimator, detailed fabric specifications, and customer review breakdown.
8. **Wishlist:** Dedicated wishlist with 1-click move to cart and live stock badges.
9. **Smart Shopping Bag:** Real-time quantity adjustments, discount savings breakdown, auto-applied free shipping threshold (orders over ₹999), and promo coupon code input.
10. **Multi-Address Management:** Save, edit, delete, and set default shipping addresses (Home, Work, Other).
11. **Express Checkout:** Streamlined step-by-step checkout with delivery address selection and order notes.
12. **Multi-Method Payment Simulation:**
    - **UPI:** Dynamic QR Code with live VPA address and instant app verification.
    - **Debit & Credit Cards:** Interactive card preview with Luhn-compliant visual inputs (never persists CVV or raw PAN).
    - **Net Banking:** Popular Indian bank selector (HDFC, ICICI, SBI, Axis, Kotak).
    - **Cash on Delivery (COD):** Instant booking with delivery verification.
13. **Celebratory Order Confirmation:** Interactive confetti celebration, unique order number (`AUR-YYMMDD-XXXX`), delivery ETA, and itemized invoice summary.
14. **Customer Orders History ("My Orders"):** Filter past orders, check fulfillment statuses, and inspect invoices.
15. **Visual Order Tracking Timeline:** Live multi-checkpoint progression (*Order Placed → Order Confirmed → Packed → Shipped → Out for Delivery → Delivered*) with courier name and tracking numbers.
16. **Verified Customer Reviews & Ratings:** 1–5 star ratings, review submission, rating distribution bar charts (5★ to 1★), and verified purchase badges.
17. **Customer Profile:** Manage profile details, view saved addresses, past orders count, and account settings.
18. **In-App Notifications:** Real-time alerts on order confirmations, courier dispatches, price drops, and festival promotions.
19. **Help & Support:** Comprehensive FAQ accordion, order issue resolution center, return/refund policy guidelines, and contact concierge form.
20. **Mobile Bottom Navigation Bar:** Ergonomic sticky bottom bar on mobile viewports (*Home, Categories, Wishlist, Cart with counter badge, Profile*).

---

### 🛡️ Admin Dashboard & Boutique Management (15 Sections)
1. **Admin Authentication:** Secure JWT-based admin login with role authorization.
2. **Dashboard Overview:** Real-time KPI summary cards:
   - Total Net Sales (₹)
   - Total Orders (with pending fulfillment breakdown)
   - Active Registered Customers
   - Total Catalog Items
   - Low Stock Alert Count
3. **Live Revenue & Volume Charts:**
   - 7-Day Daily Sales Trend bar chart
   - Stock volume distribution across categories
4. **Product Management (CRUD):** Add, edit, and delete boutique items with:
   - Title, Description, Category, SKU
   - Original Price, Discounted Price, Discount %
   - Fabric / Material composition
   - Multiple image URLs gallery
   - Size & Color variant inventory matrix
   - Badges: *Featured, Trending, New Arrival, Bestseller*
5. **Inventory Management:** Live inventory monitor with low-stock warnings (items with stock < 10) and one-click quick restock prompt.
6. **Order Fulfillment & Tracking Dispatcher:**
   - View all customer orders with status filters (*All, Order Placed, Confirmed, Packed, Shipped, Delivered, Cancelled*)
   - Advance order status with courier assignment (*BlueDart, Delhivery, DTDC, Ekart*) and tracking number
   - Automatic customer notification dispatch upon status progression
7. **Category Management:** Create and organize fashion categories with hero image URLs.
8. **Offers & Coupons Management:**
   - Create percentage (%) or flat (₹) coupon codes
   - Minimum cart value requirements and max discount limits
   - Expiration dates and usage counters
9. **Customer Patron Management:** View registered customer roster, phone numbers, and join dates.
10. **Review Moderation:** View and moderate customer feedback.

---

## 📂 Project Folder Structure

```text
botique/
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   │   └── jwt_handler.py         # Bcrypt hashing, JWT encoding/decoding, role dependencies
│   │   ├── database/
│   │   │   └── db.py                  # SQLite connection, WAL mode, row dict helpers
│   │   ├── models/
│   │   │   └── models.py              # 15 relational SQL tables with indexes and foreign keys
│   │   ├── routes/
│   │   │   ├── address_routes.py      # Customer address CRUD
│   │   │   ├── admin_routes.py        # Dashboard stats, charts, inventory, customers
│   │   │   ├── auth_routes.py         # Login, register, profile update
│   │   │   ├── cart_routes.py         # Cart add, update, remove, clear
│   │   │   ├── category_routes.py     # Public & admin category management
│   │   │   ├── coupon_routes.py       # Coupon application and admin coupon CRUD
│   │   │   ├── notification_routes.py # In-app notification dispatcher
│   │   │   ├── order_routes.py        # Place order, tracking timeline, admin order status
│   │   │   ├── payment_routes.py      # Payment gateway simulation & verification
│   │   │   ├── product_routes.py      # Catalog filtering, search, sorting, details, product CRUD
│   │   │   ├── review_routes.py       # Star ratings, review submissions, product reviews
│   │   │   └── wishlist_routes.py     # Wishlist toggle and fetch
│   │   ├── schemas/
│   │   │   └── schemas.py             # Pydantic request/response validation models
│   │   ├── services/
│   │   │   └── seed_data.py           # Pre-seeds 22 luxury products, categories, coupons, demo users
│   │   └── main.py                    # FastAPI root application, CORS, static uploads
│   ├── uploads/                       # Directory for local product image uploads
│   ├── requirements.txt               # Python backend dependencies
│   ├── boutique.db                    # SQLite database file
│   └── .env                           # Backend environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthModal.jsx          # Login & registration modal with role switching
│   │   │   ├── Footer.jsx             # Luxury boutique footer with newsletter & badges
│   │   │   ├── MobileBottomNav.jsx    # Sticky mobile navigation bar
│   │   │   ├── Navbar.jsx             # Top bar, announcement ticker, search, cart/wishlist counters
│   │   │   ├── NotificationsModal.jsx # Live in-app notifications drawer
│   │   │   ├── PaymentModal.jsx       # Multi-tab simulated payment gateway (UPI, Card, NetBanking, COD)
│   │   │   ├── ProductCard.jsx        # Premium product card with quick-size selector & badges
│   │   │   ├── ReviewModal.jsx        # Customer rating & review writer modal
│   │   │   ├── SizeChartModal.jsx     # Interactive garment measurement size guide
│   │   │   └── SplashScreen.jsx       # Initial brand splash screen
│   │   ├── context/
│   │   │   ├── AuthContext.jsx        # User session, JWT persistence, login/logout
│   │   │   ├── CartContext.jsx        # Cart state, subtotal calculation, coupon discounts
│   │   │   └── WishlistContext.jsx    # Wishlist synchronization
│   │   ├── pages/
│   │   │   ├── AdminPortal.jsx        # Comprehensive Admin management dashboard
│   │   │   ├── CartPage.jsx           # Shopping bag page with promo codes
│   │   │   ├── CategoriesPage.jsx     # Visual categories catalog
│   │   │   ├── CheckoutPage.jsx       # Express multi-address checkout
│   │   │   ├── HelpSupportPage.jsx    # Concierge, FAQs, returns info
│   │   │   ├── HomePage.jsx           # Editorial hero, banners, carousels, testimonials
│   │   │   ├── MyOrdersPage.jsx       # Past order history with invoice view
│   │   │   ├── OrderConfirmationPage.jsx # Confetti confirmation and tracking launcher
│   │   │   ├── OrderTrackingPage.jsx  # Visual progress timeline
│   │   │   ├── ProductDetailPage.jsx  # Multi-image gallery, specs, pincode checker, reviews
│   │   │   ├── ProfilePage.jsx        # Customer profile & account details
│   │   │   ├── ShopPage.jsx           # Faceted search, price filters, category chips
│   │   │   └── WishlistPage.jsx       # Customer curated favorites
│   │   ├── services/
│   │   │   └── api.js                 # Complete API service client
│   │   ├── App.jsx                    # Master application router & modal coordinator
│   │   ├── index.css                  # Boutique design system tokens & luxury styling
│   │   └── main.jsx                   # React entry point
│   ├── package.json                   # Frontend dependencies
│   └── vite.config.js                 # Vite dev server with /api proxy to FastAPI
│
├── .env                               # Root environment configuration
├── .env.example                       # Environment variables template
└── README.md                          # Full system documentation
```

---

## 🗄️ Database Architecture

The SQLite database (`backend/boutique.db`) implements 15 normalized relational tables with foreign keys and cascaded relationships:

| Table | Purpose |
|---|---|
| `users` | Customer & Admin accounts with bcrypt password hashes, contact details, and role (`customer` \| `admin`). |
| `categories` | Product collections (e.g. Sarees, Kurtis, Lehengas) with slug and banner image. |
| `products` | Core catalog with SKU, original price, discounted price, stock count, fabric composition, and luxury flags. |
| `product_images` | Multi-image gallery URLs with `is_primary` flag. |
| `product_variants` | Size (`XS`, `S`, `M`, `L`, `XL`, `XXL`) and Color variations with dedicated variant stock. |
| `addresses` | Customer delivery addresses with village/city, district, state, pin code, and `is_default` marker. |
| `orders` | Placed orders with unique order numbers, total amounts, discount savings, delivery fee, and net amount. |
| `order_items` | Snapshot of purchased products, unit prices, sizes, colors, and quantities. |
| `order_tracking` | Multi-checkpoint progress logs (`Order Placed`, `Confirmed`, `Packed`, `Shipped`, `Delivered`) with courier notes and locations. |
| `payments` | Audit records of payment transactions (method, amount, status, gateway transaction references). |
| `reviews` | Customer ratings (1-5 stars), detailed comments, review images, and verified purchase markers. |
| `coupons` | Promo codes with percentage or flat discounts, minimum order threshold, max savings, and usage counts. |
| `notifications` | In-app alerts linked to order events, special promotions, and price drops. |
| `wishlist` | Persisted favorite items for each customer. |
| `cart` | Real-time shopping bag contents with variant specifications. |

---

## 🔑 Default Demo Accounts

The database comes automatically pre-seeded with sample accounts and 22 luxury boutique products:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Boutique Owner / Admin** | `admin@auraboutique.com` | `Admin@123` | Full Admin Dashboard, Catalog CRUD, Order Dispatch, Stock Restock, Coupons |
| **Customer / Patron** | `customer@auraboutique.com` | `Customer@123` | Storefront browsing, Cart, Checkout, Order Tracking, Reviews, Wishlist |

### Active Promo Codes Seeded:
- `WELCOME100`: Flat **₹100 OFF** on orders over ₹499
- `AURALUXE15`: **15% OFF** on luxury collections (Min ₹1,499, Max ₹1,000)
- `FESTIVE20`: **20% OFF** on festival attire (Min ₹1,999, Max ₹1,500)
- `SUMMER50`: Flat **₹50 OFF** on everyday kurtis & tops (Min ₹399)

---

## 🚀 Quick Start & Local Execution

### Prerequisites
- **Python 3.10+** (with `pip`)
- **Node.js 18+** or **Node.js 20+** (with `npm`)

---

### Step 1: Backend Setup (FastAPI)

1. Open PowerShell or Terminal and navigate to the project directory:
   ```bash
   cd c:\Users\malli\Desktop\botique
   ```

2. Install Python dependencies:
   ```bash
   pip install fastapi uvicorn passlib[bcrypt] python-jose[cryptography] python-multipart pydantic email-validator
   ```

3. Launch the FastAPI server:
   ```bash
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

   - **Backend API:** `http://127.0.0.1:8000`
   - **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`
   - **Alternative ReDoc:** `http://127.0.0.1:8000/redoc`

---

### Step 2: Frontend Setup (React + Vite)

1. Open a second Terminal window:
   ```bash
   cd c:\Users\malli\Desktop\botique\frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your web browser and navigate to:
   ```text
   http://127.0.0.1:5173/
   ```

---

## 📡 Complete REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create customer account
- `POST /api/auth/login` - Authenticate customer or admin (returns JWT Bearer token)
- `GET /api/auth/me` - Fetch authenticated user profile
- `PUT /api/auth/profile` - Update customer name, phone, or preferences

### Products & Catalog (`/api/products`)
- `GET /api/products` - Browse catalog with filters (`category_id`, `search`, `min_price`, `max_price`, `size`, `color`, `rating`, `in_stock_only`, `sort_by`, `page`, `limit`)
- `GET /api/products/featured-sections` - Home page curated sections (Trending, New Arrivals, Bestsellers, Offers)
- `GET /api/products/{id_or_slug}` - Full product specifications, images, and variant options
- `POST /api/products` *(Admin)* - Create new boutique product
- `PUT /api/products/{id}` *(Admin)* - Update existing product details
- `DELETE /api/products/{id}` *(Admin)* - Delete product from catalog

### Categories (`/api/categories`)
- `GET /api/categories` - Fetch all categories with product counts
- `POST /api/categories` *(Admin)* - Create new category
- `PUT /api/categories/{id}` *(Admin)* - Update category
- `DELETE /api/categories/{id}` *(Admin)* - Delete category

### Shopping Bag (`/api/cart`)
- `GET /api/cart` - View current customer cart with summary calculations
- `POST /api/cart/add` or `POST /api/cart` - Add garment to cart with size and color
- `PUT /api/cart/{cart_id}` - Update quantity
- `DELETE /api/cart/{cart_id}` - Remove item from cart
- `DELETE /api/cart/clear/all` - Clear entire cart

### Wishlist (`/api/wishlist`)
- `GET /api/wishlist` - View saved items
- `POST /api/wishlist/toggle` - Add or remove product from wishlist

### Addresses (`/api/addresses`)
- `GET /api/addresses` - List saved delivery addresses
- `POST /api/addresses` - Add new address
- `PUT /api/addresses/{id}` - Edit address
- `DELETE /api/addresses/{id}` - Delete address
- `PUT /api/addresses/{id}/default` - Set default delivery address

### Orders & Tracking (`/api/orders`)
- `POST /api/orders` - Place new order (supports cart checkout or direct buy-now)
- `GET /api/orders/my-orders` - Customer order history
- `GET /api/orders/{order_id}` - Detailed order invoice
- `GET /api/orders/{order_id}/track` - Visual tracking timeline events
- `POST /api/orders/{order_id}/cancel` - Customer cancellation request
- `GET /api/orders/admin/all` *(Admin)* - Admin order roster with status filters
- `PUT /api/orders/admin/{order_id}/status` *(Admin)* - Update order status, assign courier & tracking number

### Payment Simulation (`/api/payments`)
- `POST /api/payments/simulate` - Simulates payment gateway callback (UPI, Card, NetBanking, COD)
- `GET /api/payments/order/{order_id}` - View payment transaction record

### Reviews & Ratings (`/api/reviews`)
- `GET /api/reviews/product/{product_id}` - Product reviews with star distribution summary
- `POST /api/reviews` - Submit review with 1-5 star rating and comment
- `GET /api/reviews/admin/all` *(Admin)* - Admin review list
- `DELETE /api/reviews/admin/{id}` *(Admin)* - Delete inappropriate review

### Offers & Coupons (`/api/coupons`)
- `GET /api/coupons/active` - List active public promotions
- `POST /api/coupons/apply` - Validate coupon code against cart subtotal
- `GET /api/coupons/admin/all` *(Admin)* - Admin coupon manager
- `POST /api/coupons/admin` *(Admin)* - Create new coupon
- `DELETE /api/coupons/admin/{id}` *(Admin)* - Delete coupon

### Admin Operations (`/api/admin`)
- `GET /api/admin/dashboard/stats` - Total sales, orders, customers, items, low-stock count
- `GET /api/admin/dashboard/charts` - 7-day sales trend & category stock breakdown
- `GET /api/admin/inventory` - Inventory monitor with variant breakdowns
- `PUT /api/admin/inventory/{product_id}` - Restock product
- `GET /api/admin/customers` - List registered customer patrons

---

## 💳 Production Payment Gateway Integration Guide

The application comes pre-built with an interactive **Payment Gateway Simulator** for testing. To connect a live payment gateway like **Razorpay**, follow this production guide:

### Step 1: Install Razorpay Python SDK
```bash
pip install razorpay
```

### Step 2: Add Keys to `.env`
```env
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
```

### Step 3: Backend Order Creation Endpoint
```python
import razorpay
from fastapi import APIRouter, Depends

client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))

@router.post("/razorpay/create-order")
def create_razorpay_order(amount: float, order_id: int):
    # Amount in paise (1 INR = 100 paise)
    razorpay_order = client.order.create({
        "amount": int(amount * 100),
        "currency": "INR",
        "receipt": f"receipt_order_{order_id}",
        "payment_capture": 1
    })
    return razorpay_order
```

### Step 4: Frontend Razorpay Checkout Script
In `frontend/index.html`, add:
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

In `PaymentModal.jsx`:
```javascript
const handleLiveRazorpay = () => {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: orderData.net_amount * 100,
    currency: "INR",
    name: "Aura Atelier Boutique",
    description: `Payment for Order #${orderData.order_number}`,
    image: "/favicon.ico",
    order_id: razorpayOrderId,
    handler: async function (response) {
      // Verify signature on backend
      await api.verifyPaymentSignature({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      });
      onPaymentSuccess(response);
    },
    prefill: {
      name: orderData.customer_name,
      email: orderData.customer_email,
      contact: orderData.customer_phone
    },
    theme: {
      color: "#68132C" // Boutique Burgundy
    }
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
};
```

---

## 🎨 Luxury Design System

- **Primary Boutique Burgundy:** `#68132C` & `#801B37`
- **Antique Gold Accent:** `#D4AF37` & `#B8860B`
- **Soft Cream & Champagne:** `#FCF9F5` & `#F5EDE2`
- **Deep Espresso Brown:** `#251815`
- **Typography:**
  - Serif Display: `'Cinzel', 'Playfair Display', serif`
  - Sans Body: `'Plus Jakarta Sans', sans-serif`
- **Responsive Layout:** Optimized for 360px mobile viewports through 4K displays.

---

## 🛡️ Security Implementation
- **Password Protection:** Secure bcrypt one-way hashing with salt rounds.
- **JWT Authorization:** Stateless Bearer tokens with signature verification and role guards.
- **Sensitive Payment Handling:** Zero storage of plain card PAN, CVV, or UPI PINs.
- **Database Safety:** Parameterized SQLite queries preventing SQL injection.
- **CORS Protection:** Configurable whitelist for permitted origins.

---

## 📄 License
Created for **Aura Atelier Boutique**. All rights reserved.
