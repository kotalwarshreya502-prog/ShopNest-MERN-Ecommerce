import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Heart, ShoppingBag, Check } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const isLiked = isInWishlist(product._id);
  const currentPrice = Number(product.discountPrice || product.price);
  const originalPrice = product.discountPrice
    ? Number(product.price)
    : Number(product.originalPrice || 0);

  const discountPercent =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const imageSrc =
    product.image ||
    (product.images && product.images[0]) ||
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600";

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link to={`/product/${product._id}`}>
          <img
            src={imageSrc}
            alt={product.name}
            className="product-image"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
            }}
          />
        </Link>

        {/* Badges */}
        <div className="product-card-badges">
          {discountPercent > 0 && (
            <span className="badge-discount">{discountPercent}% OFF</span>
          )}
          {product.isFeatured && <span className="badge-featured">FEATURED</span>}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="badge-stock-low">Only {product.stock} left</span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          className={`wishlist-icon ${isLiked ? "liked" : ""}`}
          onClick={handleWishlistClick}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
        </button>

        {/* Quick Add Overlay on hover */}
        <div className="quick-add-overlay">
          <button
            className={`btn-quick-add ${justAdded ? "added" : ""}`}
            onClick={handleQuickAdd}
            disabled={product.stock <= 0}
          >
            {justAdded ? (
              <>
                <Check size={16} /> Added!
              </>
            ) : product.stock <= 0 ? (
              "Out of stock"
            ) : (
              <>
                <ShoppingBag size={16} /> Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-category-brand">
          <span className="product-category">{product.category}</span>
          {product.brand && <span className="product-brand-dot">•</span>}
          {product.brand && <span className="product-brand">{product.brand}</span>}
        </div>

        <Link to={`/product/${product._id}`} className="product-name" title={product.name}>
          {product.name}
        </Link>

        <div className="product-rating">
          <div className="stars-wrapper">
            <Star size={13} fill="currentColor" />
            <span className="rating-num">
              {Number(product.ratings || product.rating || 4.5).toFixed(1)}
            </span>
          </div>
          <span className="reviews-num">
            ({product.numReviews || product.reviewsCount || 24})
          </span>
        </div>

        <div className="product-prices">
          <strong className="current-price">
            ₹{currentPrice.toLocaleString("en-IN")}
          </strong>
          {originalPrice > currentPrice && (
            <del className="original-price">
              ₹{originalPrice.toLocaleString("en-IN")}
            </del>
          )}
        </div>
      </div>
    </article>
  );
}
