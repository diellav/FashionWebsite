import React from "react";
import {Link, useNavigate} from 'react-router-dom';
import {faInstagram, faXTwitter, faFacebook, faTiktok} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../template/AboutUs.css';
import '../template/AboutUsResponsive.css';
const AboutUs=()=>{
 const navigate=useNavigate();

return(
<div>
   <div className="main">
      <div className="mainF">
        <img src='../../../../images/AboutUs/aboutUs.jpg' alt='aboutUs'></img>
        <div className="txt">
        <h2>About UrbanGaze</h2>
        <p id='secondText'>Find out Why Our Company Excels at What It Does!</p>
        </div>
      </div>
    </div>
    <div className="introduction">
            <h2>Our Story</h2>
            <div className="intro">
            <p>UrbanGaze began in a small loft in downtown Los Angeles, where two childhood friends—both passionate about street culture, design, and sustainability—decided to create something different. What started as a late-night conversation over thrifted fabrics and marker sketches quickly evolved into a brand with a bold mission: to capture the raw essence of the city and turn it into wearable art. With just a sewing machine, a few rolls of fabric, and a whole lot of vision, UrbanGaze was born.</p>
            <p>Influenced by the rhythm of the streets, underground movements, and the unapologetic spirit of youth, UrbanGaze combines modern silhouettes with gritty authenticity. From hand-printed tees to limited-run jackets, every piece tells a story of rebellion, identity, and creativity. We're not just another fashion label—we're a platform for those who dare to stand out, speak up, and wear their truth.</p>
            <p>Today, UrbanGaze is more than just clothing—it's a culture. We've grown from that little loft into a global community of artists, trendsetters, and everyday pioneers. But our roots remain strong. We continue to design with heart, push boundaries, and stay true to the street. This is our journey, and we’re just getting started. Welcome to UrbanGaze.</p>
            <img src='../../../../images/AboutUs/ourstory.jpg' alt='Our Story'></img>
            </div>
    </div>

    <div className="achievements">
        <div className="bar">
            <div className="group">
            <h3>15+</h3><h3>Years of Style</h3>
            </div>
            <div className="group">
            <h3>200k+</h3><h3>Stylish Customers</h3>
            </div>
             <div className="group">
            <h3>99%</h3><h3>Satisfaction Rate</h3>
            </div>
             <div className="group">
            <h3>35+</h3><h3>Fashion Awards</h3>
            </div>
            <div className="group">
            <h3>50+</h3><h3>Countries Shipped</h3>
            </div>
        </div>
    </div>
    <div className="sections">
        <div className="section">
            <div className="msg">
            <h3>We serve style</h3>
             <p>At the heart of everything we do is a deep love for style that empowers. We believe fashion is more than just what you wear — it’s a form of self-expression, a statement, and a feeling. That’s why we work tirelessly to bring you curated collections that blend global trends with timeless aesthetics. Whether you're dressing up for a big event or elevating your everyday look, we’re here to help you show up with confidence and authenticity. With us, style isn’t just served — it’s celebrated.</p>
       </div>
        <div className="img">
        <img src='../../../../images/AboutUs/style.jpg' alt='style'></img></div>
        </div>
        <div className="section">
            <div className="img">
            <img src='../../../../images/AboutUs/quality.jpg' alt='quality'></img></div>
             <div className="msg">
            <h3>Quality materials</h3>
            <p>Every piece in our collection is designed to feel as incredible as it looks. We handpick high-quality fabrics that offer comfort, durability, and elegance — because your wardrobe deserves the best. From buttery-soft cottons to structured silks and sustainable blends, we don’t compromise on materials. Behind every stitch is attention to detail and craftsmanship that stands the test of time. Great fashion starts with great fabric, and we make sure you experience that with every wear.</p>
        </div>
        </div>
        <div className="section">
            <div className="msg">
            <h3>Fast and trusting shipping</h3>
            <p>We know you can’t wait to wear your new favorites — and you shouldn’t have to. That’s why we’ve streamlined our shipping process to get your orders to you quickly, safely, and reliably. With real-time tracking, secure packaging, and a support team ready to help, you can shop with total peace of mind. Whether it's your first order or your fiftieth, we treat every delivery like it matters — because it does. Fashion should be fast, but never rushed, and always handled with care.</p>
        </div>
        <div className="img">
        <img src='../../../../images/AboutUs/shipping.jpg' alt='shipping'></img></div>  
        </div>
    </div>
    
     <div className="social_media">
        <h2>Follow Us</h2>
        <h5 style={{fontStyle:"italic"}}>On Social Media</h5>
      <div className="socials">
        <div className="box">
        <FontAwesomeIcon icon={faInstagram} className='socialIcon'/>
        <p>@urbangaze</p>
        </div>
        <div className="box">
        <FontAwesomeIcon icon={faXTwitter} className='socialIcon'/>
        <p>@itsUrbanGaze</p>
        </div>
        <div className="box">
        <FontAwesomeIcon icon={faFacebook} className='socialIcon' />
        <p>@urbangaze</p>
        </div>
        <div className="box">
        <FontAwesomeIcon icon={faTiktok} className='socialIcon'/>
        <p>@TheUrbanGaze</p>
        </div>
      </div>
 </div>
</div>        
);
};
export default AboutUs;