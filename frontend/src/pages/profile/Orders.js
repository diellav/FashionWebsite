import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axiosInstance.get("/orders/my").then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <p><b>Order Reference Number:</b> {order.id}</p>
              <p><b>Total:</b> €{order.total_price}</p>
              <p><b>Status:</b> {order.status}</p>
              <p><b>Created:</b> {new Date(order.created_at).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
