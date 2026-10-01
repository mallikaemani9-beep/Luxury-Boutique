import React, { useState, useEffect } from 'react';
import { 
  Filter, SlidersHorizontal, Search, X, Check, 
  ArrowUpDown, ChevronDown, RotateCcw 
} from 'lucide-react';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ShopPage({ onNavigate, initialFilters = {}, onRequireAuth }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(initialFilters.search || '');
  const [category, setCategory] = useState(initialFilters.category || 'all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(initialFilters.sort_by || 'newest');
  const [isNewOnly, setIsNewOnly] = useState(initialFilters.filter === 'is_new');
  const [isBestsellerOnly, setIsBestsellerOnly] = useState(initialFilters.filter === 'is_bestseller');

  // Mobile drawer open state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await api.getCategories();
        setCategories(cats || []);
      } catch (err) {
        console.error(err);
      }
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const params = {
          search: search.trim() || undefined,
          category: category !== 'all' ? category : undefined,
          min_price: minPrice ? Number(minPrice) : undefined,
          max_price: maxPrice ? Number(maxPrice) : undefined,
          size: selectedSize || undefined,
          color: selectedColor || undefined,
          rating: ratingFilter ? Number(ratingFilter) : undefined,
          in_stock: inStockOnly || undefined,
          sort_by: sortBy,
          is_new: isNewOnly || undefined,
          is_bestseller: isBestsellerOnly || undefined
        };
        const prods = await api.getProducts(params);
        setProducts(prods || []);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [search, category, minPrice, maxPrice, selectedSize, selectedColor, ratingFilter, inStockOnly, sortBy, isNewOnly, isBestsellerOnly]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSize('');
    setSelectedColor('');
    setRatingFilter('');
    setInStockOnly(false);
    setSortBy('newest');
    setIsNewOnly(false);
    setIsBestsellerOnly(false);
  };

  const sizesList = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colorsList = [
    { label: 'Wine Burgundy', code: '#58111A' },
    { label: 'Emerald Green', code: '#0B5345' },
    { label: 'Blush Pink', code: '#E8C4C8' },
    { label: 'Rose Gold', code: '#B76E79' },
    { label: 'Mustard Gold', code: '#E5A93B' },
    { label: 'Indigo Blue', code: '#1A2B4C' },
    { label: 'Ivory Cream', code: '#FDFBF7' }
  ];

  return (
    <div className="shop-page container" style={{ padding: '36px 20px', minHeight: '80vh' }}>
      {/* Header with Title & Sort controls */}
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
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-espresso)' }}>
            {category && category !== 'all' ? `${category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')} Collection` : 'All Boutique Coutures'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Showing {products.length} exclusive designer pieces
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
          </button>

          {/* Sort By Dropdown */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '9px 36px 9px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--color-border)',
                background: '#FFFFFF',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                appearance: 'none',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="popular">Sort: Most Popular</option>
              <option value="price_asc">Sort: Price Low to High</option>
              <option value="price_desc">Sort: Price High to Low</option>
              <option value="rating">Sort: Highest Rated</option>
            </select>
            <ArrowUpDown size={15} color="var(--color-text-muted)" style={{ position: 'absolute', right: '12px', pointerEvents: 'none' }} />
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Products Grid */}
      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        {/* Desktop Sidebar Filters */}
        <aside 
          className="desktop-filter-sidebar"
          style={{
            width: '260px',
            flexShrink: 0,
            background: '#FFFFFF',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 600 }}>
              Refine By
            </h4>
            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.75rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}
            >
              <RotateCcw size={13} /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Search Keywords</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Product name, silk, kurti..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.82rem',
                  outline: 'none'
                }}
              />
              <Search size={15} color="var(--color-text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>Categories</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto' }}>
              <button
                onClick={() => setCategory('all')}
                style={{
                  textAlign: 'left',
                  fontSize: '0.82rem',
                  padding: '4px 6px',
                  borderRadius: '4px',
                  fontWeight: category === 'all' ? 700 : 500,
                  color: category === 'all' ? 'var(--color-primary)' : 'var(--color-text)',
                  background: category === 'all' ? 'var(--color-primary-light)' : 'transparent'
                }}
              >
                All Collections
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.slug)}
                  style={{
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    fontWeight: category === c.slug ? 700 : 500,
                    color: category === c.slug ? 'var(--color-primary)' : 'var(--color-text)',
                    background: category === c.slug ? 'var(--color-primary-light)' : 'transparent'
                  }}
                >
                  {c.name} ({c.product_count})
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>Price Range (₹)</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
              />
              <span style={{ color: 'var(--color-text-muted)' }}>-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>Size</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {sizesList.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${selectedSize === sz ? 'var(--color-primary)' : 'var(--color-border)'}`,
                    background: selectedSize === sz ? 'var(--color-primary)' : '#FFF',
                    color: selectedSize === sz ? '#FFF' : 'var(--color-text)',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Color Palettes */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '8px' }}>Color Palette</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {colorsList.map((clr) => (
                <button
                  key={clr.label}
                  onClick={() => setSelectedColor(selectedColor === clr.label ? '' : clr.label)}
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    background: clr.code,
                    border: selectedColor === clr.label ? '2px solid var(--color-primary)' : '1px solid rgba(0,0,0,0.2)',
                    boxShadow: selectedColor === clr.label ? '0 0 6px var(--color-primary)' : 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title={clr.label}
                >
                  {selectedColor === clr.label && <Check size={12} color="#FFF" />}
                </button>
              ))}
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Minimum Rating</label>
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--color-border)', fontSize: '0.82rem' }}
            >
              <option value="">All Ratings</option>
              <option value="4.8">4.8 & Above</option>
              <option value="4.5">4.5 & Above</option>
              <option value="4.0">4.0 & Above</option>
            </select>
          </div>

          {/* Availability */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="instock"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              style={{ cursor: 'pointer', accentColor: 'var(--color-primary)' }}
            />
            <label htmlFor="instock" style={{ fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>
              In Stock Only
            </label>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '20px'
            }}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-shimmer" style={{ height: '360px', borderRadius: 'var(--radius-md)' }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)'
            }}>
              <Search size={44} color="var(--color-border)" style={{ margin: '0 auto 14px' }} />
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.3rem', color: 'var(--color-espresso)' }}>
                No matching couture found
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '6px', maxWidth: '400px', margin: '6px auto 16px' }}>
                We could not find items matching your active filter criteria. Try clearing some filters or searching for Banarasi, Kurti, or Saree.
              </p>
              <button onClick={handleResetFilters} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                Reset All Filters
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))',
              gap: '20px'
            }}>
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={(id) => onNavigate('product-detail', { id })}
                  onRequireAuth={onRequireAuth}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-in Modal */}
      {mobileFilterOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <div style={{
            width: '85%',
            maxWidth: '340px',
            height: '100%',
            background: '#FFFFFF',
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} style={{ padding: '4px' }}>
                <X size={20} />
              </button>
            </div>

            {/* Mobile Filters Body */}
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)' }}
              >
                <option value="all">All Collections</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '6px' }}>Sizes</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {sizesList.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(selectedSize === sz ? '' : sz)}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '4px',
                      border: `1px solid ${selectedSize === sz ? 'var(--color-primary)' : 'var(--color-border)'}`,
                      background: selectedSize === sz ? 'var(--color-primary)' : '#FFF',
                      color: selectedSize === sz ? '#FFF' : 'var(--color-text)',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="btn-primary"
              style={{ width: '100%', marginTop: 'auto', padding: '12px' }}
            >
              Apply Filters ({products.length} items)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
