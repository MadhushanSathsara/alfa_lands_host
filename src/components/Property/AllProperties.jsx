import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AllProperties.css';
import { BsSuitHeart } from 'react-icons/bs';
import { IoBedOutline, IoLocateOutline } from 'react-icons/io5';
import { GiBathtub, GiHomeGarage } from 'react-icons/gi';
import axios from 'axios';

const AllProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allPropertiesData, setAllPropertiesData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);


  useEffect(() => {
    fetch('http://localhost/estate/Backend/api/get_properties.php')
      .then(res => res.json())
      .then(data => setAllPropertiesData(data))
      .catch(err => console.error('Error fetching properties:', err));
  }, []);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setShowSearchResults(false);
      setHasSearched(false);
      return;
    }
    
    try {
      setHasSearched(true);
      const res = await axios.get(
        `http://localhost/estate/Backend/api/search.property.php?location=${searchTerm}`
      );
      setSearchResults(res.data);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Search failed', error);
      setSearchResults([]);
      setShowSearchResults(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };


  const displayProperties = showSearchResults ? searchResults : allPropertiesData;

  return (
    <div className="all-properties-listing">
      <h1 className="all-properties-title">All <span className="highli">Properties</span></h1>

    
      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by location..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

    
        {hasSearched && searchResults.length === 0 && showSearchResults && (
          <p className="no-results">No properties found matching "{searchTerm}"</p>
        )}
      </div>

  
      <div className="property-grid">
        {displayProperties.map((property) => (
          <Link 
            to={`/property/${property.property_id}`} 
            key={property.property_id} 
            className="deal-link"
          >
            <div className="property-card">
              <div className="image-wrapper">
                <img 
                  src={property.property_image} 
                  alt="Property" 
                  className="property-image" 
                />
               
              </div>
              <div className="property-info">
                <h3 className="property-title">{property.property_name}</h3>
                <p className="price">
                  LKR {parseFloat(property.property_price).toLocaleString()}
                </p>
                <div className="features">
                  <div className="feature">
                    <IoBedOutline /> <span>{property.beds} Beds</span>
                  </div>
                  <div className="feature">
                    <GiBathtub /> <span>{property.baths} Baths</span>
                  </div>
                  <div className="feature">
                    <GiHomeGarage /> <span>{property.garage} Garage</span>
                  </div>
                </div>
                <div className="location">
                  <IoLocateOutline /> <span>{property.property_address}</span>
                </div>
                
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AllProperties;