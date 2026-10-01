import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [summary, setSummary] = useState({
    item_count: 0,
    original_subtotal: 0,
    discount_amount: 0,
    subtotal: 0,
    delivery_charge: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setSummary({
        item_count: 0,
        original_subtotal: 0,
        discount_amount: 0,
        subtotal: 0,
        delivery_charge: 0,
        total: 0
      });
      return;
    }
    try {
      setLoading(true);
      const res = await api.getCart();
      setCartItems(res.items || []);
      setSummary(res.summary || {});
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("PLEASE_LOGIN");
    }
    const res = await api.addToCart({
      product_id: productId,
      size,
      color,
      quantity
    });
    await fetchCart();
    return res;
  };

  const updateQuantity = async (cartId, quantity) => {
    await api.updateCartItem(cartId, quantity);
    await fetchCart();
  };

  const removeFromCart = async (cartId) => {
    await api.deleteCartItem(cartId);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.clearCart();
    await fetchCart();
  };

  const applyCouponCode = async (code) => {
    const res = await api.applyCoupon(code, summary.subtotal);
    setAppliedCoupon({
      code: res.code,
      discount_amount: res.discount_amount
    });
    return res;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Grand total including coupon discount
  const finalTotal = appliedCoupon
    ? Math.max(0, summary.total - appliedCoupon.discount_amount)
    : summary.total;

  return (
    <CartContext.Provider value={{
      cartItems,
      summary,
      loading,
      appliedCoupon,
      finalTotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      refreshCart: fetchCart,
      applyCouponCode,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
