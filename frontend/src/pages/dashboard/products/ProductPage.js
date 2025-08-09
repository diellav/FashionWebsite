import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../axios";
import CreateProductForm from "./ProductForm";
import '../../../template/ProfilePage.css';
const CreateProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [sort, setSort] = useState('name');
    const [order, setOrder] = useState('asc');
    const [search, setSearch] = useState('');
    const [searching, setSearching] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const debounceTimeout = useRef(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        axiosInstance.get('/products',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/categories-navbar'),
      ]);
     setProducts(Array.isArray(productsRes.data.data) ? productsRes.data.data : []);
      console.log('Products response:', productsRes.data.data);
      setTotalPages(productsRes.data.last_page);
     setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);

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
        await axiosInstance.delete(`/products/${productId}`);
        alert("Product deleted successfully");
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
          <h2>Products List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="name">Name</option>
              <option value="description">Description</option>
              <option value="price">Price</option>
              <option value="categoryID">Category</option>
              <option value="main_image">Image</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>


          <button onClick={handleAddClick} className="addButton">Add Product</button>
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
                  <th>Description</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(prod => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{prod.name}</td>
                    <td>{prod.description}</td>
                    <td>{prod.price}</td>
                   <td>{categories?.find(c => c.id === prod.categoryID)?.name || '-'}</td>
                    <td>{prod.main_image}</td>
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
        <CreateProductForm
          product={editingProduct}
          categories={categories}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default CreateProductPage;
