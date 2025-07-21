import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faHeart } from '@fortawesome/free-solid-svg-icons';
import "../template/ShopPage.css";
import ShopFilter from "../components/ShopFilter";
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'


const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    categories: [],
    sizes: [],
    sortOption: 'featured'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const limit = 20;
  const[totalPages,setTotalPages]=useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate=useNavigate();
  const location=useLocation();
  const user=localStorage.getItem('user');

    useEffect(() => {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
}, [wishlist]);

  useEffect(() => {
  const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
  console.log("Loaded wishlist from localStorage:", storedWishlist);
  setWishlist(storedWishlist);
}, []);

  useEffect(() => {
    fetchFilteredProducts(filters,currentPage);
  }, [filters,currentPage]);
  
  useEffect(() => {
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");
  const subcategory = searchParams.get("subcategory");

  const newfilters={...filters,};
  if(category) newfilters.category=category;
  if(subcategory) newfilters.subcategory=subcategory;
  setFilters(newfilters);
  fetchFilteredProducts(newfilters,currentPage);
}, [location.search, currentPage]);


  const fetchFilteredProducts = async (filterData, page=1) => {
    try {
      const params={
      ...filterData,
              page,
              limit
      };
        if (filterData.subcategory) {
      params.subcategory = filterData.subcategory;
    }
      const res = await axiosInstance.get('/products/filter', {params});
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    }
  };

  const handleFilterApply = (appliedFilters) => {
    setFilters(appliedFilters);
    setShowFilters(false);
  };
  const handlePageChange=(pageNumber)=>{
    setCurrentPage(pageNumber);
  };
  const isInWishlist=(productId)=>{
    return wishlist.includes(productId);
  };
  const toggleWishlist=async(product)=>{
    try{
        if(!user){
          alert('You need to be logged in before adding an item to the wishlist');
          navigate('/login',{replace:true}); return;
        }
        let updated;
    if(isInWishlist(product.id)){
       const res = await axiosInstance.get('/wishlists');
      const userId = JSON.parse(user).id;
       const itemToDelete = res.data.find(
        item => item.productID === product.id && item.userID === userId
      );
      if(itemToDelete){
      await axiosInstance.delete(`/wishlists/${itemToDelete.id}`);
      updated=wishlist.filter(id=>id!==product.id);
      alert('Removed from wishlist');
    }
  }else {
      await axiosInstance.post('/wishlists', {
        productID: product.id,
        variantID: null
       });
      updated=[...wishlist, product.id];
      alert('Added to wishlist');
    }
    setWishlist(updated);
    localStorage.setItem('wishlist',JSON.stringify(updated));
  }catch(err){
    setError('Failed to add or remove item from wishlist', err);
  }
  };

  return (
    <div className="shop-page">
      <div className="main">
        <div className="mainF">
          <img src='../../../../images/Shop/shop.jpg' alt='shop' />
          <div className="txt">
            <h1>Shop</h1>
          </div>
        </div>
      </div>

      <button 
        className={`filter-toggle-btn ${showFilters? 'shifted':''}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        <FontAwesomeIcon icon={faFilter} />
        <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
      </button>
      <div className={`filters-overlay ${showFilters ? 'visible' : ''}`}>
        <div className="filters-content">
          <ShopFilter onFilterApply={handleFilterApply} />
        </div>
      </div>
        <p className="shop-description">
          Discover the latest arrivals in fashion, accessories, and tech. Use filters to find the perfect match based on your budget and preferences.
        </p>
      <div className="main_cart">
          <h3>New Arrivals</h3>
          <div className="product-summary">
            <p>{products.length} items found</p>
          </div>
          <div className="carts">
          {products.map(product => (
          <div key={product.id} className="single_cart"
          onClick={() => navigate(`/products/${product.id}`)}>
          <img src={product.main_image} alt={product.name} className="single_cart_image" />
          <div className="single_cart_info">
            <h5>{product.name}</h5>
            <p>{product.description}</p>
            <p id='wishlist'>${product.price}<FontAwesomeIcon icon={isInWishlist(product.id)? faHeart: faHeartRegular} 
            className='icon' onClick={(e)=>{ e.stopPropagation(); 
            toggleWishlist(product)}}
            /></p>
          </div>
        </div>
    ))}
  </div>

  </div>
    <div className="pagination">
      <button onClick={()=>handlePageChange(currentPage-1)}
        disabled={currentPage===1}>Prev</button>
    {[...Array(totalPages)].map((_, index) => {
      const pageNumber = index + 1;
      return (
        <button
          key={pageNumber}
          onClick={() => handlePageChange(pageNumber)}
          className={pageNumber === currentPage ? 'active' : ''}
        >
          {pageNumber}
        </button>
      );
    })}
    <button onClick={()=>handlePageChange(currentPage+1)}
      disabled={currentPage===totalPages}>Next</button>
  </div>
    </div>
  );
};

export default ShopPage;
