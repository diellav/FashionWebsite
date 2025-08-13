import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../axios";
import SizesForm from "./SizesForm";
import '../../../template/ProfilePage.css';

const SizesPage = () => {
  const [sizes, setSizes] = useState([]);
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingSize, setEditingSize] = useState(null);
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
  const fetchSizes = async () => {
    try {
      setLoading(true);
      const sizesRes = await axiosInstance.get('/sizes_stock-dashboard', { params: { page, limit, sort, order, search } });
      setSizes(Array.isArray(sizesRes.data.data) ? sizesRes.data.data : []);
      setTotalPages(sizesRes.data.last_page || 1);
    } catch (err) {
      setError("Failed to load sizes");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };
  const fetchProductsAndVariants = async () => {
    try {
      const [productsRes, variantsRes] = await Promise.all([
        axiosInstance.get('/products-dashboard'),  
        axiosInstance.get('/product_variants-dashboard'),  
      ]);
      setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
      setVariants(Array.isArray(variantsRes.data) ? variantsRes.data : []);
    } catch {
      setError("Failed to load products or variants");
    }
  };

  useEffect(() => {
    fetchSizes();
  }, [page, limit, sort, order, search]);

  useEffect(() => {
    fetchProductsAndVariants();
  }, []);

  const handleAddClick = () => {
    setEditingSize(null);
    setShowForm(true);
  };

  const handleEditClick = (size) => {
    setEditingSize(size);
    setShowForm(true);
  };

  const handleDeleteClick = async (sizeId) => {
    if (window.confirm("Are you sure you want to delete this size?")) {
      try {
        await axiosInstance.delete(`/sizes_stock/${sizeId}`);
        alert("Size deleted successfully");
        fetchSizes();
      } catch {
        alert("Failed to delete size");
      }
    }
  };

  const handleFormSaved = () => {
    setShowForm(false);
    fetchSizes();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    setSearching(true);
    debounceTimeout.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 500);
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="editProfile">
      {!showForm && (
        <>
          <h2>Sizes List</h2>
          <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search sizes..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="size">Size</option>
              <option value="stock">Stock</option>
              <option value="productID">Product</option>
              <option value="variantID">Variant</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <button onClick={handleAddClick} className="addButton">Add Size</button>

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
                <p>Loading...</p>
              </div>
            )}

            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Size</th>
                    <th>Stock</th>
                    <th>Product</th>
                    <th>Variant</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sizes.map(s => {
                     const sizeProduct = products.find(p => p.id === s.productID);
                     const sizeVariant = variants.find(v => v.id === s.variantID);
                    return(
                    <tr key={s.id}>
                      <td>{s.id}</td>
                      <td>{s.size}</td>
                      <td>{s.stock}</td>
                      <td>{sizeProduct? sizeProduct.name : '-'}</td>
                      <td>{sizeVariant? sizeVariant.color : '-'} - {sizeVariant? sizeVariant.material : '-'}</td>
                      <td>
                        <button onClick={() => handleEditClick(s)}>Edit</button>
                        <button onClick={() => handleDeleteClick(s.id)}>Delete</button>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pagination">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}>Prev</button>
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
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
            <button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</button>
          </div>
        </>
      )}

      {showForm && (
        <SizesForm
          size={editingSize}
          products={products}
          variants={variants}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default SizesPage;
