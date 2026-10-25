import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  RotateCcw,
  XCircle,
  ArrowRight,
  FileText,
  Printer,
  X,
  AlertCircle,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import api from "../services/api";

const STATUS_STEPS = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const fetchOrders = () => {
    setLoading(true);
    api
      .get("/orders/my-orders")
      .then((res) => {
        setOrders(res.data.orders || []);
      })
      .catch((err) => {
        console.warn("Failed to fetch orders:", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelSubmit = async (e) => {
    e.preventDefault();
    if (!cancelModalOrder) return;

    setCancelling(true);
    try {
      const res = await api.patch(`/orders/${cancelModalOrder._id}/cancel`, {
        reason: cancelReason || "Cancelled by customer request",
      });

      if (res.data.success) {
        setCancelModalOrder(null);
        setCancelReason("");
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Delivered":
        return "badge-delivered";
      case "Shipped":
        return "badge-shipped";
      case "Processing":
      case "Confirmed":
        return "badge-processing";
      case "Cancelled":
        return "badge-cancelled";
      default:
        return "badge-pending";
    }
  };

  return (
    <div className="shopnest">
      <Navbar />

      <main className="section-container orders-page-container">
        <div className="page-heading">
          <span className="eyebrow">PURCHASE HISTORY</span>
          <h1>My Orders</h1>
          <p>Track shipment status, download invoices, or manage recent orders.</p>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading your orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon-wrap">
              <Package size={48} />
            </div>
            <h2>No orders placed yet</h2>
            <p>Discover our top picks and place your first order today!</p>
            <Link to="/shop" className="btn-primary">
              Explore Catalog <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="orders-cards-list">
            {orders.map((order) => {
              const currentStepIndex = STATUS_STEPS.indexOf(order.status);
              const isEligibleForCancel =
                order.status === "Pending" || order.status === "Confirmed";

              return (
                <article key={order._id} className="order-main-card">
                  {/* Order Card Header */}
                  <div className="order-header-row">
                    <div className="order-meta-info">
                      <div>
                        <span className="label">ORDER ID</span>
                        <strong className="val">{order.orderId || order._id}</strong>
                      </div>
                      <div>
                        <span className="label">ORDER PLACED</span>
                        <span className="val">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div>
                        <span className="label">TOTAL AMOUNT</span>
                        <strong className="val">
                          ₹{Number(order.totalPrice).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    </div>

                    <div className="order-status-badge-wrap">
                      <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {order.status !== "Cancelled" && currentStepIndex >= 0 && (
                    <div className="order-timeline-strip">
                      {STATUS_STEPS.map((s, idx) => (
                        <div
                          key={s}
                          className={`timeline-node ${idx <= currentStepIndex ? "completed" : ""}`}
                        >
                          <div className="node-indicator">
                            {idx <= currentStepIndex ? <CheckCircle size={14} /> : idx + 1}
                          </div>
                          <span className="node-label">{s}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {order.status === "Cancelled" && (
                    <div className="cancelled-banner">
                      <XCircle size={18} />
                      <span>Order was cancelled. Reason: {order.cancelReason || "Customer request"}</span>
                    </div>
                  )}

                  {/* Items List */}
                  <div className="order-items-grid">
                    {(order.orderItems || []).map((item, idx) => (
                      <div key={idx} className="order-item-snippet">
                        <img
                          src={
                            item.image ||
                            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200"
                          }
                          alt={item.name}
                        />
                        <div className="snippet-info">
                          <Link
                            to={`/product/${item.product?._id || item.product}`}
                            className="snippet-name"
                          >
                            {item.name}
                          </Link>
                          <span className="snippet-qty-price">
                            Qty: {item.quantity} · ₹{Number(item.price).toLocaleString("en-IN")} each
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer & Actions */}
                  <div className="order-footer-row">
                    <div className="order-shipping-summary">
                      <span className="label">Delivery Destination:</span>
                      <p>
                        {order.shippingAddress?.fullName}, {order.shippingAddress?.city} -{" "}
                        {order.shippingAddress?.postalCode}
                      </p>
                    </div>

                    <div className="order-actions-buttons">
                      <button
                        className="btn-invoice"
                        onClick={() => setInvoiceOrder(order)}
                      >
                        <FileText size={16} /> View Invoice
                      </button>

                      {isEligibleForCancel && (
                        <button
                          className="btn-cancel-order"
                          onClick={() => setCancelModalOrder(order)}
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Cancellation Modal */}
        {cancelModalOrder && (
          <div className="modal-backdrop" onClick={() => setCancelModalOrder(null)}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Cancel Order #{cancelModalOrder.orderId || cancelModalOrder._id}</h3>
                <button
                  className="modal-close-btn"
                  onClick={() => setCancelModalOrder(null)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCancelSubmit} className="cancel-order-form">
                <p>
                  Are you sure you want to cancel this order? This action will return items
                  to store inventory.
                </p>

                <div className="form-group">
                  <label>Cancellation Reason:</label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                  >
                    <option value="">Select a reason...</option>
                    <option value="Changed my mind">Changed my mind</option>
                    <option value="Found a better price elsewhere">
                      Found a better price elsewhere
                    </option>
                    <option value="Ordered by mistake">Ordered by mistake</option>
                    <option value="Delivery time is too long">Delivery time is too long</option>
                    <option value="Incorrect shipping address entered">
                      Incorrect shipping address entered
                    </option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setCancelModalOrder(null)}
                  >
                    Keep Order
                  </button>
                  <button
                    type="submit"
                    className="btn-danger"
                    disabled={cancelling}
                  >
                    {cancelling ? "Processing..." : "Confirm Cancellation"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Invoice Modal */}
        {invoiceOrder && (
          <div className="modal-backdrop" onClick={() => setInvoiceOrder(null)}>
            <div
              className="modal-window invoice-modal"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Order Invoice</h3>
                <div className="invoice-header-actions">
                  <button
                    className="btn-print"
                    onClick={() => window.print()}
                    title="Print Invoice"
                  >
                    <Printer size={16} /> Print
                  </button>
                  <button
                    className="modal-close-btn"
                    onClick={() => setInvoiceOrder(null)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="invoice-body printable">
                <div className="invoice-top">
                  <div>
                    <h2 className="brand-logo">
                      shop<span className="brand-accent">nest</span>.
                    </h2>
                    <p>Official Tax Invoice / Receipt</p>
                  </div>
                  <div className="invoice-meta-right">
                    <strong>Invoice #: {invoiceOrder.orderId || invoiceOrder._id}</strong>
                    <span>Date: {new Date(invoiceOrder.createdAt).toLocaleDateString("en-IN")}</span>
                    <span>Status: {invoiceOrder.status}</span>
                  </div>
                </div>

                <div className="invoice-address-grid">
                  <div>
                    <strong>Billed / Shipped To:</strong>
                    <p>{invoiceOrder.shippingAddress?.fullName}</p>
                    <p>{invoiceOrder.shippingAddress?.addressLine}</p>
                    <p>
                      {invoiceOrder.shippingAddress?.city},{" "}
                      {invoiceOrder.shippingAddress?.state} -{" "}
                      {invoiceOrder.shippingAddress?.postalCode}
                    </p>
                    <p>Phone: {invoiceOrder.shippingAddress?.phone}</p>
                  </div>
                  <div>
                    <strong>Payment Information:</strong>
                    <p>Method: {invoiceOrder.paymentMethod}</p>
                    <p>Payment Status: {invoiceOrder.isPaid ? "Paid" : "Pending (COD)"}</p>
                  </div>
                </div>

                <table className="invoice-items-table">
                  <thead>
                    <tr>
                      <th>Item Description</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(invoiceOrder.orderItems || []).map((it, idx) => (
                      <tr key={idx}>
                        <td>{it.name}</td>
                        <td>{it.quantity}</td>
                        <td>₹{Number(it.price).toLocaleString("en-IN")}</td>
                        <td>₹{(Number(it.price) * it.quantity).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="invoice-totals-col">
                  <div>
                    <span>Items Subtotal:</span>
                    <span>₹{Number(invoiceOrder.itemsPrice).toLocaleString("en-IN")}</span>
                  </div>
                  <div>
                    <span>Shipping Charges:</span>
                    <span>
                      {invoiceOrder.shippingPrice === 0
                        ? "FREE"
                        : `₹${invoiceOrder.shippingPrice}`}
                    </span>
                  </div>
                  {invoiceOrder.discountPrice > 0 && (
                    <div>
                      <span>Discount ({invoiceOrder.couponApplied}):</span>
                      <span>- ₹{Number(invoiceOrder.discountPrice).toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="invoice-grand-total">
                    <strong>Grand Total:</strong>
                    <strong>₹{Number(invoiceOrder.totalPrice).toLocaleString("en-IN")}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
