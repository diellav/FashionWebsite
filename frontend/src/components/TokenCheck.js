import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const TokenCheck = (logout, showWarning = true) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let warningTimeout;
    let logoutTimeout;

    try {
      const decoded = jwtDecode(token);
      const expiredTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const remainingTime = expiredTime - currentTime;

      if (remainingTime <= 0) {
        alert('Your session has expired! Please login again.');
        localStorage.removeItem('token');
        logout?.();
        navigate('/login', { replace: true });
      } else {
        if (showWarning && remainingTime > 60000) {
          warningTimeout = setTimeout(() => {
            alert('Your session will expire in 1 minute, please refresh or login again!');
          }, remainingTime - 60000);
        }

        logoutTimeout = setTimeout(() => {
          alert('Your session has expired! Please login again.');
          localStorage.removeItem('token');
          logout?.();
          navigate('/login', { replace: true });
        }, remainingTime);
      }
    } catch (err) {
      console.error('Failed decoding token:', err);
      localStorage.removeItem('token');
      logout?.();
      navigate('/login', { replace: true });
    }

    return () => {
      if (warningTimeout) clearTimeout(warningTimeout);
      if (logoutTimeout) clearTimeout(logoutTimeout);
    };
  }, [navigate, logout, showWarning]);
};

export default TokenCheck;
