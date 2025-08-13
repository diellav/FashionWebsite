import React, {useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import '../template/Cart.css';
const Wishlist=()=>{
    const[error,setError]=useState('');
    const user=JSON.parse(localStorage.getItem('user'));
    const[wishlistItems, setWishlistItems]=useState([]);
const navigate=useNavigate();
    useEffect(()=>{
        fetchWishlist();
    },[]);
    const fetchWishlist=async()=>{
        try{
            const res=await axiosInstance.get('/wishlists');
            setWishlistItems(res.data);
        }catch(err){
            setError('Failed to fetch wishlist');
        }
    };
    const handleRemoveFromWishlist=async(id)=>{
      try{
        await axiosInstance.delete(`/wishlists/${id}`);
        setWishlistItems(prevItems=>prevItems.filter(items=>items.id!==id));
      }catch(err){
        setError('Could not remove item from wishlist');
      }
    };
  

    return(
        <div className="mainCart">
            <br></br>
            <h3>My Wishlist</h3>
            <p id='helper-text'>Here are your saved items. Add them to your cart when you're ready to buy.</p>

            {
            wishlistItems.length>0? (
            <ul>
                <ul>
                {wishlistItems.map(item => (
                    <li key={item.id} className="cartItem">
                        <div className="photoCart">
                        <img src={item.variants && item.variants.image? `${item.variants.image}` : `${item.product.main_image}`}></img></div>
                    <div className="textCart">
                    <h4>{item.product?.name || 'No product'}</h4>
                     {item.variant && (
                        <p>Variant: {item.variant.color} - {item.variant.material}</p>
                    )}
                    <p>Price: ${item.product?.price || 0}</p>
                    <button
                onClick={() => navigate(`/products/${item.product.id}`)}
                className="add-btn"
                >See details
                    </button></div>
                     <button className="remove-btn" onClick={() => handleRemoveFromWishlist(item.id)}>
                    X
                     </button><p className='Cartmessage'>Remove From Wishlist</p>
                    </li>
                ))}
                </ul>

                    </ul>
                ):(<p>Your Wishlist is Empty! Browse products and click the heart icon to save items for later.</p>)
            }
        </div>
    );
};
export default Wishlist;