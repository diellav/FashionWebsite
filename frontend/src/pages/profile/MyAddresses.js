import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const MyAddresses = () => {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    axiosInstance.get("/my-addresses").then(async res => {
      const enriched = await Promise.all(
        res.data.map(async (addr) => {
          const geo = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              `${addr.address}, ${addr.city}, ${addr.country}`
            )}`
          ).then(res => res.json());

          return {
            ...addr,
            lat: geo[0]?.lat || null,
            lon: geo[0]?.lon || null,
          };
        })
      );
      setAddresses(enriched.filter(addr => addr.lat && addr.lon));
    });
  }, []);

  if (addresses.length === 0) return <p>You have no addresses saved or they couldn’t be geolocated.</p>;

  const center = [addresses[0].lat, addresses[0].lon];

  return (
    <div className="addresses-container">
      <h2>My Addresses</h2>
    <div className="map_address">
      <div className="addresses-list">
        {addresses.map((address) => (
          <div key={address.id} className="address-card">
            <p><b>Country:</b> {address.country}</p>
            <p><b>City:</b> {address.city}</p>
            <p><b>Postal Code:</b> {address.postal_code}</p>
            <p><b>Address:</b> {address.address}</p>
            <hr></hr>
          </div>
        ))}
      </div>
       <div className="map-container">
        <MapContainer center={center} zoom={5} scrollWheelZoom={true} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          />
          {addresses.map((address) => (
            <Marker key={address.id} position={[address.lat, address.lon]}>
              <Popup>
                <b>{address.country}</b><br />
                {address.city}<br />
                {address.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      </div>
    </div>
  );
};

export default MyAddresses;
