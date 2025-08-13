import React, { useState,useEffect } from 'react';
import { Link , useNavigate, useLocation, NavLink} from 'react-router-dom';
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
  const [shopOpen, setShopOpen] = useState(false);

const handleShopClick = (e) => {
  if (window.innerWidth <= 768) {
    e.preventDefault(); 
    if (shopOpen) {
      setShopOpen(false);
      navigate('/products/filter');
    } else {
      setShopOpen(true);
    }
  }
};

  const navigate=useNavigate();
  const location=useLocation();

  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories-navbar");
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories", err);
    }
  };
  fetchCategories();
}, []);
useEffect(() => {
  if (mobileMenuOpen) {
    document.body.classList.add('menu-open');
  } else {
    document.body.classList.remove('menu-open');
  }
}, [mobileMenuOpen]);

const parentCategories = categories.filter(cat => cat.parentID === null);

  const toggleMobileMenu = (e) => {
    e.stopPropagation();
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <nav  className={`navbar ${mobileMenuOpen ? 'mobile-open' : ''}`} onClick={closeMobileMenu}>
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
            <li><NavLink to="/home" activeclassname="active" >Home</NavLink></li>
         {mobileMenuOpen ? (
  <li className="navbar__item mobile-shop">
    <NavLink to="/products/filter" onClick={handleShopClick}>Shop</NavLink>
    {shopOpen && ( 
      <ul className="mobile-shop-list">
        {parentCategories.map(parent => (
          <span key={parent.id}>
            <NavLink 
              to={`/products/filter?category=${encodeURIComponent(parent.name.toLowerCase())}`}
            >
              {parent.name}
            </NavLink>
            {parent.children && parent.children.length > 0 && (
              <ul>
                {parent.children.map(child => (
                  <li key={child.id}>
                    <NavLink 
                      to={`/products/filter?category=${encodeURIComponent(parent.name.toLowerCase())}&subcategory=${encodeURIComponent(child.name.toLowerCase())}`}
                    >
                      {child.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </span>
        ))}
        <li>
          <NavLink to="#" className="happening-now-title">
            Happening Now
          </NavLink>
          <ul>
            <li><NavLink to="/sale">Sale</NavLink></li>
            <li><NavLink to="/recent-products">New Arrivals</NavLink></li>
            <li><NavLink to="/collection-products">New Collection</NavLink></li>
          </ul>
        </li>
      </ul>
    )}
  </li>
) : (

          <li className="navbar__item navbar__item--products">
          <li><NavLink to="/products/filter">Shop</NavLink></li>
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
                  <li><Link to="/sale" activeclassname="active" >Sale</Link></li>
                  <li><Link to="/recent-products" activeclassname="active" >New Arrivals</Link></li>
                  <li><Link to="/collection-products" activeclassname="active" >New Collection</Link></li>
                </ul>
              </div>
                </div>
              </div>
              </div>
            </div>
          </li>) }


            <li><NavLink to="/aboutUs" activeclassname="active">About Us</NavLink></li>
            <li><NavLink to="/contactUs" activeclassname="active">Contact</NavLink></li>
            {role === 'Admin' && <li><NavLink to="/dashboard">Dashboard</NavLink></li>}
           {mobileMenuOpen? (
            <>
            <hr></hr>
            {user && location.pathname.startsWith("/profile")? (
                  <>
                    <a href="/" onClick={onLogout}>Logout</a>
                  </>
                ) : (
                  !user &&<li><NavLink to="/login">Login</NavLink></li>
                )}
              </>
            ) : (
              user && !location.pathname.startsWith("/profile") ? (
                <li className="navbar__dropdown">
                  <span className="navbar__user">Hello, {user.username}</span>
                  <ul className="navbar__dropdown-menu">
                    {role!=='Admin'&&(
                    <li><NavLink to="/profile" activeclassname="active" >Profile</NavLink></li>)}
                    <li><a href="/" onClick={onLogout}>Logout</a></li>
                  </ul>
                </li>
              ) : (
                !user && <li><NavLink to="/login" activeclassname="active" >Login</NavLink></li>
              )
            )}
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faCartShopping} className='icon' onClick={()=>navigate('/cart')}/>
              {!mobileMenuOpen && <p className='message'>Cart</p>}
            </div>
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faHeartRegular} className='icon' onClick={()=>navigate('/wishlists')}/>
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
