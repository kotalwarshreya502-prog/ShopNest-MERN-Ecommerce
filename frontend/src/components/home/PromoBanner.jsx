import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Tag } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="promo-banner-section section-container">
      <div className="promo-card">
        <div className="promo-card-content">
          <span className="promo-tag">
            <Sparkles size={16} /> LIMITED TIME PROMOTION
          </span>
          <h2>
            Upgrade Your Everyday Style &amp; Gadgets.
            <br />
            Get Flat 15% Extra Off.
          </h2>
          <p>
            Apply promo code <span className="coupon-highlight">SAVE10</span> at checkout
            on all eligible orders above ₹999. Enjoy complimentary doorstep shipping &amp; 7-day returns.
          </p>
          <div className="promo-actions">
            <Link to="/deals" className="btn-primary">
              <Tag size={16} /> Shop Today's Deals <ArrowRight size={18} />
            </Link>
            <Link to="/shop" className="btn-outline-light">
              Explore All Products
            </Link>
          </div>
        </div>
        <div className="promo-card-visual">
          <div className="promo-badge-circle">
            <span className="badge-up-to">UP TO</span>
            <span className="badge-percent">50%</span>
            <span className="badge-off">OFF</span>
          </div>
        </div>
      </div>
    </section>
  );
}
