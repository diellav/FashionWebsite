import React, {useState, useEffect} from "react";
//import axiosInstance from '../axios';
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

      <div style={{ padding: "2rem" }}>
        <h3>Home Page</h3>
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