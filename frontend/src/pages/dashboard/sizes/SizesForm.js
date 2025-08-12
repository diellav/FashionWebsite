import React, { useState, useEffect } from "react";
import axiosInstance from "../../../axios";

const SizesForm = ({ size, products, variants, onSaved, onCancel }) => {
  const [formData, setFormData] = useState({
    productID: '',
    variantID: '',
    sizes: [],
  });

  const [sizesInput, setSizesInput] = useState({
    size: '',
    stock: '',
  });

  const [error, setError] = useState('');
  const filteredVariants = (variants || []).filter(v => v.productID === formData.productID);


  useEffect(() => {
    if (size) {
       console.log('Editing size prop:', size);
      setFormData({
        productID: size.productID || '',
        variantID: size.variantID || '',
        sizes: size.sizes || (size.size ? [{ size: size.size, stock: size.stock }] : []),
      });
    } else {
      setFormData({
        productID: '',
        variantID: '',
        sizes: [],
      });
    }
    setSizesInput({ size: '', stock: '' });
    setError('');
  }, [size]);

  const handleChange = (e) => {
      const { name, value } = e.target;
    if (name === 'productID') {
      setFormData({
        ...formData,
        productID: value,
        variantID: '',
        sizes: [],
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSizesChange = (e) => {
    setSizesInput({ ...sizesInput, [e.target.name]: e.target.value });
  };

  const addSize = () => {
  if (!sizesInput.size.trim()) {
    alert("Please enter a size");
    return;
  }
  if (sizesInput.stock === '') {
    alert("Please enter stock quantity");
    return;
  }

  const filteredSizes = formData.sizes.filter(s => s.size.toLowerCase() !== sizesInput.size.trim().toLowerCase());
  setFormData({
    ...formData,
    sizes: [...filteredSizes, { size: sizesInput.size.trim(), stock: Number(sizesInput.stock) }],
  });

  setSizesInput({ size: '', stock: '' });
};

  const removeSize = (index) => {
    const newSizes = [...formData.sizes];
    newSizes.splice(index, 1);
    setFormData({ ...formData, sizes: newSizes });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.productID) {
      setError("Please select a product");
      return;
    }
    if (formData.sizes.length === 0) {
      setError("Please add at least one size");
      return;
    }

    const data = new FormData();
    data.append("productID", formData.productID);
    if(formData.variantID) data.append("variantID", formData.variantID);

    formData.sizes.forEach((s, i) => {
      data.append(`sizes[${i}][size]`, s.size);
      data.append(`sizes[${i}][stock]`, s.stock);
    });


    try {
      if (size) {
        data.append('_method', 'PUT');
        await axiosInstance.post(`/sizes_stock/${size.id}`, data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Size updated successfully");
      } else {
        await axiosInstance.post("/sizes_stock", data, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        alert("Size created successfully");
      }
      if (onSaved) onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save size");
    }
  };

  return (
    <div>
      <h2>{size ? "Edit Size" : "Add Size"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="editProfile">
    <div className="subsection">
        <label>
          Product:
          <select name="productID" value={formData.productID} onChange={handleChange}>
            <option value="">Select Product</option>
            {products.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </label>

        <label>
          Variant ID (optional):
          <select name="variantID" value={formData.variantID} onChange={handleChange}>
            <option value="">Select Variant</option>
            {(variants || []).map(cat => (
              <option key={cat.id} value={cat.id}>{cat.color} - {cat.material}</option>
            ))}
          </select>
        </label>
</div>
        <hr />
        <h3>Add Size</h3>
<div className="subsection">
        <label>
          Size:
          <input
            type="text"
            name="size"
            value={sizesInput.size}
            onChange={handleSizesChange}
            placeholder="e.g. M, L, XL"
          />
        </label>

        <label>
          Stock:
          <input
            type="number"
            name="stock"
            value={sizesInput.stock}
            onChange={handleSizesChange}
            min={0}
          />
        </label>
        </div>

        <button type="button" onClick={addSize}>Add Size</button>

        {formData.sizes.length > 0 && (
          <div>
            <h4>Added Sizes</h4>
            <ul>
              {formData.sizes.map((s, idx) => (
                <li key={idx}>
                  Size: {s.size}, Stock: {s.stock}{" "}
                  <button type="button" onClick={() => removeSize(idx)}>Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )}

        <hr />

      

        <div className="save_cancel" style={{ marginTop: 20 }}>
          <button type="submit" className="save">Save Changes</button>
          <button type="button" onClick={onCancel} className="cancel">Cancel</button>
        </div>

      </form>
    </div>
  );
};

export default SizesForm;
