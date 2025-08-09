import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";

const CreateUserForm = ({ user, roles, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone_number: '',
    address: '',
    email: '',
    username: '',
    password: '',
    roleID: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        gender: user.gender || '',
        date_of_birth: user.date_of_birth || '',
        phone_number: user.phone_number || '',
        address: user.address || '',
        email: user.email || '',
        username: user.username || '',
        password: '',
        roleID: user.roleID || '',
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        gender: '',
        date_of_birth: '',
        phone_number: '',
        address: '',
        email: '',
        username: '',
        password: '',
        roleID: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (user) {
        await axiosInstance.put(`/users/${user.id}`, formData);
        alert('User updated successfully');
      } else {
        await axiosInstance.post('/users', formData);
        alert('User added successfully');
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div>
      <h2>{user ? "Edit User" : "Add User"}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} className="editProfile">

        <div className="subsection">
          <label>First Name<input  name="first_name"  value={formData.first_name}  onChange={handleChange}
          placeholder="First Name"/></label>
          <label>Last Name<input name="last_name" value={formData.last_name} onChange={handleChange}
           placeholder="Last Name"/> </label>
        </div>

        <div className="subsection">
        <label>Gender<input name="gender" value={formData.gender} onChange={handleChange}
          placeholder="Gender"/></label>
        <label>Date of Birth<input type="date" name="date_of_birth" value={formData.date_of_birth}
        onChange={handleChange} placeholder="Date of Birth"/></label>
        </div>

        <div className="subsection">
        <label>Email <input type="email" name="email" value={formData.email}
           onChange={handleChange} placeholder="Email" />
        </label>
        <label>Username<input  name="username" value={formData.username} onChange={handleChange}
         placeholder="Username"/></label>
        </div>

        <div className="subsection">
        <label>Phone Number <input  name="phone_number"  value={formData.phone_number}  onChange={handleChange}
          placeholder="Phone Number" />
        </label>
         <label>Main Address<input name="address"  value={formData.address}  onChange={handleChange}
          placeholder="Address" />
          </label>
           
          <div className="subsection">
          <label>Password<input  type="password"  name="password"  value={formData.password}
            onChange={handleChange}  placeholder="Password"/></label>
          <label> Role
           <select
              name="roleID"
              value={formData.roleID}
              onChange={handleChange}
            >
              <option value="">Select Role</option>
              {roles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.roleName}
                </option>
              ))}
            </select></label></div>
        </div>

        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: '10px' }}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateUserForm;
