import React from "react";

export default function LoadingSkeleton({ count = 8 }) {
  return (
    <div className="product-grid skeleton-grid">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="skeleton-card">
          <div className="skeleton-image pulse"></div>
          <div className="skeleton-content">
            <div className="skeleton-line short pulse"></div>
            <div className="skeleton-line pulse"></div>
            <div className="skeleton-line medium pulse"></div>
            <div className="skeleton-line price pulse"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
