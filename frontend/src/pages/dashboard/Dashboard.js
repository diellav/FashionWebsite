import React from 'react';
import {Routes, Route, NavLink, Navigate, Link} from 'react-router-dom';
import '../../template/ProfilePage.css';
import ProfileInfo from '../profile/ProfileInfo';
import EditProfile from '../profile/EditProfile';
import ChangePassword from '../profile/ChangePassword';
import UsersPage from './users/UsersPage';
import CategoryPage from './category/CategoryPage';
import CreateProductPage from './products/ProductPage';
const Dashboard = ({onLogout}) => {
  return (
    <div className="profile-page-container">
      <aside className="sidebar">
        <h2>My Account</h2>
        <ul>
          <li><NavLink to="/dashboard/info" activeclassname="active">Profile Info</NavLink></li>
           <li><NavLink to="/dashboard/change-password" activeclassname="active">Change Password</NavLink></li>
           <br></br>
           <h2>System Management</h2>
          <li><NavLink to="/dashboard/users" activeclassname="active">Users</NavLink></li>
          <li><NavLink to="/dashboard/categories" activeclassname="active">Categories</NavLink></li>
          <li><NavLink to="/dashboard/products" activeclassname="active">Products</NavLink></li>
          <br></br>
          <li><NavLink to="/" activeclassname="active" onClick={onLogout}>Logout</NavLink></li>
        </ul>
      </aside>

      <main className="profile-content">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard/info" replace />} />
          <Route path="info" element={<ProfileInfo />} />
          <Route path="users" element={<UsersPage/>} />
          <Route path="/categories" element={<CategoryPage/>} />
          <Route path="/products" element={<CreateProductPage/>} />
          <Route path="edit" element={<EditProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
