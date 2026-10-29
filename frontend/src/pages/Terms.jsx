import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";

const Section = ({ title, children }) => (
  <div style={{ marginBottom: "2.5rem" }}>
    <h2 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "0.75rem", color: "var(--ink)" }}>{title}</h2>
    <div style={{ color: "var(--text-muted)", lineHeight: 1.8, fontSize: "0.95rem" }}>{children}</div>
  </div>
);

export default function Terms() {
  return (
    <div className="shopnest">
      <Navbar />
      <main style={{ minHeight: "60vh" }}>
        <div style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "2.5rem 0" }}>
          <div className="section-container">
            <nav className="breadcrumb" aria-label="breadcrumb">
              <Link to="/">Home</Link><span>/</span><span>Terms &amp; Conditions</span>
            </nav>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "0.5rem" }}>Terms &amp; Conditions</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Last updated: 1 January 2026</p>
          </div>
        </div>

        <div className="section-container" style={{ maxWidth: 800, padding: "3rem 1rem" }}>
          <Section title="1. Acceptance of Terms">
            By accessing or using ShopNest (the "Platform"), you agree to be bound by these Terms &amp; Conditions.
            If you do not agree, please do not use the Platform. ShopNest reserves the right to modify these
            terms at any time; continued use of the Platform constitutes acceptance of the updated terms.
          </Section>

          <Section title="2. Eligibility">
            You must be at least 18 years of age and capable of entering into a legally binding contract to
            use this Platform. By using ShopNest, you represent that you meet these requirements.
          </Section>

          <Section title="3. Account Responsibilities">
            <ul style={{ paddingLeft: "1.25rem" }}>
              <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
              <li>You agree to notify us immediately of any unauthorized use of your account.</li>
              <li>You must not share your account or allow others to access it on your behalf.</li>
            </ul>
          </Section>

          <Section title="4. Products & Pricing">
            <ul style={{ paddingLeft: "1.25rem" }}>
              <li>All prices are displayed in Indian Rupees (INR) and include applicable taxes unless stated otherwise.</li>
              <li>ShopNest reserves the right to modify prices without prior notice.</li>
              <li>Product images are for illustrative purposes; actual product appearance may vary slightly.</li>
              <li>Availability is subject to stock and may change without notice.</li>
            </ul>
          </Section>

          <Section title="5. Orders & Payments">
            Placing an order constitutes an offer to purchase a product. ShopNest reserves the right to refuse
            or cancel any order. Payments are processed by Razorpay and are subject to their terms. Orders are
            confirmed only after successful payment verification on the server.
          </Section>

          <Section title="6. Shipping & Delivery">
            Estimated delivery times are indicative and may vary due to location, weather, or logistics delays.
            Risk of loss and title pass to you upon delivery. Delivery charges (if any) are shown at checkout.
          </Section>

          <Section title="7. Returns & Refunds">
            You may return eligible items within 7 days of delivery in their original, unused condition with
            all packaging intact. Refunds are processed within 7–10 business days after the return is verified.
            Certain product categories (e.g., personal care, digital downloads) may be non-returnable.
          </Section>

          <Section title="8. Intellectual Property">
            All content on ShopNest — including logos, text, images, and software — is the property of
            ShopNest or its licensors and is protected by applicable intellectual property laws. You may not
            reproduce or redistribute any content without prior written permission.
          </Section>

          <Section title="9. Limitation of Liability">
            ShopNest shall not be liable for any indirect, incidental, or consequential damages arising from
            your use of the Platform. Our maximum liability shall not exceed the amount paid by you for the
            specific order giving rise to the claim.
          </Section>

          <Section title="10. Governing Law">
            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive
            jurisdiction of courts in Mumbai, Maharashtra.
          </Section>

          <Section title="11. Contact">
            For legal inquiries, contact us at <strong>legal@shopnest.example</strong>.
          </Section>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
            <Link to="/privacy-policy" style={{ color: "var(--accent)", marginRight: "1.5rem" }}>Privacy Policy</Link>
            <Link to="/contact" style={{ color: "var(--accent)" }}>Contact Us</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

