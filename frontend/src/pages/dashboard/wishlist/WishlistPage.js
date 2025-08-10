import React, { useState, useEffect,useRef } from "react";
import axiosInstance from "../../../axios";
import '../../../template/ProfilePage.css';
const WishlistsPage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [users, setUsers] = useState([]);
  const [product, setProducts] = useState([]);
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      const [wishlistsRes, usersRes,productRes, variantRes] = await Promise.all([
        axiosInstance.get('/wishlists-dashboard',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/users'),
        axiosInstance.get('/products-dashboard'),
        axiosInstance.get('/product_variants-dashboard'),
      ]);
      setWishlists(wishlistsRes.data.data);
      setTotalPages(wishlistsRes.data.last_page);
      setUsers(usersRes.data.data);
      setProducts(productRes.data);
      setVariants(variantRes.data);
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


  const handleDeleteClick = async (wishlistId) => {
    if (window.confirm("Are you sure you want to delete this wishlist?")) {
      try {
        await axiosInstance.delete(`/wishlists/${wishlistId}`);
        alert("Wishlist deleted successfully");
        fetchData();
      } catch (err) {
        alert("Failed to delete wishlist");
      }
    }
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

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="editProfile">
        <>
          <h2>Wishlists List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search wishlists..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="userID">User</option>
              <option value="productID">Product</option>
               <option value="wishlist_text">Variant</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
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
                <th>User</th>
                <th>Product</th>
                <th>Variant</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {wishlists.map(wishlist => {
                const wishlistUser = users.find(r => r.id === wishlist.userID);
                const wishlistProduct = product.find(r => r.id === wishlist.productID);
                const wishlistVariant = variants.find(r => r.id === wishlist.variantID);
                return (
                  <tr key={wishlist.id}>
                    <td>{wishlist.id}</td>
                    <td>{wishlistUser ? wishlistUser.first_name : '-'} {wishlistUser ? wishlistUser.last_name : '-'}</td>
                    <td>{wishlistProduct ? wishlistProduct.name : '-'}</td>
                    <td>{wishlistVariant ? wishlistVariant.color : '-'} - {wishlistVariant ? wishlistVariant.material : '-'}</td>
                    <td>
                      <button onClick={() => handleDeleteClick(wishlist.id)}>Delete</button>
                    </td>
                  </tr>
                )
              })}
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
    </div>
  );
};

export default WishlistsPage;
