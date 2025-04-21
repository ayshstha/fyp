import React, { useState } from "react";
import "./Donation.css"; // Import the CSS file
const KhaltiPayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState("");
  const token = localStorage.getItem("Token");

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      // Validate amount
      const donationAmount = parseInt(amount);
      if (!donationAmount || donationAmount < 10) {
        throw new Error("Please enter a valid amount (minimum Rs. 10)");
      }

      const response = await fetch("http://127.0.0.1:8000/khalti-verify/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          return_url: window.location.origin + "/home", // Redirect to home after success

          website_url: window.location.origin,
          amount: donationAmount * 100, // Convert to paisa
          purchase_order_id: "order_" + Date.now(),
          purchase_order_name: "Donation",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Payment initiation failed");
      }

      const data = await response.json();
      if (data.payment_url) {
        window.location.href = data.payment_url;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
      console.error("Payment error:", err);
    }
  };

    return (
    <div className="donation-container">
      <div className="hero-section">
        <h1>
          <span className="paw-icon">🐾</span> Help Street Dogs Thrive
          <span className="heart-icon">❤️</span>
        </h1>
        <p className="hero-text">
          Every rupee you donate helps provide food, shelter, and medical care 
          for street dogs in need. Together, we can make a difference!
        </p>
      </div>

      <div className="content-wrapper">
        <div className="impact-section">
          <h2>Your Impact Matters</h2>
          <div className="impact-grid">
            <div className="impact-card">
              <div className="icon">🍗</div>
              <h3>Daily Meals</h3>
              <p>Rs.50 feeds a dog for a day</p>
            </div>
            <div className="impact-card">
              <div className="icon">💉</div>
              <h3>Vaccinations</h3>
              <p>Rs.500 covers vital vaccines</p>
            </div>
            <div className="impact-card">
              <div className="icon">🏥</div>
              <h3>Medical Care</h3>
              <p>Rs.1500 funds emergency treatment</p>
            </div>
          </div>
        </div>

        <div className="donation-form">
          <h2 className="form-title">Make a Life-changing Donation</h2>
          <p className="form-subtitle">
            "No act of kindness, no matter how small, is ever wasted." - Aesop
          </p>

          <div className="input-group">
            <label htmlFor="amount">Donation Amount (Rs.)</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter amount here"
              min="10"
              step="10"
            />
          </div>

          <button
            onClick={handlePayment}
            disabled={loading || !amount}
            className="donate-button"
          >
            {loading ? "Processing Kindness..." : `Donate Rs. ${amount || 0}`}
          </button>

          {error && <div className="error-message">{error}</div>}

          <div className="security-note">
            🔒 Secure payment via Khalti | 100% of donations go directly to care
          </div>
        </div>
      </div>
    </div>
  );
};

export default KhaltiPayment;
