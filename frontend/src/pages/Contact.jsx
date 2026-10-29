import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, MessageCircle, Package, RotateCcw, Shield } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for your message! Our support team will reply within 24 hours.");
    e.target.reset();
  };

  return (
    <div className="shopnest">
      <Navbar />
      <main style={{ minHeight: "60vh" }}>
        {/* Hero */}
        <div className="page-hero" style={{ background: "var(--bg-subtle)", padding: "3rem 0", textAlign: "center" }}>
          <div className="section-container">
            <nav className="breadcrumb" style={{ justifyContent: "center", marginBottom: "1rem" }}>
              <Link to="/">Home</Link><span>/</span><span>Contact Us</span>
            </nav>
            <h1 style={{ fontSize: "2.5rem", fontWeight: 700 }}>Contact &amp; Support</h1>
            <p style={{ color: "var(--text-muted)", maxWidth: 540, margin: "0.75rem auto 0" }}>
              We're here to help. Reach out to us and we'll respond within 24 hours on business days.
            </p>
          </div>
        </div>

        <div className="section-container" style={{ padding: "3rem 1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", maxWidth: 960, margin: "0 auto" }}>
            {/* Contact Form */}
            <div>
              <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Send a Message</h2>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div>
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" type="text" placeholder="Your full name" required />
                </div>
                <div>
                  <label className="form-label">Email Address *</label>
                  <input className="form-input" type="email" placeholder="you@example.com" required />
                </div>
                <div>
                  <label className="form-label">Subject *</label>
                  <select className="form-input" required defaultValue="">
                    <option value="" disabled>Select a topic</option>
                    <option>Order Issue</option>
                    <option>Product Query</option>
                    <option>Return / Refund</option>
                    <option>Payment Problem</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea className="form-input" rows={5} placeholder="Describe your issue or question in detail…" required style={{ resize: "vertical" }} />
                </div>
                <button type="submit" className="btn-primary" style={{ alignSelf: "flex-start" }}>
                  Send Message
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>Contact Information</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {[
                  { icon: <Mail size={20} />, label: "Email Support", value: "support@shopnest.example" },
                  { icon: <Phone size={20} />, label: "Toll-Free Helpline", value: "+91 1800-123-SHOP" },
                  { icon: <MapPin size={20} />, label: "Registered Office", value: "ShopNest HQ, Mumbai, Maharashtra 400001, India" },
                  { icon: <Clock size={20} />, label: "Support Hours", value: "Monday–Saturday, 9 AM – 8 PM IST" },
                ].map((item) => (
                  <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                    <div style={{ color: "var(--accent)", marginTop: 3 }}>{item.icon}</div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{item.label}</div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Help */}
              <div style={{ marginTop: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>Quick Help</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {[
                    { icon: <Package size={16} />, label: "Track My Order", to: "/orders" },
                    { icon: <RotateCcw size={16} />, label: "Return & Refund Policy", to: "/return-policy" },
                    { icon: <Shield size={16} />, label: "Privacy Policy", to: "/privacy-policy" },
                    { icon: <MessageCircle size={16} />, label: "FAQs & Help Centre", to: "/about" },
                  ].map((link) => (
                    <Link key={link.to} to={link.to} style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "var(--accent)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 500 }}>
                      {link.icon} {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

