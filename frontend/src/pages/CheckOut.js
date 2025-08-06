import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axiosInstance from "../axios";

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    const { token, error } = await stripe.createToken(card);

    if (error) {
      setError(error.message);
      return;
    }

    try {
      const response = await axiosInstance.post('/checkout', {
        shipping_address: shippingAddress,
        country,
        city,
        postal_code: postalCode,
        stripeToken: token.id,
      });

      setSuccess(`Order completed! Order reference: ${response.data.orderID}`);
      navigate('/profile/orders');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Shipping Information</h2>

      <label>Country</label>
      <input
        type="text"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        required
      />

      <label>City</label>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        required
      />

      <label>Postal Code</label>
      <input
        type="text"
        value={postalCode}
        onChange={(e) => setPostalCode(e.target.value)}
        required
      />

      <label>Address</label>
      <input
        type="text"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
        required
      />

      <h2>Card Details</h2>
      <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
        <CardElement />
      </div>

      <button type="submit" disabled={!stripe} style={{ marginTop: '15px' }}>Pay</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </form>
  );
};

export default Checkout;
