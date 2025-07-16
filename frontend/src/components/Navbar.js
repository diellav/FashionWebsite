import React, { useState } from 'react';
import { Link , useNavigate} from 'react-router-dom';
import '../template/Navbar.css';
import SearchToggle from './SearchBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import {faCartShopping} from '@fortawesome/free-solid-svg-icons'
const Navbar = ({ onLogout }) => {
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate=useNavigate();
  if (!user) return null;

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
            <li><Link to="/products">Shop</Link></li>
            <li><Link to="/aboutUs">About Us</Link></li>
            <li><Link to="/contactUS">Contact</Link></li>
            {role === 'Admin' && <li><Link to="/dashboard">Dashboard</Link></li>}
           {mobileMenuOpen? (
            <>
            <hr></hr>
            <li><Link to="/profile">Profile</Link></li>
                <li><a href="/" onClick={onLogout}>Logout</a></li></>
           ):(
              <li className="navbar__dropdown">
              <span className="navbar__user">Hello, {user.username}</span>
              <ul className="navbar__dropdown-menu">
                <li><Link to="/profile">Profile</Link></li>
                <li><a href="/" onClick={onLogout}>Logout</a></li>
              </ul>
            </li> 
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
