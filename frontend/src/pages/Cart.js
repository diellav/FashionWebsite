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
            console.log('Items:',res.data);
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
    };
    const calculateTotal=()=>{
        return cartItems.reduce((total,item)=>{
            const price=item.products?.price || 0;
            const quantity=item.quantity || 1;
            return total+(price*quantity);
        }, 0).toFixed(2);
    };
    const handleQuantityChange = async (id, newQuantity) => {
  if (newQuantity < 1) return;

  try {
    await axiosInstance.put(`/cart_items/${id}`, { quantity: newQuantity });

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  } catch (err) {
    setError('Could not update quantity');
  }
};


    return(
        <div className="mainCart">
            <h3>My Cart</h3>
            {
    cartItems.length>0? (
        <ul>
            {cartItems.map(item=>(
                <li key={item.id} className="cartItem">
                    <div className="photoCart">
                    <img src={item.variants && item.variants.image? `${item.variants.image}` : `${item.products.main_image}`}></img></div>
                    <div className="textCart">
                    <h4>{item.products.name}</h4>
                    <div className="quantity">
                    <h5>Quantity:</h5><input type="number" min="1" value={item.quantity}
                    onChange={(e)=>handleQuantityChange(item.id, parseInt(e.target.value))}></input>
                </div>
                    <p>Price: ${item.products.price}</p></div>
                    <div className="variant">
                    {item.variants && (
                    <p>Color: {item.variants.color}</p>
                )}</div>
                    <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>
                        X
                    </button><p className='Cartmessage'>Remove From Cart</p>
                </li>
            ))}
            <h4>Total: ${calculateTotal()}</h4>
            <button>Proceed to Payment</button>
        </ul>
    ):(<p>Your Cart is Empty!</p>)
}
        </div>
    );
};
export default Cart;