import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import '../template/Navbar.css';

const SearchToggle = () => {
  const [showInput, setShowInput] = useState(false);
  const [query, setQuery] = useState('');

  const toggleSearch = () => setShowInput(prev => !prev);

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
    </div>
  );
};

export default SearchToggle;
