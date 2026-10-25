import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Minus,
  Plus,
  Tag,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

export default function Cart() {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    shipping,
    discount,
    grandTotal,
    coupon,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyCouponCode,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    setValidatingCoupon(true);

    try {
      const res = await api.post("/coupons/validate", {
        code: couponInput.trim(),
        subtotal,
      });

      if (res.data.success) {
        applyCouponCode(couponInput.trim());
        setCouponSuccess(res.data.message);
        setCouponInput("");
      }
    } catch (err) {
      // Fallback local coupon check
      const localRes = applyCouponCode(couponInput.trim());
      if (localRes.success) {
        setCouponSuccess(localRes.message);
        setCouponInput("");
      } else {
        setCouponError(
          err.response?.data?.message || "Invalid coupon code. Try SAVE10, SHOP500 or FESTIVE50."
        );
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  return (
    <div className="shopnest">
      <Navbar />

      <main className="section-container cart-page-container">
        <div className="page-heading">
          <span className="eyebrow">YOUR BASKET</span>
          <h1>Shopping Cart ({items.length} items)</h1>
          <p>Review and modify your items before completing your purchase.</p>
        </div>

        {items.length === 0 ? (
          <div className="empty-state cart-empty">
            <div className="empty-icon-wrap">
              <ShoppingBag size={48} />
            </div>
            <h2>Your cart is empty</h2>
            <p>
              Looks like you haven't added anything to your cart yet. Explore our featured
              collections and find something you love!
            </p>
            <Link to="/shop" className="btn-primary">
              Start Shopping <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="cart-layout-grid">
            {/* Cart Items List */}
            <div className="cart-items-column">
              <div className="cart-items-header">
                <span>Product Details</span>
                <span>Subtotal</span>
              </div>

              <div className="cart-item-list">
                {items.map((item) => {
                  const lineTotal = Number(item.price) * (item.quantity || 1);
                  return (
                    <article key={item._id} className="cart-item-row">
                      <Link to={`/product/${item._id}`} className="cart-item-img-wrap">
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                          }
                          alt={item.name}
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400";
                          }}
                        />
                      </Link>

                      <div className="cart-item-info-col">
                        <span className="product-category">{item.category}</span>
                        <Link to={`/product/${item._id}`} className="cart-product-title">
                          {item.name}
                        </Link>

                        <div className="cart-item-unit-price">
                          Price: <strong>₹{Number(item.price).toLocaleString("en-IN")}</strong>
                        </div>

                        {/* Quantity and Actions */}
                        <div className="cart-item-actions-row">
                          <div className="quantity-control compact">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="quantity-num">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              disabled={item.quantity >= (item.stock || 999)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          <button
                            className="btn-remove-item"
                            onClick={() => removeFromCart(item._id)}
                            title="Remove item from cart"
                          >
                            <Trash2 size={16} /> <span>Remove</span>
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-line-total">
                        <strong>₹{lineTotal.toLocaleString("en-IN")}</strong>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="cart-bottom-actions">
                <Link to="/shop" className="btn-outline btn-continue-shopping">
                  Continue Shopping
                </Link>
                <button onClick={clearCart} className="btn-clear-cart">
                  <Trash2 size={16} /> Clear Entire Cart
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <aside className="order-summary-card">
              <h3>Order Summary</h3>

              {/* Coupon Box */}
              <div className="cart-coupon-section">
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <div className="coupon-input-wrap">
                    <Tag size={16} className="coupon-icon" />
                    <input
                      type="text"
                      placeholder="Coupon (e.g. SAVE10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-apply-coupon"
                    disabled={validatingCoupon}
                  >
                    {validatingCoupon ? "Checking..." : "Apply"}
                  </button>
                </form>

                {couponError && (
                  <div className="coupon-feedback error">
                    <AlertCircle size={14} /> <span>{couponError}</span>
                  </div>
                )}

                {couponSuccess && (
                  <div className="coupon-feedback success">
                    <CheckCircle size={14} /> <span>{couponSuccess}</span>
                  </div>
                )}

                {coupon && (
                  <div className="applied-coupon-pill">
                    <span>
                      Code: <strong>{coupon.code}</strong> ({coupon.label})
                    </span>
                    <button onClick={removeCoupon} title="Remove Coupon">
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="summary-breakdown">
                <div className="summary-row">
                  <span>Items Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>

                <div className="summary-row">
                  <span>Shipping Charges</span>
                  <span>
                    {shipping === 0 ? (
                      <strong className="free-shipping-text">FREE</strong>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="summary-row discount-row">
                    <span>Coupon Discount</span>
                    <span>- ₹{discount.toLocaleString("en-IN")}</span>
                  </div>
                )}

                {subtotal > 0 && subtotal < 999 && (
                  <div className="free-shipping-hint">
                    Add ₹{(999 - subtotal).toLocaleString("en-IN")} more to unlock{" "}
                    <strong>FREE Delivery</strong>!
                  </div>
                )}

                <div className="summary-divider"></div>

                <div className="summary-total-row">
                  <span>Total Amount</span>
                  <span className="total-val">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                className="btn-primary btn-checkout-main"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout <ArrowRight size={18} />
              </button>

              <div className="checkout-trust-points">
                <div className="trust-point">
                  <ShieldCheck size={16} /> <span>Safe &amp; Secure Checkout</span>
                </div>
                <div className="trust-point">
                  <RotateCcw size={16} /> <span>7-Day Return Policy</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
