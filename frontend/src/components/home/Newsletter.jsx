import React, { useState } from "react";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="newsletter-section section-container">
      <div className="newsletter-box">
        <div className="newsletter-content">
          <span className="eyebrow">SHOPNEST INSIDER</span>
          <h2>Be the first to know about secret sales &amp; new arrivals</h2>
          <p>
            Sign up for our weekly newsletter to receive exclusive discounts, members-only deals,
            and early access to seasonal sales.
          </p>
        </div>

        <div className="newsletter-form-wrapper">
          {subscribed ? (
            <div className="newsletter-success">
              <CheckCircle size={22} className="success-icon" />
              <span>Thank you! You've been subscribed for exclusive ShopNest offers.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="newsletter-form">
              <div className="newsletter-input-group">
                <Mail size={18} className="newsletter-icon" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary newsletter-submit">
                Subscribe <ArrowRight size={16} />
              </button>
            </form>
          )}
          <small className="newsletter-privacy-note">
            🔒 By subscribing you agree with our terms. We never spam. Unsubscribe anytime.
          </small>
        </div>
      </div>
    </section>
  );
}
