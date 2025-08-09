import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";

const CreateCategoryForm = ({ category, categories, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentID: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        description: category.description || '',
        image: category.image || '',
        parentID: category.parentID || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        image: '',
        parentID: '',
      });
    }
  }, [category]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (category) {
        await axiosInstance.put(`/categories/${category.id}`, formData);
        alert('Category updated successfully');
      } else {
        await axiosInstance.post('/categories', formData);
        alert('Category added successfully');
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <div>
      <h2>{category ? "Edit Category" : "Add Category"}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit} className="editProfile">

        <div className="subsection">
          <label>Name<input  name="name"  value={formData.name}  onChange={handleChange}
          placeholder="Name"/></label>
       <label>Description<input name="description" value={formData.description} onChange={handleChange}
          placeholder="Description"/></label>
           <label>Image<input type="text" name="image" value={formData.image}
        onChange={handleChange} placeholder="Image"/></label>
        </div>

          <div className="subsection">
          <label> Parent Category
           <select
              name="parentID"
              value={formData.parentID}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              {categories.map(categorie => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.name}
                </option>
              ))}
            </select></label>
        </div>

          <div className="save_cancel">
        <button type="submit" className="save">Save Changes</button>
        <button type="button" onClick={onCancel} className="cancel">Cancel</button></div>
      </form>
    </div>
  );
};

export default CreateCategoryForm;
