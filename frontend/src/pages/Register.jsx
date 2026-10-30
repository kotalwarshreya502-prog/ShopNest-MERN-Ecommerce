import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, Mail, Lock, Phone, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, pendingCartItem, clearPendingCartItem } = useAuth();
  const { addPendingItemToCart } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // 1. Validate all fields
    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPhone = phone.trim();

    if (!trimmedName) {
      setError("Please enter your full name.");
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    // Phone format validation
    const phoneRegex = /^[0-9+\-\s]{10,15}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setError("Please enter a valid 10-digit phone number.");
      return;
    }

    // Password requirements
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter your password.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/register", {
        name: trimmedName,
        email: normalizedEmail,
        phone: trimmedPhone,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        // Automatically authenticate the newly registered customer
        login(response.data.user, response.data.token);

        let finalSuccessMsg = "Account created successfully! Welcome to ShopNest.";

        // Retrieve and add pending product to MongoDB cart if user initiated Add to Cart as guest
        const pendingItem = pendingCartItem || location.state?.pendingCartItem;
        if (pendingItem && pendingItem.product) {
          await addPendingItemToCart(pendingItem);
          clearPendingCartItem();
          finalSuccessMsg = "Your product has been successfully added to your cart!";
        }

        setSuccessMessage(finalSuccessMsg);

        // Redirect user to Home or previous intended page with success message
        setTimeout(() => {
          navigate(redirectPath, {
            replace: true,
            state: { notification: finalSuccessMsg },
          });
        }, 800);
      }
    } catch (err) {
      const msg = err.response?.data?.message;
      if (msg && msg.toLowerCase().includes("already registered")) {
        setError("This email is already registered. Please log in.");
      } else {
        setError(msg || "Registration failed. Please check your details and try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <Link to="/" className="brand-logo">
            shop<span className="brand-accent">nest</span>.
          </Link>
          <h2>Create Account</h2>
          <p>Join ShopNest for seamless shopping, order tracking, and exclusive perks.</p>
        </div>

        {error && (
          <div className="alert-box error" role="alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="alert-box success" role="status">
            <CheckCircle size={18} />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <div className="input-with-icon">
              <User size={18} className="input-icon" />
              <input
                id="name"
                type="text"
                required
                placeholder="Rahul Sharma"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <div className="input-with-icon">
              <Phone size={18} className="input-icon" />
              <input
                id="phone"
                type="tel"
                required
                placeholder="9876543210"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type="password"
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError("");
                }}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
