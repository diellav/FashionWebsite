import React from 'react';
import {Routes, Route, NavLink, Navigate, Link} from 'react-router-dom';
import '../../template/ProfilePage.css';
import ProfileInfo from '../profile/ProfileInfo';
import EditProfile from '../profile/EditProfile';
import ChangePassword from '../profile/ChangePassword';
import UsersPage from './users/UsersPage';
import CategoryPage from './category/CategoryPage';
import CreateProductPage from './products/ProductPage';
import CreateProductVariantPage from './products/ProductVariantPage';
import CreateProductImagesPage from './products/ProductImagesPage';
import ContactsPage from './contact/ContactPage';
import ReviewsPage from './reviews/ReviewsPage';
import WishlistsPage from './wishlist/WishlistPage';
import PaymentsPage from './payments/PaymentsPage';
import CartsPage from './carts/CartsPage';
import OrdersPage from './orders/OrdersPage';
import CollectionsPage from './collections/CollectionsPage';
import DiscountsPage from './discounts/DiscountsPage';
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
          <li><NavLink to="/dashboard/product_variants" activeclassname="active">Variants</NavLink></li>
          <li><NavLink to="/dashboard/product_images" activeclassname="active">Images</NavLink></li>
          <li><NavLink to="/dashboard/contacts" activeclassname="active">Contacts</NavLink></li>
          <li><NavLink to="/dashboard/reviews" activeclassname="active">Reviews</NavLink></li>
          <li><NavLink to="/dashboard/wishlists" activeclassname="active">Wishlists</NavLink></li>
          <li><NavLink to="/dashboard/payments" activeclassname="active">Payments</NavLink></li>
          <li><NavLink to="/dashboard/carts" activeclassname="active">Carts</NavLink></li>
          <li><NavLink to="/dashboard/orders" activeclassname="active">Orders</NavLink></li>
          <li><NavLink to="/dashboard/collections" activeclassname="active">Collections</NavLink></li>
          <li><NavLink to="/dashboard/discounts" activeclassname="active">Discounts</NavLink></li>
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
          <Route path="/product_variants" element={<CreateProductVariantPage/>} />
          <Route path="/product_images" element={<CreateProductImagesPage/>} />
          <Route path="/contacts" element={<ContactsPage/>} />
          <Route path="/reviews" element={<ReviewsPage/>} />
          <Route path="/wishlists" element={<WishlistsPage/>} />
          <Route path="/payments" element={<PaymentsPage/>} />
          <Route path="/carts" element={<CartsPage/>} />
          <Route path="/orders" element={<OrdersPage/>} />
          <Route path="/collections" element={<CollectionsPage/>} />
          <Route path="/discounts" element={<DiscountsPage/>} />
          <Route path="edit" element={<EditProfile />} />
          <Route path="change-password" element={<ChangePassword />} />
        </Routes>
      </main>
    </div>
  );
};

export default Dashboard;
