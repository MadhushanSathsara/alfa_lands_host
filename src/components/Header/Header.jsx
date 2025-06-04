import React, { useState } from 'react';
import logoImg from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [showLogin, setShowLogin] = useState(false);

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <nav className="home__navbar">
      <div className="home__logo">
        <img src={logoImg} alt="Logo" />
      </div>

      {/* Navigation container for better spacing control */}
      <div className="nav__container">
        <ul className="home__menu">
          <li><Link to="/content">Home</Link></li>
          <li><Link to="/bestdeals">Best Deals</Link></li>
          <li><Link to="/all-properties">Properties</Link></li>
          <li><a href="#">Trending</a></li>
          <li><Link to="/aboutus">About Us</Link></li>
        </ul>

        {/* Toggle button with controlled spacing */}
        <div className="toggle__wrapper">
          <div className="toggle__container">
            <button className="toggle__button" onClick={toggleLogin}>
              &#9776;
            </button>

            {/* Collapsible login */}
            {showLogin && (
              <div className="login__collapse">
                <Link to="/login">
                  <button className="login__button">Login</button>
                </Link>
                <button className="news">News</button>
                <button className="news">Support</button>
                <button className="news">Privacy Policy</button>
                <button className="news">Blog</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;