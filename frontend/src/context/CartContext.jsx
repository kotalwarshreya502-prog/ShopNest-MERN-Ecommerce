import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("shopnest_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [loadingCart, setLoadingCart] = useState(false);

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem("shopnest_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Fetch Cart from MongoDB Atlas whenever user becomes authenticated
  const fetchCartFromDB = useCallback(async () => {
    if (!isAuthenticated) {
      setItems([]);
      return;
    }
    setLoadingCart(true);
    try {
      const res = await api.get("/cart");
      if (res.data.success && res.data.cart?.items) {
        setItems(res.data.cart.items);
        localStorage.setItem("shopnest_cart", JSON.stringify(res.data.cart.items));
      }
    } catch (err) {
      console.warn("Could not load cart from MongoDB:", err.message);
    } finally {
      setLoadingCart(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCartFromDB();
  }, [fetchCartFromDB]);

  useEffect(() => {
    if (items && items.length > 0) {
      localStorage.setItem("shopnest_cart", JSON.stringify(items));
    } else {
      localStorage.removeItem("shopnest_cart");
    }
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem("shopnest_coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("shopnest_coupon");
    }
  }, [coupon]);

  // Add to cart with guest protection
  const addToCart = async (product, qty = 1) => {
    const quantity = Math.max(1, parseInt(qty, 10) || 1);

    // If guest, show professional login/register popup and do not add to cart yet
    if (!isAuthenticated) {
      openAuthModal({ product, quantity });
      return { success: false, requireAuth: true };
    }

    // For authenticated users, persist directly to MongoDB Atlas
    try {
      const res = await api.post("/cart/add", {
        productId: product._id,
        quantity,
      });

      if (res.data.success && res.data.cart) {
        setItems(res.data.cart.items);
        return {
          success: true,
          message: res.data.message || "Your product has been successfully added to your cart!",
        };
      }
    } catch (err) {
      console.error("Cart addition failed:", err);
      // Fallback local update
      setItems((prev) => {
        const idx = prev.findIndex((i) => String(i.product || i._id) === String(product._id));
        if (idx > -1) {
          const updated = [...prev];
          updated[idx].quantity = (updated[idx].quantity || 1) + quantity;
          return updated;
        }
        return [
          ...prev,
          {
            _id: product._id,
            product: product._id,
            name: product.name,
            price: Number(product.discountPrice || product.price),
            originalPrice: Number(product.price),
            image: product.image || (product.images && product.images[0]) || "",
            category: product.category || "General",
            brand: product.brand || "",
            quantity,
            stock: product.stock || 999,
          },
        ];
      });
      return { success: true, message: "Your product has been successfully added to your cart!" };
    }
  };

  // Automatically add pending product to MongoDB cart after successful login or registration
  const addPendingItemToCart = async (pendingItem) => {
    if (!pendingItem || !pendingItem.product) return null;
    const prod = pendingItem.product;
    const prodId = prod._id || prod;
    const quantity = pendingItem.quantity || 1;

    try {
      const res = await api.post("/cart/add", {
        productId: prodId,
        quantity,
      });

      if (res.data.success && res.data.cart) {
        setItems(res.data.cart.items);
        return {
          success: true,
          message: "Your product has been successfully added to your cart!",
        };
      }
    } catch (err) {
      console.error("Failed to add pending product to cart:", err);
    }
    return null;
  };

  const updateQuantity = async (productId, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      return removeFromCart(productId);
    }

    if (isAuthenticated) {
      try {
        const res = await api.put("/cart/update", {
          productId,
          quantity: qty,
        });
        if (res.data.success && res.data.cart) {
          setItems(res.data.cart.items);
          return;
        }
      } catch (err) {
        console.error("Update quantity failed in DB:", err);
      }
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item.product || item._id) === String(productId)) {
          const validQty = Math.min(item.stock || 999, Math.max(1, qty));
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/remove/${productId}`);
        if (res.data.success && res.data.cart) {
          setItems(res.data.cart.items);
          return;
        }
      } catch (err) {
        console.error("Remove item failed in DB:", err);
      }
    }

    setItems((prevItems) =>
      prevItems.filter((item) => String(item.product || item._id) !== String(productId))
    );
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.delete("/cart/clear");
      } catch (err) {
        console.error("Clear cart failed in DB:", err);
      }
    }

    setItems([]);
    setCoupon(null);
    localStorage.removeItem("shopnest_cart");
    localStorage.removeItem("shopnest_coupon");
  };

  const applyCouponCode = (code) => {
    const cleanCode = (code || "").trim().toUpperCase();
    if (cleanCode === "SAVE10") {
      setCoupon({ code: "SAVE10", type: "percent", value: 10, label: "10% Off" });
      return { success: true, message: "Coupon SAVE10 applied! You get 10% off." };
    } else if (cleanCode === "SHOP500") {
      setCoupon({ code: "SHOP500", type: "fixed", value: 500, label: "₹500 Flat Off" });
      return { success: true, message: "Coupon SHOP500 applied! Flat ₹500 off." };
    } else if (cleanCode === "FESTIVE50") {
      setCoupon({ code: "FESTIVE50", type: "percent", value: 15, label: "Festive 15% Off" });
      return { success: true, message: "Festive offer applied! 15% off." };
    } else {
      return { success: false, message: "Invalid coupon code. Try SAVE10, SHOP500 or FESTIVE50." };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Calculations
  const totalItemsCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  // Free delivery above ₹999, else ₹79 standard shipping
  const shipping = subtotal > 0 && subtotal < 999 ? 79 : 0;

  let discount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.type === "percent") {
      discount = Math.round((subtotal * coupon.value) / 100);
    } else if (coupon.type === "fixed") {
      discount = Math.min(subtotal, coupon.value);
    }
  }

  const grandTotal = Math.max(0, subtotal + shipping - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItemsCount,
        subtotal,
        shipping,
        discount,
        grandTotal,
        coupon,
        loadingCart,
        addToCart,
        addPendingItemToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,
        removeCoupon,
        fetchCartFromDB,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
