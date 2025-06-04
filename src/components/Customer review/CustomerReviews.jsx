import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './CustomerReviews.css';

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 768, settings: { slidesToShow: 1 } },
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
  ],
};

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('http://localhost/estate/backend/api/get_reviews.php')
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.error('Error loading reviews:', err));
  }, []);

  return (
    <div className="customer-reviews">
      <h2>Customer <span className="highli"> Reviews</span></h2>
       <div className="reviews-wrapper">
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <img
                src={`http://localhost/estate/backend/api/images/customer/${review.customer_image}`}
                alt={`${review.user_name}'s profile`}
                className="review-image"
              />
              <div className="review-content">
                <h3>{review.user_name}</h3>
                <p className="rating">Rating: {'⭐'.repeat(review.rating)}</p>
                <p className="review-text">"{review.comment}"</p>
              </div>
            </div>
          ))}
         </Slider>
         </div>
    </div>
  );
};

export default CustomerReviews;
