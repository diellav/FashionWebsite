import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import '../../template/ProfilePage.css';
const EditProfile = () => {
  const [userData, setUserData] = useState({});
  const [success, setSuccess] = useState("");
  useEffect(() => {
    axiosInstance.get("/me").then(res => setUserData(res.data));
  }, []);

  const handleChange = e => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    axiosInstance.put(`/users/${userData.id}`, userData)
      .then(() => setSuccess("Profile updated successfully"))
      .catch(() => setSuccess("Failed to update profile"));
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      {success && <p>{success}</p>}
      <form onSubmit={handleSubmit} className="editProfile">
        <div className="subsection"><label>First Name<input name="first_name" value={userData.first_name || ""} onChange={handleChange} placeholder="First Name" /></label>
        <label>Last Name<input name="last_name" value={userData.last_name || ""} onChange={handleChange} placeholder="Last Name" /></label></div>
       <div className="subsection"><label>Date of Birth<input name="date_of_birth" value={userData.date_of_birth || ""} onChange={handleChange} placeholder="Date of Birth" /></label>
        <label>Email<input name="email" value={userData.email || ""} onChange={handleChange} placeholder="Email" /></label></div>
       <div className="subsection"><label>Username<input name="email" value={userData.username || ""} onChange={handleChange} placeholder="Username" /></label>
        <label>Phone Number<input name="phone_number" value={userData.phone_number || ""} onChange={handleChange} placeholder="Phone Number" /></label></div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;
