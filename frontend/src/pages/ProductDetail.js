import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import "../template/ProductDetails.css";
import useWishlist from "../components/WishlistHook";
import useCart from "../components/CartHook";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  
  const { wishlist, isInWishlist, toggleWishlist, error:wishlistError } = useWishlist();
  const { cart, addToCart, removeFromCart, isInCart, error:cartError} = useCart();
  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

   const handleAddToCart = () => {
    addToCart(product, 1);
  };
  return (
    <div className="product-detail-page">
      <div className="phototext">
      <img src={product.main_image} alt={product.name} /></div>
      <div className="description">
         <h3>{product.name}</h3>
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>{product.stock > 0 ? "In stock" : "Out of stock"}</p>

      {product.variants && product.variants.length > 0 && (
        <div>
          <h3>Variants:</h3>
          <ul>
            {product.variants.map((variant) => (
              <li key={variant.id}>
                Size: {variant.size}, Color: {variant.color}, Price: ${variant.price || product.price}
              </li>
            ))}
          </ul>
        </div>
        
      )}
      <p id='wishlist'>Add to Wishlist<FontAwesomeIcon icon={isInWishlist(product.id)? faHeart: faHeartRegular} 
                  className='icon' onClick={(e)=>{ e.stopPropagation(); 
                  toggleWishlist(product)}}
                  /></p>

      <button onClick={handleAddToCart} disabled={product.stock === 0}
       className="add-to-cart-button">
        {isInCart(product.id)? "Added to Cart" : "Add to Cart"}</button>
    </div>
    </div>
  );
};

export default ProductDetail;
