import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../../axios";

const CreateCategoryForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    subcategory: '',
    description: '',
    image: '',
    parentID: '',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await axiosInstance.post('/categories', formData); 
      navigate('/categories', { replace: true }); 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    }
  };

  return (
    <div>
      <h2>Create Category</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br />
        <input 
          type="text"
          name="subcategory"
          placeholder="Subkategory"
          value={formData.subcategory}
          onChange={handleChange}
          required
        />
        <br />
        <input 
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <br />
        <input 
          type="text"
          name="image"
          placeholder="Image link"
          value={formData.image}
          onChange={handleChange}
          required
        />
        <br />
        <input 
          type="number"
          name="parentID"
          placeholder="Parent category"
          value={formData.parentID}
          onChange={handleChange}
        />
        <br />
        <button type="submit">Create</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default CreateCategoryForm;
