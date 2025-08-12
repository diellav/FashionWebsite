import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";

const CreateAddressForm = ({ address, users, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    userID: '',
    country: '',
    city: '',
    postal_code: '',
    address: '',
 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (address) {
      setFormData({
        userID: address.userID || '',
        country: address.country || '',
        city: address.city || '',
        postal_code: address.postal_code || '',
        address: address.address || '',
        
      });
    } else {
      setFormData({
        userID: '',
        country: '',
        city: '',
        postal_code: '',
        address: '',
        
      });
    }
  }, [address]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (address) {
        await axiosInstance.put(`/address/${address.id}`, formData);
        alert('Address updated successfully');
      } else {
        await axiosInstance.post('/address', formData);
        alert('Address added successfully');
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div>
      <h2>{address ? "Edit Address" : "Add Address"}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} className="editProfile">

        <div className="subsection">
             <label> User
           <select
              name="userID"
              value={formData.userID}
              onChange={handleChange}
            >
              <option value="">Select User</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </option>
              ))}
            </select></label>
          <label>Country<input  name="country"  value={formData.country}  onChange={handleChange}
          placeholder="Country"/></label>
          <label>City<input name="city" value={formData.city} onChange={handleChange}
           placeholder="City"/> </label>
        </div>

        <div className="subsection">
         <label>Postal Code<input name="postal_code" value={formData.postal_code} onChange={handleChange}
          placeholder="Postal Code"/></label>
         <label>Main Address<input name="address"  value={formData.address}  onChange={handleChange}
          placeholder="Address" />  </label>
        </div>

          <div className="save_cancel">
        <button type="submit" className="save">Save Changes</button>
        <button type="button" onClick={onCancel} className="cancel">Cancel</button></div>
      </form>
    </div>
  );
};

export default CreateAddressForm;
