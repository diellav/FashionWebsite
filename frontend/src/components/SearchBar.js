import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import '../template/Navbar.css';

const SearchToggle = () => {
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const toggleSearch = () => setShowInput(prev => !prev);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      return;
    }

    const delay = setTimeout(() => {
      fetch('http://localhost:8000/api/search?q=' + encodeURIComponent(query))
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error('Search error:', err));
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  return (
    <div className="search-container">
      <button className="search-icon" onClick={toggleSearch}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>

      <input
        type="text"
        placeholder="Search..."
        className={`search-input ${showInput ? 'visible' : ''}`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {showInput && results.length > 0 && (
        <ul className="search-results">
          {results.map((item) => (
            <li key={item.id} className='searchitem'>
              <Link to={`/products/${item.id}`}>{item.name}<img src={item.main_image}></img></Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchToggle;
