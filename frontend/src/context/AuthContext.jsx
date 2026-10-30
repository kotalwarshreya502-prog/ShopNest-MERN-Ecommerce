import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("shopnest_user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("shopnest_token") || null;
  });

  const [loading, setLoading] = useState(true);

  // Authentication popup modal state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(() => {
    try {
      const saved = sessionStorage.getItem("shopnest_pending_cart_item");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Sync token to api service and localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem("shopnest_token", token);
    } else {
      localStorage.removeItem("shopnest_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("shopnest_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("shopnest_user");
    }
    setLoading(false);
  }, [user]);

  // Sync pendingCartItem to sessionStorage
  useEffect(() => {
    if (pendingCartItem) {
      sessionStorage.setItem("shopnest_pending_cart_item", JSON.stringify(pendingCartItem));
    } else {
      sessionStorage.removeItem("shopnest_pending_cart_item");
    }
  }, [pendingCartItem]);

  const openAuthModal = (item = null) => {
    if (item) {
      setPendingCartItem(item);
    }
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const clearPendingCartItem = () => {
    setPendingCartItem(null);
    sessionStorage.removeItem("shopnest_pending_cart_item");
  };

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("shopnest_user", JSON.stringify(userData));
    localStorage.setItem("shopnest_token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    clearPendingCartItem();
    localStorage.removeItem("shopnest_user");
    localStorage.removeItem("shopnest_token");
    localStorage.removeItem("shopnest_cart");
    localStorage.removeItem("shopnest_wishlist");
    localStorage.removeItem("shopnest_coupon");
  };

  const updateUser = (updatedData) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem("shopnest_user", JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "admin",
        login,
        logout,
        updateUser,
        loading,
        authModalOpen,
        openAuthModal,
        closeAuthModal,
        pendingCartItem,
        setPendingCartItem,
        clearPendingCartItem,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
