import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight, Sparkles, Award, Zap, TrendingUp, Tag, Star,
  CheckCircle, X, Smartphone, Laptop, Gamepad2, Shirt,
  Footprints, Watch, PackageCheck, Flame
} from "lucide-react";
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

  // Category specific sections
  const [mobiles, setMobiles] = useState([]);
  const [laptops, setLaptops] = useState([]);
  const [gaming, setGaming] = useState([]);
  const [fashion, setFashion] = useState([]);
  const [footwear, setFootwear] = useState([]);
  const [watches, setWatches] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [deals, setDeals] = useState([]);

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
        setMobiles(data.mobiles || []);
        setLaptops(data.laptops || []);
        setGaming(data.gaming || []);
        setFashion(data.fashion || []);
        setFootwear(data.footwear || []);
        setWatches(data.watches || []);
        setAccessories(data.accessories || []);
        setDeals(data.deals || []);
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
    { id: "Mobiles", label: "Mobiles" },
    { id: "Laptops", label: "Laptops" },
    { id: "Gaming", label: "Gaming" },
    { id: "Fashion", label: "Fashion" },
    { id: "Footwear", label: "Footwear" },
    { id: "Watches", label: "Watches" },
    { id: "Accessories", label: "Accessories" },
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
              <button onClick={() => setToast("")} style={{ color: "inherit", opacity: 0.8, cursor: "pointer", display: "flex", background: "none", border: "none" }}>
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

        {/* ── 1. Trending Mobiles ────────────────────────────────────────── */}
        {(loading || mobiles.length > 0) && (
          <section className="section-container" style={{ marginTop: "3.5rem" }}>
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <Smartphone size={14} /> 5G SMARTPHONES &amp; FLAGSHIPS
                </span>
                <h2 className="section-title">Trending Mobiles</h2>
                <p className="section-subtitle">Apple iPhone 15, Samsung Galaxy S24 Ultra, OnePlus 12 &amp; Google Pixel</p>
              </div>
              <Link to="/category/mobiles" className="text-link">
                View All Mobiles <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {mobiles.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 2. Best Laptops ───────────────────────────────────────────── */}
        {(loading || laptops.length > 0) && (
          <section className="section-container" style={{ marginTop: "3.5rem" }}>
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <Laptop size={14} /> MACBOOKS, ULTRABOOKS &amp; RIGS
                </span>
                <h2 className="section-title">Best Laptops</h2>
                <p className="section-subtitle">MacBook Pro M3 Max, Dell XPS OLED, HP Spectre &amp; ThinkPad</p>
              </div>
              <Link to="/category/laptops" className="text-link">
                View All Laptops <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {laptops.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Promotional Banner ────────────────────────────────────────── */}
        <PromoBanner />

        {/* ── 3. Gaming Collection ──────────────────────────────────────── */}
        {(loading || gaming.length > 0) && (
          <section className="section-container" style={{ marginTop: "3.5rem" }}>
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <Gamepad2 size={14} /> NEXT-GEN CONSOLES &amp; ESPORTS
                </span>
                <h2 className="section-title">Gaming Collection</h2>
                <p className="section-subtitle">PlayStation 5 Slim, Xbox Series X, DualSense &amp; Optical Keyboards</p>
              </div>
              <Link to="/category/gaming" className="text-link">
                Explore Gaming <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {gaming.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 4. Latest Fashion ─────────────────────────────────────────── */}
        {(loading || fashion.length > 0) && (
          <section className="section-container" style={{ marginTop: "3.5rem" }}>
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <Shirt size={14} /> NEW SEASON APPAREL
                </span>
                <h2 className="section-title">Latest Fashion</h2>
                <p className="section-subtitle">Levi's Denim Jackets, Ralph Lauren Oxford Shirts &amp; Designer Dresses</p>
              </div>
              <Link to="/category/fashion" className="text-link">
                Explore Fashion <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {fashion.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 5. Trending Footwear ──────────────────────────────────────── */}
        {(loading || footwear.length > 0) && (
          <section className="section-container" style={{ marginTop: "3.5rem" }}>
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <Footprints size={14} /> SNEAKERS &amp; FORMALS
                </span>
                <h2 className="section-title">Trending Footwear</h2>
                <p className="section-subtitle">Air Jordan 1 Retro, Nike Pegasus 40, Adidas Ultraboost &amp; Clarks Derbys</p>
              </div>
              <Link to="/category/footwear" className="text-link">
                View All Footwear <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {footwear.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 6. Premium Watches ────────────────────────────────────────── */}
        {(loading || watches.length > 0) && (
          <section className="section-container" style={{ marginTop: "3.5rem" }}>
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <Watch size={14} /> LUXURY TIMEPIECES &amp; WEARABLES
                </span>
                <h2 className="section-title">Premium Watches</h2>
                <p className="section-subtitle">Apple Watch 9, Galaxy Watch 6, Casio G-Shock &amp; Tissot PRX</p>
              </div>
              <Link to="/category/watches" className="text-link">
                View All Watches <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {watches.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 7. Accessories Collection ─────────────────────────────────── */}
        {(loading || accessories.length > 0) && (
          <section className="section-container" style={{ marginTop: "3.5rem" }}>
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <PackageCheck size={14} /> EVERYDAY CARRY ESSENTIALS
                </span>
                <h2 className="section-title">Accessories Collection</h2>
                <p className="section-subtitle">Sony Noise-Canceling Audio, AirPods Pro, Ray-Ban Aviators &amp; Backpacks</p>
              </div>
              <Link to="/category/accessories" className="text-link">
                View All Accessories <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {accessories.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── 8. Best Deals ─────────────────────────────────────────────── */}
        {(loading || deals.length > 0) && (
          <section className="deals-strip-section section-container" style={{ marginTop: "3.5rem" }}>
            <div className="section-header">
              <div>
                <span className="eyebrow">
                  <Flame size={14} color="#e5484d" /> MAXIMUM SAVINGS
                </span>
                <h2 className="section-title">Best Deals &amp; Discounts</h2>
                <p className="section-subtitle">Exclusive limited-time price drops across top brands</p>
              </div>
              <Link to="/deals" className="text-link">
                All Deals &amp; Offers <ArrowRight size={18} />
              </Link>
            </div>

            {loading ? (
              <LoadingSkeleton count={4} />
            ) : (
              <div className="product-grid">
                {deals.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Best Sellers This Week ────────────────────────────────────── */}
        {(loading || bestsellers.length > 0) && (
          <section className="bestsellers-section section-container" style={{ marginTop: "3.5rem" }}>
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
                {bestsellers.slice(0, 4).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ── Promo Cards ───────────────────────────────────────────────── */}
        <section className="section-container" style={{ marginTop: "3.5rem" }}>
          <div className="promo-card-grid">
            <Link to="/category/mobiles" className="promo-banner-card promo-electronics">
              <div className="promo-card-content">
                <Tag size={20} />
                <span>Flagship 5G</span>
                <h3>Trending Mobiles</h3>
                <p>Shop Phones →</p>
              </div>
            </Link>
            <Link to="/category/fashion" className="promo-banner-card promo-fashion">
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
