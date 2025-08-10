import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../axios";
import CreateProductImagesForm from "./ProductImagesForm";
import '../../../template/ProfilePage.css';
const CreateProductImagesPage = () => {
  const [products, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingImage, setEditingImage] = useState(null);
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
      const [imagesRes, productsRes,variantsRes] = await Promise.all([
        axiosInstance.get('/product_images',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/products-dashboard'),
        axiosInstance.get('/product_variants-dashboard'),
      ]);
     setImages(Array.isArray(imagesRes.data.data) ? imagesRes.data.data : []);
      console.log('Images response:', imagesRes.data.data);
      setTotalPages(imagesRes.data.last_page);
     setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);
     setVariants(Array.isArray(variantsRes.data) ? variantsRes.data : []);

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
    setEditingImage(null);
    setShowForm(true);
  };

  const handleEditClick = (image) => {
    setEditingImage(image);
    setShowForm(true);
  };

  const handleDeleteClick = async (imageId) => {
    if(window.confirm("Are you sure you want to delete this image?")) {
      try {
        await axiosInstance.delete(`/product_images/${imageId}`);
        alert("Image deleted successfully");
        fetchData();
      } catch (err) {
        alert("Failed to delete image");
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
          <h2>Images List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search images..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="productID">Product</option>
              <option value="variantID">Variant</option>
              <option value="images">Image</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>


          <button onClick={handleAddClick} className="addButton">Add Image</button>
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
                  <th>Product</th>
                  <th>Variant</th>
                  <th>Images</th>
                </tr>
              </thead>
              <tbody>
                {images.map(prod => (
                  <tr key={prod.id}>
                    <td>{prod.id}</td>
                    <td>{products?.find(c => c.id === prod.productID)?.name || '-'}</td>
                    <td>{variants?.find(c => c.id === prod.variantID)?.color || '-'}</td>
                    <td>{prod.images}</td>
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
        <CreateProductImagesForm
          image={editingImage}
          products={products}
          variants={variants}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default CreateProductImagesPage;
