import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  ArrowRight,
  Shield,
  Search,
  CheckCircle,
  X,
  Tag,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

const CATEGORIES = [
  "Electronics",
  "Fashion",
  "Footwear",
  "Accessories",
  "Home & Living",
  "Beauty",
  "Sports",
  "Books",
];

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState("overview"); // overview, products, orders, coupons
  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  // Products Tab State
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState("");
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    discountPrice: "",
    category: "Electronics",
    brand: "ShopNest",
    stock: "10",
    image: "",
    description: "",
    isFeatured: false,
    isBestseller: false,
  });

  // Orders Tab State
  const [orders, setOrders] = useState([]);
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Coupons Tab State
  const [coupons, setCoupons] = useState([]);
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percent",
    discountValue: "10",
    minOrderAmount: "0",
    maxDiscountAmount: "",
  });

  // Fetch Dashboard Stats
  const fetchDashboardStats = () => {
    setLoadingStats(true);
    api
      .get("/admin/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.warn("Failed to fetch admin stats:", err.message);
      })
      .finally(() => {
        setLoadingStats(false);
      });
  };

  // Fetch Products
  const fetchAdminProducts = () => {
    api
      .get("/products?limit=50")
      .then((res) => {
        setProducts(res.data.products || []);
      })
      .catch((err) => console.warn(err));
  };

  // Fetch Orders
  const fetchAdminOrders = () => {
    const url =
      orderStatusFilter === "All"
        ? "/orders"
        : `/orders?status=${orderStatusFilter}`;
    api
      .get(url)
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => console.warn(err));
  };

  // Fetch Coupons
  const fetchAdminCoupons = () => {
    api
      .get("/coupons")
      .then((res) => {
        setCoupons(res.data.coupons || []);
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    if (isAdmin) {
      fetchDashboardStats();
      fetchAdminProducts();
      fetchAdminOrders();
      fetchAdminCoupons();
    }
  }, [isAdmin, orderStatusFilter]);

  // Product CRUD Handlers
  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      price: "",
      discountPrice: "",
      category: "Electronics",
      brand: "ShopNest",
      stock: "10",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      description: "",
      isFeatured: false,
      isBestseller: false,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      price: String(prod.price),
      discountPrice: prod.discountPrice ? String(prod.discountPrice) : "",
      category: prod.category,
      brand: prod.brand || "ShopNest",
      stock: String(prod.stock),
      image: prod.image || "",
      description: prod.description || "",
      isFeatured: !!prod.isFeatured,
      isBestseller: !!prod.isBestseller,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...productForm,
        price: Number(productForm.price),
        discountPrice: productForm.discountPrice
          ? Number(productForm.discountPrice)
          : null,
        stock: Number(productForm.stock),
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct._id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setProductModalOpen(false);
      fetchAdminProducts();
      fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchAdminProducts();
      fetchDashboardStats();
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  // Order Status Updater
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      fetchAdminOrders();
      fetchDashboardStats();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  // Coupon Handlers
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await api.post("/coupons", {
        ...couponForm,
        discountValue: Number(couponForm.discountValue),
        minOrderAmount: Number(couponForm.minOrderAmount) || 0,
        maxDiscountAmount: couponForm.maxDiscountAmount
          ? Number(couponForm.maxDiscountAmount)
          : null,
      });
      setCouponModalOpen(false);
      fetchAdminCoupons();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const handleToggleCoupon = async (id) => {
    try {
      await api.patch(`/coupons/${id}/toggle`);
      fetchAdminCoupons();
    } catch (err) {
      alert("Failed to toggle coupon status");
    }
  };

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Delete this coupon code?")) return;
    try {
      await api.delete(`/coupons/${id}`);
      fetchAdminCoupons();
    } catch (err) {
      alert("Failed to delete coupon");
    }
  };

  // Security Check: Deny access if not admin
  if (!isAdmin) {
    return (
      <div className="shopnest">
        <Navbar />
        <main className="section-container empty-state access-denied-state">
          <div className="empty-icon-wrap" style={{ background: "#fee2e2", color: "#b91c1c" }}>
            <Shield size={48} />
          </div>
          <h2>Administrator Access Required</h2>
          <p>
            You must be signed in with an administrator account to view the Store Management
            Console.
          </p>
          <div className="denied-actions">
            <Link to="/login" className="btn-primary">
              Sign In as Admin
            </Link>
            <Link to="/" className="btn-outline">
              Return to Storefront
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(productSearch.toLowerCase()))
  );

  return (
    <div className="shopnest admin-view">
      <Navbar />

      <main className="section-container admin-container">
        {/* Header */}
        <div className="admin-header-row">
          <div>
            <span className="eyebrow">
              <Shield size={14} /> ADMINISTRATIVE CONTROL
            </span>
            <h1>Store Management Console</h1>
            <p>Full control over catalog inventory, orders, customer accounts, and promotions.</p>
          </div>

          <div className="admin-quick-actions">
            <button className="btn-primary" onClick={handleOpenCreateProduct}>
              <Plus size={16} /> Add Product
            </button>
            <button
              className="btn-outline"
              onClick={() => {
                fetchDashboardStats();
                fetchAdminProducts();
                fetchAdminOrders();
              }}
              title="Refresh Data"
            >
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button
            className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Dashboard Overview
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Product Catalog ({products.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Order Management ({orders.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "coupons" ? "active" : ""}`}
            onClick={() => setActiveTab("coupons")}
          >
            Coupons &amp; Discounts ({coupons.length})
          </button>
        </div>

        {/* ================================================= */}
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {/* ================================================= */}
        {activeTab === "overview" && (
          <div className="admin-overview-section">
            {/* KPI Cards */}
            <div className="admin-stats-grid">
              <div className="stat-card">
                <div className="stat-icon-wrap green">
                  <DollarSign size={24} />
                </div>
                <div>
                  <span className="stat-label">Total Revenue</span>
                  <h3 className="stat-value">
                    ₹{Number(stats?.stats?.totalRevenue || 0).toLocaleString("en-IN")}
                  </h3>
                  <span className="stat-trend positive">
                    <TrendingUp size={14} /> Real MongoDB verified
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrap blue">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <span className="stat-label">Total Orders</span>
                  <h3 className="stat-value">{stats?.stats?.totalOrders || 0}</h3>
                  <span className="stat-note">Orders placed</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrap orange">
                  <Package size={24} />
                </div>
                <div>
                  <span className="stat-label">Catalog Products</span>
                  <h3 className="stat-value">{stats?.stats?.totalProducts || 0}</h3>
                  <span className="stat-note">Active listings</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon-wrap purple">
                  <Users size={24} />
                </div>
                <div>
                  <span className="stat-label">Registered Customers</span>
                  <h3 className="stat-value">{stats?.stats?.totalCustomers || 0}</h3>
                  <span className="stat-note">Active accounts</span>
                </div>
              </div>
            </div>

            {/* Low Stock Alerts Strip */}
            {stats?.lowStockProducts && stats.lowStockProducts.length > 0 && (
              <div className="admin-alert-banner">
                <AlertTriangle size={20} className="alert-icon" />
                <div className="alert-text">
                  <strong>
                    Low Inventory Warning ({stats.lowStockProducts.length} items with ≤ 5 units)
                  </strong>
                  <p>
                    {stats.lowStockProducts
                      .slice(0, 3)
                      .map((p) => `${p.name} (${p.stock} left)`)
                      .join(" • ")}
                  </p>
                </div>
              </div>
            )}

            {/* Recent Orders Overview */}
            <div className="admin-panel-box">
              <div className="panel-header">
                <h3>Recent Store Orders</h3>
                <button
                  className="text-link"
                  onClick={() => setActiveTab("orders")}
                >
                  View All Orders <ArrowRight size={16} />
                </button>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Payment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats?.recentOrders || []).map((ord) => (
                      <tr key={ord._id}>
                        <td>
                          <strong>{ord.orderId || ord._id}</strong>
                        </td>
                        <td>{ord.customerInfo?.name || ord.user?.name || "Customer"}</td>
                        <td>{new Date(ord.createdAt).toLocaleDateString("en-IN")}</td>
                        <td>₹{Number(ord.totalPrice).toLocaleString("en-IN")}</td>
                        <td>
                          <span className={`status-pill ${ord.status.toLowerCase()}`}>
                            {ord.status}
                          </span>
                        </td>
                        <td>{ord.isPaid ? "Paid" : "Pending"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 2: PRODUCT MANAGEMENT */}
        {/* ================================================= */}
        {activeTab === "products" && (
          <div className="admin-products-section">
            <div className="panel-header-toolbar">
              <div className="admin-search-wrap">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search catalog by name, brand, or category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
              <button className="btn-primary" onClick={handleOpenCreateProduct}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Price</th>
                    <th>Discount Price</th>
                    <th>Stock</th>
                    <th>Ratings</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p._id}>
                      <td className="product-cell">
                        <img
                          src={
                            p.image ||
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100"
                          }
                          alt={p.name}
                          className="table-thumb"
                        />
                        <div>
                          <strong>{p.name}</strong>
                          {p.isFeatured && <span className="featured-tag">Featured</span>}
                        </div>
                      </td>
                      <td>{p.category}</td>
                      <td>{p.brand}</td>
                      <td>₹{Number(p.price).toLocaleString("en-IN")}</td>
                      <td>
                        {p.discountPrice
                          ? `₹${Number(p.discountPrice).toLocaleString("en-IN")}`
                          : "-"}
                      </td>
                      <td>
                        <span className={`stock-indicator ${p.stock <= 5 ? "low" : "ok"}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td>{p.ratings} ★ ({p.numReviews})</td>
                      <td className="action-buttons-cell">
                        <button
                          className="btn-action-edit"
                          onClick={() => handleOpenEditProduct(p)}
                          title="Edit Product"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="btn-action-delete"
                          onClick={() => handleDeleteProduct(p._id)}
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 3: ORDER MANAGEMENT */}
        {/* ================================================= */}
        {activeTab === "orders" && (
          <div className="admin-orders-section">
            <div className="panel-header-toolbar">
              <div className="order-filter-buttons">
                {["All", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                  (st) => (
                    <button
                      key={st}
                      className={`order-filter-pill ${orderStatusFilter === st ? "active" : ""}`}
                      onClick={() => setOrderStatusFilter(st)}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Order Reference</th>
                    <th>Customer Name</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Current Status</th>
                    <th>Update Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord._id}>
                      <td>
                        <strong>{ord.orderId || ord._id}</strong>
                      </td>
                      <td>
                        <div>
                          <strong>{ord.customerInfo?.name || ord.user?.name}</strong>
                          <small className="cell-sub">{ord.customerInfo?.phone}</small>
                        </div>
                      </td>
                      <td>{new Date(ord.createdAt).toLocaleDateString("en-IN")}</td>
                      <td>{(ord.orderItems || []).length} items</td>
                      <td>
                        <strong>₹{Number(ord.totalPrice).toLocaleString("en-IN")}</strong>
                      </td>
                      <td>
                        <span className={`payment-pill ${ord.isPaid ? "paid" : "pending"}`}>
                          {ord.paymentMethod} ({ord.isPaid ? "Paid" : "Pending"})
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${ord.status.toLowerCase()}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="status-select-control"
                          value={ord.status}
                          onChange={(e) => handleUpdateOrderStatus(ord._id, e.target.value)}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* TAB 4: COUPON MANAGEMENT */}
        {/* ================================================= */}
        {activeTab === "coupons" && (
          <div className="admin-coupons-section">
            <div className="panel-header-toolbar">
              <div>
                <h3>Promotional Coupon Codes</h3>
                <p>Create and manage discount codes applicable at checkout.</p>
              </div>
              <button
                className="btn-primary"
                onClick={() => setCouponModalOpen(true)}
              >
                <Plus size={16} /> Create Coupon
              </button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-data-table">
                <thead>
                  <tr>
                    <th>Coupon Code</th>
                    <th>Discount Type</th>
                    <th>Discount Value</th>
                    <th>Min Order (₹)</th>
                    <th>Max Cap (₹)</th>
                    <th>Redemptions</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <span className="coupon-code-badge">{c.code}</span>
                      </td>
                      <td>{c.discountType === "percent" ? "Percentage" : "Fixed Amount"}</td>
                      <td>
                        <strong>
                          {c.discountType === "percent"
                            ? `${c.discountValue}%`
                            : `₹${c.discountValue}`}
                        </strong>
                      </td>
                      <td>₹{c.minOrderAmount || 0}</td>
                      <td>{c.maxDiscountAmount ? `₹${c.maxDiscountAmount}` : "No Limit"}</td>
                      <td>{c.usedCount || 0} times</td>
                      <td>
                        <button
                          className={`btn-toggle-status ${c.isActive ? "active" : "inactive"}`}
                          onClick={() => handleToggleCoupon(c._id)}
                        >
                          {c.isActive ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td>
                        <button
                          className="btn-action-delete"
                          onClick={() => handleDeleteCoupon(c._id)}
                          title="Delete Coupon"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Product Modal (Create & Edit) */}
        {productModalOpen && (
          <div
            className="modal-backdrop"
            onClick={() => setProductModalOpen(false)}
          >
            <div className="modal-window product-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{editingProduct ? "Edit Product" : "Create New Product"}</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setProductModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="admin-entity-form">
                <div className="form-group">
                  <label>Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) =>
                      setProductForm({ ...productForm, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-grid-3">
                  <div className="form-group">
                    <label>Regular Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.price}
                      onChange={(e) =>
                        setProductForm({ ...productForm, price: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Discount Price (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={productForm.discountPrice}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          discountPrice: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Inventory Stock *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productForm.stock}
                      onChange={(e) =>
                        setProductForm({ ...productForm, stock: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) =>
                        setProductForm({ ...productForm, category: e.target.value })
                      }
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Brand Name</label>
                    <input
                      type="text"
                      value={productForm.brand}
                      onChange={(e) =>
                        setProductForm({ ...productForm, brand: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Image URL *</label>
                  <input
                    type="url"
                    required
                    value={productForm.image}
                    onChange={(e) =>
                      setProductForm({ ...productForm, image: e.target.value })
                    }
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    rows={4}
                    required
                    value={productForm.description}
                    onChange={(e) =>
                      setProductForm({
                        ...productForm,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-checkboxes-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isFeatured: e.target.checked,
                        })
                      }
                    />
                    <span>Mark as Featured Product</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={productForm.isBestseller}
                      onChange={(e) =>
                        setProductForm({
                          ...productForm,
                          isBestseller: e.target.checked,
                        })
                      }
                    />
                    <span>Mark as Bestseller</span>
                  </label>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setProductModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Coupon Modal */}
        {couponModalOpen && (
          <div
            className="modal-backdrop"
            onClick={() => setCouponModalOpen(false)}
          >
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Create New Coupon</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setCouponModalOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateCoupon} className="admin-entity-form">
                <div className="form-group">
                  <label>Coupon Code (e.g. FESTIVE20) *</label>
                  <input
                    type="text"
                    required
                    placeholder="SAVE15"
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm({
                        ...couponForm,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Discount Type</label>
                    <select
                      value={couponForm.discountType}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          discountType: e.target.value,
                        })
                      }
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="fixed">Fixed Flat Amount (₹)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Discount Value *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={couponForm.discountValue}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          discountValue: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Minimum Order Amount (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={couponForm.minOrderAmount}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          minOrderAmount: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Max Discount Cap (₹, optional)</label>
                    <input
                      type="number"
                      min="0"
                      value={couponForm.maxDiscountAmount}
                      onChange={(e) =>
                        setCouponForm({
                          ...couponForm,
                          maxDiscountAmount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setCouponModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Coupon Code
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
