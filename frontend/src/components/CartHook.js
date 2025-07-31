import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axiosInstance from "../axios";
const useCart=()=>{ //hooks gjith duhen me pas use...
  const [cart, setCart] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

    useEffect(() => {
        fetchCart();
  }, [user]);


  const fetchCart = async () => {
  if (!user) return;

  try {
    const userId = JSON.parse(user).id;
    const cartsRes = await axiosInstance.get('/cart');
    const userCartObj = cartsRes.data.find(cart => cart.userID === userId);
    if (!userCartObj) {
      setCart([]);
      return;
    }

    const cartId = userCartObj.id;
    const cartItemsRes = await axiosInstance.get('/cart_items');
    const userCartItems = cartItemsRes.data.filter(item => item.cartID === cartId);

    setCart(userCartItems);
  } catch (err) {
    setError('Failed to fetch cart');
  }
};


  const getOrCreateCartId = async (userId) => {
    try {
      const res = await axiosInstance.get('/cart');
      const existing = res.data.find(cart => cart.userID === userId);

      if (existing) return existing.id;
      const createRes = await axiosInstance.post('/cart', {
        userID: userId,
      });

      return createRes.data.id;
    } catch (err) {
      console.error('Error getting/creating cart:', err);
      throw new Error('Cart error');
    }
  };

  const addToCart=async(product, quantity=1)=>{
     if (!user) {
      alert('You need to be logged in to add items to cart.');
      navigate('/login', { replace: true });
      return;
    }
    try{
         const userId=JSON.parse(user).id;
         const cartId = await getOrCreateCartId(userId);
         const existing=cart.find(item=>item.productID===product.id
          && item.variantID===(product.variant? product.variant.id:null)
         );
         if(existing){
            await axiosInstance.put(`cart_items/${existing.id}`, {
                quantity:existing.quantity+quantity,
            });
            const updated=cart.map(item=>item.id===existing.id?
                {...item, quantity:item.quantity+quantity}:item);
         
         setCart(updated);
           }
        else{
            const res=await axiosInstance.post('/cart_items',{
                cartID:cartId,
                productID:product.id,
                variantID:product.variant? product.variant.id:null,
                quantity,
            });
            setCart([...cart, res.data]);
    }

      alert('Product added to cart');
        
    }catch(err){
        setError('Failed to add to cart');
    }
  };

   const removeFromCart = async (productId,variantID) => {
    try {
      const item = cart.find(item => item.productID === productId 
        && item.variantID === variantID 
      );
      if (item) {
        await axiosInstance.delete(`/cart_items/${item.id}`);
        setCart(cart.filter(i => i.id !== item.id));
      }
    } catch (err) {
      console.error(err);
      setError('Failed to remove from cart');
    }
  };

const isInCart = (productId,variantID) => {
  return cart.some(item => String(item.productID) === String(productId)
&& String(item.variantID) === String(variantID));
};

  return {cart, addToCart, removeFromCart,isInCart, error};
};
export default useCart;