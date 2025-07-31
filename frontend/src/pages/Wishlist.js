import React, {useState, useEffect} from "react";
import axiosInstance from "../axios";
import '../template/Cart.css';
const Wishlist=()=>{
    const[error,setError]=useState('');
    const user=JSON.parse(localStorage.getItem('user'));
    const[wishlistItems, setWishlistItems]=useState([]);

    useEffect(()=>{
        fetchWishlist();
    });
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
        setError('Could not remove item fro wishlist');
      }
    };
    return(
        <div className="mainWishlist">
            <h3>My Wishlist</h3>
            {
            wishlistItems.length>0? (
            <ul>
                <ul>
                {wishlistItems.map(item => (
                    <li key={item.id}>
                    <h4>{item.product?.name || 'No product'}</h4>
                    <p>Price: ${item.product?.price || 0}</p>
                    {item.variant && (
                        <p>Variant: {item.variant.name}</p>
                    )}
                     <button className="remove-btn" onClick={() => handleRemoveFromWishlist(item.id)}>
                                    Remove
                                </button>
                    </li>
                ))}
                </ul>

                    </ul>
                ):(<p>Your Wishlist is Empty!</p>)
            }
        </div>
    );
};
export default Wishlist;