import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Heart,
  LogOut,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser, logout, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' or 'addresses'

  // Profile Form
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [password, setPassword] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [updating, setUpdating] = useState(false);

  // Address Form
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    addressLine: "",
    city: "",
    state: "Maharashtra",
    postalCode: "",
    country: "India",
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const [addressError, setAddressError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileSuccess("");
    setProfileError("");
    setUpdating(true);

    try {
      const res = await api.put("/auth/profile", {
        name,
        phone,
        ...(password ? { password } : {}),
      });

      if (res.data.success) {
        updateUser(res.data.user);
        setProfileSuccess("Profile updated successfully!");
        setPassword("");
      }
    } catch (err) {
      setProfileError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setAddressError("");
    setAddressLoading(true);

    try {
      const res = await api.post("/auth/address", newAddress);
      if (res.data.success) {
        updateUser({ addresses: res.data.addresses });
        setShowAddAddressModal(false);
        setNewAddress({
          fullName: user?.name || "",
          phone: user?.phone || "",
          addressLine: "",
          city: "",
          state: "Maharashtra",
          postalCode: "",
          country: "India",
        });
      }
    } catch (err) {
      setAddressError(err.response?.data?.message || "Failed to add address");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to remove this address?")) return;
    try {
      const res = await api.delete(`/auth/address/${addressId}`);
      if (res.data.success) {
        updateUser({ addresses: res.data.addresses });
      }
    } catch (err) {
      alert("Failed to delete address");
    }
  };

  return (
    <div className="shopnest">
      <Navbar />

      <main className="section-container profile-page-container">
        <div className="page-heading">
          <span className="eyebrow">CUSTOMER ACCOUNT</span>
          <h1>My Profile &amp; Settings</h1>
          <p>Manage your account credentials, delivery addresses, and personal preferences.</p>
        </div>

        <div className="profile-layout-grid">
          {/* Sidebar */}
          <aside className="profile-nav-sidebar">
            <div className="profile-user-summary">
              <div className="avatar-circle">
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </div>
              <div className="user-details-mini">
                <strong>{user?.name || "Shopper"}</strong>
                <span>{user?.email || "guest@shopnest.com"}</span>
                {isAdmin && (
                  <span className="badge-admin-role">
                    <Shield size={12} /> Administrator
                  </span>
                )}
              </div>
            </div>

            <div className="profile-links-group">
              <button
                className={`profile-nav-btn ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={18} /> Personal Details
              </button>

              <button
                className={`profile-nav-btn ${activeTab === "addresses" ? "active" : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                <MapPin size={18} /> Saved Addresses (
                {user?.addresses ? user.addresses.length : 0})
              </button>

              <Link to="/orders" className="profile-nav-btn">
                <Package size={18} /> Order History
              </Link>

              <Link to="/wishlist" className="profile-nav-btn">
                <Heart size={18} /> Saved Wishlist ({wishlistCount})
              </Link>

              {isAdmin && (
                <Link to="/admin" className="profile-nav-btn admin-highlight">
                  <Shield size={18} /> Admin Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="profile-nav-btn logout"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </aside>

          {/* Main Tab Content */}
          <section className="profile-main-content">
            {activeTab === "profile" && (
              <div className="profile-card">
                <h2>Account Information</h2>
                <p className="card-subtitle">
                  Update your contact details and security credentials.
                </p>

                {profileSuccess && (
                  <div className="alert-box success">
                    <CheckCircle size={16} /> <span>{profileSuccess}</span>
                  </div>
                )}
                {profileError && (
                  <div className="alert-box error">
                    <AlertCircle size={16} /> <span>{profileError}</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="profile-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <div className="input-with-icon">
                      <User size={18} className="input-icon" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email Address (Primary)</label>
                    <div className="input-with-icon">
                      <Mail size={18} className="input-icon" />
                      <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className="disabled-input"
                      />
                    </div>
                    <small className="field-hint">Email address cannot be modified.</small>
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <div className="input-with-icon">
                      <Phone size={18} className="input-icon" />
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Change Password (leave blank to keep current)</label>
                    <input
                      type="password"
                      placeholder="Enter new password (at least 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary btn-save-profile"
                    disabled={updating}
                  >
                    {updating ? "Saving Changes..." : "Save Profile"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className="profile-card">
                <div className="card-header-with-btn">
                  <div>
                    <h2>Saved Delivery Addresses</h2>
                    <p className="card-subtitle">
                      Manage multiple shipping locations for instant checkout.
                    </p>
                  </div>
                  <button
                    className="btn-primary btn-sm"
                    onClick={() => setShowAddAddressModal(true)}
                  >
                    <Plus size={16} /> Add New Address
                  </button>
                </div>

                {(!user?.addresses || user.addresses.length === 0) ? (
                  <div className="empty-sub-state">
                    <MapPin size={36} />
                    <p>No addresses saved yet. Add one to speed up checkout.</p>
                  </div>
                ) : (
                  <div className="addresses-grid">
                    {user.addresses.map((addr) => (
                      <div key={addr._id} className="address-box-card">
                        <div className="addr-top">
                          <strong>{addr.fullName}</strong>
                          {addr.isDefault && (
                            <span className="default-pill">Default</span>
                          )}
                        </div>
                        <p className="addr-phone">Phone: {addr.phone}</p>
                        <p className="addr-text">
                          {addr.addressLine}, {addr.city}, {addr.state} -{" "}
                          {addr.postalCode}
                        </p>
                        <div className="addr-actions">
                          <button
                            className="btn-delete-addr"
                            onClick={() => handleDeleteAddress(addr._id)}
                          >
                            <Trash2 size={15} /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Add Address Modal */}
        {showAddAddressModal && (
          <div
            className="modal-backdrop"
            onClick={() => setShowAddAddressModal(false)}
          >
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Delivery Address</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setShowAddAddressModal(false)}
                >
                  ✕
                </button>
              </div>

              {addressError && (
                <div className="alert-box error">
                  <AlertCircle size={16} /> <span>{addressError}</span>
                </div>
              )}

              <form onSubmit={handleAddAddress} className="add-address-form">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.fullName}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, phone: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Address (House / Street / Area) *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.addressLine}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, addressLine: e.target.value })
                    }
                  />
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>PIN Code *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    value={newAddress.postalCode}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, postalCode: e.target.value })
                    }
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setShowAddAddressModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={addressLoading}
                  >
                    {addressLoading ? "Saving..." : "Save Address"}
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
