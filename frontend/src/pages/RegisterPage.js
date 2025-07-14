import React,{useState} from "react";
import {useNavigate} from 'react-router-dom';
import axiosInstance from "../axios";
import '../template/LoginPage.css';
const RegisterPage=()=>{
    const[formData, setFormData]=useState({
        first_name:'',
        last_name:'',
        gender:'',
        date_of_birth:'',
        phone_number:'',
        address:'',
        email:'',
        username:'',
        password:'',
    });
    const[error, setError]=useState('');
    const navigate=useNavigate();
   
    const handleChange=(e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };    
    const handleSubmit=async(e)=>{
        e.preventDefault();
        setError('');

        try{
            await axiosInstance.post("/register",formData);
            navigate('/login', {replace:true});
        }catch(err) {
          if (err.response && err.response.data) {
            const errors = err.response.data;
            setError(
              (errors.email ? 'Email already in use! Please use another email address. ' : '') +
              (errors.username ? 'Username already in use! Please use another username.' : '')
            );
          } else {
    setError('Registration failed');
  }
}
    };
    return(
       <div className='login'>
      <div className='loginForm'>
        <div className='register'>
      <h2>Sign in to UrbanGaze</h2>
        <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="first_name" 
          placeholder="First Name" 
          value={formData.first_name} 
          onChange={handleChange}
          required
        />
        <br />
        <input 
         type="text" 
          name="last_name" 
          placeholder="Last Name" 
          value={formData.last_name} 
          onChange={handleChange}
          required
        />
        <br />
        <input 
         type="text" 
          name="gender" 
          placeholder="Gender" 
          value={formData.gender} 
          onChange={handleChange}
          required
        />
        <br />
         <input 
         type="date" 
          name="date_of_birth" 
          placeholder="Date of birth" 
          value={formData.date_of_birth} 
          onChange={handleChange}
          required
        />
        <br />
        <input 
         type="text" 
          name="phone_number" 
          placeholder="Phone Number" 
          value={formData.phone_number} 
          onChange={handleChange}
          required
        />
        <br /><input 
         type="text" 
          name="address" 
          placeholder="Address" 
          value={formData.address} 
          onChange={handleChange}
          required
        />
        <br /><input 
         type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange}
          required
        />
        <br /><input 
         type="text" 
          name="username" 
          placeholder="Username" 
          value={formData.username} 
          onChange={handleChange}
          required
        />
        <br /><input 
         type="password" 
          name="password" 
          placeholder="Password" 
          value={formData.password} 
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Register</button>
      </form>
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

export default RegisterPage;