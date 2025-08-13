import React from "react";
import "../template/AboutUs.css";
import "../template/AboutUsResponsive.css";

const PrivacyPolicy = () => {
  return (
    <div className="introduction">
      <h2>Privacy Policy</h2>

      <div className="intro">
        <p>
          UrbanGaze cares about your privacy. This policy explains what information we collect, how we use it, and how we protect it.
        </p>

        <h3 style={{textAlign:"center"}}>1. What We Collect</h3>
        <ul>
          <li>Personal info: Name, email, address, phone number</li>
          <li>Login credentials (securely encrypted)</li>
          <li>Payment info (handled by trusted providers)</li>
          <li>Browsing and usage activity</li>
          <li>Device data: IP address, browser, location</li>
        </ul>

        <h3 style={{textAlign:"center"}}>2. How We Use It</h3>
        <ul>
          <li>To deliver your orders and provide support</li>
          <li>To improve our website and your experience</li>
          <li>To personalize product suggestions</li>
          <li>To send updates (if subscribed)</li>
          <li>To detect fraud and secure your account</li>
        </ul>

        <h3 style={{textAlign:"center"}}>3. Cookies & Tracking</h3>
        <p>We use cookies to:</p>
        <ul>
          <li>Save your cart and wishlist</li>
          <li>Keep you logged in</li>
          <li>Track website usage (Google Analytics, etc.)</li>
        </ul>

        <h3 style={{textAlign:"center"}}>4. Data Security</h3>
        <ul>
          <li>Secure connections (HTTPS)</li>
          <li>Encrypted passwords</li>
          <li>Trusted payment gateways</li>
          <li>Limited staff access</li>
        </ul>

        <h3 style={{textAlign:"center"}}>5. Your Rights</h3>
        <ul>
          <li>Access or update your information</li>
          <li>Request deletion of your data</li>
          <li>Opt out of promotional emails</li>
        </ul>

        <p>
          For any privacy requests, contact us at:{" "}
          <a href="mailto:privacy@urbangaze.com">privacy@urbangaze.com</a>
        </p>

        <h3 style={{textAlign:"center"}}>6. Updates</h3>
        <p>
          We may update this policy from time to time. If major changes occur, we will notify you via our website or email.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
