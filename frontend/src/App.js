import React, { useEffect, useState } from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from 'react-router-dom';
import HomePage from "./pages/HomePage";
import Login from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CreateCategoryForm from "./pages/dashboard/categories/CategoryForm";
function AppContent() {
    const[isAuthenticated,setIsAuthenticated]=useState(false);
    const [loading, setLoading] = useState(true);
    const[user,setUser]=useState(null);
const navigate=useNavigate();

   useEffect(()=>{
    const token=localStorage.getItem('token');
    if(token){
      setIsAuthenticated(true);
    } setLoading(false);
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
    <Routes>
      <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated}/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/" element={isAuthenticated? (<HomePage onLogout={handleLogout}/>):( <Navigate to="/login"/>)}/>
      <Route path="/categories" element={isAuthenticated? (<CreateCategoryForm/>):( <Navigate to="/login"/>)}/>
    </Routes>
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
