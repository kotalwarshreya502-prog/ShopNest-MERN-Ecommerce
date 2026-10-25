import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
  };

  return (
    <div className="shopnest">
      <Navbar />

      <main className="section-container page-content">
        <div className="page-heading">
          <span className="eyebrow">YOUR SAVED ITEMS</span>
          <h1>My Wishlist ({wishlist.length})</h1>
          <p>Keep track of products you love and want to buy later.</p>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Heart size={48} className="empty-icon" />
            </div>
            <h2>Your wishlist is empty</h2>
            <p>Explore our products and tap the heart icon to save items here.</p>
            <Link to="/shop" className="btn-primary">
              Explore Products <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="wishlist-wrapper">
            <div className="wishlist-actions-bar">
              <span>{wishlist.length} item{wishlist.length > 1 ? "s" : ""} saved</span>
              <button onClick={clearWishlist} className="btn-text-danger">
                <Trash2 size={16} /> Clear all
              </button>
            </div>

            <div className="product-grid">
              {wishlist.map((product) => (
                <div key={product._id} className="product-card">
                  <div className="product-image-wrap">
                    <img
                      src={product.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600"}
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
                      }}
                    />
                    <button
                      className="wishlist-icon liked"
                      onClick={() => removeFromWishlist(product._id)}
                      title="Remove from wishlist"
                    >
                      <Heart size={18} fill="currentColor" />
                    </button>
                  </div>

                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <Link to={`/product/${product._id}`} className="product-name">
                      {product.name}
                    </Link>
                    <div className="product-prices">
                      <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
                    </div>

                    <button
                      onClick={() => handleMoveToCart(product)}
                      className="btn-primary btn-sm move-cart-btn"
                    >
                      <ShoppingBag size={16} /> Move to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
