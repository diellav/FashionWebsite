import React, { useEffect, useState } from "react";
import { useNavigate ,NavLink} from "react-router-dom";
import axiosInstance from "../../axios";

const ProfileInfo = () => {
  const [userData, setUserData] = useState(null);
  const role=localStorage.getItem('role');
    const navigate=useNavigate();
  useEffect(() => {
    axiosInstance.get("/me").then(res => {
      setUserData(res.data);
    });
  }, []);
  const handleDelete = () => {
     const confirmed = window.confirm('Are you sure you want to delete your account?');
  if (!confirmed) return;

  axiosInstance.delete(`/users/${userData.id}`)
    .then(() => {
     localStorage.removeItem('user');
     localStorage.removeItem('token');
     navigate('/home');
    });
};

  if (!userData) return <p>Loading profile...</p>;

  const { first_name, last_name, email, gender, phone_number, date_of_birth, address ,username} = userData;

  return (
    <div className="profile-info-container">
      <h2>Profile Info</h2>
      <p><b>Name:</b> {first_name} {last_name}</p>
      <p><b>Email:</b> {email}</p>
      <p><b>Username:</b> {username}</p>
      <p><b>Gender:</b> {gender}</p>
      <p><b>Phone:</b> {phone_number}</p>
      <p><b>Date of Birth:</b> {date_of_birth?.split('T')[0]}</p>
      <p><b>Main Address:</b> {address}</p>
      <p><b>Member Since:</b> {new Date(userData.created_at).toLocaleDateString()}</p>

       <div className="delete-account-section">
         <button onClick={()=>{
          if(role!=='Admin'){
            navigate('/profile/edit')
          }
         else{
          navigate('/dashboard/edit')
        }}} className="edit-button">
        Edit Profile
      </button>
      <button onClick={handleDelete} className="delete-button">
        Delete Account
      </button>
    </div>
    
    </div>
    
  );
};

export default ProfileInfo;
