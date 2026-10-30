import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  ShoppingBag,
  Truck,
  ShieldCheck,
  RotateCcw,
  Minus,
  Plus,
  ArrowLeft,
  Check,
  MapPin,
  MessageSquare,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProductCard from "../components/common/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAuthenticated, user, openAuthModal } = useAuth();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState("");
  const [addedNotice, setAddedNotice] = useState(false);

  // Delivery pincode check
  const [pincode, setPincode] = useState("");
  const [pincodeStatus, setPincodeStatus] = useState(null);

  // Review submission form
  const [ratingInput, setRatingInput] = useState(5);
  const [titleInput, setTitleInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setReviewSuccess("");
    setReviewError("");

    api
      .get(`/products/${id}`)
      .then((res) => {
        if (isMounted) {
          const data = res.data;
          setProduct(data.product);
          setReviews(data.reviews || []);
          setRelatedProducts(data.relatedProducts || []);
          setSelectedImage(
            data.product.image ||
              (data.product.images && data.product.images[0]) ||
              ""
          );

          // Save to recently viewed in localStorage
          try {
            const recent = JSON.parse(
              localStorage.getItem("shopnest_recently_viewed") || "[]"
            );
            const filtered = recent.filter(
              (p) => String(p._id) !== String(data.product._id)
            );
            filtered.unshift({
              _id: data.product._id,
              name: data.product.name,
              price: data.product.price,
              discountPrice: data.product.discountPrice,
              image: data.product.image,
              category: data.product.category,
              ratings: data.product.ratings,
            });
            localStorage.setItem(
              "shopnest_recently_viewed",
              JSON.stringify(filtered.slice(0, 6))
            );
          } catch (e) {
            console.warn(e);
          }
        }
      })
      .catch((err) => {
        console.error("Failed to fetch product details:", err.message);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6 && /^\d+$/.test(pincode.trim())) {
      setPincodeStatus({
        valid: true,
        message: "Delivery available! Estimated delivery within 2-4 business days.",
      });
    } else {
      setPincodeStatus({
        valid: false,
        message: "Please enter a valid 6-digit Indian PIN code.",
      });
    }
  };

  const handleAddToCart = async () => {
    if (!product || product.stock <= 0) return;
    const res = await addToCart(product, quantity);
    if (res?.success) {
      setAddedNotice(true);
      setTimeout(() => setAddedNotice(false), 2500);
    }
  };

  const handleBuyNow = async () => {
    if (!product || product.stock <= 0) return;
    if (!isAuthenticated) {
      openAuthModal({ product, quantity });
      return;
    }
    await addToCart(product, quantity);
    navigate("/checkout");
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    if (!isAuthenticated) {
      setReviewError("Please log in to submit a review.");
      return;
    }

    if (!commentInput.trim()) {
      setReviewError("Please provide review comments.");
      return;
    }

    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, {
        rating: ratingInput,
        title: titleInput,
        comment: commentInput,
      });

      if (res.data.success) {
        setReviewSuccess("Thank you! Your verified review has been published.");
        setReviews([res.data.review, ...reviews]);
        setTitleInput("");
        setCommentInput("");
        setRatingInput(5);
      }
    } catch (err) {
      setReviewError(
        err.response?.data?.message || "Failed to submit review. Try again."
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="shopnest">
        <Navbar />
        <div className="section-container loading-state">
          <div className="skeleton-content" style={{ maxWidth: 800, margin: "4rem auto" }}>
            <div className="skeleton-image pulse" style={{ height: 350, borderRadius: 16 }}></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="shopnest">
        <Navbar />
        <div className="section-container empty-state">
          <h2>Product Not Found</h2>
          <p>The product you are looking for does not exist in our catalog.</p>
          <Link to="/shop" className="btn-primary">
            Browse All Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const currentPrice = Number(product.discountPrice || product.price);
  const originalPrice = product.discountPrice ? Number(product.price) : 0;
  const discountPercent =
    originalPrice > currentPrice
      ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
      : 0;

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image];

  return (
    <div className="shopnest">
      <Navbar />

      <main className="section-container product-details-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/shop">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${encodeURIComponent(product.category)}`}>
            {product.category}
          </Link>
          <span>/</span>
          <span className="current">{product.name}</span>
        </div>

        {/* Product Showcase Grid */}
        <div className="product-details-grid">
          {/* Gallery Column */}
          <div className="product-gallery">
            <div className="main-image-wrap">
              <img
                src={selectedImage || product.image}
                alt={product.name}
                className="main-product-image"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800";
                }}
              />
              <button
                className={`wishlist-gallery-btn ${isLiked ? "liked" : ""}`}
                onClick={() => toggleWishlist(product)}
                aria-label="Toggle Wishlist"
              >
                <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Thumbnail Row */}
            {galleryImages.length > 1 && (
              <div className="thumbnail-list">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    className={`thumb-btn ${selectedImage === img ? "active" : ""}`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Meta Column */}
          <div className="product-meta-details">
            <div className="product-brand-category">
              <span className="badge-category">{product.category}</span>
              {product.brand && (
                <span className="product-brand">By {product.brand}</span>
              )}
            </div>

            <h1 className="product-meta-title">{product.name}</h1>

            {/* Ratings & Reviews */}
            <div className="rating-pill">
              <div className="stars-fill">
                <Star size={16} fill="currentColor" />
                <span>{Number(product.ratings || 4.5).toFixed(1)}</span>
              </div>
              <span className="review-count">
                ({product.numReviews || reviews.length} customer ratings)
              </span>
            </div>

            {/* Pricing */}
            <div className="product-price-block">
              <div className="price-main">
                <span className="price-current">
                  ₹{currentPrice.toLocaleString("en-IN")}
                </span>
                {originalPrice > currentPrice && (
                  <>
                    <del className="price-original">
                      ₹{originalPrice.toLocaleString("en-IN")}
                    </del>
                    <span className="badge-discount">{discountPercent}% OFF</span>
                  </>
                )}
              </div>
              <span className="tax-inclusive">Inclusive of all taxes</span>
            </div>

            <p className="product-description">{product.description}</p>

            {/* Stock Availability */}
            <div className="stock-status">
              {product.stock > 0 ? (
                <span className="in-stock">
                  <Check size={16} /> In Stock ({product.stock} units available)
                </span>
              ) : (
                <span className="out-of-stock">Currently Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="quantity-section">
                <label>Quantity:</label>
                <div className="quantity-control">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <span className="quantity-value">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="product-action-buttons">
              <button
                className={`btn-primary btn-add-cart ${addedNotice ? "success-added" : ""}`}
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                {addedNotice ? (
                  <>
                    <Check size={18} /> Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>

              <button
                className="btn-accent btn-buy-now"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>
            </div>

            {/* Pincode Serviceability Checker */}
            <div className="pincode-checker-box">
              <div className="pincode-label">
                <MapPin size={16} /> Check Delivery Pincode:
              </div>
              <form onSubmit={handlePincodeCheck} className="pincode-form">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit PIN code"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                />
                <button type="submit" className="btn-pincode-check">
                  Check
                </button>
              </form>
              {pincodeStatus && (
                <div
                  className={`pincode-msg ${pincodeStatus.valid ? "success" : "error"}`}
                >
                  {pincodeStatus.message}
                </div>
              )}
            </div>

            {/* Trust Highlights */}
            <div className="product-trust-strip">
              <div className="trust-item">
                <Truck size={18} />
                <div>
                  <strong>Free Express Delivery</strong>
                  <p>On orders above ₹999</p>
                </div>
              </div>
              <div className="trust-item">
                <ShieldCheck size={18} />
                <div>
                  <strong>100% Original Brand</strong>
                  <p>Direct from verified manufacturers</p>
                </div>
              </div>
              <div className="trust-item">
                <RotateCcw size={18} />
                <div>
                  <strong>7-Day Easy Returns</strong>
                  <p>Instant doorstep returns & exchange</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specifications Table */}
        {product.specifications && product.specifications.length > 0 && (
          <section className="specifications-section">
            <h2>Product Specifications</h2>
            <div className="spec-table">
              {product.specifications.map((spec, i) => (
                <div key={i} className="spec-row">
                  <span className="spec-key">{spec.key}</span>
                  <span className="spec-val">{spec.value}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customer Reviews Section */}
        <section className="reviews-section">
          <div className="reviews-header">
            <div>
              <span className="eyebrow">CUSTOMER FEEDBACK</span>
              <h2>Ratings &amp; Reviews ({reviews.length})</h2>
            </div>
          </div>

          <div className="reviews-layout">
            {/* Review List */}
            <div className="reviews-list-col">
              {reviews.length === 0 ? (
                <div className="no-reviews-box">
                  <MessageSquare size={32} />
                  <p>No customer reviews yet. Be the first to review this product!</p>
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev._id} className="review-card">
                    <div className="review-card-top">
                      <div className="review-user-info">
                        <strong>{rev.userName}</strong>
                        {rev.isVerifiedPurchase && (
                          <span className="verified-badge">
                            <Check size={12} /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="review-stars">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            fill={i < rev.rating ? "#eab308" : "none"}
                            color={i < rev.rating ? "#eab308" : "#cbd5e1"}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.title && <h4 className="review-title">{rev.title}</h4>}
                    <p className="review-comment">{rev.comment}</p>
                    <small className="review-date">
                      {rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString("en-IN")
                        : "Recently"}
                    </small>
                  </div>
                ))
              )}
            </div>

            {/* Review Form */}
            <div className="review-form-col">
              <div className="review-form-box">
                <h3>Write a Review</h3>
                <p>Share your honest experience to help other shoppers.</p>

                {reviewError && (
                  <div className="alert-box error">
                    <AlertCircle size={16} /> <span>{reviewError}</span>
                  </div>
                )}
                {reviewSuccess && (
                  <div className="alert-box success">
                    <Check size={16} /> <span>{reviewSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleReviewSubmit} className="review-form">
                  <div className="form-group">
                    <label>Rating:</label>
                    <div className="star-rating-select">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          className="star-btn"
                          onClick={() => setRatingInput(star)}
                        >
                          <Star
                            size={22}
                            fill={star <= ratingInput ? "#eab308" : "none"}
                            color={star <= ratingInput ? "#eab308" : "#cbd5e1"}
                          />
                        </button>
                      ))}
                      <span className="rating-num-label">{ratingInput} / 5 Stars</span>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Review Title:</label>
                    <input
                      type="text"
                      placeholder="e.g. Exceptional sound clarity & comfort"
                      value={titleInput}
                      onChange={(e) => setTitleInput(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Your Feedback:</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="What did you like or dislike about this product?"
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={submittingReview}
                  >
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products-section">
            <div className="section-header">
              <div>
                <span className="eyebrow">SIMILAR FINDS</span>
                <h2>You Might Also Like</h2>
              </div>
            </div>
            <div className="product-grid">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
