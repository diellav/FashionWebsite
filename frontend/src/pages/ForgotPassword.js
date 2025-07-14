import React, { useState } from 'react';
import axiosInstance from '../axios';
import '../template/LoginPage.css';
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

 try {
    const response = await axiosInstance.post('/password/email', { email });
    setMessage(response.data.message);
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong.');
  }
};

  return (
    
    <div className='login'>
      <div className='loginForm'>
        <div className='form'>
      <h2>Request Password Reset</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p style={{color: 'green'}}>{message}</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
    </div>
      </div>
      <div className='image'>
      <div className='loginFoto'>
        <img src="/images/CoverPhoto.jpg" alt='login'/>
      </div> </div>
    </div>
  );
}

export default ForgotPassword;
