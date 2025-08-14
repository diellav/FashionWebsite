import React, {useState, useEffect} from "react";
import axiosInstance from '../axios';
import '../template/HomePage.css';
import '../template/HomePageResponsive.css';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruckFast, faCreditCard, faPhoneVolume} from '@fortawesome/free-solid-svg-icons';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import FAQ from '../components/FAQ';
import LazyImage from './LazyImage';
const HomePage=()=>{
  const navigate=useNavigate();
  const[recent,setRecent]=useState([]);
  const[deals,setDeals]=useState([]);
  const[bestseller,setBestSeller]=useState([]);
  const[collection,setCollection]=useState([]);
   
    useEffect(() => {
    fetchRecentProducts();
    fetchDeals();
    fetchBestSellerProducts();
    fetchCollection();
      }, []);

  const fetchRecentProducts=async()=>{
    try{
    const res=await axiosInstance.get('/recent-products');
    setRecent(res.data.products);
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
    const fetchBestSellerProducts=async()=>{
    try{
    const res=await axiosInstance.get('/best-products');
    setBestSeller(res.data);
    }catch(err){
      console.error('Failed to fetch products', err);
    }
  };
  
   const fetchCollection=async()=>{
    try{
    const res=await axiosInstance.get('/collections-home');
    setCollection(res.data);

    }catch(err){
      console.error('Failed to fetch products', err);
    }
  };

  return (
    <div>
      <div className="main">
      <div className="mainFoto">
        <LazyImage src='../../../../images/MainPhoto.jpg'></LazyImage>
        <div className="text">
        <p>Welcome to Urban Gaze, where modern minimalism meets effortless sophistication.</p>
        <p id='secondText'>Crafted for the city, tailored for distinction.</p>
        <button onClick={()=>navigate('/products/filter')}>Shop Now!</button>
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
             <p onClick={()=>navigate('/recent-products')} id='allproducts'>See all products...</p>
          {recent.length>0 ? (
            <Slider
              dots={true}
               
              speed={500}
              slidesToShow={4}
              slidesToScroll={1}
               lazyLoad="progressive"
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
            <div key={product.id} className="product-slide" onClick={()=>navigate(`/products/${product.id}`)}>
              <LazyImage src={product.main_image} alt={product.name}
              style={{ width: '100%', height: '270px', objectFit: 'cover' }}></LazyImage>
              <h5>{product.name}</h5>
              {product.discounted_price ? (
              <>
                <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
                  ${product.price}
                </span>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  ${product.discounted_price}
                </span>
              </>
            ) : (
              <>${product.price}</>
            )}
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
                 
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={5000}
                 lazyLoad="progressive"
              >
                {deals.map(deals=>(
                   <div key={deals.id} className="discount-slide" onClick={()=>navigate('/sale')}>
                    <LazyImage src={deals.image} alt={deals.name}/>
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
           <div className="main_arrivals">
         <h3>Our best sellers</h3>
          <div className="arrivals">
          {bestseller.length>0 ? (
            <Slider
              dots={true}
               
              speed={500}
              slidesToShow={4}
              slidesToScroll={1}
               lazyLoad="progressive"
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
          {bestseller.map(product=>(
            <div key={product.id} className="product-slide" onClick={()=>navigate(`/products/${product.id}`)}>
              <LazyImage src={product.main_image} alt={product.name}
              style={{ width: '100%', height: '250px', objectFit: 'cover' }}></LazyImage>
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
               <h3>New Collections</h3>
              {collection.length>0?(
              <Slider
                dots={true}
                 
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                autoplay={true}
                autoplaySpeed={5000}
                 lazyLoad="progressive"
              >
                {collection.map(deals=>(
                   <div key={deals.id} className="discount-slide" id='LazyImageW' onClick={()=>navigate(`/collection-products?collectionId=${deals.id}`)}>
                    <LazyImage src={deals.image} alt={deals.name} id='LazyImage'/>
                   <h3>{deals.name}</h3>
              <h5>{deals.description}</h5>
              </div>
                ))}</Slider>
              ):(
                <p>No discounts for this week</p>
              )}
            </div>
          </div>

          <hr></hr>
          <div id='faq'>
          <FAQ /></div>
          <div className="newsletter">
            <div className="letter">
              <h2>Subscribe to Our NewsLetter to Get The Latest Updates on Our Discounts and Be The First to Know About Our New Collections</h2>
              <form className="formNewsletter" method='POST'>
                <input type='email' name='email' placeholder="Please write your email address"></input>
                <button type='submit'>Subscribe</button>
              </form>
            </div>
          </div>
        <div>
 
      </div>
    </div>
  );
};

export default HomePage;