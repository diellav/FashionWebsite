import React, { useState, useEffect,useRef } from "react";
import axiosInstance from "../../../axios";
import '../../../template/ProfilePage.css';
const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
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
      const [contactsRes] = await Promise.all([
        axiosInstance.get('/contacts',{params: {page,limit,sort,order,search}}),
      ]);
      setContacts(contactsRes.data.data);
      setTotalPages(contactsRes.data.last_page);
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
          <h2>Contacts List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="email">Email</option>
              <option value="phone_number">Phone Number</option>
              <option value="message">Message</option>
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map(contact => {
                return (
                  <tr key={contact.id}>
                    <td>{contact.id}</td>
                    <td>{contact.first_name}</td>
                    <td>{contact.last_name}</td>
                    <td>{contact.email}</td>
                    <td>{contact.phone_number}</td>
                    <td>{contact.message}</td>
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

export default ContactsPage;
