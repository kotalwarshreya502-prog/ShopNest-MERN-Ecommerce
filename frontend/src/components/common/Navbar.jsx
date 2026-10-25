import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Shield,
  Package,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import AnnouncementBar from "./AnnouncementBar";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Men",
  "Women",
  "Home & Living",
  "Beauty",
  "Accessories",
  "Footwear",
  "Sports",
  "Books",
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
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo */}
          <Link to="/" className="brand-logo">
            shop<span className="brand-accent">nest</span>
            <span className="brand-dot">.</span>
          </Link>

          {/* Search bar */}
          <form className="navbar-search" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                placeholder="Search for smartphones, sneakers, watches, brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <button type="submit" className="search-submit-btn">
              Search
            </button>
          </form>

          {/* Header Actions */}
          <div className="header-actions">
            {/* Wishlist */}
            <Link to="/wishlist" className="action-item" title="Wishlist">
              <div className="icon-badge-wrapper">
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="badge-count wishlist-badge">{wishlistCount}</span>
                )}
              </div>
              <span className="action-label">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="action-item" title="Shopping Cart">
              <div className="icon-badge-wrapper">
                <ShoppingBag size={22} />
                {totalItemsCount > 0 && (
                  <span className="badge-count cart-badge">{totalItemsCount}</span>
                )}
              </div>
              <span className="action-label">Cart</span>
            </Link>

            {/* Account / User Menu */}
            <div className="user-menu-container">
              {isAuthenticated ? (
                <div className="user-dropdown-wrapper">
                  <button
                    className="user-btn logged-in"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    aria-expanded={userDropdownOpen}
                  >
                    <div className="user-avatar-initial">
                      {user.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="user-name-role">
                      <span className="user-name">{user.name.split(" ")[0]}</span>
                      <small className="user-role">{user.role || "Customer"}</small>
                    </div>
                    <ChevronDown size={14} />
                  </button>

                  {userDropdownOpen && (
                    <div className="user-dropdown-menu">
                      <div className="dropdown-user-info">
                        <strong>{user.name}</strong>
                        <span>{user.email}</span>
                      </div>
                      <div className="dropdown-divider"></div>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="dropdown-link"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="dropdown-link"
                      >
                        <Package size={16} /> My Orders
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="dropdown-link admin-link"
                        >
                          <Shield size={16} /> Admin Dashboard
                        </Link>
                      )}
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-link logout-btn">
                        <LogOut size={16} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link to="/login" className="btn-nav-login">
                    Sign in
                  </Link>
                  <Link to="/register" className="btn-nav-register">
                    Join
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Navigation Bar */}
        <nav className="category-navbar">
          <div className="category-scroll-container">
            <Link
              to="/shop"
              className={`cat-nav-link ${location.pathname === "/shop" && !location.search ? "active" : ""}`}
            >
              All Products
            </Link>
            <Link
              to="/deals"
              className={`cat-nav-link deals-link ${location.pathname === "/deals" ? "active" : ""}`}
            >
              ⚡ Deals & Offers
            </Link>
            {CATEGORIES.map((cat) => {
              const isActive = location.search.includes(`category=${encodeURIComponent(cat)}`);
              return (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className={`cat-nav-link ${isActive ? "active" : ""}`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer-overlay" onClick={() => setMobileMenuOpen(false)}>
            <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
              <div className="drawer-header">
                <Link to="/" className="brand-logo" onClick={() => setMobileMenuOpen(false)}>
                  shop<span className="brand-accent">nest</span>.
                </Link>
                <button
                  className="drawer-close"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Search */}
              <form className="drawer-search" onSubmit={handleSearchSubmit}>
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {/* Drawer Links */}
              <div className="drawer-nav-sections">
                <div className="drawer-group">
                  <span className="drawer-group-title">Navigation</span>
                  <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </Link>
                  <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
                    Shop All Products
                  </Link>
                  <Link to="/deals" onClick={() => setMobileMenuOpen(false)}>
                    ⚡ Today's Deals
                  </Link>
                </div>

                <div className="drawer-group">
                  <span className="drawer-group-title">Categories</span>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat}
                      to={`/shop?category=${encodeURIComponent(cat)}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>

                <div className="drawer-group">
                  <span className="drawer-group-title">Account & Orders</span>
                  {isAuthenticated ? (
                    <>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                        My Profile
                      </Link>
                      <Link to="/orders" onClick={() => setMobileMenuOpen(false)}>
                        My Orders
                      </Link>
                      <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                        Wishlist ({wishlistCount})
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                          Admin Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="drawer-logout">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
