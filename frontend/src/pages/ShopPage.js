import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faHeart } from '@fortawesome/free-solid-svg-icons';
import "../template/ShopPage.css";
import ShopFilter from "../components/ShopFilter";
import { faHeart as faHeartRegular} from '@fortawesome/free-regular-svg-icons'
import useWishlist from "../components/WishlistHook";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
   const navigate=useNavigate();
  const location=useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get("category") || null;
  const initialSubcategory = searchParams.get("subcategory") || null;
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    categories: [],
    sizes: [],
    sortOption: 'featured',
    category: initialCategory,
    subcategory: initialSubcategory,
    recent: false,
    sale: false,
    collection:false
  });
  const [showFilters, setShowFilters] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const limit = 20;
  const[totalPages,setTotalPages]=useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialized, setInitialized] = useState(false);

  const user=localStorage.getItem('user');
useEffect(() => {
  const searchParams = new URLSearchParams(location.search);
  const path = location.pathname;

  const category = searchParams.get("category") || null;
  const subcategory = searchParams.get("subcategory") || null;
  const isRecent = path === "/recent-products";
  const isSale = path === "/sale";
  const isCollection=path==="/collection-products";
  const collectionId = searchParams.get("collectionId") || null;
  const sortOption = isRecent ? "newest" : "featured";

  setFilters(prev => ({
    ...prev,
    category,
    subcategory,
    recent: isRecent,
    sale: isSale,
    collection:isCollection,
    collectionId: collectionId,
    sortOption
  }));

  setCurrentPage(1);
  setInitialized(true); 
}, [location]);

  
  useEffect(() => {
    fetchCategories();
  }, []);
 useEffect(() => {
  if (initialized) {
    fetchFilteredProducts(filters, currentPage);
  }
}, [filters, currentPage, initialized]);
 

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
      if (!filterData.recent) delete params.recent;
    if (!filterData.sale) delete params.sale;
    if (filterData.collectionId) {
  params.collectionId = filterData.collectionId;
}
      const res = await axiosInstance.get('/products/filter', {params});
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      console.log('pr', res.data.products);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    }
  };

  const handleFilterApply = (appliedFilters) => {
  const updatedFilters = {
    ...filters,
    ...appliedFilters,
    recent: filters.recent,
    sale: filters.sale,
    collection:filters.collection,
  };

  setFilters(updatedFilters);
  setShowFilters(false);
  setCurrentPage(1);

  const params = new URLSearchParams();
  if (updatedFilters.category) params.set("category", updatedFilters.category);
  if (updatedFilters.subcategory) params.set("subcategory", updatedFilters.subcategory);
  if (updatedFilters.recent) params.set("recent", "true");
  if (updatedFilters.sale) params.set("sale", "true");
  if (updatedFilters.collection) params.set("collection", "true");
  

  navigate({ search: params.toString() });
};

  const handlePageChange=(pageNumber)=>{
    setCurrentPage(pageNumber);
  };

  
  const fetchCategories=async()=>{
    try{
      const res=await axiosInstance.get('/categories-navbar');
      setCategories(res.data);
      console.log('Categories',res.data)
    }catch(err){
      setError('Failed to fetch categories',err);
    }
  };

const getDescriptions = () => {
  if (filters.subcategory && filters.category) {
    const category = categories.find(cat => cat.name.toLowerCase() === filters.category.toLowerCase() );
    if (category) {
      const sub = categories.find(cat =>cat.name.toLowerCase() === filters.subcategory.toLowerCase() 
      && cat.parentID === category.id);
      if (sub) return sub.description;
    }
  }
  if (filters.category) {
    const cat = categories.find( cat => cat.name.toLowerCase() === filters.category.toLowerCase() 
    && cat.parentID === null);
    if (cat) return cat.description;
  }
  return 'Browse our latest products across all categories.';
};
  const selectedCategory = categories.find(
    (cat) => cat.name.toLowerCase() === filters.category?.toLowerCase() && cat.parentID === null
  );

  const selectedSubcategory = categories.find(
    (cat) => cat.name.toLowerCase() === filters.subcategory?.toLowerCase() && cat.parentID === selectedCategory?.id
  );

  const { wishlist, isInWishlist, toggleWishlist, error:wishlistError } = useWishlist();

    if (!Array.isArray(categories)) {
    return <div>Loading categories...</div>;
  }
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
        <p className="shop-description">
          Discover the latest arrivals in fashion, accessories, and tech. Use filters to find the perfect match based on your budget and preferences.
        </p>
         <button 
        className={`filter-toggle-btn ${showFilters? 'shifted':''}`}
        onClick={() => setShowFilters(!showFilters)}
      >
        <span>{showFilters ? 'X' : 'Filter'}</span>
      </button>
        <div className="cartFilter">
      <div className={`filters-overlay ${showFilters ? 'visible' : ''}`}>
        <div className="filters-content">
          <ShopFilter onFilterApply={handleFilterApply} />
        </div>
      </div>

      <div className="main_cart">
           <h3> {filters.recent? "NEW ARRIVALS": filters.sale? "SALE PRODUCTS" :  filters.collection? "NEW COLLECTION" : 
           selectedSubcategory? selectedSubcategory.name.toUpperCase(): selectedCategory? selectedCategory.name.toUpperCase()
    : "ALL PRODUCTS"}</h3>
          <h5>{categories.length>0?
          getDescriptions(): 'Loading description...'}</h5>
          <h6>{filters.subcategory? 
          `${filters.category} > ${filters.subcategory}` : ``}</h6>
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
            <p id='wishlist'>
              {product.discounted_price ? (
              <>
                <span style={{ textDecoration: 'line-through', color: 'gray', marginRight: '8px' }}>
                  ${product.price}
                </span>
                <span style={{ color: 'red', fontWeight: 'bold' }}>
                  ${product.discounted_price}
                </span>
              </>
            ) : (
              <>${product.price}</>
            )}<FontAwesomeIcon icon={isInWishlist(product.id)? faHeart: faHeartRegular} 
            className='icon' onClick={(e)=>{ e.stopPropagation(); 
            toggleWishlist(product)}}
            /></p>
          </div>
        </div>
    ))}
  </div>
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
