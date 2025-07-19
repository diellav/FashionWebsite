import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import '../template/Navbar.css';
import SearchToggle from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
const Navbar = ({user, onLogout }) => {
  const role = localStorage.getItem('role');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate=useNavigate();

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
          <Link to="/products/filter">Shop</Link>
          <div className='navbar__list'>
            <div className="mega-menu-wrapper">
              <div className="mega-menu">
                <div className="mega-menu-content">
                  <div className="mega-menu-section">
                    <h4>Women</h4>
                    <ul>
                      <li><Link to="/products/women/dresses">Dresses</Link></li>
                      <li><Link to="/products/women/tops">Tops & Blouses</Link></li>
                      <li><Link to="/products/women/pants">Pants & Skirts</Link></li>
                      <li><Link to="/products/women/jeans">Jeans</Link></li>
                      <li><Link to="/products/women/jackets">Jackets & Coats</Link></li>
                      <li><Link to="/products/women/shoes">Shoes</Link></li>
                    </ul>
                  </div>

                  <div className="mega-menu-section">
                    <h4>Men</h4>
                    <ul>
                       <li><Link to="/products/men/shirts">Shirts</Link></li>
                        <li><Link to="/products/men/t-shirts">T-Shirts</Link></li>
                        <li><Link to="/products/men/jackets">Jackets & Coats</Link></li>
                        <li><Link to="/products/men/hoodies">Hoodies & Sweatshirts</Link></li>
                        <li><Link to="/products/men/jeans">Jeans</Link></li>
                        <li><Link to="/products/men/shoes">Shoes</Link></li>
                    </ul>
                  </div>

                  <div className="mega-menu-section">
                    <h4>Accessories</h4>
                    <ul>
                    <li><Link to="/products/accessories/watches">Watches</Link></li>
                      <li><Link to="/products/accessories/bags">Bags</Link></li>
                      <li><Link to="/products/accessories/jewelry">Jewelry</Link></li>
                      <li><Link to="/products/accessories/hats">Hats</Link></li>
                      <li><Link to="/products/accessories/sunglasses">Sunglasses</Link></li>
                    </ul>
                  </div>
                  <div className="mega-menu-section">
                    <h4>Shoes</h4>
                    <ul>
                      <li><Link to="/products/shoes/sneakers">Sneakers</Link></li>
                      <li><Link to="/products/shoes/heels">Heels</Link></li>
                      <li><Link to="/products/shoes/boots">Boots</Link></li>
                      <li><Link to="/products/shoes/sandals">Sandals</Link></li>
                    </ul>
                  </div>
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
