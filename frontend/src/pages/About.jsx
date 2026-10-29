import React from "react";
import { Link } from "react-router-dom";
import { Users, ShoppingBag, Star, Truck, Shield, Heart } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const STATS = [
  { icon: <Users size={28} />, value: "50,000+", label: "Happy Customers" },
  { icon: <ShoppingBag size={28} />, value: "5,000+", label: "Products Listed" },
  { icon: <Star size={28} />, value: "4.8/5", label: "Average Rating" },
  { icon: <Truck size={28} />, value: "98%", label: "On-Time Delivery" },
];

const VALUES = [
  { icon: <Shield size={22} />, title: "Trust & Authenticity", desc: "Every product on ShopNest is sourced from verified brands and authorized distributors. Zero counterfeit, zero compromise." },
  { icon: <Heart size={22} />, title: "Customer First", desc: "Our support team is dedicated to resolving your queries quickly. From returns to tracking, we make it effortless." },
  { icon: <Truck size={22} />, title: "Fast Reliable Delivery", desc: "We partner with India's top logistics providers to ensure your orders arrive on time, every time." },
  { icon: <Star size={22} />, title: "Premium Value", desc: "We negotiate directly with brands and manufacturers to bring you the best prices without sacrificing quality." },
];

export default function About() {
  return (
    <div className="shopnest">
      <Navbar />
      <main style={{ minHeight: "60vh" }}>
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)", color: "#fff", padding: "5rem 0 4rem", textAlign: "center" }}>
          <div className="section-container">
            <nav className="breadcrumb" style={{ justifyContent: "center", marginBottom: "1rem", color: "rgba(255,255,255,0.6)" }}>
              <Link to="/" style={{ color: "rgba(255,255,255,0.6)" }}>Home</Link>
              <span style={{ color: "rgba(255,255,255,0.4)" }}>/</span>
              <span>About Us</span>
            </nav>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛍️</div>
            <h1 style={{ fontSize: "2.8rem", fontWeight: 800, marginBottom: "1rem" }}>
              About <span style={{ color: "var(--accent)" }}>ShopNest</span>
            </h1>
            <p style={{ fontSize: "1.1rem", opacity: 0.8, maxWidth: 600, margin: "0 auto" }}>
              India's premier online shopping destination — bringing you curated products from the world's best brands, delivered to your doorstep.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}>
          <div className="section-container" style={{ padding: "2.5rem 1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", textAlign: "center" }}>
              {STATS.map((s) => (
                <div key={s.label}>
                  <div style={{ color: "var(--accent)", marginBottom: "0.5rem" }}>{s.icon}</div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)" }}>{s.value}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="section-container" style={{ padding: "4rem 1rem" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <span className="eyebrow" style={{ justifyContent: "center" }}>OUR MISSION</span>
            <h2 className="section-title">Redefining Online Shopping in India</h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "1.05rem" }}>
              Founded with the mission to make premium products accessible to every Indian household, ShopNest
              combines a curated product catalogue, transparent pricing, and world-class delivery infrastructure.
              We believe everyone deserves to shop with confidence — knowing they'll receive authentic products
              at fair prices, every single time.
            </p>
          </div>

          {/* Values */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "2rem", marginTop: "3rem", maxWidth: 900, margin: "3rem auto 0" }}>
            {VALUES.map((v) => (
              <div key={v.title} style={{ display: "flex", gap: "1rem", padding: "1.5rem", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
                <div style={{ color: "var(--accent)", flexShrink: 0, marginTop: 2 }}>{v.icon}</div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: "0.5rem" }}>{v.title}</h3>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7 }}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)", padding: "3rem 0", textAlign: "center" }}>
          <div className="section-container">
            <h2 style={{ marginBottom: "1rem" }}>Ready to start shopping?</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: "1.5rem" }}>Explore thousands of products across 8+ categories.</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link to="/shop" className="btn-primary">Browse Products</Link>
              <Link to="/contact" className="btn-outline">Contact Us</Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

