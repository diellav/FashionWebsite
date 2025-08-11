import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../../../axios";
import "../../../template/ProfilePage.css";

const CartsPage = () => {
  const [carts, setCarts] = useState([]);
  const [users, setUsers] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [expandedCartId, setExpandedCartId] = useState(null);
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

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const [cartsRes, usersRes] = await Promise.all([
        axiosInstance.get("/cart", {
          params: { page, limit, sort, order, search },
        }),
        axiosInstance.get("/users-dashboard"),
      ]);
      setCarts(cartsRes.data.data);
      setTotalPages(cartsRes.data.last_page);
      setUsers(usersRes.data);
    } catch {
      setError("Failed to load carts");
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const fetchCartItems = async (cartID) => {
    if (cartItems[cartID]) {
      setExpandedCartId(expandedCartId === cartID ? null : cartID);
      return;
    }
    try {
      const res = await axiosInstance.get(`/cart_items-dashboard/${cartID}`);
      setCartItems((prev) => ({ ...prev, [cartID]: res.data }));
      setExpandedCartId(cartID);
    } catch {
      alert("Failed to load cart items");
    }
  };

  useEffect(() => {
    fetchCarts();
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
      <h2>Carts List</h2>
       <p className="helper-text">Click on a cart to see it's items</p>

      <div className="search-sort-controls">
        <input
          type="text"
          placeholder="Search carts..."
          value={searchInput}
          onChange={handleSearchChange}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="id">ID</option>
          <option value="userID">User</option>
          <option value="created_at">Date</option>
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
                <th>Items</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
      {carts.map((cart) => {
        const cartUser = users.find((u) => u.id === cart.userID);
        return (
          <React.Fragment key={cart.id}>
            <tr style={{ cursor: "pointer" }} onClick={() => fetchCartItems(cart.id)}  className={expandedCartId === cart.id ? "expanded" : ""} >
            <td>{cart.id}</td>
            <td>{cartUser? `${cartUser.first_name} ${cartUser.last_name}`: "-"}</td>
              <td>{cart.items_count}</td>
              <td>{cart.created_at?.split('T')[0]}</td>
            </tr>
{expandedCartId === cart.id && (
  <tr className="cart-items-row">
    <td colSpan={4} style={{ padding: 0 }}>
      <div className="cart-items-wrapper">
        <table className="table sub-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {cartItems[cart.id]?.map((item) => (
              <tr key={item.id}>
                <td>{item.product?.name || "-"}</td>
                <td>
                  {item.variants
                    ? `${item.variants.color} - ${item.variants.material}`
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

export default CartsPage;
