import React, { useState } from 'react';
import axiosInstance from '../../axios';
import '../../template/ProfilePage.css';
const ChangePassword=()=>{
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setMessage('');
    setError('');
    try{
        const res=await axiosInstance.post('/change-password',{
        current_password: currentPassword,
        new_password:newPassword,
        new_password_confirmation:confirmPassword,});
        setMessage(res.data.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
    }catch(err){
        setError(err.response?.data?.message || 'Something went wrong.');
    }
  };
  return(
     <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} className="editProfile">
       <div className="subsection"><label>Current Password<input
          type="password"
          placeholder="..."
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        /></label> </div>
        <div className="subsection"><label>New Password<input
          type="password"
          placeholder="..."
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        /></label> </div>
       <div className="subsection"><label>Confirm Password<input
          type="password"
          placeholder="..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /></label> </div>
        <button type="submit">Update Password</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};
export default ChangePassword;