import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateCategoryForm from "./pages/dashboard/categories/CategoryForm";
import TokenCheck from "./pages/TokenCheck";
import Navbar from "./components/Navbar";
import axiosInstance from "./axios";
function AppContent() {
    TokenCheck();
    const[isAuthenticated,setIsAuthenticated]=useState(false);
    const [loading, setLoading] = useState(true);
    const[user,setUser]=useState(null);
    const navigate=useNavigate();
    const role=localStorage.getItem('role');

   useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token){
      axiosInstance.get('/me')
      .then(res=>{
        setIsAuthenticated(true);
        setUser(res.data.user);
      })
      .catch(()=>{
        setIsAuthenticated(false);
      })
      .finally(()=>{
        setLoading(false);
      });
      
    }else{
      setLoading(false);
    }
  },[]);

   const handleLogout = () => {
    localStorage.removeItem('token');
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
      <Navbar onLogout={handleLogout}/>
    <Routes>
      <Route path='/' element={role==='Admin'? <Navigate to='/dashboard' replace/> 
      : role==='Customer'? <Navigate to='/home' replace/> : <Navigate to='/login' replace/>}/>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUser={user}/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/home" element={isAuthenticated? (<HomePage onLogout={handleLogout}/>):( <Navigate to="/login"/>)}/>
      <Route path="/categories" element={isAuthenticated? (<CreateCategoryForm/>):( <Navigate to="/login"/>)}/>
    </Routes>
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
