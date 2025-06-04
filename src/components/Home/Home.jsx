import React, { useState } from 'react';
import './Home.css';
import homeImg from '../../assets/home_img.jpg';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setResults([]);
      setHasSearched(false);
      return;
    }
    
    try {
      setHasSearched(true);
      const res = await axios.get(`http://localhost/estate/Backend/api/search.property.php?location=${searchTerm}`);
      setResults(res.data);
    } catch (error) {
      console.error('Search failed', error);
      setResults([]);
    }
  };

  return (
    <div className="home">
      <div className="effect1">
        <div className="home__hero">
          <img src={homeImg} alt="Modern House" className="home__image" />
          <div className="home__overlay">
            <h2 className="home__title">Everything starts with a dream</h2>
            <div className="home__search-bar">
              <input
                type="text"
                placeholder="Find your perfect location..."
                className="home__search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button className="home__search-button" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </div>
      </div>

      <div className="home__results">
        {hasSearched && results.length === 0 && (
          <p className="no-results">No properties found matching "{searchTerm}"</p>
        )}

        {results.map((property) => (
          <div key={property.property_id} className="home__result-card">
            <img src={property.property_image} alt={property.property_name} className="result-image" />
            <h4>{property.property_name}</h4>
            <p>{property.property_address}</p>
            <p>Price: ${property.property_price}</p>
            <Link to={`/PropertyOverview/${property.property_id}`} className="viewb">View More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;