import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Truck,
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Banknote,
  AlertCircle,
  ShoppingBag,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, shipping, discount, grandTotal, coupon, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [step, setStep] = useState(1); // 1: Address, 2: Payment & Review
  const [paymentMethod, setPaymentMethod] = useState("COD"); // 'COD' or 'Razorpay'

  // Address Form State
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    addressLine: "",
    city: "",
    state: "Maharashtra",
    postalCode: "",
    country: "India",
  });

  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [busy, setBusy] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Populate address if user has saved addresses
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setSelectedSavedAddress(defaultAddr._id);
      setAddressForm({
        fullName: defaultAddr.fullName,
        phone: defaultAddr.phone,
        addressLine: defaultAddr.addressLine,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode,
        country: defaultAddr.country || "India",
      });
    } else if (user) {
      setAddressForm((prev) => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
      }));
    }
  }, [user]);

  const handleSelectSavedAddress = (addr) => {
    setSelectedSavedAddress(addr._id);
    setUseNewAddress(false);
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine: addr.addressLine,
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      country: addr.country || "India",
    });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine || !addressForm.city || !addressForm.postalCode) {
      setErrorMessage("Please fill in all required shipping address fields.");
      return;
    }

    if (addressForm.postalCode.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit postal PIN code.");
      return;
    }

    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setErrorMessage("");
    setBusy(true);

    try {
      // 1. Send Order to Backend
      const orderPayload = {
        orderItems: items.map((i) => ({
          product: i._id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
        })),
        shippingAddress: addressForm,
        paymentMethod,
        customerInfo: {
          name: addressForm.fullName,
          email: user?.email || "guest@shopnest.com",
          phone: addressForm.phone,
        },
        couponCode: coupon?.code || null,
      };

      const res = await api.post("/orders", orderPayload);

      if (!res.data.success) {
        throw new Error(res.data.message || "Could not place order");
      }

      const createdOrder = res.data.order;

      // 2. If Razorpay chosen, initiate test payment verification
      if (paymentMethod === "Razorpay") {
        const paymentRes = await api.post("/payments/create-order", {
          orderId: createdOrder._id,
        });

        if (paymentRes.data.success) {
          // Verify Razorpay Order (supports simulation in development mode)
          const verifyRes = await api.post("/payments/verify", {
            orderId: createdOrder._id,
            razorpay_order_id: paymentRes.data.razorpayOrder.id,
            razorpay_payment_id: `pay_test_${Date.now()}`,
            razorpay_signature: "mock_signature_verified",
            isMock: !paymentRes.data.isLiveGateway,
          });

          if (verifyRes.data.success) {
            clearCart();
            setOrderSuccess(verifyRes.data.order);
            return;
          }
        }
      }

      // COD or standard successful completion
      clearCart();
      setOrderSuccess(createdOrder);
    } catch (err) {
      console.error("Order submission failure:", err);
      setErrorMessage(
        err.response?.data?.message ||
          err.message ||
          "Failed to process your order. Please check that server and MongoDB are running."
      );
    } finally {
      setBusy(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <div className="shopnest">
        <Navbar />
        <main className="section-container checkout-success-container">
          <div className="order-success-card">
            <div className="success-icon-wrap">
              <CheckCircle size={56} className="success-icon" />
            </div>
            <h1>Thank You for Your Order!</h1>
            <p className="order-confirmed-msg">
              Your order has been placed and is being prepared with utmost care.
            </p>

            <div className="order-details-box">
              <div className="detail-item">
                <span className="label">Order Reference:</span>
                <strong className="val order-id-highlight">
                  {orderSuccess.orderId || orderSuccess._id}
                </strong>
              </div>
              <div className="detail-item">
                <span className="label">Payment Status:</span>
                <strong className="val">
                  {orderSuccess.isPaid ? "Paid Online (Razorpay)" : "Pending (Cash on Delivery)"}
                </strong>
              </div>
              <div className="detail-item">
                <span className="label">Total Paid / Due:</span>
                <strong className="val">
                  ₹{Number(orderSuccess.totalPrice).toLocaleString("en-IN")}
                </strong>
              </div>
              <div className="detail-item">
                <span className="label">Delivering To:</span>
                <span className="val address-preview">
                  {orderSuccess.shippingAddress?.fullName},{" "}
                  {orderSuccess.shippingAddress?.addressLine},{" "}
                  {orderSuccess.shippingAddress?.city} -{" "}
                  {orderSuccess.shippingAddress?.postalCode}
                </span>
              </div>
            </div>

            <div className="success-buttons">
              <Link to="/orders" className="btn-primary">
                View My Orders <ArrowRight size={18} />
              </Link>
              <Link to="/shop" className="btn-outline">
                Continue Shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="shopnest">
        <Navbar />
        <div className="section-container empty-state">
          <ShoppingBag size={48} />
          <h2>Your cart is empty</h2>
          <p>Add some products before proceeding to checkout.</p>
          <Link to="/shop" className="btn-primary">
            Explore Shop
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="shopnest">
      {/* Checkout Navbar */}
      <header className="checkout-top-bar">
        <div className="section-container checkout-bar-inner">
          <Link to="/" className="brand-logo">
            shop<span className="brand-accent">nest</span>.
          </Link>
          <div className="secure-badge">
            <ShieldCheck size={18} />
            <span>256-bit Encrypted Checkout</span>
          </div>
        </div>
      </header>

      <main className="section-container checkout-main-container">
        {/* Step Indicator */}
        <div className="checkout-steps-bar">
          <div className={`step-badge ${step >= 1 ? "active" : ""}`}>
            <span className="step-num">1</span>
            <span className="step-name">Delivery Address</span>
          </div>
          <div className="step-connector"></div>
          <div className={`step-badge ${step >= 2 ? "active" : ""}`}>
            <span className="step-num">2</span>
            <span className="step-name">Payment &amp; Review</span>
          </div>
        </div>

        {errorMessage && (
          <div className="alert-box error checkout-error">
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="checkout-content-grid">
          {/* Main Form Area */}
          <div className="checkout-form-column">
            {step === 1 ? (
              <div className="checkout-step-card">
                <h2>1. Delivery Address</h2>

                {/* Saved addresses selector */}
                {user?.addresses && user.addresses.length > 0 && !useNewAddress && (
                  <div className="saved-addresses-list">
                    <h4>Select Saved Address:</h4>
                    {user.addresses.map((addr) => (
                      <div
                        key={addr._id}
                        className={`saved-addr-card ${selectedSavedAddress === addr._id ? "selected" : ""}`}
                        onClick={() => handleSelectSavedAddress(addr)}
                      >
                        <div className="addr-header">
                          <strong>{addr.fullName}</strong>
                          <span>{addr.phone}</span>
                        </div>
                        <p>{addr.addressLine}, {addr.city}, {addr.state} - {addr.postalCode}</p>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-add-new-addr"
                      onClick={() => setUseNewAddress(true)}
                    >
                      <Plus size={16} /> Enter a different address
                    </button>
                  </div>
                )}

                {/* Address Form */}
                {(!user?.addresses || user.addresses.length === 0 || useNewAddress) && (
                  <form onSubmit={handleAddressSubmit} className="checkout-form">
                    {useNewAddress && (
                      <button
                        type="button"
                        className="btn-text"
                        onClick={() => setUseNewAddress(false)}
                      >
                        ← Back to saved addresses
                      </button>
                    )}

                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.fullName}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, fullName: e.target.value })
                          }
                          placeholder="e.g. John Doe"
                        />
                      </div>

                      <div className="form-group">
                        <label>Phone Number (10 digits) *</label>
                        <input
                          type="tel"
                          required
                          pattern="[0-9]{10}"
                          value={addressForm.phone}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, phone: e.target.value })
                          }
                          placeholder="9876543210"
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Address (House No, Building, Street, Area) *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.addressLine}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, addressLine: e.target.value })
                          }
                          placeholder="Flat 101, Palm Avenue, MG Road"
                        />
                      </div>

                      <div className="form-group">
                        <label>City / Town *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.city}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, city: e.target.value })
                          }
                          placeholder="Mumbai"
                        />
                      </div>

                      <div className="form-group">
                        <label>State *</label>
                        <input
                          type="text"
                          required
                          value={addressForm.state}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, state: e.target.value })
                          }
                          placeholder="Maharashtra"
                        />
                      </div>

                      <div className="form-group">
                        <label>6-Digit PIN Code *</label>
                        <input
                          type="text"
                          required
                          pattern="[0-9]{6}"
                          maxLength={6}
                          value={addressForm.postalCode}
                          onChange={(e) =>
                            setAddressForm({ ...addressForm, postalCode: e.target.value })
                          }
                          placeholder="400001"
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary btn-step-continue">
                      Continue to Payment <ArrowRight size={18} />
                    </button>
                  </form>
                )}

                {user?.addresses && user.addresses.length > 0 && !useNewAddress && (
                  <button
                    type="button"
                    className="btn-primary btn-step-continue"
                    onClick={() => setStep(2)}
                  >
                    Deliver to this Address <ArrowRight size={18} />
                  </button>
                )}
              </div>
            ) : (
              /* Step 2: Payment & Review */
              <div className="checkout-step-card">
                <button className="btn-back-step" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Edit Delivery Address
                </button>

                <h2>2. Select Payment Method</h2>

                <div className="payment-options-grid">
                  <label
                    className={`payment-option-card ${paymentMethod === "COD" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                    />
                    <div className="option-icon">
                      <Banknote size={24} />
                    </div>
                    <div className="option-text">
                      <strong>Cash on Delivery (COD)</strong>
                      <p>Pay in cash or UPI upon delivery at your doorstep.</p>
                    </div>
                  </label>

                  <label
                    className={`payment-option-card ${paymentMethod === "Razorpay" ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Razorpay"
                      checked={paymentMethod === "Razorpay"}
                      onChange={() => setPaymentMethod("Razorpay")}
                    />
                    <div className="option-icon">
                      <CreditCard size={24} />
                    </div>
                    <div className="option-text">
                      <strong>Online Payment (Razorpay Test Mode)</strong>
                      <p>Supports Cards, UPI, NetBanking with cryptographic server verification.</p>
                    </div>
                  </label>
                </div>

                <div className="place-order-cta-box">
                  <button
                    className="btn-primary btn-confirm-order"
                    onClick={handlePlaceOrder}
                    disabled={busy}
                  >
                    {busy
                      ? "Processing Your Order..."
                      : `Confirm & Place Order · ₹${grandTotal.toLocaleString("en-IN")}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Checkout Order Summary */}
          <aside className="checkout-sidebar-summary">
            <h3>Order Overview ({items.length} items)</h3>

            <div className="checkout-items-preview">
              {items.map((item) => (
                <div key={item._id} className="checkout-item-mini">
                  <img src={item.image} alt={item.name} />
                  <div className="item-mini-info">
                    <strong>{item.name}</strong>
                    <small>Qty: {item.quantity}</small>
                  </div>
                  <span className="item-mini-price">
                    ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-breakdown">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Coupon ({coupon?.code})</span>
                  <span>- ₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-total-row">
                <span>Grand Total</span>
                <span className="total-val">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
