import React from "react";
import { Sparkles, Truck } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="announcement-content">
        <span className="announcement-tag">
          <Sparkles size={13} /> FESTIVE SALE
        </span>
        <span className="announcement-text">
          UP TO 50% OFF ON POPULAR ELECTRONICS & FASHION | FREE EXPRESS DELIVERY ON ORDERS OVER ₹999
        </span>
        <span className="announcement-coupon">
          USE CODE: <strong>SAVE10</strong>
        </span>
      </div>
    </div>
  );
}
