import React from 'react';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-bootstrap';
import './NewestDeal.css';
import { BsSuitHeart } from 'react-icons/bs';
import { IoBedOutline, IoLocateOutline } from 'react-icons/io5';
import { GiBathtub, GiHomeGarage } from 'react-icons/gi';

import property1 from '../../assets/property_1.png';
import property2 from '../../assets/property_2.png';
import property3 from '../../assets/property_3.png';
import property4 from '../../assets/property_4.png';
import property5 from '../../assets/property_5.png';
import property6 from '../../assets/property_6.png';
import property7 from '../../assets/property_7.png';
import property8 from '../../assets/property_8.png';

const NewestDealCarousel = () => {
  const dealsData = [
    { id: 1, image: property1, beds: 5, baths: 3, garage: 1, price: '$110,000', location: 'New Street, Colombo' },
    { id: 2, image: property2, beds: 4, baths: 2, garage: 1, price: '$120,000', location: 'High Street, Kandy' },
    { id: 3, image: property3, beds: 3, baths: 2, garage: 1, price: '$130,000', location: 'Galle Road, Galle' },
    { id: 4, image: property4, beds: 6, baths: 4, garage: 2, price: '$140,000', location: 'Main Street, Negombo' },
    { id: 5, image: property5, beds: 2, baths: 1, garage: 1, price: '$80,000', location: 'Lake Road, Nuwara Eliya' },
    { id: 6, image: property6, beds: 4, baths: 3, garage: 1, price: '$150,000', location: 'Park Avenue, Colombo' },
    { id: 7, image: property7, beds: 5, baths: 3, garage: 2, price: '$160,000', location: 'Hill Top, Kandy' },
    { id: 8, image: property8, beds: 3, baths: 2, garage: 1, price: '$100,000', location: 'Beach Road, Matara' },
  ];

  const chunkedDeals = [];
  for (let i = 0; i < dealsData.length; i += 3) {
    chunkedDeals.push(dealsData.slice(i, i + 3));
  }

  return (
    <div className="newest-deal-carousel">
      <h1 className="title">Newest Deals</h1>
      
      <Carousel fade controls={false} indicators={false} interval={3000} pause={false}>
        {chunkedDeals.map((dealGroup, index) => (
          <Carousel.Item key={index}>
            <div className="carousel-group">
              {dealGroup.map((deal) => (
                <Link to={`/property/${deal.id}`} key={deal.id} className="deal-link">
                  <div className="deal-card">
                    <div className="image-container">
                      <img src={deal.image} alt="Property" className="property-image" />
                      <div className="heart-icon">
                        <BsSuitHeart size={"1.5rem"} />
                      </div>
                    </div>
                    <div className="details">
                      <div className="deal-features">
                        <div className="feature-item">
                          <IoBedOutline />
                          <p>{deal.beds} beds</p>
                        </div>
                        <div className="feature-item">
                          <GiBathtub />
                          <p>{deal.baths} baths</p>
                        </div>
                        <div className="feature-item">
                          <GiHomeGarage />
                          <p>{deal.garage} garage</p>
                        </div>
                      </div>
                      <p className="price">{deal.price}</p>
                      <div className="location">
                        <IoLocateOutline />
                        <p>{deal.location}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      <div className="view-more-container">
        <button className="view-more-btn">View More</button>
      </div>
    </div>
  );
};

export default NewestDealCarousel;
