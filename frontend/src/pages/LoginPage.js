import React, { useState } from 'react';
import axiosInstance from '../axios';
import {Link, useNavigate} from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import '../template/LoginPage.css';
const Login = ({setIsAuthenticated,setUser}) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('/login', formData);
      const { token, user} = response.data;
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);
      localStorage.setItem('user', JSON.stringify(user));
      setIsAuthenticated(true);
      setSuccess(true);
      setUser(user);
      if (user.role === 'Customer') {
          navigate('/home');
        } else if (user.role === 'Admin') {
          navigate('/dashboard');
        }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className='login'>
      <div className='loginForm'>
        <div className='form'>
      <h2>Welcome back!</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange}
          required
        />
        <br />
        <input 
          type="password" 
          name="password" 
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Log In</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {success && <p style={{color: 'green'}}>Login successful!</p>}
      <br/>
      <p>
        Don't have account? <Link to="/register" id="links">Register</Link>
      </p>
       <p>
        Forgot Password? <Link to="/password/forgot" id="links">Reset</Link>
      </p>
      </div>
      </div>
      <div className='image'>
      <div className='loginFoto'>
        <img src="/images/CoverPhoto.jpg" alt='login'/>
      </div> </div>
    </div>
  );
};

export default Login;
