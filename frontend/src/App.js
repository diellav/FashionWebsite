import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation} from 'react-router-dom';
import axiosInstance from "./axios";
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateCategoryForm from "./pages/dashboard/categories/CategoryForm";
import TokenCheck from "./pages/TokenCheck";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import 'bootstrap/dist/css/bootstrap.min.css';
import './template/Navbar.css';

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
    TokenCheck();
    const[isAuthenticated,setIsAuthenticated]=useState(false);
    const [loading, setLoading] = useState(true);
    const[user,setUser]=useState(null);
    const[role,setRole]=useState(null);
    const navigate=useNavigate();

   useEffect(()=>{
    const token=localStorage.getItem('token');
    const roleStored=localStorage.getItem('role');
    setRole(roleStored);
    if(token){
      axiosInstance.get('/me')
      .then(res=>{
        setIsAuthenticated(true);
        setUser(res.data.user);
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

  return (
    <div className="App">
      {loading ? (
      <p>Loading...</p>
    ) : (
      <>
     
    {isAuthenticated && <Navbar onLogout={handleLogout}/>}
    <Routes>
      <Route path='/' element={role==='Admin'? <Navigate to='/dashboard' replace/> 
      : role==='Customer'? <Navigate to='/home' replace/> : <Navigate to='/login' replace/>}/>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={setUser}/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/home" element={isAuthenticated? (<HomePage />):( <Navigate to="/login"/>)}/>
      <Route path="/categories" element={isAuthenticated? (<CreateCategoryForm/>):( <Navigate to="/login"/>)}/>
       <Route path="/reset-password" element={<ResetPasswordPage />} />
       <Route path="/password/forgot" element={<ForgotPassword />} />
    </Routes>
    {isAuthenticated && <Footer onLogout={handleLogout}/>}
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
