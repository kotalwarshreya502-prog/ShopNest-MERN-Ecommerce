import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TrendingUp, ArrowRight } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProductCard from "../components/common/ProductCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import api from "../services/api";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/products?newArrival=true&sort=newest&limit=12&page=${page}`)
      .then(({ data }) => {
        if (!active) return;
        if (data.success) {
          // If no newArrival flagged products yet, show newest products
          if (data.total === 0) {
            return api.get(`/products?sort=newest&limit=12&page=${page}`);
          }
          setProducts(data.products);
          setTotalPages(data.pages);
          setTotal(data.total);
        }
      })
      .then((fallback) => {
        if (!active || !fallback) return;
        const d = fallback.data;
        if (d?.success) {
          setProducts(d.products);
          setTotalPages(d.pages);
          setTotal(d.total);
        }
      })
      .catch(console.error)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [page]);

  return (
    <div className="shopnest">
      <Navbar />
      <main className="section-container" style={{ minHeight: "60vh", paddingTop: "2rem" }}>
        {/* Breadcrumb */}
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>New Arrivals</span>
        </nav>

        {/* Header */}
        <div className="section-header-row" style={{ marginBottom: "2rem" }}>
          <div>
            <span className="eyebrow"><TrendingUp size={14} /> JUST LANDED</span>
            <h1 className="section-title">New Arrivals</h1>
            <p className="section-subtitle">
              {loading ? "Loading latest products…" : `${total} fresh products added to our catalogue`}
            </p>
          </div>
          <Link to="/shop" className="text-link">
            Browse All Products <ArrowRight size={18} />
          </Link>
        </div>

        {/* Product Grid */}
        {loading ? (
          <LoadingSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No new arrivals yet</h3>
            <p>Check back soon — we add new products regularly.</p>
            <Link to="/shop" className="btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <div className="product-grid">{products.map((p) => <ProductCard key={p._id} product={p} />)}</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-bar" style={{ marginTop: "2rem" }}>
            <button className="btn-outline" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              ← Previous
            </button>
            <span style={{ padding: "0 1rem", color: "var(--text-muted)" }}>Page {page} of {totalPages}</span>
            <button className="btn-outline" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next →
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

