import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    try {
      setLoading(true);
      const items = await api.getWishlist();
      setWishlistItems(items || []);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isWishlisted = (productId) => {
    return wishlistItems.some(item => item.id === productId || item.product_id === productId);
  };

  const toggleWishlist = async (productId) => {
    if (!isAuthenticated) {
      throw new Error("PLEASE_LOGIN");
    }
    const res = await api.toggleWishlist(productId);
    await fetchWishlist();
    return res;
  };

  const removeFromWishlist = async (productId) => {
    await api.removeFromWishlist(productId);
    await fetchWishlist();
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlistCount: wishlistItems.length,
      loading,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      refreshWishlist: fetchWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
