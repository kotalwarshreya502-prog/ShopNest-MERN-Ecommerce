import React, { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Filter,
  SlidersHorizontal,
  Grid,
  List,
  Star,
  X,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Tag,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProductCard from "../components/common/ProductCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import api from "../services/api";

const CATEGORIES = [
  "All",
  "Electronics",
  "Fashion",
  "Footwear",
  "Accessories",
  "Home & Living",
  "Beauty",
  "Sports",
  "Books",
];

const BRANDS = [
  "All",
  // Electronics
  "Sony", "Apple", "Amazon",
  // Fashion Men
  "H&M", "Zara", "Allen Solly", "Uniqlo", "Van Heusen", "Manyavar", "Levi's",
  // Fashion Women
  "Biba", "Global Desi", "W", "Libas",
  // Footwear
  "Nike", "Adidas", "Puma", "Clarks", "Woodland", "Bata", "Red Tape",
  // Accessories
  "Fossil", "Herschel", "Ray-Ban", "Hidesign", "Da Milano", "Baggit", "Caprese", "Mivi",
  // Home & Living
  "IKEA", "Urban Ladder", "Pepperfry", "NestHome", "Nestasia", "Lifelong",
  // Beauty & Sports
  "The Ordinary", "Boldfit",
  // Books
  "Jaico Publishing", "Plata Publishing", "HarperCollins", "Pearson Education",
  "Crown Business", "Penguin Random House",
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "bestseller", label: "Best Sellers" },
];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter & Search States (derived from or synced with URL)
  const searchQuery = searchParams.get("search") || searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "All";
  const brandParam = searchParams.get("brand") || "All";
  const sortParam = searchParams.get("sort") || "featured";
  const minPriceParam = searchParams.get("minPrice") || "";
  const maxPriceParam = searchParams.get("maxPrice") || "";
  const minRatingParam = searchParams.get("minRating") || "";
  const inStockParam = searchParams.get("inStock") === "true";
  const pageParam = parseInt(searchParams.get("page"), 10) || 1;

  // Local filter inputs before applying
  const [minPriceInput, setMinPriceInput] = useState(minPriceParam);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPriceParam);

  useEffect(() => {
    setMinPriceInput(minPriceParam);
    setMaxPriceInput(maxPriceParam);
  }, [minPriceParam, maxPriceParam]);

  // Fetch products from backend whenever URL searchParams change
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = new URLSearchParams(searchParams);
    params.set("limit", "12");

    api
      .get(`/products?${params.toString()}`)
      .then((res) => {
        if (isMounted) {
          const data = res.data;
          setProducts(data.products || []);
          setTotalProducts(data.total || (data.products ? data.products.length : 0));
          setTotalPages(data.pages || 1);
        }
      })
      .catch((err) => {
        console.warn("Failed to fetch products from backend:", err.message);
        if (isMounted) setProducts([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [searchParams]);

  // Helper to update a single search param while preserving others
  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    next.set("page", "1"); // Reset to page 1 on filter change
    setSearchParams(next);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPriceInput) next.set("minPrice", minPriceInput);
    else next.delete("minPrice");

    if (maxPriceInput) next.set("maxPrice", maxPriceInput);
    else next.delete("maxPrice");

    next.set("page", "1");
    setSearchParams(next);
  };

  const handleClearAll = () => {
    setMinPriceInput("");
    setMaxPriceInput("");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters =
    searchQuery ||
    categoryParam !== "All" ||
    brandParam !== "All" ||
    minPriceParam ||
    maxPriceParam ||
    minRatingParam ||
    inStockParam;

  return (
    <div className="shopnest">
      <Navbar />

      <main className="section-container shop-page-container">
        {/* Breadcrumb & Header */}
        <div className="shop-header-strip">
          <div>
            <div className="breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <span className="current">Shop Catalogue</span>
              {categoryParam !== "All" && (
                <>
                  <span>/</span>
                  <span className="current">{categoryParam}</span>
                </>
              )}
            </div>
            <h1 className="shop-title">
              {categoryParam !== "All"
                ? `${categoryParam} Collection`
                : searchQuery
                ? `Results for "${searchQuery}"`
                : "All Products"}
            </h1>
            <p className="shop-result-count">
              Showing <strong>{products.length}</strong> of <strong>{totalProducts}</strong>{" "}
              available products
            </p>
          </div>

          {/* Controls: Sort & View Toggle */}
          <div className="shop-controls">
            <button
              className="btn-filter-mobile"
              onClick={() => setMobileFilterOpen(true)}
            >
              <Filter size={18} /> Filters
            </button>

            <div className="sort-dropdown-wrap">
              <label htmlFor="sortSelect">Sort by:</label>
              <select
                id="sortSelect"
                value={sortParam}
                onChange={(e) => updateParam("sort", e.target.value)}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="view-mode-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Tag Bar */}
        {hasActiveFilters && (
          <div className="active-filters-bar">
            <span className="active-filter-label">Active Filters:</span>
            {searchQuery && (
              <span className="filter-tag">
                Keyword: "{searchQuery}"
                <X size={14} onClick={() => updateParam("search", "")} />
              </span>
            )}
            {categoryParam !== "All" && (
              <span className="filter-tag">
                Category: {categoryParam}
                <X size={14} onClick={() => updateParam("category", "All")} />
              </span>
            )}
            {brandParam !== "All" && (
              <span className="filter-tag">
                Brand: {brandParam}
                <X size={14} onClick={() => updateParam("brand", "All")} />
              </span>
            )}
            {(minPriceParam || maxPriceParam) && (
              <span className="filter-tag">
                Price: ₹{minPriceParam || "0"} - ₹{maxPriceParam || "Any"}
                <X
                  size={14}
                  onClick={() => {
                    const next = new URLSearchParams(searchParams);
                    next.delete("minPrice");
                    next.delete("maxPrice");
                    setSearchParams(next);
                  }}
                />
              </span>
            )}
            {minRatingParam && (
              <span className="filter-tag">
                {minRatingParam}★ & above
                <X size={14} onClick={() => updateParam("minRating", "")} />
              </span>
            )}
            {inStockParam && (
              <span className="filter-tag">
                In Stock Only
                <X size={14} onClick={() => updateParam("inStock", "")} />
              </span>
            )}

            <button className="clear-all-link" onClick={handleClearAll}>
              <RotateCcw size={14} /> Clear all
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Product Grid */}
        <div className="shop-layout">
          {/* Desktop Filter Sidebar */}
          <aside className="shop-sidebar">
            <div className="filter-section">
              <h3>Categories</h3>
              <div className="filter-list">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-item-btn ${categoryParam === cat ? "active" : ""}`}
                    onClick={() => updateParam("category", cat)}
                  >
                    <span>{cat}</span>
                    {categoryParam === cat && <span className="active-dot">•</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-divider"></div>

            {/* Price Filter */}
            <div className="filter-section">
              <h3>Price Range (₹)</h3>
              <form onSubmit={handlePriceApply} className="price-filter-form">
                <div className="price-inputs">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn-apply-price">
                  Apply
                </button>
              </form>
            </div>

            <div className="filter-divider"></div>

            {/* Brand Filter */}
            <div className="filter-section">
              <h3>Brand</h3>
              <div className="filter-list scrollable">
                {BRANDS.map((b) => (
                  <button
                    key={b}
                    className={`filter-item-btn ${brandParam === b ? "active" : ""}`}
                    onClick={() => updateParam("brand", b)}
                  >
                    <span>{b}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-divider"></div>

            {/* Customer Rating Filter */}
            <div className="filter-section">
              <h3>Customer Rating</h3>
              <div className="rating-filter-options">
                {[4, 3, 2].map((r) => (
                  <button
                    key={r}
                    className={`rating-opt-btn ${minRatingParam === String(r) ? "active" : ""}`}
                    onClick={() =>
                      updateParam(
                        "minRating",
                        minRatingParam === String(r) ? "" : String(r)
                      )
                    }
                  >
                    <div className="stars-row">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill={i < r ? "#eab308" : "none"}
                          color={i < r ? "#eab308" : "#cbd5e1"}
                        />
                      ))}
                    </div>
                    <span>{r}★ & above</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-divider"></div>

            {/* Availability */}
            <div className="filter-section">
              <h3>Availability</h3>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateParam("inStock", e.target.checked ? "true" : "")}
                />
                <span>Include In-Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Listing Area */}
          <section className="shop-product-area">
            {loading ? (
              <LoadingSkeleton count={12} />
            ) : products.length === 0 ? (
              <div className="empty-state shop-empty">
                <div className="empty-icon-wrap">
                  <Search size={44} />
                </div>
                <h2>No products found</h2>
                <p>
                  We couldn't find any items matching your selected criteria. Try resetting
                  or adjusting your filters.
                </p>
                <button className="btn-primary" onClick={handleClearAll}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                <div className={`product-grid ${viewMode === "list" ? "list-view" : ""}`}>
                  {products.map((prod) => (
                    <ProductCard key={prod._id} product={prod} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-bar">
                    <button
                      className="pagination-btn"
                      disabled={pageParam <= 1}
                      onClick={() => updateParam("page", String(pageParam - 1))}
                    >
                      <ChevronLeft size={18} /> Previous
                    </button>

                    <div className="page-numbers">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            className={`page-num-btn ${pageParam === pageNum ? "active" : ""}`}
                            onClick={() => updateParam("page", String(pageNum))}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      className="pagination-btn"
                      disabled={pageParam >= totalPages}
                      onClick={() => updateParam("page", String(pageParam + 1))}
                    >
                      Next <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div
            className="mobile-drawer-overlay"
            onClick={() => setMobileFilterOpen(false)}
          >
            <div className="mobile-drawer filter-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <h3>Filter Catalogue</h3>
                <button
                  className="drawer-close"
                  onClick={() => setMobileFilterOpen(false)}
                >
                  <X size={22} />
                </button>
              </div>

              <div className="drawer-scroll-body">
                <h4>Categories</h4>
                <div className="filter-list">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      className={`filter-item-btn ${categoryParam === cat ? "active" : ""}`}
                      onClick={() => {
                        updateParam("category", cat);
                        setMobileFilterOpen(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="filter-divider"></div>

                <h4>Price Range</h4>
                <form
                  onSubmit={(e) => {
                    handlePriceApply(e);
                    setMobileFilterOpen(false);
                  }}
                  className="price-filter-form"
                >
                  <div className="price-inputs">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-primary btn-sm">
                    Apply Filter
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
