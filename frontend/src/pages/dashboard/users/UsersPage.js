import React, { useState, useEffect,useRef } from "react";
import axiosInstance from "../../../axios";
import CreateUserForm from "./UsersForm";
import '../../../template/ProfilePage.css';
const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('first_name');
  const [order, setOrder] = useState('asc');
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const debounceTimeout = useRef(null);
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, rolesRes] = await Promise.all([
        axiosInstance.get('/users',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/roles'),
      ]);
      setUsers(usersRes.data.data);
      setTotalPages(usersRes.data.last_page);
      setRoles(rolesRes.data);
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
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleDeleteClick = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/users/${userId}`);
        alert("User deleted successfully");
        fetchData();
      } catch (err) {
        alert("Failed to delete user");
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
          <h2>Users List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search users..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="gender">Gender</option>
              <option value="date_of_birth">Date of Birth</option>
              <option value="phone_number">Phone Number</option>
              <option value="address">Address</option>
              <option value="email">Email</option>
              <option value="username">Username</option>
              <option value="roleID">Role</option>
            </select>
            <select value={order} onChange={e => setOrder(e.target.value)}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>


          <button onClick={handleAddClick} className="addButton">Add User</button>
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>Gender</th>
                <th>Date Of Birth</th>
                <th>Phone Number</th>
                <th>Address</th>
                <th>Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const userRole = roles.find(r => r.id === user.roleID);
                return (
                  <tr key={user.id}>
                    <td>{user.first_name}</td>
                    <td>{user.last_name}</td>
                    <td>{user.gender}</td>
                    <td>{user.date_of_birth?.split('T')[0]}</td>
                    <td>{user.phone_number}</td>
                    <td>{user.address}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{userRole ? userRole.roleName : '-'}</td>
                    <td>
                      <button onClick={() => handleEditClick(user)}>Edit</button>
                      <button onClick={() => handleDeleteClick(user.id)}>Delete</button>
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
        <CreateUserForm
          user={editingUser}
          roles={roles}
          onSaved={handleFormSaved}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
};

export default UsersPage;
