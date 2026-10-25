import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("shopnest_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState(() => {
    try {
      const saved = localStorage.getItem("shopnest_coupon");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    localStorage.setItem("shopnest_cart", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (coupon) {
      localStorage.setItem("shopnest_coupon", JSON.stringify(coupon));
    } else {
      localStorage.removeItem("shopnest_coupon");
    }
  }, [coupon]);

  const addToCart = (product, qty = 1) => {
    const quantity = Math.max(1, parseInt(qty, 10) || 1);
    const maxStock = product.stock !== undefined ? product.stock : 999;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => String(item._id) === String(product._id)
      );

      if (existingIndex > -1) {
        const currentQty = prevItems[existingIndex].quantity || 1;
        const newQty = Math.min(maxStock, currentQty + quantity);
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      } else {
        const itemToAdd = {
          _id: product._id,
          name: product.name,
          price: Number(product.discountPrice || product.price),
          originalPrice: product.discountPrice ? Number(product.price) : Number(product.originalPrice || product.price),
          image: product.image || (product.images && product.images[0]) || "",
          category: product.category || "General",
          brand: product.brand || "",
          stock: maxStock,
          quantity: Math.min(maxStock, quantity),
        };
        return [...prevItems, itemToAdd];
      }
    });
  };

  const updateQuantity = (productId, newQty) => {
    const qty = parseInt(newQty, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (String(item._id) === String(productId)) {
          const validQty = Math.min(item.stock || 999, Math.max(1, qty));
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => String(item._id) !== String(productId))
    );
  };

  const clearCart = () => {
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
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCouponCode,
        removeCoupon,
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
