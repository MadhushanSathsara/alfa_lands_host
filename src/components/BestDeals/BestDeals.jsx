import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './Deals.css';
import property1 from '../../../Backend/api/Images/property/property_1.jpg';
import property2 from '../../../Backend/api/Images/property/property_2.jpg';
import property3 from '../../../Backend/api/Images/property/property_9.jpg';
import property4 from '../../../Backend/api/Images/property/property_3.jpg';
import property5 from '../../../Backend/api/Images/property/property_7.jpg';
import property7 from '../../../Backend/api/Images/property/property_10.jpg';
import { IoLocateOutline } from 'react-icons/io5';

const BestDeals = () => {
  const dealsData = [
    { id: 1, image: property5, title: "Place", location: "High Street, Kandy" },
    { id: 2, image: property2, title: "Place", location: "Main Street, Colombo" },
    { id: 3, image: property3, title: "Place", location: "Beach Road, Matara" },
    { id: 4, image: property4, title: "Place", location: "Lake Road, Nuwara Eliya" },
    { id: 5, image: property1, title: "Place", location: "Hill Top, Kandy" },
    { id: 6, image: property7, title: "Place", location: "Park Avenue, Colombo" },
  ];


  const chunkedDeals = [];
  for (let i = 0; i < dealsData.length; i += 3) {
    chunkedDeals.push(dealsData.slice(i, i + 3));
  }


  return (
    <div className="best-deals-carousel">
      <div className="header">
        <h1 className="header-title">Best <span className="highli"> Deals</span></h1>
        <p className="header-description">Find the best real estate deals at unbeatable prices.</p>
      </div>
      <Carousel controls={false} indicators={false} interval={5000} pause={false}>
        {chunkedDeals.map((dealGroup, index) => (
          <Carousel.Item key={index}>
            <div className="deal-slide">
              {dealGroup[0] && (
                <div className="featured-deal">
                  <img src={dealGroup[0].image} alt={`Property ${dealGroup[0].id}`} className="featured-image" />
                  <div className="deal-info">
                    <h1 className="deal-title">{dealGroup[0].title}</h1>
                    <p className="deal-location">
                      <IoLocateOutline size="1.2rem" /> {dealGroup[0].location}
                    </p>
                  </div>
                </div>
              )}
              <div className="small-deals">
                {dealGroup.slice(1).map((deal) => (
                  <div key={deal.id} className="small-deal-item">
                    <img src={deal.image} alt={`Property ${deal.id}`} className="small-deal-image" />
                    <div className="deal-info">
                      <h2 className="deal-title">{deal.title}</h2>
                      <p className="deal-location">
                        <IoLocateOutline size="1rem" /> {deal.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      <div className="view-more-container">
        <button className="view">View More Deals</button>
      </div>
    </div>
  );
};

export default BestDeals;
