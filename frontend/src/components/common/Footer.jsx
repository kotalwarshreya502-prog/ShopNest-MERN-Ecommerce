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

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const YoutubeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"></path>
    <polygon points="10 15 15 12 10 9 10 15"></polygon>
  </svg>
);

export default function Footer() {
  const year = new Date().getFullYear();

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
            <small>Razorpay &amp; 256-bit encryption</small>
          </div>
        </div>
      </div>

      <div className="footer-main">
        {/* Brand */}
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
            <div className="contact-item"><Mail size={16} /><span>support@shopnest.example</span></div>
            <div className="contact-item"><Phone size={16} /><span>+91 1800-123-SHOP (Toll-Free)</span></div>
            <div className="contact-item"><MapPin size={16} /><span>Mumbai, Maharashtra, India</span></div>
          </div>

          {/* Social links */}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
            {[
              { icon: <InstagramIcon />, href: "#", label: "Instagram" },
              { icon: <TwitterIcon />, href: "#", label: "Twitter" },
              { icon: <FacebookIcon />, href: "#", label: "Facebook" },
              { icon: <YoutubeIcon />, href: "#", label: "YouTube" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "inherit",
                  textDecoration: "none",
                  transition: "background 0.2s",
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="footer-col">
          <h4>Popular Categories</h4>
          <Link to="/category/electronics">Electronics &amp; Tech</Link>
          <Link to="/category/fashion">Men &amp; Women Fashion</Link>
          <Link to="/category/footwear">Footwear &amp; Sneakers</Link>
          <Link to="/category/accessories">Watches &amp; Accessories</Link>
          <Link to="/category/home-living">Home &amp; Living</Link>
          <Link to="/category/beauty">Beauty &amp; Skincare</Link>
          <Link to="/category/books">Books &amp; Stationery</Link>
          <Link to="/category/sports">Sports &amp; Fitness</Link>
        </div>

        {/* Customer Care */}
        <div className="footer-col">
          <h4>Customer Care</h4>
          <Link to="/orders">Track Your Order</Link>
          <Link to="/cart">View Shopping Cart</Link>
          <Link to="/wishlist">Saved Wishlist</Link>
          <Link to="/profile">My Account</Link>
          <Link to="/deals">Daily Deals &amp; Offers</Link>
          <Link to="/contact">Help &amp; Support</Link>
          <Link to="/return-policy">Returns &amp; Refunds</Link>
        </div>

        {/* Useful Links */}
        <div className="footer-col">
          <h4>Discover</h4>
          <Link to="/new-arrivals">New Arrivals</Link>
          <Link to="/best-sellers">Best Sellers</Link>
          <Link to="/deals">Flash Deals</Link>
          <Link to="/about">About ShopNest</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>
            © {year} ShopNest E-Commerce. All rights reserved.
            <span style={{ margin: "0 0.75rem", opacity: 0.4 }}>|</span>
            Made with <Heart size={12} style={{ display: "inline", color: "var(--accent)", verticalAlign: "middle" }} /> in India
          </p>
          <div className="payment-badges-text">
            <span>Accepted: UPI · Credit/Debit Cards · NetBanking · COD</span>
          </div>
          <p className="footer-credit">Full-Stack MERN Portfolio Project</p>
        </div>
      </div>
    </footer>
  );
}
