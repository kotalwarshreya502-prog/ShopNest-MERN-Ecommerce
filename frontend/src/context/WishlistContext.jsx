import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem("shopnest_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("shopnest_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => String(item._id) === String(productId));
  };

  const addToWishlist = (product) => {
    if (!isInWishlist(product._id)) {
      setWishlist((prev) => [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.discountPrice ? product.price : null,
          image: product.image || (product.images && product.images[0]) || "",
          category: product.category,
          brand: product.brand,
          rating: product.ratings || product.rating || 4.5,
          stock: product.stock,
        },
      ]);
    }
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) =>
      prev.filter((item) => String(item._id) !== String(productId))
    );
  };

  const toggleWishlist = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      return false; // removed
    } else {
      addToWishlist(product);
      return true; // added
    }
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
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
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
