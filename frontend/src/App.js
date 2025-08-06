
import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation} from 'react-router-dom';
import axiosInstance from "./axios";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateCategoryForm from "./pages/dashboard/categories/CategoryForm";
import TokenCheck from "./components/TokenCheck";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import 'bootstrap/dist/css/bootstrap.min.css';
import ShopPage from "./pages/ShopPage";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import ReturnPolicy from "./pages/ReturnPolicy";
import PrivacyPolicy from "./pages/Privacy";
import PaymentPage from "./pages/PaymentPage";
import ProfilePage from "./pages/ProfilePage";

function ResetPasswordPage() {
  const query = new URLSearchParams(useLocation().search);
  const token = query.get('token');
  const email = query.get('email');

  if (!token || !email) {
    return <Navigate to="/login" replace />;
  }

  return <ResetPassword token={token} email={email} />;
}

function AppContent() {
    const[isAuthenticated,setIsAuthenticated]=useState(false);
    const [loading, setLoading] = useState(true);
    const[user,setUser]=useState(null);
    const[role,setRole]=useState(null);
    const navigate=useNavigate();

   useEffect(()=>{
    const token=localStorage.getItem('token');
    const roleStored=localStorage.getItem('role');
    setRole(roleStored);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if(token){
      axiosInstance.get('/me')
      .then(res=>{
        setIsAuthenticated(true);
        setUser(res.data);
      })
      .catch(()=>{
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUser(null);
        setRole(null);
      })
      .finally(()=>{
        setLoading(false);
      });
      
    }else{
      setLoading(false);
    }
  },[]);

   const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login', { replace: true });
  };

  TokenCheck(handleLogout);
  return (
    <div className="App">
      {loading ? (
      <p>Loading...</p>
    ) : (
      <>
      
<Navbar user={user} onLogout={handleLogout}/>
    <Routes>
      <Route path='/' element={<HomePage />}/>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/home" element={<HomePage />}/>
      <Route path="/categories" element={isAuthenticated? (<CreateCategoryForm/>):( <Navigate to="/login"/>)}/>
      <Route path="/checkout" element={isAuthenticated? (<PaymentPage/>):( <Navigate to="/login"/>)}/>
      <Route path="/profile/*" element={isAuthenticated ? (<ProfilePage onLogout={handleLogout}/>) : (<Navigate to="/login" />)} />
       <Route path="/reset-password" element={<ResetPasswordPage />} />
       <Route path="/password/forgot" element={<ForgotPassword />} />
       <Route path="/aboutUs" element={<AboutUs />} />
       <Route path="/contactUs" element={<ContactUs />} />
       <Route path="/products/filter" element={<ShopPage />} />
       <Route path="/products/:id" element={<ProductDetail />} />
       <Route path="/cart" element={<Cart />} />
       <Route path="/wishlists" element={<Wishlist />} />
       <Route path="/returns" element={<ReturnPolicy />} />
       <Route path="/privacy" element={<PrivacyPolicy />} />
    </Routes>
<Footer user={user}/>
    </>
 )}
    </div>
  );
}

export default function App(){
  return(
    <Router>
      <AppContent/>
    </Router>
  );
}

 
