import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProductCard from "../components/common/ProductCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import api from "../services/api";

const CATEGORY_META = {
  electronics: { label: "Electronics", emoji: "🔌", desc: "Top-tier audio, high-definition cameras, and smart wireless tech." },
  "mobiles-accessories": { label: "Mobiles & Accessories", emoji: "📱", desc: "Flagship smartphones, fast GaN chargers, rugged cases, and mobile essentials." },
  "laptops-computers": { label: "Laptops & Computers", emoji: "💻", desc: "High-performance ultrabooks, custom mechanical keyboards, and 4K monitors." },
  gaming: { label: "Gaming", emoji: "🎮", desc: "Next-gen consoles, low-latency wireless controllers, and competitive gaming gear." },
  fashion: { label: "Fashion", emoji: "👗", desc: "Trending apparel, denim jackets, ethnic suits, and chic casual wear." },
  footwear: { label: "Footwear", emoji: "👟", desc: "Performance running sneakers, classic white court shoes, and handcrafted leather formals." },
  watches: { label: "Watches", emoji: "⌚", desc: "Chronographs, minimalist dress timepieces, and advanced smartwatch wearables." },
  accessories: { label: "Accessories", emoji: "👜", desc: "Full-grain leather wallets, polarized aviators, and everyday carry bags." },
  "home-living": { label: "Home & Living", emoji: "🏠", desc: "Nordic furniture, warm accent lighting, luxury bedding, and artisanal ceramics." },
  "home & living": { label: "Home & Living", emoji: "🏠", desc: "Nordic furniture, warm accent lighting, luxury bedding, and artisanal ceramics." },
  "kitchen-products": { label: "Kitchen Products", emoji: "🍳", desc: "Air fryers, espresso machines, nutrient extractors, and granite cookware sets." },
  beauty: { label: "Beauty", emoji: "✨", desc: "Clinically proven serums, luxury perfumes, and salon-grade grooming tools." },
  sports: { label: "Sports & Fitness", emoji: "🏋️", desc: "High-density exercise mats, adjustable dumbbells, and match-grade equipment." },
  books: { label: "Books & Stationery", emoji: "📚", desc: "Bestselling hardcovers, programming guides, and luxury ruled notebooks." },
  "toys-lifestyle": { label: "Toys & Lifestyle", emoji: "🧸", desc: "4K camera drones, intricate LEGO Technic sets, and hi-res desktop audio." },
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
            <div className="category-hero-content">
              <span style={{ fontSize: "3rem" }}>{meta.emoji}</span>
              <div>
                <h1>{meta.label}</h1>
                <p>{meta.desc}</p>
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

