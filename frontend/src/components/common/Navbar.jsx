import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search, ShoppingBag, Heart, User, Menu, X,
  ChevronDown, LogOut, Shield, Package,
  Zap, TrendingUp, Award,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import AnnouncementBar from "./AnnouncementBar";

const CATEGORIES = [
  { label: "Electronics", slug: "electronics", icon: "🔌" },
  { label: "Mobiles", slug: "mobiles-accessories", icon: "📱" },
  { label: "Laptops", slug: "laptops-computers", icon: "💻" },
  { label: "Gaming", slug: "gaming", icon: "🎮" },
  { label: "Fashion", slug: "fashion", icon: "👗" },
  { label: "Footwear", slug: "footwear", icon: "👟" },
  { label: "Watches", slug: "watches", icon: "⌚" },
  { label: "Accessories", slug: "accessories", icon: "👜" },
  { label: "Home & Living", slug: "home-living", icon: "🏠" },
  { label: "Kitchen", slug: "kitchen-products", icon: "🍳" },
  { label: "Beauty", slug: "beauty", icon: "✨" },
  { label: "Sports", slug: "sports", icon: "🏋️" },
  { label: "Books", slug: "books", icon: "📚" },
  { label: "Toys & Lifestyle", slug: "toys-lifestyle", icon: "🧸" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate("/");
  };

  const isCatActive = (slug) =>
    location.pathname === `/category/${slug}` ||
    location.search.includes(`category=${encodeURIComponent(CATEGORIES.find((c) => c.slug === slug)?.label || "")}`);

  return (
    <>
      <AnnouncementBar />

      <header className="site-header-wrapper">
        <div className="main-navbar">
          {/* Mobile menu trigger */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="brand-logo">
            shop<span className="brand-accent">nest</span>
            <span className="brand-dot">.</span>
          </Link>

          {/* Search bar */}
          <form className="navbar-search" onSubmit={handleSearchSubmit} role="search">
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="search"
                placeholder="Search for products, brands, categories…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search products"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="search-submit-btn">Search</button>
          </form>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Wishlist */}
            <Link to="/wishlist" className="action-item" title="Wishlist" aria-label={`Wishlist (${wishlistCount} items)`}>
              <div className="icon-badge-wrapper">
                <Heart size={22} />
                {wishlistCount > 0 && <span className="badge-count wishlist-badge">{wishlistCount}</span>}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="action-item" title="Shopping Cart" aria-label={`Cart (${totalItemsCount} items)`}>
              <div className="icon-badge-wrapper">
                <ShoppingBag size={22} />
                {totalItemsCount > 0 && <span className="badge-count cart-badge">{totalItemsCount}</span>}
              </div>
              <span className="action-label">Cart</span>
            </Link>

            {/* Account / User Menu */}
            <div className="user-menu-container" ref={userDropdownRef}>
              {isAuthenticated ? (
                <div className="user-dropdown-wrapper">
                  <button
                    className="user-btn logged-in"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-expanded={userDropdownOpen}
                    aria-haspopup="true"
                  >
                    <div className="user-avatar-initial">
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="user-name-role">
                      <span className="user-name">{user?.name?.split(" ")[0]}</span>
                      <small className="user-role">{user?.role || "Customer"}</small>
                    </div>
                    <ChevronDown size={14} />
                  </button>

                  {userDropdownOpen && (
                    <div className="user-dropdown-menu" role="menu">
                      <div className="dropdown-user-info">
                        <strong>{user?.name}</strong>
                        <span>{user?.email}</span>
                      </div>
                      <div className="dropdown-divider" />
                      <Link to="/profile" onClick={() => setUserDropdownOpen(false)} className="dropdown-link" role="menuitem">
                        <User size={16} /> My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setUserDropdownOpen(false)} className="dropdown-link" role="menuitem">
                        <Package size={16} /> My Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setUserDropdownOpen(false)} className="dropdown-link" role="menuitem">
                        <Heart size={16} /> Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setUserDropdownOpen(false)} className="dropdown-link admin-link" role="menuitem">
                          <Shield size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-link logout-btn" role="menuitem">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn-nav-login">Sign in</Link>
                  <Link to="/register" className="btn-nav-register">Join</Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="category-navbar" aria-label="Product categories">
          <div className="category-scroll-container">
            <Link to="/shop" className={`cat-nav-link ${location.pathname === "/shop" && !location.search ? "active" : ""}`}>
              All Products
            </Link>
            <Link to="/deals" className={`cat-nav-link deals-link ${location.pathname === "/deals" ? "active" : ""}`}>
              ⚡ Deals
            </Link>
            <Link to="/new-arrivals" className={`cat-nav-link ${location.pathname === "/new-arrivals" ? "active" : ""}`}>
              <TrendingUp size={13} style={{ verticalAlign: "middle", marginRight: 3 }} />New
            </Link>
            <Link to="/best-sellers" className={`cat-nav-link ${location.pathname === "/best-sellers" ? "active" : ""}`}>
              <Award size={13} style={{ verticalAlign: "middle", marginRight: 3 }} />Best Sellers
            </Link>
            <span className="cat-nav-divider" aria-hidden="true">|</span>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className={`cat-nav-link ${isCatActive(cat.slug) ? "active" : ""}`}
              >
                {cat.icon} {cat.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Navigation menu">
              <div className="drawer-header">
                <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
                  shop<span className="brand-accent">nest</span>.
                </Link>
                <button className="drawer-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Search */}
              <form className="drawer-search" onSubmit={handleSearchSubmit}>
                <Search size={16} />
                <input
                  type="search"
                  placeholder="Search products…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              <div className="drawer-nav-sections">
                {/* Special links */}
                <div className="drawer-group">
                  <span className="drawer-group-title">Highlights</span>
                  <Link to="/">🏠 Home</Link>
                  <Link to="/shop">🛍️ All Products</Link>
                  <Link to="/deals">⚡ Today's Deals</Link>
                  <Link to="/new-arrivals">🆕 New Arrivals</Link>
                  <Link to="/best-sellers">🏆 Best Sellers</Link>
                </div>

                {/* Categories */}
                <div className="drawer-group">
                  <span className="drawer-group-title">Shop by Category</span>
                  {CATEGORIES.map((cat) => (
                    <Link key={cat.slug} to={`/category/${cat.slug}`}>
                      {cat.icon} {cat.label}
                    </Link>
                  ))}
                </div>

                {/* Account */}
                <div className="drawer-group">
                  <span className="drawer-group-title">Account &amp; Orders</span>
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile">👤 My Profile</Link>
                      <Link to="/orders">📦 My Orders</Link>
                      <Link to="/wishlist">❤️ Wishlist ({wishlistCount})</Link>
                      <Link to="/cart">🛒 Cart ({totalItemsCount})</Link>
                      {isAdmin && <Link to="/admin">🛡️ Admin Dashboard</Link>}
                      <button onClick={handleLogout} className="drawer-logout">Sign Out</button>
                    </>
                  ) : (
                    <>
                      <Link to="/login">Sign In</Link>
                      <Link to="/register">Create Account</Link>
                    </>
                  )}
                </div>

                {/* Info */}
                <div className="drawer-group">
                  <span className="drawer-group-title">Info</span>
                  <Link to="/about">About ShopNest</Link>
                  <Link to="/contact">Contact &amp; Support</Link>
                  <Link to="/privacy-policy">Privacy Policy</Link>
                  <Link to="/terms">Terms &amp; Conditions</Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
