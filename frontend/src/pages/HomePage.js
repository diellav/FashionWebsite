import React, {useState, useEffect} from "react";
import axiosInstance from '../axios';
import '../template/HomePage.css';
const HomePage=({onLogout})=>{
    const[user,setUser]=useState(null);
  
   
    useEffect(() => {
    fetchUser();
      }, []);

  const fetchUser=async ()=> {
    const fakeUser = { name: "Test User", email: "test@example.com" };
  setUser(fakeUser);
  };

  
  


  return (
    <div>
      <div className="main">
      <div className="mainFoto">
        <img src='../../../../images/MainPhoto.jpg'></img>
        <p>Welcome to Urban Gaze, where modern minimalism meets effortless sophistication.<br></br><p id='secondText'>Crafted for the city, tailored for distinction.</p></p>
      </div>
      </div>
      <div className="insights">
        <div className="box">

        </div>
        <div className="box">

        </div>
        <div className="box">

        </div>
      </div>
      <div>
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
       </div>
       )}

        
      </div>
    </div>
  );
};

export default HomePage;