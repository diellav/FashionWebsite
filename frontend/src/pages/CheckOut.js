import React, { useState , useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axiosInstance from "../axios";
import '../template/CheckOut.css'; 

const Checkout = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    axiosInstance.get('/my-addresses')
      .then(res => setAddresses(res.data))
      .catch(err => console.error(err));
  }, []);
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
      const payload = selectedAddress !== 'new'
        ? { address_id: selectedAddress, stripeToken: token.id }
        : { shipping_address: shippingAddress, country, city, postal_code: postalCode, stripeToken: token.id };

      const response = await axiosInstance.post('/checkout', payload);

      setSuccess(`Order completed! Order reference: ${response.data.orderID}`);
      navigate('/profile/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed.');
    }
  };

 return (
  <form onSubmit={handleSubmit} className="checkout-form">
    <h2>Shipping Address</h2>
    <p className="helper-text">
      Please select an existing address or add a new one below.
    </p>

    <select
      value={selectedAddress}
      onChange={(e) => setSelectedAddress(e.target.value)}
      required
    >
      <option value="">-- Select an address --</option>
      {addresses.map(addr => (
        <option key={addr.id} value={addr.id}>
          {addr.address}, {addr.city}, {addr.country}
        </option>
      ))}
      <option value="new">Add new address</option>
    </select>

    {selectedAddress === 'new' && (
      <>
        <div className="form-section">
          <label>Country
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </label>
          <label>City
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-section">
          <label>Postal Code
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </label>
          <label>Address
            <input
              type="text"
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              required
            />
          </label>
        </div>
      </>
    )}

    <h2 style={{ marginTop: '2%' }}>Card Details</h2>
    <p className="helper-text">
      Enter your card information securely below. We use Stripe for safe payments.
    </p>

    <div className="card-element-wrapper">
      <CardElement />
    </div>

    <button type="submit" disabled={!stripe}>Pay</button>

    <p
      style={{ marginTop: '2%' }}
      onClick={() => {
        const confirmCancel = window.confirm(
          'Are you sure you want to cancel this checkout payment?'
        );
        if (confirmCancel) navigate('/cart');
      }}
    >
      Cancel Payment
    </p>

    {error && <p className="error-message">{error}</p>}
    {success && <p className="success-message">{success}</p>}
  </form>
);
};

export default Checkout;
