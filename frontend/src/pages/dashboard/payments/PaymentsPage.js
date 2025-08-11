import React, { useState, useEffect,useRef } from "react";
import axiosInstance from "../../../axios";
import '../../../template/ProfilePage.css';
const PaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [users, setUsers] = useState([]);
  const [Order, setOrderPs] = useState([]);
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
      const [paymentsRes, usersRes,OrderRes] = await Promise.all([
        axiosInstance.get('/payments',{params: {page,limit,sort,order,search}}),
        axiosInstance.get('/users-dashboard'),
        axiosInstance.get('/orders-dashboard'),
      ]);
      setPayments(paymentsRes.data.data);
      setTotalPages(paymentsRes.data.last_page);
      setUsers(usersRes.data);
      setOrderPs(OrderRes.data);
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
          <h2>Payments List</h2>
             <div className="search-sort-controls">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchInput}
              onChange={handleSearchChange}
            />
            <select value={sort} onChange={e => setSort(e.target.value)}>
              <option value="id">ID</option>
              <option value="userID">User</option>
              <option value="orderID">Order</option>
               <option value="total_price">Total</option>
               <option value="payment_status">Status</option>
               <option value="transaction_reference">Transaction Ref.</option>
               <option value="created_at">Created At</option>
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
                <th>Order Reference</th>
                <th>Total</th>
                <th>Status</th>
                <th>Transaction Reference</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => {
                const paymentUser = users.find(r => r.id === payment.userID);
                const paymentOrderP = Order.find(r => r.id === payment.orderID);
                return (
                  <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{paymentUser ? paymentUser.first_name : '-'} {paymentUser ? paymentUser.last_name : '-'}</td>
                    <td>{paymentOrderP ? paymentOrderP.id : '-'}</td>
                    <td>{payment.total_price}</td>
                    <td>{payment.payment_status}</td>
                    <td>{payment.transaction_reference}</td>
                    <td>{payment.created_at?.split('T')[0]}</td>
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

export default PaymentsPage;
