import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";
const CreateProductVariantForm = ({ product = null, products=[], onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    productID: '',
    color: '',
    material: '',
    image: null,
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
         productID: product.productID || '',
        color: product.color || '',
        material: product.material || '',
        image: null,
      });
    } else {
      setFormData({
         productID: '',
        color: '',
        material: '',
      
        image: null,
       
      });
    }
    setError('');
  }, [product]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleMainImageChange = (e) => {
    setFormData({...formData, image: e.target.files[0]});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
      data.append("productID", formData.productID);
    data.append("color", formData.color);
    data.append("material", formData.material);
    if (formData.image) {
      data.append("image", formData.image);
    }

  

   try {
  if (product) {
    data.append('_method', 'PUT');
    await axiosInstance.post(`/product_variants/${product.id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("Product updated successfully");
  } else {
    await axiosInstance.post("/product_variants", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("Product created successfully");
  }
  if (onSaved) onSaved();
} catch (err) {
  setError(err.response?.data?.message || "Failed to save product");
}
  };
  return (
    <div>
      <h2>{product ? "Edit Product" : "Add Product"}</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="editProfile">
      <div className="subsection">
        <label>
          Color
          <input name="color" value={formData.color} onChange={handleChange} required />
        </label>

        <label>
          Material
          <textarea name="material" value={formData.material} onChange={handleChange} required />
        </label>

       </div>
<div className="subsection">
        <label>
          Product
          <select name="productID" value={formData.productID} onChange={handleChange} required>
            <option value="">Select Product</option>
            {products && products.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>

        <label>
          Main Image
          <input type="file" accept="image/*" onChange={handleMainImageChange} />
        </label>

    </div>

        <hr />
        

       
<hr></hr>
        <div className="save_cancel">
          <button type="submit" className="save">Save Changes</button>
          <button type="button" onClick={onCancel} className="cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductVariantForm;
