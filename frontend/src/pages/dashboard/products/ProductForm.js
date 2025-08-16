import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";
const CreateProductForm = ({ product, categories, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    categoryID: '',
    main_image: null,
    images: [],
    variants: [],
  });
  const [variantInput, setVariantInput] = useState({
    color: '',
    material: '',
    images: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        categoryID: product.categoryID || '',
        main_image: null,
        images: [],
        variants: product.variants || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        categoryID: '',
        main_image: null,
        images: [],
        variants: [],
      });
    }
    setVariantInput({ color: '', material: '', images: [] });
    setError('');
  }, [product]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleMainImageChange = (e) => {
    setFormData({...formData, main_image: e.target.files[0]});
  };

  const handleImagesChange = (e) => {
    setFormData({...formData, images: Array.from(e.target.files)});
  };

  const handleVariantChange = (e) => {
    setVariantInput({...variantInput, [e.target.name]: e.target.value});
  };

  const handleVariantImagesChange = (e) => {
    setVariantInput({...variantInput, images: Array.from(e.target.files)});
  };

  const addVariant = () => {
    if (!variantInput.color && !variantInput.material) {
      alert("Please enter color or material for variant");
      return;
    }
    setFormData({
      ...formData,
      variants: [...formData.variants, variantInput]
    });
    setVariantInput({ color: '', material: '', images: [] });
  };

  const removeVariant = (index) => {
    const newVariants = [...formData.variants];
    newVariants.splice(index, 1);
    setFormData({...formData, variants: newVariants});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("categoryID", formData.categoryID);
    if (formData.main_image) {
      data.append("main_image", formData.main_image);
    }
    formData.images.forEach((file, i) => {
      data.append(`images[${i}]`, file);
    });

    formData.variants.forEach((variant, i) => {
      data.append(`variants[${i}][color]`, variant.color || "");
      data.append(`variants[${i}][material]`, variant.material || "");
      if (variant.images) {
        variant.images.forEach((file, j) => {
          data.append(`variants[${i}][images][${j}]`, file);
        });
      }
    });

   try {
        let response;

if (product && product.id) {
   data.append('_method', 'PUT');
      response = await axiosInstance.post(`/products/${product.id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    } else {
      response = await axiosInstance.post('/products', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
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
          Name
          <input name="name" value={formData.name} onChange={handleChange} required />
        </label>

        <label>
          Description
          <textarea name="description" value={formData.description} onChange={handleChange} required />
        </label>

        <label>
          Price
          <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        </label></div>
<div className="subsection">
        <label>
          Category
          <select name="categoryID" value={formData.categoryID} onChange={handleChange} required>
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>

        <label>
          Main Image
          <input type="file" accept="image/*" onChange={handleMainImageChange} />
        </label>

        <label>
          Product Images
          <input type="file" multiple accept="image/*" onChange={handleImagesChange} />
        </label></div>

        <hr />
        <h3>Add Variant</h3>
<div className="subsection">
        <label>
          Color
          <input name="color" value={variantInput.color} onChange={handleVariantChange} />
        </label>

        <label>
          Material
          <input name="material" value={variantInput.material} onChange={handleVariantChange} />
        </label>

        <label>
          Variant Images
          <input type="file" multiple accept="image/*" onChange={handleVariantImagesChange} />
        </label></div>

        <button type="button" onClick={addVariant}>Add</button>

        {formData.variants.length > 0 && (
          <div>
            <h4>Variants</h4>
            <ul>
              {formData.variants.map((v, idx) => (
                <div className="subsection">
                <li key={idx}>
                  Color: {v.color || '-'}, Material: {v.material || '-'}
                  <button type="button" onClick={() => removeVariant(idx)}>Remove</button>
                </li></div>
              ))}
            </ul>
          </div>
        )}
<hr></hr>
        <div className="save_cancel">
          <button type="submit" className="save">Save Changes</button>
          <button type="button" onClick={onCancel} className="cancel">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProductForm;
