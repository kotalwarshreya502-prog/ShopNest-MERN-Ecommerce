import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProductCard from "../components/common/ProductCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import api from "../services/api";

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get(`/products?bestseller=true&sort=bestseller&limit=12&page=${page}`)
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
  }, [page]);

  return (
    <div className="shopnest">
      <Navbar />
      <main className="section-container" style={{ minHeight: "60vh", paddingTop: "2rem" }}>
        <nav className="breadcrumb" aria-label="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Best Sellers</span>
        </nav>

        <div className="section-header-row" style={{ marginBottom: "2rem" }}>
          <div>
            <span className="eyebrow"><Award size={14} /> SHOPPER FAVORITES</span>
            <h1 className="section-title">Best Sellers</h1>
            <p className="section-subtitle">
              {loading ? "Loading best sellers…" : `${total} top-rated products loved by our customers`}
            </p>
          </div>
          <Link to="/shop" className="text-link">
            Browse All Products <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <LoadingSkeleton count={12} />
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h3>No bestsellers yet</h3>
            <p>Products with the most reviews will appear here.</p>
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
      </main>
      <Footer />
    </div>
  );
}

