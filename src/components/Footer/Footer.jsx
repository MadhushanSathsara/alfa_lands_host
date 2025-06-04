import React from 'react';
import './Footer.css';
import { FaGooglePlay } from 'react-icons/fa';
import { IoLogoAppleAppstore } from 'react-icons/io5';
import { FiTwitter, FiFacebook } from 'react-icons/fi';
import { AiOutlineInstagram, AiOutlineYoutube, AiOutlineLinkedin } from 'react-icons/ai';

const Footer = () => {
  return (
    <div className='footer-container'>
      <footer className='footer'>
        <div className='footer-top'>
          <div className='footer-header'>
            <h3>Contact</h3>
            <h3>Sources</h3>
            <h3>Links</h3>
          </div>
          <div className='footer-content'>
            <div className='footer-section'>
              <address>43 Raymouth Rd, Colombo 7, Sri Lanka</address>
              <ul className='footer-links'>
                <li><a href='tel://+94112345678'>+94 112 345 678</a></li>
                <li><a href='mailto:info@alfaland.com'>info@alfaland.com</a></li>
              </ul>
            </div>

            <div className='footer-section'>
              <ul className='footer-links'>
                <li><a href='#'>About us</a></li>
                <li><a href='#'>Services</a></li>
                <li><a href='#'>Vision</a></li>
                <li><a href='#'>Mission</a></li>
                <li><a href='#'>Terms</a></li>
                <li><a href='#'>Privacy</a></li>
              </ul>
            </div>

            <div className='footer-section'>
              <ul className='footer-links'>
                <li><a href='#'>Our Vision</a></li>
                <li><a href='#'>About us</a></li>
                <li><a href='#'>Contact us</a></li>
              </ul>
              <div className='social-icons'>
                <a href='#'><FiFacebook size={'1.5rem'} /></a>
                <a href='#'><AiOutlineInstagram size={'1.5rem'} /></a>
                <a href='#'><FiTwitter size={'1.5rem'} /></a>
                <a href='#'><AiOutlineLinkedin size={'1.5rem'} /></a>
                <a href='#'><AiOutlineYoutube size={'1.5rem'} /></a>
              </div>
            </div>
          </div>
        </div>

        <div className='footer-bottom'>
          <p>
            Copyright &copy; {new Date().getFullYear()}. All Rights Reserved.
            Designed by <a href='https://alfaland.co'>Alfaland</a>.
          </p>
          <p>
            Distributed by <a href='https://talfaland.com/' target='_blank' rel='noopener noreferrer'>AlfaLand</a>.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
