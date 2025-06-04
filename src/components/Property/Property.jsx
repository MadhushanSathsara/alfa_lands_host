// src/components/Property.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Property1.css';
import { BsSuitHeart } from 'react-icons/bs';
import { IoBedOutline, IoLocateOutline } from 'react-icons/io5';
import { GiBathtub, GiHomeGarage } from 'react-icons/gi';

const Property = () => {
  const [dealsData, setDealsData] = useState([]);

  useEffect(() => {
    fetch('http://localhost/estate/Backend/api/get_properties.php')
      .then(res => res.json())
      .then(data => setDealsData(data.slice(0, 10))) // ✅ Only take first 8 items
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="property-listing">
      <h1 className="property-title">Property <span className="highli">Showcase</span></h1>

      <div className="property-grid">
        {dealsData.map(deal => (
          <Link to={`/property/${deal.property_id}`} key={deal.property_id} className="deal-link">
            <div className="property-cardd">
              <div className="image-wrapper">
                <img src={deal.property_image} alt="Property" className="property-image" />
              </div>
              <div className="property-info">
                <div className="features">
                  <div className="feature"><IoBedOutline /> <span>{deal.beds} Beds</span></div>
                  <div className="feature"><GiBathtub /> <span>{deal.baths} Baths</span></div>
                  <div className="feature"><GiHomeGarage /> <span>{deal.garage} Garage</span></div>
                </div>
                <div className="location"><IoLocateOutline /> <span>{deal.property_address}</span></div>
                <p className="price">LKR {parseFloat(deal.property_price).toLocaleString()}</p>
                
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="view-more-container">
        <Link to="/all-properties">
          <button className="view-more-btn">View More Properties</button>
        </Link>
      </div>
    </div>
  );
};

export default Property;
