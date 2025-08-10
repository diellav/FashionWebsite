import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axiosInstance from "../axios";
const useWishlist=()=>{ //hooks gjith duhen me pas use...
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  useEffect(()=>{
    fetchWishlist();
  },[user]);
  const fetchWishlist=async()=>{
    if (!user) return;
    try{
        const res=await axiosInstance.get('/wishlists');
        const userId=JSON.parse(user).id;
        const userWishlist=res.data.filter((item)=>item.userID===userId)
        .map((item)=>item.productID);
        setWishlist(userWishlist);
    }catch(err){
        setError('Failed to fetch wishlist');
    }
  };

    const isInWishlist=(productId)=>{
    return wishlist.includes(productId);
  };


    const toggleWishlist=async(productID, variantID=null)=>{
 if(!user){
          alert('You need to be logged in before adding an item to the wishlist');
          navigate('/login',{replace:true}); return;
        }
    try{
        let updated=[...wishlist];
       const res = await axiosInstance.get('/wishlists');
      const userId = JSON.parse(user).id;
       const itemToDelete = res.data.find(
        item => item.productID === productID 
        && item.variantID===variantID
        && item.userID === userId
      );
      if(itemToDelete){
      await axiosInstance.delete(`/wishlists/${itemToDelete.id}`);
      updated=wishlist.filter(id=>id!==productID);
      alert('Removed from wishlist');
  }else {
      await axiosInstance.post('/wishlists', {
        productID,
        variantID
       });
      updated=[...wishlist, productID];
      alert('Added to wishlist');
    }
    setWishlist(updated);
  }catch(err){
    setError('Failed to add or remove item from wishlist', err);
  }
  };

  return {wishlist, isInWishlist, toggleWishlist, error}
};
export default useWishlist;