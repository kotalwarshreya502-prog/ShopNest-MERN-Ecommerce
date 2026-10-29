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

export default function PrivacyPolicy() {
  return (
    <div className="shopnest">
      <Navbar />
      <main style={{ minHeight: "60vh" }}>
        <div style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)", padding: "2.5rem 0" }}>
          <div className="section-container">
            <nav className="breadcrumb" aria-label="breadcrumb">
              <Link to="/">Home</Link><span>/</span><span>Privacy Policy</span>
            </nav>
            <h1 style={{ fontSize: "2.2rem", fontWeight: 800, marginTop: "0.5rem" }}>Privacy Policy</h1>
            <p style={{ color: "var(--text-muted)", marginTop: "0.5rem" }}>Last updated: 1 January 2026</p>
          </div>
        </div>

        <div className="section-container" style={{ maxWidth: 800, padding: "3rem 1rem" }}>
          <Section title="1. Introduction">
            ShopNest ("we", "us", or "our") is committed to protecting your personal information. This Privacy Policy
            explains what data we collect, how we use it, and your rights as a data subject.
          </Section>

          <Section title="2. Information We Collect">
            <ul style={{ paddingLeft: "1.25rem" }}>
              <li><strong>Account data</strong>: name, email address, phone number, and hashed password.</li>
              <li><strong>Address data</strong>: delivery addresses you save to your account.</li>
              <li><strong>Transaction data</strong>: order details, items purchased, payment status.</li>
              <li><strong>Usage data</strong>: pages visited, search queries, device/browser type, IP address.</li>
              <li><strong>Communications</strong>: messages sent to our support team.</li>
            </ul>
          </Section>

          <Section title="3. How We Use Your Information">
            <ul style={{ paddingLeft: "1.25rem" }}>
              <li>To process and fulfil your orders.</li>
              <li>To provide customer support and respond to queries.</li>
              <li>To send order confirmations, shipping updates, and promotional emails (with your consent).</li>
              <li>To improve our platform and personalise your shopping experience.</li>
              <li>To detect and prevent fraud and unauthorised access.</li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            We use industry-standard measures including bcrypt password hashing, JWT tokens, HTTPS encryption, and
            role-based access control to protect your personal data. Payment processing is handled by Razorpay,
            which is PCI-DSS compliant. We do not store card numbers or CVVs.
          </Section>

          <Section title="5. Cookies">
            We use essential cookies for authentication and session management. We may use analytics cookies (with
            your consent) to understand how visitors use our platform and improve the user experience.
          </Section>

          <Section title="6. Third-Party Services">
            ShopNest uses third-party services including MongoDB Atlas (database), Cloudinary (image storage),
            and Razorpay (payments). Each service has its own Privacy Policy and data handling practices.
          </Section>

          <Section title="7. Your Rights">
            You have the right to access, correct, or delete your personal data. To submit a request, contact
            us at <strong>privacy@shopnest.example</strong>. We will respond within 30 days.
          </Section>

          <Section title="8. Data Retention">
            We retain your account and order data for as long as your account is active or as required by
            applicable law. You may request account deletion at any time from your Profile settings.
          </Section>

          <Section title="9. Contact">
            For privacy-related queries, email us at <strong>privacy@shopnest.example</strong> or write to
            ShopNest, Mumbai, Maharashtra, India.
          </Section>

          <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", marginTop: "1rem" }}>
            <Link to="/terms" style={{ color: "var(--accent)", marginRight: "1.5rem" }}>Terms &amp; Conditions</Link>
            <Link to="/contact" style={{ color: "var(--accent)" }}>Contact Us</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

