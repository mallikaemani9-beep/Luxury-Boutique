import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingBag, Users, AlertTriangle, 
  Plus, Edit, Trash2, CheckCircle2, TrendingUp, Tag, 
  DollarSign, RefreshCw, Eye, X, Check, Search, Shield, Filter 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminPortal({ onNavigate, onOpenAuth }) {
  const { user, isAdmin } = useAuth();

  // Active Admin Section Tab
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard', 'products', 'orders', 'inventory', 'categories', 'coupons', 'customers', 'reviews'

  // Data states
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals & Form states
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    category_id: 1,
    original_price: '',
    discounted_price: '',
    stock: 20,
    fabric: '',
    sku: '',
    is_featured: false,
    is_trending: false,
    is_new: true,
    is_bestseller: false,
    images: [''],
    variants: [
      { size: 'S', color: 'Wine Burgundy', color_code: '#58111A', stock: 5 },
      { size: 'M', color: 'Wine Burgundy', color_code: '#58111A', stock: 5 },
      { size: 'L', color: 'Wine Burgundy', color_code: '#58111A', stock: 5 }
    ]
  });

  // Category Form
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image_url: '' });

  // Coupon Form
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: 15,
    min_order_value: 999,
    max_discount: 1000,
    expiry_date: '2027-12-31'
  });

  // Selected Order for Status Update
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState(null);
  const [orderStatusForm, setOrderStatusForm] = useState({
    order_status: 'Order Confirmed',
    courier_name: 'Bluedart Express',
    tracking_number: '',
    description: '',
    location: ''
  });

  // Filters
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const loadAllAdminData = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const [s, ch, prods, cats, ords, inv, coup, cust, rev] = await Promise.all([
        api.getDashboardStats(),
        api.getDashboardCharts(),
        api.getProducts({ limit: 100 }),
        api.getCategories(),
        api.getAdminOrders(),
        api.getInventory(),
        api.getAdminCoupons(),
        api.getCustomers(),
        api.getAdminReviews()
      ]);
      setStats(s);
      setCharts(ch);
      setProducts(prods || []);
      setCategories(cats || []);
      setOrders(ords || []);
      setInventory(inv || []);
      setCoupons(coup || []);
      setCustomers(cust || []);
      setReviews(rev || []);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'var(--color-primary-light)',
          color: 'var(--color-primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px'
        }}>
          <Shield size={38} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-espresso)', marginBottom: '8px' }}>
          Boutique Owner & Administrator Login Required
        </h2>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', maxWidth: '440px', margin: '0 auto 24px' }}>
          Please sign in with administrator credentials (admin@auraboutique.com / Admin@123) to manage boutique inventory, products, and customer orders.
        </p>
        <button
          onClick={() => onOpenAuth('admin')}
          className="btn-primary"
          style={{ padding: '12px 28px' }}
        >
          Sign In as Admin
        </button>
      </div>
    );
  }

  // --- Handlers ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: productForm.name,
        description: productForm.description,
        category_id: Number(productForm.category_id),
        original_price: Number(productForm.original_price),
        discounted_price: Number(productForm.discounted_price),
        stock: Number(productForm.stock),
        fabric: productForm.fabric,
        sku: productForm.sku,
        is_featured: productForm.is_featured,
        is_trending: productForm.is_trending,
        is_new: productForm.is_new,
        is_bestseller: productForm.is_bestseller,
        images: productForm.images.filter(img => img.trim() !== ''),
        variants: productForm.variants
      };

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
        alert("Product updated successfully!");
      } else {
        await api.createProduct(payload);
        alert("Product created successfully!");
      }
      setShowAddProductModal(false);
      setEditingProduct(null);
      await loadAllAdminData();
    } catch (err) {
      alert("Error saving product: " + err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this product?")) {
      try {
        await api.deleteProduct(id);
        await loadAllAdminData();
      } catch (err) {
        alert("Error deleting product: " + err.message);
      }
    }
  };

  const handleQuickRestock = async (productId, currentStock) => {
    const qty = prompt("Enter new total stock quantity:", currentStock + 10);
    if (qty !== null && !isNaN(qty)) {
      try {
        await api.updateInventory(productId, Number(qty));
        await loadAllAdminData();
      } catch (err) {
        alert("Error updating stock: " + err.message);
      }
    }
  };

  const handleUpdateOrderStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrderToUpdate) return;
    try {
      await api.updateOrderStatus(selectedOrderToUpdate.id, orderStatusForm);
      setSelectedOrderToUpdate(null);
      await loadAllAdminData();
      alert("Order status updated and notification dispatched to customer!");
    } catch (err) {
      alert("Error updating order: " + err.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.createCategory(categoryForm);
      setShowAddCategoryModal(false);
      setCategoryForm({ name: '', description: '', image_url: '' });
      await loadAllAdminData();
    } catch (err) {
      alert("Error creating category: " + err.message);
    }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.createAdminCoupon(couponForm);
      setShowAddCouponModal(false);
      await loadAllAdminData();
    } catch (err) {
      alert("Error creating coupon: " + err.message);
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (window.confirm("Delete this coupon?")) {
      try {
        await api.deleteAdminCoupon(id);
        await loadAllAdminData();
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Delete this review?")) {
      try {
        await api.deleteAdminReview(id);
        await loadAllAdminData();
      } catch (err) {
        alert("Error: " + err.message);
      }
    }
  };

  return (
    <div className="admin-portal container" style={{ padding: '36px 20px', minHeight: '85vh' }}>
      {/* Admin Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '28px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <Shield size={14} /> Aura Atelier Management Console
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: 'var(--color-espresso)', marginTop: '2px' }}>
            Boutique Operations Portal
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={loadAllAdminData}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            title="Refresh All Data"
          >
            <RefreshCw size={15} /> Refresh
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            Visit Customer Storefront
          </button>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '12px',
        marginBottom: '28px',
        overflowX: 'auto'
      }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard Overview' },
          { id: 'products', label: `👗 Manage Products (${products.length})` },
          { id: 'orders', label: `📦 Orders & Tracking (${orders.length})` },
          { id: 'inventory', label: `⚡ Inventory Stock (${inventory.length})` },
          { id: 'categories', label: `📁 Categories (${categories.length})` },
          { id: 'coupons', label: `🎟️ Offers & Coupons (${coupons.length})` },
          { id: 'customers', label: `👥 Customers (${customers.length})` },
          { id: 'reviews', label: `⭐ Reviews (${reviews.length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              padding: '9px 18px',
              borderRadius: 'var(--radius-full)',
              background: activeSection === tab.id ? 'var(--color-primary)' : 'var(--color-surface-soft)',
              color: activeSection === tab.id ? '#FFFFFF' : 'var(--color-text)',
              fontWeight: 700,
              fontSize: '0.82rem',
              whiteSpace: 'nowrap',
              boxShadow: activeSection === tab.id ? 'var(--shadow-sm)' : 'none'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- TAB 1: DASHBOARD OVERVIEW --- */}
      {activeSection === 'dashboard' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {/* KPI Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Total Net Sales</span>
                <DollarSign size={18} color="var(--color-primary)" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-primary)', marginTop: '8px' }}>
                ₹{stats.total_sales?.toLocaleString('en-IN')}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 600 }}>Active boutique revenue</span>
            </div>

            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Total Orders</span>
                <Package size={18} color="#D4AF37" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-espresso)', marginTop: '8px' }}>
                {stats.total_orders}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{stats.pending_orders} pending fulfillment</span>
            </div>

            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Active Customers</span>
                <Users size={18} color="#2563EB" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-espresso)', marginTop: '8px' }}>
                {stats.total_customers}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Registered patrons</span>
            </div>

            <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Total Catalog Items</span>
                <ShoppingBag size={18} color="#059669" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-espresso)', marginTop: '8px' }}>
                {stats.total_products}
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>Across {categories.length} categories</span>
            </div>

            <div style={{ background: stats.low_stock_count > 0 ? '#FEF2F2' : '#FFFFFF', padding: '20px', borderRadius: 'var(--radius-md)', border: `1px solid ${stats.low_stock_count > 0 ? '#FCA5A5' : 'var(--color-border)'}`, boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: stats.low_stock_count > 0 ? 'var(--color-danger)' : 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>
                <span>Low Stock Warnings</span>
                <AlertTriangle size={18} color="var(--color-danger)" />
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: stats.low_stock_count > 0 ? 'var(--color-danger)' : 'var(--color-espresso)', marginTop: '8px' }}>
                {stats.low_stock_count}
              </div>
              <span style={{ fontSize: '0.72rem', color: stats.low_stock_count > 0 ? 'var(--color-danger)' : 'var(--color-success)', fontWeight: 600 }}>
                {stats.low_stock_count > 0 ? "Requires restock" : "All inventories healthy"}
              </span>
            </div>
          </div>

          {/* Visual Sales Trends Chart & Category Breakdown */}
          {charts && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
              {/* Daily Sales Bar Chart */}
              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '18px' }}>
                  Daily Revenue Performance (Last 7 Days)
                </h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', gap: '10px' }}>
                  {charts.daily_trend?.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--color-primary)' }}>₹{d.sales}</span>
                      <div style={{
                        width: '100%',
                        maxWidth: '38px',
                        height: `${Math.max(20, (d.sales / 6000) * 130)}px`,
                        background: 'linear-gradient(180deg, var(--color-primary) 0%, #400B1A 100%)',
                        borderRadius: '4px 4px 0 0'
                      }} />
                      <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>{d.day.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Inventory Breakdown */}
              <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '18px' }}>
                  Stock Volume by Category
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {charts.category_distribution?.map((c) => (
                    <div key={c.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-espresso)' }}>{c.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>{c.product_count} models</span>
                        <strong style={{ color: 'var(--color-primary)', minWidth: '40px', textAlign: 'right' }}>{c.total_stock || 0} pcs</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Recent Orders Overview */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>
                Recent Customer Orders
              </h3>
              <button onClick={() => setActiveSection('orders')} style={{ fontSize: '0.82rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                Manage All Orders →
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                <thead>
                  <tr style={{ background: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                    <th style={{ padding: '10px 14px' }}>Order ID</th>
                    <th style={{ padding: '10px 14px' }}>Customer</th>
                    <th style={{ padding: '10px 14px' }}>Amount</th>
                    <th style={{ padding: '10px 14px' }}>Status</th>
                    <th style={{ padding: '10px 14px' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent_orders?.map((o) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 14px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>{o.order_number}</td>
                      <td style={{ padding: '10px 14px' }}>{o.customer_name}</td>
                      <td style={{ padding: '10px 14px', fontWeight: 700 }}>₹{o.net_amount?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span className="badge-burgundy" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>{o.order_status}</span>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)' }}>{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Today'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 2: MANAGE PRODUCTS --- */}
      {activeSection === 'products' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <input
                type="text"
                placeholder="Search products by title/SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
              />
              <Search size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>

            <button
              onClick={() => {
                setEditingProduct(null);
                setProductForm({
                  name: '',
                  description: '',
                  category_id: categories[0]?.id || 1,
                  original_price: '',
                  discounted_price: '',
                  stock: 20,
                  fabric: '',
                  sku: '',
                  is_featured: false,
                  is_trending: false,
                  is_new: true,
                  is_bestseller: false,
                  images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
                  variants: [
                    { size: 'S', color: 'Wine Burgundy', color_code: '#58111A', stock: 5 },
                    { size: 'M', color: 'Wine Burgundy', color_code: '#58111A', stock: 5 }
                  ]
                });
                setShowAddProductModal(true);
              }}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Plus size={15} /> Add New Product
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Product</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Price (₹)</th>
                  <th style={{ padding: '10px 12px' }}>Discount</th>
                  <th style={{ padding: '10px 12px' }}>Stock</th>
                  <th style={{ padding: '10px 12px' }}>SKU</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products
                  .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase())))
                  .map((p) => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={p.primary_image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=200&q=80"}
                          alt={p.name}
                          style={{ width: '40px', height: '50px', borderRadius: '4px', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--color-espresso)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {p.name}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>{p.category_name}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--color-primary)' }}>₹{p.discounted_price?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 12px' }}>{p.discount_percent}% OFF</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: 'var(--radius-full)',
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          background: p.stock < 10 ? '#FEF2F2' : '#ECFDF5',
                          color: p.stock < 10 ? 'var(--color-danger)' : 'var(--color-success)'
                        }}>
                          {p.stock} pcs
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{p.sku}</td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              setEditingProduct(p);
                              setProductForm({
                                name: p.name,
                                description: p.description,
                                category_id: p.category_id,
                                original_price: p.original_price,
                                discounted_price: p.discounted_price,
                                stock: p.stock,
                                fabric: p.fabric || '',
                                sku: p.sku || '',
                                is_featured: !!p.is_featured,
                                is_trending: !!p.is_trending,
                                is_new: !!p.is_new,
                                is_bestseller: !!p.is_bestseller,
                                images: [p.primary_image || ''],
                                variants: []
                              });
                              setShowAddProductModal(true);
                            }}
                            style={{ padding: '4px', color: 'var(--color-primary)' }}
                            title="Edit Product"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{ padding: '4px', color: 'var(--color-danger)' }}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 3: MANAGE ORDERS --- */}
      {activeSection === 'orders' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>
              Customer Orders & Dispatch Pipeline
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['all', 'Order Placed', 'Order Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    background: orderStatusFilter === st ? 'var(--color-primary)' : 'var(--color-surface-soft)',
                    color: orderStatusFilter === st ? '#FFF' : 'var(--color-text-muted)'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Order ID</th>
                  <th style={{ padding: '10px 12px' }}>Customer Info</th>
                  <th style={{ padding: '10px 12px' }}>Amount</th>
                  <th style={{ padding: '10px 12px' }}>Payment</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(o => orderStatusFilter === 'all' || o.order_status === orderStatusFilter)
                  .map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {ord.order_number}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <div><strong>{ord.customer_name}</strong></div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>{ord.customer_email} • {ord.customer_phone}</div>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>₹{ord.net_amount?.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{ord.payment_method} ({ord.payment_status})</span>
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className="badge-burgundy" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                          {ord.order_status}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                        <button
                          onClick={() => {
                            setSelectedOrderToUpdate(ord);
                            setOrderStatusForm({
                              order_status: ord.order_status,
                              courier_name: ord.courier_name || 'Bluedart Express',
                              tracking_number: ord.tracking_number || '',
                              description: '',
                              location: ''
                            });
                          }}
                          className="btn-secondary"
                          style={{ padding: '5px 10px', fontSize: '0.74rem' }}
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 4: INVENTORY TRACKER --- */}
      {activeSection === 'inventory' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '16px' }}>
            Inventory Management & Stock Warnings
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Product</th>
                  <th style={{ padding: '10px 12px' }}>SKU</th>
                  <th style={{ padding: '10px 12px' }}>Category</th>
                  <th style={{ padding: '10px 12px' }}>Current Stock</th>
                  <th style={{ padding: '10px 12px' }}>Warning Level</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Restock Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{item.name}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{item.sku}</td>
                    <td style={{ padding: '10px 12px' }}>{item.category_name}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, fontSize: '0.9rem' }}>{item.stock} units</td>
                    <td style={{ padding: '10px 12px' }}>
                      {item.stock < 10 ? (
                        <span style={{ color: 'var(--color-danger)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle size={14} /> Low Stock Alert
                        </span>
                      ) : (
                        <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>✓ Healthy</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleQuickRestock(item.id, item.stock)}
                        className="btn-primary"
                        style={{ padding: '4px 10px', fontSize: '0.72rem' }}
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 5: CATEGORIES --- */}
      {activeSection === 'categories' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>
              Product Categories ({categories.length})
            </h3>
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Plus size={15} /> Add Category
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
            {categories.map((cat) => (
              <div key={cat.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <img src={cat.image_url} alt={cat.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{cat.name}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{cat.product_count} products</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TAB 6: OFFERS & COUPONS --- */}
      {activeSection === 'coupons' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem' }}>
              Promotional Coupons & Festive Offers
            </h3>
            <button
              onClick={() => setShowAddCouponModal(true)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.82rem' }}
            >
              <Plus size={15} /> Create Coupon
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Code</th>
                  <th style={{ padding: '10px 12px' }}>Discount Type</th>
                  <th style={{ padding: '10px 12px' }}>Value</th>
                  <th style={{ padding: '10px 12px' }}>Min Order</th>
                  <th style={{ padding: '10px 12px' }}>Expiry</th>
                  <th style={{ padding: '10px 12px' }}>Used</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '0.05em' }}>{c.code}</td>
                    <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{c.discount_type}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>
                      {c.discount_type === 'percentage' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                    </td>
                    <td style={{ padding: '10px 12px' }}>₹{c.min_order_value}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--color-text-muted)' }}>{c.expiry_date}</td>
                    <td style={{ padding: '10px 12px' }}>{c.usage_count} times</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <button onClick={() => handleDeleteCoupon(c.id)} style={{ color: 'var(--color-danger)' }}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 7: CUSTOMERS --- */}
      {activeSection === 'customers' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '16px' }}>
            Registered Boutique Patrons ({customers.length})
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface-soft)', borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>Patron Name</th>
                  <th style={{ padding: '10px 12px' }}>Email</th>
                  <th style={{ padding: '10px 12px' }}>Phone</th>
                  <th style={{ padding: '10px 12px' }}>Total Orders</th>
                  <th style={{ padding: '10px 12px' }}>Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((cust) => (
                  <tr key={cust.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700 }}>{cust.name}</td>
                    <td style={{ padding: '10px 12px' }}>{cust.email}</td>
                    <td style={{ padding: '10px 12px' }}>{cust.phone || 'N/A'}</td>
                    <td style={{ padding: '10px 12px' }}>{cust.total_orders} orders</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--color-primary)' }}>₹{cust.total_spent?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* --- TAB 8: REVIEWS MODERATION --- */}
      {activeSection === 'reviews' && (
        <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', marginBottom: '16px' }}>
            Customer Reviews & Moderation ({reviews.length})
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviews.map((r) => (
              <div key={r.id} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong>{r.user_name}</strong>
                    <span className="badge-gold" style={{ fontSize: '0.65rem' }}>★ {r.rating} / 5</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: 600 }}>Product: {r.product_name}</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: 'var(--color-text)', marginTop: '4px' }}>
                    "{r.comment}"
                  </p>
                </div>
                <button onClick={() => handleDeleteReview(r.id)} style={{ color: 'var(--color-danger)', padding: '6px' }} title="Delete Review">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- MODAL: ADD / EDIT PRODUCT --- */}
      {showAddProductModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            width: '100%',
            maxWidth: '640px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '10px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem' }}>
                {editingProduct ? "Edit Boutique Product" : "Add New Boutique Product"}
              </h3>
              <button onClick={() => setShowAddProductModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Product Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zari Embroidered Silk Saree"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Category</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Fabric / Material</label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Banarasi Silk"
                    value={productForm.fabric}
                    onChange={(e) => setProductForm({ ...productForm, fabric: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.original_price}
                    onChange={(e) => setProductForm({ ...productForm, original_price: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Discounted Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.discounted_price}
                    onChange={(e) => setProductForm({ ...productForm, discounted_price: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Total Stock</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Product Image URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={productForm.images[0] || ''}
                  onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: '6px 0' }}>
                <label style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" checked={productForm.is_new} onChange={(e) => setProductForm({ ...productForm, is_new: e.target.checked })} />
                  New Arrival
                </label>
                <label style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" checked={productForm.is_bestseller} onChange={(e) => setProductForm({ ...productForm, is_bestseller: e.target.checked })} />
                  Best Seller
                </label>
                <label style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" checked={productForm.is_trending} onChange={(e) => setProductForm({ ...productForm, is_trending: e.target.checked })} />
                  Trending Piece
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setShowAddProductModal(false)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  {editingProduct ? "Update Product" : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: UPDATE ORDER STATUS --- */}
      {selectedOrderToUpdate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: 'var(--shadow-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '14px' }}>
              Update Status for #{selectedOrderToUpdate.order_number}
            </h3>

            <form onSubmit={handleUpdateOrderStatus} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Order Status</label>
                <select
                  value={orderStatusForm.order_status}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, order_status: e.target.value })}
                  style={{ width: '100%', padding: '9px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.85rem' }}
                >
                  {['Order Placed', 'Order Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Courier Partner</label>
                <input
                  type="text"
                  value={orderStatusForm.courier_name}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, courier_name: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Tracking Number</label>
                <input
                  type="text"
                  placeholder="e.g. BD-992140"
                  value={orderStatusForm.tracking_number}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, tracking_number: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 600 }}>Checkpoint Location</label>
                <input
                  type="text"
                  placeholder="e.g. Bengaluru Central Air Hub"
                  value={orderStatusForm.location}
                  onChange={(e) => setOrderStatusForm({ ...orderStatusForm, location: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setSelectedOrderToUpdate(null)} className="btn-secondary" style={{ flex: 1, padding: '10px' }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>
                  Save & Notify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE CATEGORY --- */}
      {showAddCategoryModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '420px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '14px' }}>Create Category</h3>
            <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                required
                placeholder="Category Name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
              />
              <textarea
                placeholder="Description"
                rows={2}
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem', resize: 'none' }}
              />
              <input
                type="url"
                required
                placeholder="Image URL"
                value={categoryForm.image_url}
                onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddCategoryModal(false)} className="btn-secondary" style={{ flex: 1, padding: '9px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '9px' }}>Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE COUPON --- */}
      {showAddCouponModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div style={{ background: '#FFFFFF', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '420px', padding: '24px' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '14px' }}>Create Promotional Coupon</h3>
            <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                required
                placeholder="Coupon Code (e.g. DIWALI30)"
                value={couponForm.code}
                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem', textTransform: 'uppercase' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <select
                  value={couponForm.discount_type}
                  onChange={(e) => setCouponForm({ ...couponForm, discount_type: e.target.value })}
                  style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Discount Value"
                  value={couponForm.discount_value}
                  onChange={(e) => setCouponForm({ ...couponForm, discount_value: Number(e.target.value) })}
                  style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
                />
              </div>
              <input
                type="number"
                placeholder="Min Order Value (₹)"
                value={couponForm.min_order_value}
                onChange={(e) => setCouponForm({ ...couponForm, min_order_value: Number(e.target.value) })}
                style={{ padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddCouponModal(false)} className="btn-secondary" style={{ flex: 1, padding: '9px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '9px' }}>Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
