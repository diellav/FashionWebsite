import React, {useState, useEffect} from "react";
import axiosInstance from '../axios';
import '../template/HomePage.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faCreditCard, faPhoneVolume} from '@fortawesome/free-solid-svg-icons';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
const HomePage=()=>{
    const[user,setUser]=useState(null);
  const navigate=useNavigate();
  const[recent,setRecent]=useState([]);
  const[deals,setDeals]=useState([]);
   
    useEffect(() => {
    fetchUser();
    fetchRecentProducts();
    fetchDeals();
      }, []);

  const fetchRecentProducts=async()=>{
    try{
    const res=await axiosInstance.get('/recent-products');
    setRecent(res.data);
    }catch(err){
      console.error('Failed to fetch products', err);
    }
  };
  const fetchDeals=async()=>{
    try{
    const res=await axiosInstance.get('/deals-of-the-week');
    setDeals(res.data);
    }catch(err){
      console.error('Failed to fetch deals', err);
    }
  };
  
  const fetchUser=async ()=> {
    const fakeUser = { name: "Test User", email: "test@example.com" };
  setUser(fakeUser);
  };

  
  


  return (
    <div>
      <div className="main">
      <div className="mainFoto">
        <img src='../../../../images/MainPhoto.jpg'></img>
        <div className="text">
        <p>Welcome to Urban Gaze, where modern minimalism meets effortless sophistication.</p>
        <p id='secondText'>Crafted for the city, tailored for distinction.</p>
        <button onClick={()=>navigate('/products')}>Shop Now!</button>
        </div>
      </div>
      </div>
      <div className="insights">
        <div className="box">
        <FontAwesomeIcon icon={faTruckFast} id='icon' style={{color: "#4b1802",}} />
        <h3>Shipping? Sorted.</h3>
        <p>Spend $100+, and we'll ship it for free.</p>
        <p>No games. No surprises.</p>
        </div>
        <div className="box">
        <FontAwesomeIcon icon={faCreditCard} id='icon' style={{color: "#4b1802",}} />
        <h3> Pay How You Want!</h3>
        <p>Choose which ever form of payment suits you.</p>
        <p>You shop. We secure.</p>
        </div>
        <div className="box">
        <FontAwesomeIcon icon={faPhoneVolume} id='icon' style={{color: "#4b1802",}} />
        <h3>We’re Up 24/7</h3>
        <p>Late-night cart drama? We got you.</p>
        <p>DM, chat, or email - we're always on.</p>
        </div>
      </div>
      <div className="main_products">
      <div className="products">
        <div className="box" id='women'>
        <h4>Women</h4>
        <p>Modern styles for every mood.</p>
        <p>Explore curated fits, fresh silhouettes, and seasonal drops tailored for her.</p>
        <p>Shop dresses, tops, pants, jackets & more.</p>
        </div>
        <div className="box" id='men'>
        <h4>Men</h4>
        <p>Laid-back, clean, and confident.</p>
        <p>Discover street-ready styles, smart layers, and versatile staples made to move with your lifestyle.</p>
        <p>Tees, cargos, outerwear, and everything in between.</p>
        </div>
         <div className="box" id='shoes'>
        <h4>Shoes</h4>
        <p>Fresh kicks. Solid steps.</p>
        <p>From chill everyday sneakers to boots that turn heads — we’ve got your style covered from the ground up.</p>
        <p>Sneakers, boots, sandals, heels, slides & more.</p>
        </div>
        <div className="box" id='accessories'>
        <h4>Accessories</h4>
        <p>The details that complete the look.</p>
        <p>Level up your fit with bags, jewelry, shades, and more. Minimal or bold — it’s your move.</p>
        <p>Bags, watches, caps, rings, sunglasses & more.</p>
        </div>
      </div>
      </div>
      <hr></hr>
        <div className="main_arrivals">
         <h3>New Arrivals</h3>
          <div className="arrivals">
          {recent.length>0 ? (
            <Slider
              dots={true}
              infinite={true}
              speed={500}
              slidesToShow={4}
              slidesToScroll={1}
              responsive={[
                {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
            },
          },
              { 
                breakpoint: 600,
                settings: {
                  slidesToShow: 1,
                  slidesToScroll: 1,
                },
              },
            ]}>
          {recent.map(product=>(
            <div key={product.id} className="product-slide">
              <img src={product.main_image} alt={product.name}
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}></img>
              <h5>{product.name}</h5>
              <p>${product.price}</p>
            </div>
          ))}
            </Slider>):(<p>No new products this week</p>)}
          </div>
          </div>
          <hr></hr>
          <div className="main_deals">
            <div className="deals">
               <h3>Deals of the week</h3>
              {deals.length>0?(
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={5000}
              >
                {deals.map(deals=>(
                   <div key={deals.id} className="discount-slide">
                    <img src={deals.image} alt={deals.name}/>
                     <div className="text">
                  <h2>{deals.name}</h2>
                   <h3>Discount: {deals.value}{deals.type === 'percentage' ? '%' : '$'}</h3>
                  <p>{deals.conditions}</p></div>
                </div>
                ))}</Slider>
              ):(
                <p>No discounts for this week</p>
              )}
            </div>
          </div>
          <hr></hr>
          <div>

          </div>
        <div>

        <br></br>
        <br></br>
        <br></br>
        {user && (
          <div>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
       </div>
       )}

        
      </div>
    </div>
  );
};

export default HomePage;