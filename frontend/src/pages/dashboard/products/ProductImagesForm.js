import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";
const CreateProductImagesForm = ({ image, products, variants, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    productID: '',
   variantID: '',
    images: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (image) {
      setFormData({
        productID: image.productID || '',
        variantID: image.variantID || '',
        images: [],
      });
    } else {
      setFormData({
        productID: '',
        variantID: '',
        images: [],
        variants: [],
      });
    }
    setError('');
  }, [image]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleImagesChange = (e) => {
    setFormData({...formData, images: Array.from(e.target.files)});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    data.append("productID", formData.productID);
    data.append("variantID", formData.variantID);
    formData.images.forEach((file, i) => {
      data.append(`images[${i}]`, file);
    });

   try {
  if (image) {
    data.append('_method', 'PUT');
    await axiosInstance.post(`/product_images/${image.id}`, data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("Product updated successfully");
  } else {
    await axiosInstance.post("/product_images", data, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    alert("Product created successfully");
  }
  if (onSaved) onSaved();
} catch (err) {
  setError(err.response?.data?.message || "Failed to save image");
}
  };
  return (
    <div>
      <h2>{image ? "Edit Product" : "Add Product"}</h2>
      {error && <p style={{color: 'red'}}>{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="editProfile">
      
<div className="subsection">
        <label>
          Product
          <select name="productID" value={formData.productID} onChange={handleChange} >
            <option value="">Select Product</option>
            {products.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>

         <label>
          Variant
          <select name="variantID" value={formData.variantID} onChange={handleChange} >
            <option value="">Select Variant</option>
            {variants.map(cat => (
              <option key={cat.id} value={cat.id}>Product: {cat.product?.name} - {cat.color}</option>
            ))}
          </select>
        </label>
        <label>
          Product Images
          <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
        </label></div>

        <hr />
        <div className="save_cancel">
          <button type="submit" className="save">Save Changes</button>
          <button type="button" onClick={onCancel} className="cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductImagesForm;
