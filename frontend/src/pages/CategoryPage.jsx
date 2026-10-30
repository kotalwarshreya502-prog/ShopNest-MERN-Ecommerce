import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProductCard from "../components/common/ProductCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import api from "../services/api";

const CATEGORY_META = {
  mobiles: {
    label: "Mobiles",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    desc: "Explore flagship 5G smartphones, Apple iPhones, Samsung Galaxy, OnePlus, Pixel, and top-tier mobile devices."
  },
  "mobiles-accessories": {
    label: "Mobiles",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    desc: "Explore flagship 5G smartphones, Apple iPhones, Samsung Galaxy, OnePlus, Pixel, and top-tier mobile devices."
  },
  laptops: {
    label: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    desc: "Discover Apple MacBooks, creator workstations, ultraportable thin-and-lights, and high-FPS gaming laptops."
  },
  "laptops-computers": {
    label: "Laptops",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    desc: "Discover Apple MacBooks, creator workstations, ultraportable thin-and-lights, and high-FPS gaming laptops."
  },
  gaming: {
    label: "Gaming",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    desc: "Next-gen PS5, Xbox Series X, optical RGB keyboards, esports mice, studio headsets, and 240Hz curved monitors."
  },
  fashion: {
    label: "Fashion",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    desc: "Trending denim trucker jackets, classic Oxford shirts, bohemian maxi dresses, hoodies, and regal ethnic wear."
  },
  footwear: {
    label: "Footwear",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    desc: "Iconic Air Jordan 1s, Pegasus running trainers, Ultraboost lightweight runners, formal Derby shoes, and comfort sandals."
  },
  watches: {
    label: "Watches",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    desc: "Apple Watch Series 9, Galaxy Watch6 Classic, rugged CasiOak G-Shocks, and luxury Swiss automatic timepieces."
  },
  accessories: {
    label: "Accessories",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    desc: "Sony noise-canceling headphones, AirPods Pro, Ray-Ban aviators, North Face commute backpacks, and leather wallets."
  },
  electronics: {
    label: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    desc: "Top-tier audio, high-definition camera gear, and smart wireless accessories."
  },
  "home-living": {
    label: "Home & Living",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    desc: "Nordic furniture, warm accent lighting, luxury bedding, and artisanal ceramics."
  },
  "kitchen-products": {
    label: "Kitchen Products",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
    desc: "Digital air fryers, espresso machines, nutrient extractors, and granite cookware sets."
  },
  beauty: {
    label: "Beauty",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    desc: "Clinically proven serums, luxury perfumes, and salon-grade grooming essentials."
  },
  sports: {
    label: "Sports & Fitness",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    desc: "High-density exercise mats, adjustable dumbbells, and match-grade equipment."
  },
  books: {
    label: "Books & Stationery",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    desc: "Bestselling hardcovers, programming guides, and luxury ruled notebooks."
  },
  "toys-lifestyle": {
    label: "Toys & Lifestyle",
    image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=600&auto=format&fit=crop&q=80",
    desc: "4K camera drones, intricate LEGO Technic models, and lifestyle essentials."
  },
};

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("featured");

  const meta = CATEGORY_META[slug?.toLowerCase()] || { label: slug, emoji: "🛍️", desc: `Browse all ${slug} products.` };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setPage(1);
  }, [slug]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/products?category=${encodeURIComponent(slug)}&sort=${sort}&limit=12&page=${page}`)
      .then(({ data }) => {
        if (!active) return;
        if (data.success) {
          setProducts(data.products);
          setTotalPages(data.pages);
          setTotal(data.total);
        }
      })
      .catch(console.error)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug, page, sort]);

  return (
    <div className="shopnest">
      <Navbar />
      <main style={{ minHeight: "60vh" }}>
        {/* Category Hero */}
        <div className="category-hero-banner">
          <div className="section-container">
            <nav className="breadcrumb" aria-label="breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/shop">Shop</Link>
              <span>/</span>
              <span>{meta.label}</span>
            </nav>
            <div className="category-hero-content" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "1rem" }}>
              {meta.image && (
                <img
                  src={meta.image}
                  alt={meta.label}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "12px",
                    border: "2px solid rgba(255,255,255,0.15)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    flexShrink: 0
                  }}
                />
              )}
              <div>
                <h1 style={{ margin: "0 0 0.35rem 0", fontSize: "1.85rem" }}>{meta.label}</h1>
                <p style={{ margin: 0, opacity: 0.9, maxWidth: "680px" }}>{meta.desc}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="section-container" style={{ paddingTop: "2rem" }}>
          {/* Toolbar */}
          <div className="shop-toolbar">
            <span className="results-count">
              {loading ? "Loading…" : `${total} product${total !== 1 ? "s" : ""} found`}
            </span>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="bestseller">Best Sellers</option>
            </select>
          </div>

          {loading ? (
            <LoadingSkeleton count={12} />
          ) : products.length === 0 ? (
            <div className="empty-state">
              <h3>No products in {meta.label} yet</h3>
              <p>Check back soon or explore other categories.</p>
              <Link to="/shop" className="btn-primary">Browse All Products</Link>
            </div>
          ) : (
            <div className="product-grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
          )}

          {totalPages > 1 && (
            <div className="pagination-bar" style={{ marginTop: "2rem" }}>
              <button className="btn-outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>← Previous</button>
              <span style={{ padding: "0 1rem", color: "var(--text-muted)" }}>Page {page} of {totalPages}</span>
              <button className="btn-outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next →</button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

