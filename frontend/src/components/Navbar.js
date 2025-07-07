import {useEffect,useState} from 'react';
import {useNavigate,Link } from 'react-router-dom';
import axiosInstance from '../axios';
const Navbar=({onLogout})=>{
    const navigate=useNavigate();
    const[role,setRole]=useState(null);
    const[user,setUser]=useState(null);
    useEffect(()=>{
        const token=localStorage.getItem('token');
        const role=localStorage.getItem('role');
        if(!token){
            navigate('/login'); return;
        }
        setRole(role);
        
        axiosInstance.get('/me')
      .then(res => {
        setUser(res.data.user);
      })
      .catch(err => {
        console.error('Error fetching user data', err);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
      });
  }, [navigate]);
  if (!user){
    return null;
  }
 return (
    <nav>
      <ul style={{display:'flex', listStyle:'none', gap:'15px'}}>
        <li><Link to="/home">Home</Link></li>
        {role === 'Admin' && <li><Link to="/dashboard">Dashboard</Link></li>}
        <li>Hello, {user.username}</li>
        <li>Role: {role}</li>
        <li><button onClick={onLogout}>Logout</button></li>
      </ul>
    </nav>
  );
};
export default Navbar;