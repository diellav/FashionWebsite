import React, { useState, useEffect ,useRef } from "react";
import axiosInstance from "../../../axios";
import '../../../template/ProfilePage.css';
const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState(null);
   const [page, setPage] = useState(1);
      const [limit] = useState(10);
      const [totalPages, setTotalPages] = useState(1);
      const [sort, setSort] = useState('id');
      const [order, setOrder] = useState('asc');
      const [search, setSearch] = useState('');
      const [searching, setSearching] = useState(false);
      const [searchInput, setSearchInput] = useState('');
      const debounceTimeout = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    value: "",
      type: "",
      conditions: "",
    start_date: "",
    end_date: "",
      image: "",
    productIDs: [],
  });

  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [discountsRes, productsRes] = await Promise.all([
        axiosInstance.get('/discounts',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/products-dashboard'),
      ]);
     setDiscounts(Array.isArray(discountsRes.data.data) ? discountsRes.data.data : []);
      setTotalPages(discountsRes.data.last_page);
     setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);

    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };
   useEffect(() => {
      fetchData();
    }, [page, limit, sort, order, search]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleMainImageChange = (e) => {
    setFormData({...formData, image: e.target.files[0]});
  };
  const handleCheckboxChange = (productId) => {
    setFormData((prev) => {
      const exists = prev.productIDs.includes(productId);
      let newProductIDs;
      if (exists) {
        newProductIDs = prev.productIDs.filter((id) => id !== productId);
      } else {
        newProductIDs = [...prev.productIDs, productId];
      }
      return {
        ...prev,
        productIDs: newProductIDs,
      };
    });
  };
const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    setSearching(true);       
    debounceTimeout.current = setTimeout(() => {
      setSearch(value); 
      setPage(1);       
    }, 500); 
  };

  const handleAddClick = () => {
    setEditingDiscount(null);
    setFormData({
      name: "",
      value: "",
      type: "",
      conditions: "",
      start_date: "",
      end_date: "",
      image: "",
      productIDs: [],
    });
    setShowForm(true);
  };

  const handleEditClick = (discount) => {
    setEditingDiscount(discount);
    setFormData({
      name: discount.name,
      value: discount.value || "",
      type: discount.type || "",
      conditions: discount.conditions || "",
      start_date: discount.start_date.split("T")[0],
      end_date: discount.end_date.split("T")[0],
       image: discount.image || "",
      productIDs: discount.products.map((p) => p.id),
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingDiscount(null);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("name", formData.name);
  data.append("value", formData.value);
  data.append("type", formData.type);
  data.append("conditions", formData.conditions);
  data.append("start_date", formData.start_date);
  data.append("end_date", formData.end_date);
  if (formData.image instanceof File) {
    data.append("image", formData.image);
  } else if (!editingDiscount && !formData.image) {
    data.append("image", "");
  }
  formData.productIDs.forEach((id) => {
    data.append("productIDs[]", id);
  });

  try {
    if (editingDiscount) {
for (let [key, value] of data.entries()) {
  console.log(key, value);
}
      data.append("_method", "PUT"); 
      await axiosInstance.post(`/discounts/${editingDiscount.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      await axiosInstance.post("/discounts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    setShowForm(false);
    fetchData();
  } catch (err) {
    console.error("Error saving discount:", err.response?.data);
    alert("Failed to save discount. Check console for details.");
  }
};

  return (
    <div className="editProfile">
      {!showForm && (
        <>
          <h2>Discounts</h2>
            <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search products..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="value">Value</option>
              <option value="type">Type</option>
              <option value="conditions">Conditions</option>
              <option value="start_date">Start Date</option>
              <option value="end_date">End Date</option>
              <option value="image">Image</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <button onClick={handleAddClick} className="addButton">Add Discount</button>
          <div style={{ position: 'relative' }}>
          {loading && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255,255,255,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
            }}>
                <p>Loading...</p></div>)}
               <div className="table-wrapper">
          <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Value</th>
                  <th>Type</th>
                  <th>Conditions</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Image</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {discounts.map((col) => (
                  <tr key={col.id}>
                    <td>{col.id}</td>
                    <td>{col.name}</td>
                    <td>{col.value}</td>
                    <td>{col.type}</td>
                    <td>{col.conditions}</td>
                    <td>{col.start_date?.split("T")[0]}</td>
                    <td>{col.end_date?.split("T")[0]}</td>
                    <td>
                      {col.image && <img src={col.image} alt={col.name} width={50} />}
                    </td>
                    <td>
                      {col.products.map((p) => (
                        <div key={p.id}>{p.name}</div>
                      ))}
                    </td>
                    <td>
                      <button onClick={() => handleEditClick(col)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
     </table>
            </div>
            </div>


                      <div className="pagination">
              <button 
                onClick={() => setPage(page - 1)} 
                disabled={page === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setPage(pageNumber)}
                    className={pageNumber === page ? 'active' : ''}
                  >
                    {pageNumber}
                  </button>
                );
              })}

              <button 
                onClick={() => setPage(page + 1)} 
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
             </>
          )}
:
     {showForm && (
        <div>
        <h3>{editingDiscount ? "Edit Discount" : "Add Discount"}</h3>
         {error && <p style={{color: 'red'}}>{error}</p>}
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="editProfile">
         <div className="subsection">
          <label>
            Name: <br />
            <input name="name" value={formData.name} onChange={handleChange} required />
          </label>
          <br />
         <label>
            Value: <br />
            <input name="value" value={formData.value} onChange={handleChange} required />
          </label>
          <br />
          <label>
            Type: <br />
            <input name="type" value={formData.type} onChange={handleChange}  />
          </label>
        </div>
       <div className="subsection">
         <label>
            Conditions: <br />
            <input name="conditions" value={formData.conditions} onChange={handleChange}  />
          </label>
          <label>
            Start Date: <br />
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              required
            />
          </label>
          <br />
          <label>
            End Date: <br />
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              required
            />
          </label></div>
          <br />
          <div className="subsection">
           <label>
            Image URL: <br />
                      <input type="file" accept="image/*" onChange={handleMainImageChange} />

          </label>
          <div>
            <b>Select Products:</b>
            <div
              style={{
                maxHeight: "200px",
                overflowY: "auto",
                border: "1px solid #ccc",
                padding: "5px",
                marginTop: "5px",
              }}
            >
              {products.map((product) => (
                <label key={product.id} style={{ display: "block" }}>
                  <input
                    type="checkbox"
                    checked={formData.productIDs.includes(product.id)}
                    onChange={() => handleCheckboxChange(product.id)}
                  />
                  {product.name}
                </label>
              ))}
            </div>
            </div>
          </div>

          <br />
          <button type="submit"  className="save">Save</button>
          <button type="button" onClick={handleCancel} className="cancel">
            Cancel
          </button>
       </form>
        </div>
      )}
    </div>
  );
};

export default DiscountsPage;
