import React, {useState} from 'react';
import {Routes, Route, NavLink, Navigate, Link} from 'react-router-dom';
import '../template/ProfilePage.css';
import ProfileInfo from './profile/ProfileInfo';
import Orders from './profile/Orders';
import EditProfile from './profile/EditProfile';
import ChangePassword from './profile/ChangePassword';
import MyAddresses from './profile/MyAddresses';
import { useSVGOverlay } from 'react-leaflet/SVGOverlay';

const ProfilePage = ({onLogout}) => {
  
  const [showFilters, setShowFilters] = useState(false);
  return (
    <> 
    <div className='myaccount'>
      <h4>My Account</h4>
        <button 
        className={`btn ${showFilters? 'shifted':''}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        <span>{showFilters ? 'X' : 'Menu'}</span>
      </button></div>
    <div className="profile-page-container">
       <div className={`filters-overlay ${showFilters ? 'visible' : ''}`}>
        <ul>
          <li><NavLink to="/profile/info" activeclassname="active">Profile Info</NavLink></li>
          <li><NavLink to="/profile/orders" activeclassname="active">My Orders</NavLink></li>
          <li><NavLink to="/profile/my-addresses" activeclassname="active">My Addresses</NavLink></li>
          <li><NavLink to="/wishlists" activeclassname="active">My Wishlist</NavLink></li>
          <li><NavLink to="/profile/change-password" activeclassname="active">Change Password</NavLink></li>
          <br></br>
            <li><NavLink to="/" activeclassname="active" onClick={onLogout} style={{fontSize:"larger"}}>Logout</NavLink></li>
        </ul>
        </div>
     

      <main className="profile-content">
        <Routes>
          <Route path="/" element={<Navigate to="/profile/info" replace />} />
          <Route path="/info" element={<ProfileInfo />} />
          <Route path="/my-addresses" element={<MyAddresses />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/edit" element={<EditProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </main>
    </div>
    </>
  );
};

export default ProfilePage;
