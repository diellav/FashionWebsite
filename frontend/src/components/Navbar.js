import React, { useState,useEffect } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import '../template/Navbar.css';
import SearchToggle from './SearchBar';
import axiosInstance from '../axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
const Navbar = ({user, onLogout }) => {
  const role = localStorage.getItem('role');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const navigate=useNavigate();

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };
  fetchCategories();
}, []);
const parentCategories = categories.filter(cat => cat.parentID === null);

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar" onClick={closeMobileMenu}>
      <div className="navbar__list">
        <p className="navbar__logo" onClick={()=>navigate('/home')}>UrbanGaze</p>
        <button
          className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
          type="button"
        >
          <span />
          <span />
          <span />
        </button>
        <div className={`nav__list ${mobileMenuOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
           {mobileMenuOpen? (<><SearchToggle/></>) : (<></>) }
          <ul>
            <li><Link to="/home">Home</Link></li>
             {mobileMenuOpen? (
               <Link to="/products">Shop</Link>
             ) : (
          <li className="navbar__item navbar__item--products">
          <a href="/products/filter" id='link'>Shop</a>
          <div className='navbar__list'>
            <div className="mega-menu-wrapper">
              <div className="mega-menu">
                <div className="mega-menu-content">
            {parentCategories.map(parent => (
            <div className="mega-menu-section" key={parent.id}>
              <h4 onClick={() => navigate(`/products/filter?category=${encodeURIComponent(parent.name.toLowerCase())}`)}>
                {parent.name}
              </h4>
              <ul>
                {parent.children.map(child => (
                  <li key={child.id}>
                    <Link to={`/products/filter?category=${encodeURIComponent(parent.name.toLowerCase())}&subcategory=${encodeURIComponent(child.name.toLowerCase())}`}>
                      {child.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
              <div className="mega-menu-section">
                <h4>Happening Now</h4>
                <ul>
                  <li><Link to="/products/sale">Sale</Link></li>
                  <li><Link to="/products">New Arrivals</Link></li>
                </ul>
              </div>
                </div>
              </div>
              </div>
            </div>
          </li>) }


            <li><Link to="/aboutUs">About Us</Link></li>
            <li><Link to="/contactUs">Contact</Link></li>
            {role === 'Admin' && <li><Link to="/dashboard">Dashboard</Link></li>}
           {mobileMenuOpen? (
            <>
            <hr></hr>
            {user ? (
                  <>
                    <li><Link to="/profile">Profile</Link></li>
                    <li><a href="/" onClick={onLogout}>Logout</a></li>
                  </>
                ) : (
                  <li><Link to="/login">Login</Link></li>
                )}
              </>
            ) : (
              user ? (
                <li className="navbar__dropdown">
                  <span className="navbar__user">Hello, {user.username}</span>
                  <ul className="navbar__dropdown-menu">
                    <li><Link to="/profile">Profile</Link></li>
                    <li><a href="/" onClick={onLogout}>Logout</a></li>
                  </ul>
                </li>
              ) : (
                <li><Link to="/login">Login</Link></li>
              )
            )}
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faCartShopping} className='icon' />
              {!mobileMenuOpen && <p className='message'>Cart</p>}
            </div>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faHeartRegular} className='icon' />
              {!mobileMenuOpen && <p className='message'>Wishlist</p>}
            </div>
           {!mobileMenuOpen && <div><SearchToggle/></div>}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
