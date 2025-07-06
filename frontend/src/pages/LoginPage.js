import React, { useState } from 'react';
import axiosInstance from '../axios';
import {Link, useNavigate} from 'react-router-dom';
const Login = ({setIsAuthenticated}) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [token, setToken] = useState(null);
  const navigate=useNavigate();
  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axiosInstance.post('/login', formData);
      const { token } = response.data;
      setToken(token);
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      navigate('/',{replace:true});
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
      {error && <p style={{color: 'red'}}>{error}</p>}
      {token && <p style={{color: 'green'}}>Login successful!</p>}
      <p>
        Don't have account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
