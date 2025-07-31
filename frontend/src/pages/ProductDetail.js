import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axios";
import "../template/ProductDetails.css";
import useWishlist from "../components/WishlistHook";
import useCart from "../components/CartHook";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState("");

  const { wishlist, isInWishlist, toggleWishlist } = useWishlist();
  const { cart, addToCart, isInCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
        setMainImage(res.data.main_image);
        setSelectedVariant(null);
        setSelectedSize(null);
        console.log('Product:',res.data);
      } catch (err) {
        setError("Failed to fetch product details.");
        console.error(err);
      }
    };
    fetchProduct();
  }, [id]);

  const hasVariants = product?.variants?.length > 0;

const getStockForSelected = () => {
  if (selectedSize) {
    return selectedSize.stock;
  }
  return 0;
};

  const handleAddToCart = () => {
    if (selectedSize) {
      addToCart(
        {
          ...product,
          variant: selectedVariant,
          sizeID: selectedSize.id,
        },
        1
      );
    } else {
      alert("Please select a size first.");
    }
  };

const getAllImages = () => {
  const productImages = product.images || [];
  const variantImages = product.variants?.flatMap(v => v.images || []) || [];
  if (product.main_image) {
    productImages.unshift({ images: product.main_image });
  }
  const allImages = [...productImages, ...variantImages];

  const seen = new Set();
  return allImages.filter(img => {
    if (seen.has(img.images)) return false;
    seen.add(img.images);
    return true;
  });
};

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail-page">
     <div className="thumbnail-container">
  {getAllImages().map((img) => (
    <img key={img.id} src={img.images} alt="" className={mainImage === img.images ? "selected" : ""}onClick={() => setMainImage(img.images)}
    /> 
  ))}
</div>


      <div className="main-image-container" style={{ flex: 1 }}>
        <img src={mainImage} alt={product.name} />
      </div>

      <div className="description">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>

{hasVariants && (
  <div>
    <label htmlFor="variant-select"><h4>Variants:</h4></label>
    <select
      id="variant-select"
      value={selectedVariant?.id || ""}
      onChange={(e) => {
        const selected = product.variants.find(
          (v) => v.id === parseInt(e.target.value)
        );
        setSelectedVariant(selected);
        setSelectedSize(null);
        if (selected?.images?.length > 0) {
          setMainImage(selected.images[0].images);
        } else {
          setMainImage(product.main_image);
        }
      }}
    >
      <option value="" disabled>Select a variant</option>
      {product.variants.map((variant) => (
        <option key={variant.id} value={variant.id}>
          Color: {variant.color}, Material: {variant.material}
        </option>
      ))}
    </select>
  </div>
)}


<div className="sizes-container">
  <label htmlFor="size-select">Sizes:</label>
  <select
    id="size-select"
    value={selectedSize?.id || ""}
    onChange={(e) => {
      const selected = (selectedVariant
        ? product.sizestocks.filter(s => s.variantID === selectedVariant.id)
        : product.sizestocks.filter(s => s.variantID === null)
      ).find(s => s.id === parseInt(e.target.value));
      setSelectedSize(selected);
    }}
  >
    <option value="" disabled>Select a size</option>
    {(selectedVariant
      ? product.sizestocks.filter(s => s.variantID === selectedVariant.id)
      : product.sizestocks.filter(s => s.variantID === null)
    ).map((size) => (
      <option key={size.id} value={size.id}>
        {size.size} {size.stock>0? ' (In stock)': ' (Out of stock)' }
      </option>
    ))}
  </select>
</div>

      <p id="wishlist" onClick={() => toggleWishlist(product)} >
        Add to Wishlist{" "}
        <FontAwesomeIcon icon={isInWishlist(product.id ,selectedVariant?.id) ? faHeart : faHeartRegular} />
      </p>

        <button
          onClick={handleAddToCart}
          disabled={!selectedSize || getStockForSelected() === 0}
          className="add-to-cart-button"
        >
          {isInCart(product.id, selectedVariant?.id) ? "Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;
