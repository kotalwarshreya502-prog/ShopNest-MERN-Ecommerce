import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight, AlertCircle, Sparkles, Eye, EyeOff, ShieldCheck, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeDemo, setActiveDemo] = useState(null);
  const [error, setError] = useState("");
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
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const response = await api.post("/auth/login", {
        email: normalizedEmail,
        password,
      });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to sign in. Please verify your email and password."
      );
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
          <div className="alert-box error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
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
