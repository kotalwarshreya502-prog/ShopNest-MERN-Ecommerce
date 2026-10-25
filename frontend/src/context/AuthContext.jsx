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

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("shopnest_user", JSON.stringify(userData));
    localStorage.setItem("shopnest_token", authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("shopnest_user");
    localStorage.removeItem("shopnest_token");
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
