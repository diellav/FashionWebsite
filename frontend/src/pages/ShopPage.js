import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import "../template/ShopPage.css";
import ShopFilter from "../components/ShopFilter";


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
  const navigate=useNavigate();
  useEffect(() => {
    fetchFilteredProducts(filters);
  }, [filters]);

  const fetchFilteredProducts = async (filterData) => {
    try {
      const res = await axiosInstance.get('/products/filter', {
        params: filterData
      });
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error(err);
    }
  };

  const handleFilterApply = (appliedFilters) => {
    setFilters(appliedFilters);
    setShowFilters(false);
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
        className="filter-toggle-btn"
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

      <div className="main_cart">
          <h3>New Arrivals</h3>
          <div className="carts">
          {products.map(product => (
          <div key={product.id} className="single_cart"
          onClick={() => navigate(`/products/${product.id}`)}>
          <img src={product.main_image} alt={product.name} className="single_cart_image" />
          <div className="single_cart_info">
            <h5>{product.name}</h5>
            <p>${product.price}</p>
          </div>
        </div>
    ))}
  </div>
</div>
    </div>
  );
};

export default ShopPage;
