import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axiosInstance from "../axios";
import '../template/CheckOut.css'; 

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
      <form onSubmit={handleSubmit} className="checkout-form">
      <h2>Shipping Information</h2>
      <div className="form-section">
        <label>Country
          <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </label>
        <label>City
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
        </label>
      </div>
      <div className="form-section">
        <label>Postal Code
          <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
        </label>
        <label>Address
          <input type="text" value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} required />
        </label>
      </div>
       <h2>Card Details</h2>
      <div className="card-element-wrapper">
        <CardElement />
      </div>
      <button type="submit" disabled={!stripe}>Pay</button>
      <p onClick={()=>{const confirm=window.confirm('Are you sure you want to cancel this checkout payment?');
        if(confirm)navigate('/cart')}}>
        Cancel Payment</p>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </form>
  );
};

export default Checkout;
