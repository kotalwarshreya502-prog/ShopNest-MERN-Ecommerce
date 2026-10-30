import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Sparkles, Award, Zap, TrendingUp, Tag, Star, CheckCircle, X } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroBanner from "../components/home/HeroBanner";
import CategoryGrid from "../components/home/CategoryGrid";
import PromoBanner from "../components/home/PromoBanner";
import Newsletter from "../components/home/Newsletter";
import ProductCard from "../components/common/ProductCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import api from "../services/api";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const [toast, setToast] = useState(location.state?.notification || "");

  useEffect(() => {
    if (location.state?.notification) {
      setToast(location.state.notification);
      const timer = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const [activeTab, setActiveTab] = useState("all");

  const fetchHomepageData = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products/featured");
      if (data.success) {
        setFeatured(data.featured || []);
        setTrending(data.trending || []);
        setBestsellers(data.bestsellers || []);
        setNewArrivals(data.newArrivals || []);
      }
    } catch (err) {
      console.error("Failed to load homepage products:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  const TABS = [
    { id: "all", label: "All Picks" },
    { id: "Electronics", label: "Electronics" },
    { id: "Mobiles & Accessories", label: "Mobiles" },
    { id: "Gaming", label: "Gaming" },
    { id: "Fashion", label: "Fashion" },
    { id: "Footwear", label: "Footwear" },
    { id: "Home & Living", label: "Home" },
    { id: "Kitchen Products", label: "Kitchen" },
  ];

  const tabProducts =
    activeTab === "all"
      ? featured
      : featured.filter(
          (p) => (p.category || "").toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <div className="shopnest">
      <Navbar />

      <main>
        {toast && (
          <div className="section-container" style={{ paddingTop: "1rem" }}>
            <div className="alert-box success" style={{ marginBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <CheckCircle size={18} />
                <strong style={{ fontSize: "0.95rem" }}>{toast}</strong>
              </div>
              <button onClick={() => setToast("")} style={{ color: "inherit", opacity: 0.8, cursor: "pointer", display: "flex" }}>
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <HeroBanner />

        {/* Shop By Category */}
        <CategoryGrid />

        {/* ── Featured / Trending Products ─────────────────────────────── */}
        <section className="featured-section section-container">
          <div className="section-header-row">
            <div>
              <span className="eyebrow">
                <Sparkles size={14} /> HANDPICKED COLLECTION
              </span>
              <h2 className="section-title">Trending &amp; Featured Products</h2>
              <p className="section-subtitle">
                Explore our highest-rated products chosen by thousands of satisfied shoppers.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="filter-pill-group">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  className={`filter-pill ${activeTab === tab.id ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={8} />
          ) : tabProducts.length > 0 ? (
            <div className="product-grid">
              {tabProducts.slice(0, 8).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: "3rem 0" }}>
              <p>No featured products in this category yet.</p>
            </div>
          )}

          <div className="section-cta-wrap">
            <Link to="/shop" className="btn-outline btn-explore-more">
              Explore All Products <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* ── Promotional Banner ────────────────────────────────────────── */}
        <PromoBanner />

        {/* ── Best Sellers ──────────────────────────────────────────────── */}
        {(loading || bestsellers.length > 0) && (
          <section className="bestsellers-section section-container">
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <Award size={14} /> SHOPPER FAVORITES
                </span>
                <h2 className="section-title">Best Sellers This Week</h2>
              </div>
              <Link to="/shop?bestseller=true" className="text-link">
                View All Best Sellers <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {bestsellers.slice(0, 8).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Today's Deals / Discounts ─────────────────────────────────── */}
        <section className="deals-strip-section section-container">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                <Zap size={14} /> LIMITED TIME
              </span>
              <h2 className="section-title">Today's Deals</h2>
            </div>
            <Link to="/deals" className="text-link">
              All Deals &amp; Offers <ArrowRight size={18} />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={4} />
          ) : (
            <div className="product-grid">
              {trending.slice(0, 4).map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </section>

        {/* ── New Arrivals ──────────────────────────────────────────────── */}
        {(loading || newArrivals.length > 0) && (
          <section className="new-arrivals-section section-container">
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <TrendingUp size={14} /> JUST LANDED
                </span>
                <h2 className="section-title">New Arrivals</h2>
              </div>
              <Link to="/new-arrivals" className="text-link">
                View All New Arrivals <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {(newArrivals.length > 0 ? newArrivals : trending.slice(4, 8)).slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Promo Cards ───────────────────────────────────────────────── */}
        <section className="section-container">
          <div className="promo-card-grid">
            <Link to="/shop?category=Electronics" className="promo-banner-card promo-electronics">
              <div className="promo-card-content">
                <Tag size={20} />
                <span>Up to 40% off</span>
                <h3>Electronics &amp; Gadgets</h3>
                <p>Shop Now →</p>
              </div>
            </Link>
            <Link to="/shop?category=Fashion" className="promo-banner-card promo-fashion">
              <div className="promo-card-content">
                <Star size={20} />
                <span>New Season</span>
                <h3>Fashion &amp; Apparel</h3>
                <p>Explore Collection →</p>
              </div>
            </Link>
            <Link to="/deals" className="promo-banner-card promo-deals">
              <div className="promo-card-content">
                <Zap size={20} />
                <span>Today Only</span>
                <h3>Flash Deals</h3>
                <p>Grab Now →</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Newsletter */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
