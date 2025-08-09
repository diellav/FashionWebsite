import React, { useEffect, useState } from "react";
import { useParams ,useNavigate} from "react-router-dom";
import axiosInstance from "../axios";
import "../template/ProductDetails.css";
import "../template/ShopPage.css";
import useWishlist from "../components/WishlistHook";
import useCart from "../components/CartHook";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faQuran } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(5);
  const [similar, setSimilar] = useState(5);
  const[bestseller,setBestSeller]=useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const { wishlist, isInWishlist, toggleWishlist } = useWishlist();
  const { cart, addToCart, isInCart } = useCart();
  const navigate=useNavigate();

  useEffect(() => {
    fetchProduct();
    fetchReviews();
    fetchSimilar();
    fetchBestSellerProducts();
  }, [id]);

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
   const fetchReviews = async () => {
    try {
      const res = await axiosInstance.get(`/products/${id}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  }; 
  const fetchSimilar = async () => {
    try {
      const res = await axiosInstance.get(`/similar-products/${id}'`);
      setSimilar(res.data);
      console.log('similar',res.data)
    } catch (err) {
      console.error("Failed to load reviews", err);
    }
  };

const submitReview = async () => {
  try {
    await axiosInstance.post(`/products/${id}/reviews`, {
      review_text: newReview,
      rating: rating
    });
    setNewReview('');
    setRating(5);
    const res = await axiosInstance.get(`/products/${id}/reviews`);
    setReviews(res.data);
  } catch (err) {
    console.error("Review submission failed", err);
  }
};

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
        quantity
      );
    } else {
      alert("Please select a size first.");
    }
  };

const getAllImages = () => {
  const productImages = product.images || [];
  const variantImages = product.variants?.flatMap(v => {
    const imagesArray = v.images || [];
    if (v.image) {
      return [...imagesArray, { image: v.image }];
    }
    return imagesArray;
  }) || [];

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

 const fetchBestSellerProducts=async()=>{
    try{
    const res=await axiosInstance.get('/best-products');
    console.log('best products:', res.data);
    setBestSeller(res.data);
    }catch(err){
      console.error('Failed to fetch products', err);
    }
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <>
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
        {bestseller.some(item=>item.id===product.id) && (
        <h5><i style={{color:'darkred'}}>BestSeller</i></h5>
      )}
        <div className="product-price">
          {product.discounted_price ? (
            <>
              <span className="original-price" style={{ textDecoration: 'line-through', color: 'gray', marginRight: '10px' }}>
                Price: ${product.price}
              </span>
              <span className="discounted-price" style={{ color: 'red', fontWeight: 'bold' , fontSize:"large"}}>
                Discounted Price: ${product.discounted_price}
              </span>
            </>
          ) : (
            <span className="normal-price" style={{ fontSize:"x-large"}}>Price: ${product.price}</span>
          )}
</div>


{hasVariants && (
  <div className="sizes-container">
    <label htmlFor="variant-select"><h5>Options:</h5></label>
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
      <option value="" disabled>Choose</option>
      {product.variants.map((variant) => (
        <option key={variant.id} value={variant.id}>
          Color: {variant.color}, Material: {variant.material}
        </option>
      ))}
    </select>
  </div>
)}


<div className="sizes-container">
  <label htmlFor="size-select"><h5>Sizes:</h5></label>
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
    <option value="" disabled>Choose</option>
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

      <div className="sizes-container">
        <h5>Quantity:</h5><input type="number" min="1" value={quantity}
        onChange={(e)=>setQuantity(parseInt(e.target.value)||1)}></input>
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
        Add to Cart
        </button>
      </div>
    </div>

    <div className="reviewSection">
      <h3>Reviews</h3>
      {product.average_rating && (
  <h5 id='avg'><i>Average Rating: {product.average_rating} / 5</i></h5>
)}
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map((r) => (
        <div key={r.id} className="review-item">
          <p><strong>{r.user.first_name} {r.user.last_name}</strong> rated {r.rating}/5</p>
          <p>{r.review_text}</p>
        </div>
      ))}

      {user? user && (
        <div className="review-form">
          <h5>Leave a Review:</h5>
          <label>
            Rating:
            <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
              {[5, 4, 3, 2, 1].map(num => <option key={num} value={num}>{num}</option>)}
            </select>
          </label>
          <br />
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here..."
          ></textarea>
          <br />
          <button onClick={submitReview} className="add-btn">Submit Review</button>
        </div>
      ):(<p>You need to log in before leaving a review</p>)}
</div>

       <div className="main_arrivals">
         <h3>Customers Also Viewed:</h3>
          <div className="arrivals">
          {similar.length>0 ? (
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
          {similar.map(product=>(
            <div key={product.id} className="product-slide" onClick={()=>navigate(`/products/${product.id}`)}>
              <img src={product.main_image} alt={product.name}
              style={{ width: '100%', height: '270px', objectFit: 'cover' }}></img>
              <h5>{product.name}</h5>
              <p>${product.price}</p>
            </div>
          ))}
            </Slider>):(<p>No new products this week</p>)}
          </div>
          </div>
</>
  );
};

export default ProductDetail;
