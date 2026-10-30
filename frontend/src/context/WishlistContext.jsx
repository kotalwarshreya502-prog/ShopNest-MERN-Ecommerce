import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("shopnest_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loadingWishlist, setLoadingWishlist] = useState(false);

  // Fetch Wishlist from MongoDB Atlas whenever user becomes authenticated
  const fetchWishlistFromDB = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }
    setLoadingWishlist(true);
    try {
      const res = await api.get("/wishlist");
      if (res.data.success && res.data.wishlist) {
        setWishlist(res.data.wishlist);
        localStorage.setItem("shopnest_wishlist", JSON.stringify(res.data.wishlist));
      }
    } catch (err) {
      console.warn("Could not load wishlist from MongoDB:", err.message);
    } finally {
      setLoadingWishlist(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlistFromDB();
  }, [fetchWishlistFromDB]);

  useEffect(() => {
    if (wishlist && wishlist.length > 0) {
      localStorage.setItem("shopnest_wishlist", JSON.stringify(wishlist));
    } else {
      localStorage.removeItem("shopnest_wishlist");
    }
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => String(item._id || item) === String(productId));
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      openAuthModal();
      return false;
    }

    try {
      const res = await api.post(`/wishlist/toggle/${product._id}`);
      if (res.data.success) {
        setWishlist(res.data.wishlist);
        return res.data.added;
      }
    } catch (err) {
      console.error("Failed to toggle wishlist in DB:", err);
      // Fallback local toggle
      let added = false;
      setWishlist((prev) => {
        if (prev.some((p) => String(p._id) === String(product._id))) {
          added = false;
          return prev.filter((p) => String(p._id) !== String(product._id));
        } else {
          added = true;
          return [...prev, product];
        }
      });
      return added;
    }
  };

  const removeFromWishlist = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/wishlist/remove/${productId}`);
        if (res.data.success) {
          setWishlist(res.data.wishlist);
          return;
        }
      } catch (err) {
        console.error("Failed to remove from wishlist in DB:", err);
      }
    }
    setWishlist((prev) => prev.filter((item) => String(item._id || item) !== String(productId)));
  };

  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem("shopnest_wishlist");
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        loadingWishlist,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlistFromDB,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
