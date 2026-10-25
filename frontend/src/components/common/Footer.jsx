import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="site-footer">
      {/* Trust bar */}
      <div className="footer-trust-strip">
        <div className="trust-block">
          <Truck size={24} />
          <div>
            <strong>Free Delivery</strong>
            <small>On orders over ₹999</small>
          </div>
        </div>
        <div className="trust-block">
          <ShieldCheck size={24} />
          <div>
            <strong>100% Genuine</strong>
            <small>Authentic products guaranteed</small>
          </div>
        </div>
        <div className="trust-block">
          <RotateCcw size={24} />
          <div>
            <strong>7-Day Returns</strong>
            <small>Easy, no-questions refunds</small>
          </div>
        </div>
        <div className="trust-block">
          <CreditCard size={24} />
          <div>
            <strong>Secure Payments</strong>
            <small>Razorpay & 256-bit encryption</small>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-col brand-col">
          <Link to="/" className="brand-logo footer-logo">
            shop<span className="brand-accent">nest</span>.
          </Link>
          <p className="footer-description">
            ShopNest is India's premier online shopping destination, bringing you
            curated electronics, trending fashion, home essentials, and lifestyle
            products at unmatched value.
          </p>
          <div className="footer-contact-info">
            <div className="contact-item">
              <Mail size={16} />
              <span>support@shopnest.example</span>
            </div>
            <div className="contact-item">
              <Phone size={16} />
              <span>+91 1800-123-SHOP (Toll-Free)</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>Mumbai, Maharashtra, India</span>
            </div>
          </div>
        </div>

        <div className="footer-col">
          <h4>Popular Categories</h4>
          <Link to="/shop?category=Electronics">Electronics & Tech</Link>
          <Link to="/shop?category=Fashion">Men & Women Fashion</Link>
          <Link to="/shop?category=Footwear">Footwear & Sneakers</Link>
          <Link to="/shop?category=Accessories">Watches & Accessories</Link>
          <Link to="/shop?category=Home%20%26%20Living">Home & Living</Link>
          <Link to="/shop?category=Beauty">Beauty & Skincare</Link>
        </div>

        <div className="footer-col">
          <h4>Customer Care</h4>
          <Link to="/orders">Track Your Order</Link>
          <Link to="/cart">View Shopping Cart</Link>
          <Link to="/wishlist">Saved Wishlist</Link>
          <Link to="/profile">My Account</Link>
          <Link to="/deals">Daily Deals & Offers</Link>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link to="/shop">All Products</Link>
          <Link to="/deals">Festive Discounts</Link>
          <Link to="/login">Customer Sign In</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/admin">Admin Portal</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>© {new Date().getFullYear()} ShopNest E-Commerce. All rights reserved.</p>
          <div className="payment-badges-text">
            <span>Accepted Payments: UPI • Credit/Debit Cards • NetBanking • COD</span>
          </div>
          <p className="footer-credit">
            Built with modern MERN Architecture for portfolio excellence.
          </p>
        </div>
      </div>
    </footer>
  );
}
