import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../axios";
import "../../../template/ProfilePage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [orderItems, setOrderItems] = useState({});
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debounceTimeout = useRef(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [ordersRes, usersRes] = await Promise.all([
        axiosInstance.get("/orders", {
          params: { page, limit, sort, order, search },
        }),
        axiosInstance.get("/users-dashboard"),
      ]);
      setOrders(ordersRes.data.data);
      setTotalPages(ordersRes.data.last_page);
      setUsers(usersRes.data);
    } catch {
      setError("Failed to load orders");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const fetchOrderItems = async (orderID) => {
    if (orderItems[orderID]) {
      setExpandedOrderId(expandedOrderId === orderID ? null : orderID);
      return;
    }
    try {
      const res = await axiosInstance.get(`/order_items-dashboard/${orderID}`);
      setOrderItems((prev) => ({ ...prev, [orderID]: res.data }));
      setExpandedOrderId(orderID);
    } catch {
      alert("Failed to load order items");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, sort, order, search]);

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

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="editProfile">
      <h2>Orders List</h2>
       <p className="helper-text">Click on a order to see it's items</p>

      <div className="search-sort-controls">
        <input
          type="text"
          placeholder="Search orders..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="id">ID</option>
          <option value="userID">User</option>
          <option value="total_price">Total Price</option>
          <option value="shipping_address">Shipping Address</option>
          <option value="payment_method">Payment Method</option>
          <option value="status">Status</option>
          <option value="created_at">Made at</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div style={{ position: "relative" }}>
        {loading && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(255,255,255,0.7)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <p>Loading...</p>
          </div>
        )}

        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Items</th>
                <th>Shipping Address</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
      {orders.map((order) => {
        const orderUser = users.find((u) => u.id === order.userID);
        return (
          <React.Fragment key={order.id}>
            <tr style={{ cursor: "pointer" }} onClick={() => fetchOrderItems(order.id)}  className={expandedOrderId === order.id ? "expanded" : ""} >
            <td>{order.id}</td>
            <td>{orderUser? `${orderUser.first_name} ${orderUser.last_name}`: "-"}</td>
              <td>{order.total_price}</td>
               <td>{order.items_count}</td>
              <td>{order.shipping_address}</td>
              <td>{order.payment_method}</td>
              <td>{order.status}</td>
              <td>{order.created_at?.split('T')[0]}</td>
            </tr>
{expandedOrderId === order.id && (
  <tr className="order-items-row">
    <td colSpan={4} style={{ padding: 0 }}>
      <div className="order-items-wrapper">
        <table className="table sub-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {orderItems[order.id]?.map((item) => (
              <tr key={item.id}>
                <td>{item.product?.name || "-"}</td>
                <td>
                  {item.product_variant
                    ? `${item.product_variant.color} - ${item.product_variant.material}`
                    : "-"}
                </td>
                <td>{item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </td>
  </tr>
)}

                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>
          Prev
        </button>
        {[...Array(totalPages)].map((_, i) => {
          const pageNumber = i + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={pageNumber === page ? "active" : ""}
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
    </div>
  );
};

export default OrdersPage;
