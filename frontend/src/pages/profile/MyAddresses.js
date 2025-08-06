import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    axiosInstance.get("/my-addresses").then(res => {
      setAddresses(res.data);
    });
  }, []);

  if (addresses.length === 0) return <p>You have no addresses saved.</p>;

  return (
    <div className="addresses-list">
      <h2>My Addresses</h2>
      {addresses.map((address) => (
        <div key={address.id} className="address-card">
          <p><b>Country:</b> {address.country}</p>
          <p><b>City:</b> {address.city}</p>
          <p><b>Postal Code:</b> {address.postal_code}</p>
          <p><b>Address:</b> {address.address}</p>
        </div>
      ))}
    </div>
  );
};

export default MyAddresses;
