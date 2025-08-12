import React, { useState, useEffect,useRef } from "react";
import axiosInstance from "../../../axios";
import CreateAddressForm from "./AddressForm";
import '../../../template/ProfilePage.css';
const AddressPage = () => {
  const [addresss, setAddress] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingAddres, setEditingAddres] = useState(null);
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
      const [addresssRes, usersRes] = await Promise.all([
        axiosInstance.get('/addresses-dashboard',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/users-dashboard'),
      ]);
      setAddress(addresssRes.data.data);
      setTotalPages(addresssRes.data.last_page);
      setUsers(usersRes.data);
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
    setEditingAddres(null);
    setShowForm(true);
  };

  const handleEditClick = (address) => {
    setEditingAddres(address);
    setShowForm(true);
  };

  const handleDeleteClick = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await axiosInstance.delete(`/addresss/${addressId}`);
        alert("Addres deleted successfully");
        fetchData();
      } catch (err) {
        alert("Failed to delete address");
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

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="editProfile">
      {!showForm && (
        <>
          <h2>Address List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search addresss..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="userID">User</option>
              <option value="country">Country</option>
              <option value="city">City</option>
              <option value="postal_code">Postal Code</option>
            
              <option value="address">Address</option>
             

            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>


          <button onClick={handleAddClick} className="addButton">Add Addres</button>
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
                <th>Country</th>
                <th>City</th>
                <th>Postal Code</th>
                
                <th>Address</th>
              
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {addresss.map(address => {
                const addressUser = users.find(r => r.id === address.userID);
                return (
                  <tr key={address.id}>
                    <td>{address.id}</td>
                    <td>{addressUser ? addressUser.first_name : '-'} {addressUser ? addressUser.last_name : '-'}</td>
                    <td>{address.country}</td>
                    <td>{address.city}</td>
                    <td>{address.postal_code}</td>
                    <td>{address.address}</td>
                    <td>
                      <button onClick={() => handleEditClick(address)}>Edit</button>
                      <button onClick={() => handleDeleteClick(address.id)}>Delete</button>
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
      )}

      {showForm && (
        <CreateAddressForm
          address={editingAddres}
          users={users}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default AddressPage;
