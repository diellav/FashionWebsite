import React,{useEffect, useState} from "react";
import {Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axios";
import '../template/ShopFilter.css';
const ShopFilter=({onFilterApply})=>{
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [sortOption, setSortOption] = useState('featured');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  
  useEffect(()=>{
    fetchCategories();
  }, []);
  const fetchCategories=async()=>{
    try{
        const res=await axiosInstance.get('/categories');
        setCategories(res.data);
        setLoading(false);
    }catch(err){
            setError('Failed to fetch categories', err);
            setLoading(false);
        }
    };

    const handleCategoryToggle=(categoryID)=>{
        setSelectedCategories(prev=>
            prev.includes(categoryID)? prev.filter(id=>id !==categoryID) : [...prev, categoryID]
        );
    };

      const handleSizeToggle=(size)=>{
        setSelectedSizes(prev=>
            prev.includes(size)? prev.filter(s=>s !==size) : [...prev, size]
        );
    };

    const handleApplyFilters=()=>{
        const filters={
            priceRange,
            categories:selectedCategories,
            sizes:selectedSizes,
            sortOption
        };
        onFilterApply(filters);
    };
    
    const handleResetFilters=()=>{
      const defaultFilters={
        priceRange:[0,1000],
        categories:[],
        sizes:[],
        sortOption:'featured'
      };
        setSelectedCategories([]);
        setSelectedSizes([]);
        setPriceRange([0,1000]);
        setSortOption('featured');
        onFilterApply(defaultFilters);
    };
  
     if (loading) return <div className="filters-loading">Loading filters...</div>;
     if (error) return <div className="filters-error">Error: {error}</div>;
  
  return(
        <div className="filters">
           <div className="bar_filter">
            <div className="filter-section">
            <h3>Sort By</h3>
            <select value={sortOption}
            onChange={(e)=>setSortOption(e.target.value)}
            className="filter-select">
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="newest">Newest Arrivals</option>
            </select>
           </div>

        <div className="filter-section">
          <h3>Price Range</h3>
          <div className="price-range">
            <span>${priceRange[0]}</span>
            <input
              type="range" min="0"max="1000" value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            />
            <input type="range" min="0" max="1000" value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
            <span>${priceRange[1]}</span>
          </div>
        </div>

         <div className="filter-section">
          <h3>Categories</h3>
          <div className="filter-options">
            {categories.map(category=>(
                <label key={category.id} className="filter-option">
                    <input type='checkbox' checked={selectedCategories.includes(category.id)}
                    onChange={()=>handleCategoryToggle(category.id)}/>
                    {category.name}
                </label>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <h3>Sizes</h3>
          <div className="size-options">
            {sizes.map(size=>(
                <label key={size} className="filter-option">
                    <input type='checkbox' checked={selectedSizes.includes(size)}
                    onChange={()=>handleSizeToggle(size)} className="size-checkbox"/>
                    <span className="size-label">{size}</span>
                </label>
            ))}         

          </div>
        </div>
<button className="apply-filters" onClick={handleApplyFilters}>Apply Filters</button>
<button className="reset-filters" onClick={handleResetFilters}>Reset All</button>

        </div>
    </div>
        
    );
};
export default ShopFilter;
