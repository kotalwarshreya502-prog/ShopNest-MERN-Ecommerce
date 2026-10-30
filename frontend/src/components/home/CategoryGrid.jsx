import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const CATEGORIES = [
  {
    name: "Mobiles",
    slug: "mobiles",
    description: "Apple iPhones, Samsung Galaxy & 5G Flagships",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&auto=format&fit=crop&q=80",
    itemCount: "8+ Products",
  },
  {
    name: "Laptops",
    slug: "laptops",
    description: "MacBooks, Dell XPS, ThinkPads & Gaming Rigs",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80",
    itemCount: "8+ Products",
  },
  {
    name: "Gaming",
    slug: "gaming",
    description: "PS5, Xbox, Razer Keyboards & Pro Controllers",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=600&auto=format&fit=crop&q=80",
    itemCount: "13+ Products",
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Denim Jackets, Oxford Shirts & Designer Wear",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80",
    itemCount: "28+ Products",
  },
  {
    name: "Footwear",
    slug: "footwear",
    description: "Air Jordans, Pegasus, Ultraboost & Formals",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
    itemCount: "21+ Products",
  },
  {
    name: "Watches",
    slug: "watches",
    description: "Apple Watch, G-Shock & Swiss Chronographs",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=80",
    itemCount: "11+ Products",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Noise-Canceling Audio, Ray-Bans & Backpacks",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    itemCount: "23+ Products",
  },
  {
    name: "Electronics",
    slug: "electronics",
    description: "Pro Audio, Cameras & Wireless Tech",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    itemCount: "6+ Products",
  },
  {
    name: "Home & Living",
    slug: "home-living",
    description: "Modern Furniture, Decor & Bedding",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&auto=format&fit=crop&q=80",
    itemCount: "13+ Products",
  },
  {
    name: "Kitchen Products",
    slug: "kitchen-products",
    description: "Air Fryers, Espresso & Cookware",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=600&auto=format&fit=crop&q=80",
    itemCount: "4+ Products",
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Facial Serums, Cleansers & Perfumes",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80",
    itemCount: "4+ Products",
  },
  {
    name: "Sports & Fitness",
    slug: "sports",
    description: "Yoga Mats, Dumbbells & Gear",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80",
    itemCount: "4+ Products",
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
            to={`/category/${cat.slug}`}
            className="category-card"
          >
            <div className="category-image-wrap">
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600";
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
