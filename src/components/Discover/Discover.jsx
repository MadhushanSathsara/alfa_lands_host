import React from 'react';
import './Discover.css';
import { FaHome } from 'react-icons/fa'; // You can choose another icon if preferred

function Discover() {
  return (
    <div className="discover-container">
      <div className="discover-title">
        {/* <FaHome className="discover-icon" /> */}
        <h2>
          Discover Your Perfect <br></br>
          <span className="highli">Property Match</span>
        </h2>
      </div>
      <div className="discover-description">
       <p>
        Browse our exclusive collection of properties handpicked to suit every lifestyle, preference, and budget.
        Whether you're seeking a modern city apartment, a peaceful countryside villa, or a stylish beachfront retreat, 
        we bring you closer to the home of your dreams.With advanced search tools, verified listings, and expert guidance, 
        finding your ideal space has never been easier. Experience the perfect balance of comfort, elegance, and convenience — 
        all in one place. Let us help you discover not just a property, but a place where life truly begins.
        </p>

      </div>
    </div>
  );
}

export default Discover;
