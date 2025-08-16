import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../axios";
import CreateProductVariantForm from "./ProductVariantForm";
import '../../../template/ProfilePage.css';
const CreateProductVariantPage = () => {
  const [products, setProducts] = useState([]);
  const [pr, setPr] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('id');
    const [order, setOrder] = useState('asc');
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const debounceTimeout = useRef(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, prRes] = await Promise.all([
        axiosInstance.get('/product_variants',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/products-dashboard')
      ]);
     setProducts(Array.isArray(productsRes.data.data) ? productsRes.data.data : []);
      console.log('Products response:', productsRes.data.data);
      setTotalPages(productsRes.data.last_page);
      setPr(prRes.data);

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
  
  const handleAddClick = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteClick = async (productId) => {
    if(window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/product_variants/${productId}`);
        fetchData();
      } catch (err) {
        alert("Failed to delete product");
      }
    }
  };

 const handleFormSaved = () => {
    setShowForm(false);
    fetchData();
  };
  const handleFormCancel = () => {
    setShowForm(false);
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


  if(error) return <p style={{color: 'red'}}>{error}</p>;

  return (
     <div className="editProfile">
      {!showForm && (
        <>
          <h2>Product Variants List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search variants..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="color">Color</option>
              <option value="material">Material</option>
              <option value="productID">Product</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>


          <button onClick={handleAddClick} className="addButton">Add Variant</button>
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
                  <th>Color</th>
                  <th>Material</th>
                  <th>Product</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.color}</td>
                    <td>{prod.material}</td>
                   <td>{prod.product?.name || '-'}</td>
                    <td>
                      <button onClick={() => handleEditClick(prod)}>Edit</button>
                      <button onClick={() => handleDeleteClick(prod.id)}>Delete</button>
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

      {showForm && (
        <CreateProductVariantForm
          product={editingProduct}
          products={pr}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default CreateProductVariantPage;
