import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, AlertCircle, CheckCircle, Sparkles, Eye, EyeOff, ShieldCheck, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, pendingCartItem, clearPendingCartItem } = useAuth();
  const { addPendingItemToCart } = useCart();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/";

  const handleQuickFill = (demoEmail, demoPass, type) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setActiveDemo(type);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      if (response.data.success) {
        // Authenticate user in React Context
        login(response.data.user, response.data.token);

        let finalSuccessMsg = "Signed in successfully!";

        // Automatic Cart Addition after Login
        const pendingItem = pendingCartItem || location.state?.pendingCartItem;
        if (pendingItem && pendingItem.product) {
          await addPendingItemToCart(pendingItem);
          clearPendingCartItem();
          finalSuccessMsg = "Your product has been successfully added to your cart!";
        }

        setSuccessMessage(finalSuccessMsg);

        setTimeout(() => {
          navigate(redirectPath, {
            replace: true,
            state: { notification: finalSuccessMsg },
          });
        }, 700);
      }
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.message;

      if (status === 404 || (msg && msg.toLowerCase().includes("not found"))) {
        setError("Account not found. Please register first.");
      } else if (msg) {
        setError(msg);
      } else {
        setError("Failed to sign in. Please verify your email and password.");
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
          <h2>Welcome Back</h2>
          <p>Sign in to your account to continue shopping</p>
        </div>

        {/* Quick Demo Fill Buttons for Interviewers/Reviewers */}
        <div className="demo-credentials-box">
          <div className="demo-label">
            <Sparkles size={14} /> Quick Demo Access:
          </div>
          <div className="demo-buttons-row">
            <button
              type="button"
              className={`btn-demo-fill ${activeDemo === "admin" ? "active" : ""}`}
              onClick={() => handleQuickFill("admin@shopnest.com", "Admin@123456", "admin")}
            >
              <ShieldCheck size={14} /> Demo Admin
            </button>
            <button
              type="button"
              className={`btn-demo-fill ${activeDemo === "customer" ? "active" : ""}`}
              onClick={() => handleQuickFill("customer@shopnest.com", "Customer@123456", "customer")}
            >
              <UserCheck size={14} /> Demo Customer
            </button>
          </div>
          <div className="demo-credentials-hint">
            <span><strong>Admin:</strong> admin@shopnest.com • Admin@123456</span>
            <span><strong>Customer:</strong> customer@shopnest.com • Customer@123456</span>
          </div>
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
            <label htmlFor="email">Email Address</label>
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
            <div className="form-label-row">
              <label htmlFor="password">Password</label>
            </div>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError("");
                }}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-primary auth-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign in to ShopNest"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
