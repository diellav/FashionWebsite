import React from "react";
import {Link } from 'react-router-dom';
const Footer=()=>{
 const user = JSON.parse(localStorage.getItem('user'));
  if (!user){
    return null;
  }
    return(
    <div>
        <div>


           <div>
            <h2>UrbanGaze</h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                 Sed non lacus ornare, pulvinar magna id, tincidunt orci. Quisque tempus enim sit amet lectus 
                 iaculis aliquam. Duis erat risus, pharetra vel ultricies vitae, rutrum sed nibh. Nulla facilisi. 
                 Nulla facilisi. Donec vel placerat nisl.
            </p>
            <div>
                <p>Logos</p>
            </div>
            </div> 
            
            <div>
                <h4>Our store</h4>
                <ul>
                <Link to='/home'>Home</Link>
                <Link to='/products'>Shop</Link>
                <Link to='/aboutUs'>About Us</Link>
                <Link to='/contactUs'>Contact Us</Link>
                </ul>
            </div>
            <div>
                <h4>Your profile</h4>
                <ul>
                <Link to='/profile'>Profile</Link>
                <Link to='/orders'>Orders</Link>
                <Link to='/questions'>FAQ</Link>
                </ul>
            </div>
            <div>
                <h4>Information</h4>
                <ul>
                <Link to='/returns'>Return Policy</Link>
                <Link to='/privacy'>Privacy</Link>
                </ul>
            </div>

        </div>
        <div> 
            <p>Copyright......</p>
        </div>
    </div>
    );

};
export default Footer;