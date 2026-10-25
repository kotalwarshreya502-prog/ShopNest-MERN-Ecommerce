import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
  Percent,
  Flame,
} from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import ProductCard from "../components/common/ProductCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import api from "../services/api";

export default function Deals() {
  const [dealProducts, setDealProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .get("/products?limit=20")
      .then((res) => {
        if (isMounted) {
          const list = res.data.products || [];
          // Filter products with real discountPrice
          const discounted = list.filter(
            (p) => p.discountPrice && p.discountPrice < p.price
          );
          setDealProducts(discounted.length > 0 ? discounted : list.slice(0, 8));
        }
      })
      .catch((err) => console.warn(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="shopnest">
      <Navbar />

      <main className="section-container deals-page-container">
        {/* Deals Hero */}
        <div className="deals-hero-banner">
          <div className="deals-hero-content">
            <span className="eyebrow" style={{ color: "#f97316" }}>
              <Flame size={16} /> LIMITED TIME FLASH EVENT
            </span>
            <h1>Today's Steals &amp; Festive Offers</h1>
            <p>
              Exclusive reductions up to 50% on premium audio, athletic sneakers, and
              designer lifestyle accessories. Valid while stocks last.
            </p>

            {/* Countdown Timer */}
            <div className="deals-countdown-box">
              <span className="timer-label">
                <Clock size={16} /> Deal Ends In:
              </span>
              <div className="timer-digits">
                <div className="time-block">
                  <strong>{String(timeLeft.hours).padStart(2, "0")}</strong>
                  <small>Hours</small>
                </div>
                <span>:</span>
                <div className="time-block">
                  <strong>{String(timeLeft.minutes).padStart(2, "0")}</strong>
                  <small>Mins</small>
                </div>
                <span>:</span>
                <div className="time-block">
                  <strong>{String(timeLeft.seconds).padStart(2, "0")}</strong>
                  <small>Secs</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coupon Highlight Badges */}
        <section className="deals-coupons-strip">
          <div className="deal-coupon-card">
            <div className="coupon-card-left">
              <span className="coupon-badge">10% OFF</span>
              <strong>Code: SAVE10</strong>
              <small>On all orders above ₹999</small>
            </div>
            <button
              className="btn-copy-code"
              onClick={() => {
                navigator.clipboard.writeText("SAVE10");
                alert("Copied code SAVE10 to clipboard!");
              }}
            >
              Copy Code
            </button>
          </div>

          <div className="deal-coupon-card">
            <div className="coupon-card-left">
              <span className="coupon-badge" style={{ background: "#2563eb" }}>
                ₹500 OFF
              </span>
              <strong>Code: SHOP500</strong>
              <small>On electronics above ₹2,000</small>
            </div>
            <button
              className="btn-copy-code"
              onClick={() => {
                navigator.clipboard.writeText("SHOP500");
                alert("Copied code SHOP500 to clipboard!");
              }}
            >
              Copy Code
            </button>
          </div>

          <div className="deal-coupon-card">
            <div className="coupon-card-left">
              <span className="coupon-badge" style={{ background: "#7c3aed" }}>
                15% OFF
              </span>
              <strong>Code: FESTIVE50</strong>
              <small>Festive special on cart ≥ ₹1,500</small>
            </div>
            <button
              className="btn-copy-code"
              onClick={() => {
                navigator.clipboard.writeText("FESTIVE50");
                alert("Copied code FESTIVE50 to clipboard!");
              }}
            >
              Copy Code
            </button>
          </div>
        </section>

        {/* Discounted Products Grid */}
        <section className="deals-products-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                <Sparkles size={14} /> ACTIVE PROMOTIONS
              </span>
              <h2>Discounted Products in Stock</h2>
            </div>
            <Link to="/shop" className="text-link">
              View Entire Catalog <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="product-grid">
              {dealProducts.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
