import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Award, Zap } from "lucide-react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroBanner from "../components/home/HeroBanner";
import CategoryGrid from "../components/home/CategoryGrid";
import PromoBanner from "../components/home/PromoBanner";
import Newsletter from "../components/home/Newsletter";
import ProductCard from "../components/common/ProductCard";
import LoadingSkeleton from "../components/common/LoadingSkeleton";
import api from "../services/api";

const SAMPLE_FEATURED = [
  {
    _id: "sn-prod-01",
    name: "Sony WH-1000XM5 Noise Cancelling Wireless Headphones",
    category: "Electronics",
    brand: "Sony",
    price: 29990,
    discountPrice: 24990,
    stock: 14,
    ratings: 4.9,
    numReviews: 320,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700",
  },
  {
    _id: "sn-prod-02",
    name: "Nike Air Max 270 React Athletic Sneakers",
    category: "Footwear",
    brand: "Nike",
    price: 12995,
    discountPrice: 8995,
    stock: 9,
    ratings: 4.8,
    numReviews: 195,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=700",
  },
  {
    _id: "sn-prod-03",
    name: "Fossil Minimalist Chronograph Leather Watch",
    category: "Accessories",
    brand: "Fossil",
    price: 11495,
    discountPrice: 6995,
    stock: 18,
    ratings: 4.6,
    numReviews: 88,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700",
  },
  {
    _id: "sn-prod-04",
    name: "Herschel Classic Everyday Travel Backpack 24L",
    category: "Accessories",
    brand: "Herschel",
    price: 5499,
    discountPrice: 3899,
    stock: 22,
    ratings: 4.7,
    numReviews: 142,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700",
  },
  {
    _id: "sn-prod-05",
    name: "Apple Watch Series 9 GPS 45mm Midnight Aluminum",
    category: "Electronics",
    brand: "Apple",
    price: 44900,
    discountPrice: 39900,
    stock: 7,
    ratings: 4.9,
    numReviews: 410,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=700",
  },
  {
    _id: "sn-prod-06",
    name: "Ray-Ban Classic Polarized Aviator Sunglasses",
    category: "Accessories",
    brand: "Ray-Ban",
    price: 8990,
    discountPrice: 6490,
    stock: 15,
    ratings: 4.6,
    numReviews: 97,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=700",
  },
  {
    _id: "sn-prod-07",
    name: "Levi's Men's Trucker Denim Jacket Vintage Indigo",
    category: "Fashion",
    brand: "Levi's",
    price: 5999,
    discountPrice: 3999,
    stock: 11,
    ratings: 4.7,
    numReviews: 156,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=700",
  },
  {
    _id: "sn-prod-08",
    name: "Adidas Originals Stan Smith Classic Leather Shoes",
    category: "Footwear",
    brand: "Adidas",
    price: 7999,
    discountPrice: 5499,
    stock: 16,
    ratings: 4.8,
    numReviews: 234,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=700",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api
      .get("/products")
      .then((res) => {
        if (isMounted) {
          const list = Array.isArray(res.data)
            ? res.data
            : res.data?.products || [];
          if (list.length > 0) {
            setProducts(list);
          } else {
            setProducts(SAMPLE_FEATURED);
          }
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts(SAMPLE_FEATURED);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredList = products.slice(0, 8);

  const filteredByTab =
    activeTab === "all"
      ? featuredList
      : featuredList.filter(
          (p) =>
            (p.category || "").toLowerCase() === activeTab.toLowerCase()
        );

  return (
    <div className="shopnest">
      <Navbar />

      <main>
        {/* Hero Section */}
        <HeroBanner />

        {/* Shop By Category */}
        <CategoryGrid />

        {/* Featured Products Section */}
        <section className="featured-section section-container">
          <div className="section-header-row">
            <div>
              <span className="eyebrow">
                <Sparkles size={14} /> HANDPICKED COLLECTION
              </span>
              <h2 className="section-title">Trending &amp; Featured Products</h2>
              <p className="section-subtitle">
                Explore our highest rated products chosen by thousands of satisfied shoppers.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="filter-pill-group">
              <button
                className={`filter-pill ${activeTab === "all" ? "active" : ""}`}
                onClick={() => setActiveTab("all")}
              >
                All Picks
              </button>
              <button
                className={`filter-pill ${activeTab === "electronics" ? "active" : ""}`}
                onClick={() => setActiveTab("electronics")}
              >
                Electronics
              </button>
              <button
                className={`filter-pill ${activeTab === "footwear" ? "active" : ""}`}
                onClick={() => setActiveTab("footwear")}
              >
                Footwear
              </button>
              <button
                className={`filter-pill ${activeTab === "accessories" ? "active" : ""}`}
                onClick={() => setActiveTab("accessories")}
              >
                Accessories
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton count={8} />
          ) : (
            <div className="product-grid">
              {filteredByTab.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}

          <div className="section-cta-wrap">
            <Link to="/shop" className="btn-outline btn-explore-more">
              Explore All Products in Catalog <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        {/* Promotional Banner */}
        <PromoBanner />

        {/* Best Sellers Strip */}
        <section className="bestsellers-section section-container">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                <Award size={14} /> SHOPPER FAVORITES
              </span>
              <h2 className="section-title">Best Sellers This Week</h2>
            </div>
            <Link to="/deals" className="text-link">
              View Special Offers <ArrowRight size={18} />
            </Link>
          </div>

          <div className="product-grid">
            {products.slice(2, 6).map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </section>

        {/* Newsletter Subscription */}
        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
