import React from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag, AlertCircle } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

export default function NotFound() {
  return (
    <div className="shopnest">
      <Navbar />
      <main style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "4rem 1rem", maxWidth: 540 }}>
          {/* Large 404 */}
          <div style={{
            fontSize: "8rem",
            fontWeight: 900,
            lineHeight: 1,
            background: "linear-gradient(135deg, var(--accent) 0%, #f97316 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
          }}>
            404
          </div>

          <div style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>
            <AlertCircle size={20} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
            Page not found
          </div>

          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, margin: "1rem 0 0.75rem" }}>
            Oops! This page took a wrong turn.
          </h1>
          <p style={{ color: "var(--text-muted)", lineHeight: 1.7, marginBottom: "2rem" }}>
            The page you're looking for doesn't exist, has been moved, or the URL may be incorrect.
            Let's get you back on track.
          </p>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/" className="btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Home size={16} /> Back to Home
            </Link>
            <Link to="/shop" className="btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ShoppingBag size={16} /> Browse Products
            </Link>
          </div>

          {/* Quick links */}
          <div style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "0.75rem" }}>Popular pages:</p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", fontSize: "0.9rem" }}>
              {[
                { to: "/deals", label: "Today's Deals" },
                { to: "/shop?bestseller=true", label: "Best Sellers" },
                { to: "/new-arrivals", label: "New Arrivals" },
                { to: "/contact", label: "Contact Support" },
              ].map((link) => (
                <Link key={link.to} to={link.to} style={{ color: "var(--accent)", textDecoration: "none" }}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

