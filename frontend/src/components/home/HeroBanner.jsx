import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, ShieldCheck, Truck, Tag } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="hero-badge-icon" />
            <span>FESTIVE DEALS ARE LIVE · UP TO 50% OFF</span>
          </div>

          <h1 className="hero-title">
            Find your next <br />
            <span className="hero-highlight">favourite thing.</span>
          </h1>

          <p className="hero-subtitle">
            Discover curated electronics, trending lifestyle fashion, and everyday essentials.
            Premium quality, verified genuine products, and superfast doorstep delivery.
          </p>

          <div className="hero-buttons">
            <Link to="/shop" className="btn-primary hero-btn-primary">
              Shop Catalogue <ArrowRight size={18} />
            </Link>
            <Link to="/deals" className="btn-outline hero-btn-secondary">
              <Tag size={18} /> View Deals
            </Link>
          </div>

          <div className="hero-highlights-strip">
            <div className="highlight-item">
              <strong>100%</strong>
              <span>Authentic Products</span>
            </div>
            <div className="highlight-divider"></div>
            <div className="highlight-item">
              <strong>Free Shipping</strong>
              <span>Orders over ₹999</span>
            </div>
            <div className="highlight-divider"></div>
            <div className="highlight-item">
              <strong>7-Day</strong>
              <span>Hassle-Free Returns</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-card">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000"
              alt="ShopNest Curated Collection"
              className="hero-main-img"
            />
            {/* Floating Offer Badge */}
            <div className="floating-badge top-right">
              <span className="floating-badge-tag">FLASH DEAL</span>
              <strong>Smart Audio & Wearables</strong>
              <small>Starting at ₹999</small>
            </div>

            <div className="floating-badge bottom-left">
              <div className="badge-avatar-group">
                <span className="verified-icon">★</span>
                <div>
                  <strong>4.8 / 5 Rating</strong>
                  <small>Over 10,000+ reviews</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
