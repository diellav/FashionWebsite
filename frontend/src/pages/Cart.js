import React, {useState, useEffect} from "react";
import axiosInstance from "../axios";
import '../template/Cart.css';
const Cart=()=>{
    const[error,setError]=useState('');
    const user=JSON.parse(localStorage.getItem('user'));
    const[cartItems, setCartItems]=useState([]);

    useEffect(()=>{
        fetchCart();
    },[]);
    const fetchCart=async()=>{
        try{
            const res=await axiosInstance.get('/cart_items');
            setCartItems(res.data);
        }catch(err){
            setError('Failed to fetch cart');
        }
    };
    const handleRemoveFromCart=async(id)=>{
        try{
        await axiosInstance.delete(`/cart_items/${id}`);
        setCartItems(prevItems=>prevItems.filter(item=>item.id!==id));
        }catch(err){
            setError('Could not remove item');
        }
    }

    return(
        <div className="mainCart">
            <h3>My Cart</h3>
            {
                cartItems.length>0? (
                    <ul>
                        {cartItems.map(item=>(
                            <li key={item.id}>
                                <h4>{item.products.name}</h4>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: ${item.products.price}</p>
                                {item.variants && (
                                <p>Variant: {item.variants.name}</p>
                            )}
                              <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                ):(<p>Your Cart is Empty!</p>)
            }
        </div>
    );
};
export default Cart;