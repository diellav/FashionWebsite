import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axiosInstance from '../axios';
import '../template/LoginPage.css';
function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  const navigate=useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const response = await axiosInstance.post('/password/reset', {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      });

      setMessage(response.data.message);
      setTimeout(()=>{
        navigate('/login');
      }, 1500)
    } catch (err) {
      if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || 'Something went wrong.');
      }
    }
  };

  return (
     <div className='login'>
      <div className='loginForm'>
        <div className='form'>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={e => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit">Change Password</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
   </div>
      </div>
      <div className='image'>
      <div className='loginFoto'>
        <img src="/images/CoverPhoto.jpg" alt='login'/>
      </div> </div>
    </div>
  );
}

export default ResetPassword;
