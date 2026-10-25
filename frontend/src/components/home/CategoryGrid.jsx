import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Electronics",
    description: "Audio, Gadgets & Accessories",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    itemCount: "120+ Products",
  },
  {
    name: "Fashion",
    description: "Trending Apparel & Styles",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500",
    itemCount: "250+ Products",
  },
  {
    name: "Footwear",
    description: "Sneakers, Formals & Casuals",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500",
    itemCount: "95+ Products",
  },
  {
    name: "Accessories",
    description: "Watches, Bags & Eyewear",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    itemCount: "80+ Products",
  },
  {
    name: "Home & Living",
    description: "Modern Decor & Essentials",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=500",
    itemCount: "60+ Products",
  },
  {
    name: "Beauty",
    description: "Skincare, Fragrances & Care",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500",
    itemCount: "70+ Products",
  },
  {
    name: "Sports",
    description: "Fitness Gear & Athleisure",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500",
    itemCount: "45+ Products",
  },
  {
    name: "Books",
    description: "Bestsellers, Fiction & Tech",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500",
    itemCount: "110+ Products",
  },
];

export default function CategoryGrid() {
  return (
    <section className="category-section section-container">
      <div className="section-header">
        <div>
          <span className="eyebrow">EXPLORE BY DEPARTMENT</span>
          <h2 className="section-title">Shop by Category</h2>
        </div>
        <Link to="/shop" className="text-link">
          Browse all categories <ArrowRight size={18} />
        </Link>
      </div>

      <div className="category-grid">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.name}
            to={`/shop?category=${encodeURIComponent(cat.name)}`}
            className="category-card"
          >
            <div className="category-image-wrap">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500";
                }}
              />
              <div className="category-overlay">
                <span className="category-explore-btn">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </div>
            <div className="category-info">
              <h3>{cat.name}</h3>
              <p>{cat.description}</p>
              <small>{cat.itemCount}</small>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
