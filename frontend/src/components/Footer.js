import React from "react";
import { Link } from "react-router-dom";
import '../template/Footer.css'
const Footer = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <>
    <div className="foot">
      <div className="footer">
        <div className="tt">
          <h2 id="urban">UrbanGaze</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed non lacus ornare, pulvinar magna id, tincidunt orci. 
            Quisque tempus enim sit amet lectus iaculis aliquam. Duis erat risus,
            pharetra vel ultricies vitae, rutrum sed nibh. Nulla facilisi.
          </p>
          <div className="social">
            <p>Logos</p>
          </div>
        </div>

        <div className="links">
          <p className="newLine">Our store</p>
          <Link to="/home">Home</Link>
          <Link to="/products/filter">Shop</Link>
          <Link to="/aboutUs">About Us</Link>
          <Link to="/contactUs">Contact</Link>
        </div>
    <br></br>
        <div className="links">
          <p className="newLine">Information</p>
          <Link to="/returns">Return Policy</Link>
          <Link to="/privacy">Privacy</Link>
        </div>
        <br></br>
    {user &&(
        <div className="links">
          <p className="newLine">Your profile</p>
          <Link to="/profile">Profile</Link>
          <Link to="/profile/orders">Orders</Link>
          <Link to="/home#faq">FAQ</Link>
        </div>
    )}

      </div>

      <div id="liner">
        <div className="line"></div>
        <div className="end">
          <p style={{ marginTop: "10px", textAlign: "center" }}>
            © {new Date().getFullYear()} UrbanGaze. All rights reserved.
          </p>
           <p style={{ fontSize: "12px", color: "#888", marginTop: "5px", textAlign: "center" }}>
      Disclaimer: This website is for demonstration purposes only.  
      All products, brand names, and images belong to their respective owners.  
      We do not claim ownership and do not collect personal data for misuse.
        <br></br>Some images on this site are sourced from Freepik.com.  
  All rights belong to their respective owners.
    </p>
        </div>
      </div>
      </div>
    </>
  );
};

export default Footer;
