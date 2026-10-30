import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, X, LogIn, UserPlus, ShoppingBag, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AuthModal() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authModalOpen, closeAuthModal, pendingCartItem } = useAuth();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && authModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [authModalOpen, closeAuthModal]);

  if (!authModalOpen) return null;

  const handleLoginClick = () => {
    closeAuthModal();
    navigate("/login", {
      state: {
        from: location,
        pendingCartItem,
      },
    });
  };

  const handleRegisterClick = () => {
    closeAuthModal();
    navigate("/register", {
      state: {
        from: location,
        pendingCartItem,
      },
    });
  };

  return (
    <div className="auth-modal-overlay" onClick={closeAuthModal} role="dialog" aria-modal="true">
      <div className="auth-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          className="auth-modal-close"
          onClick={closeAuthModal}
          aria-label="Close"
          title="Close"
        >
          <X size={20} />
        </button>

        {/* Modal Header & Icon */}
        <div className="auth-modal-header">
          <div className="auth-modal-icon-badge">
            <Lock size={28} />
          </div>
          <h2 className="auth-modal-title">Please Login or Register!</h2>
          <p className="auth-modal-message">
            Create an account or log in to continue shopping with ShopNest.
          </p>
        </div>

        {/* Pending Product Highlight (if clicked Add to Cart) */}
        {pendingCartItem && pendingCartItem.product && (
          <div className="auth-modal-product-preview">
            <div className="preview-img-wrap">
              <img
                src={
                  pendingCartItem.product.image ||
                  (pendingCartItem.product.images && pendingCartItem.product.images[0]) ||
                  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
                }
                alt={pendingCartItem.product.name}
              />
            </div>
            <div className="preview-info">
              <span className="preview-label">Selected Item:</span>
              <strong className="preview-name">{pendingCartItem.product.name}</strong>
              <span className="preview-price">
                ₹{Number(pendingCartItem.product.discountPrice || pendingCartItem.product.price).toLocaleString("en-IN")} × {pendingCartItem.quantity || 1}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="auth-modal-actions">
          <button
            type="button"
            className="btn-primary auth-modal-btn-login"
            onClick={handleLoginClick}
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>

          <button
            type="button"
            className="btn-outline auth-modal-btn-register"
            onClick={handleRegisterClick}
          >
            <UserPlus size={18} />
            <span>Create Account</span>
          </button>
        </div>

        {/* Footer info & close link */}
        <div className="auth-modal-footer">
          <div className="auth-trust-badges">
            <span><ShieldCheck size={14} /> Safe &amp; Secure Checkout</span>
            <span><ShoppingBag size={14} /> Preserved Cart</span>
          </div>
          <button
            type="button"
            className="btn-auth-modal-dismiss"
            onClick={closeAuthModal}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
