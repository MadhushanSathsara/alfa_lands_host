import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './CustomerReviews.css'; // Assuming this CSS file contains your styling
import { supabase } from '../../supabaseClient'; // Import Supabase client
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// React-slick CSS imports - make sure these are installed
// npm install react-slick slick-carousel
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";


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
    { breakpoint: 1200, settings: { slidesToShow: 3 } }, // Added an extra breakpoint for better control
  ],
};

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; 
  const CUSTOMER_IMAGES_BUCKET = 'customerimages'; 

  const getPublicImageUrl = (bucket, imageName) => {
    if (!imageName) return 'https://placehold.co/100x100?text=Customer';
    return `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${bucket}/${imageName}`;
  };


  useEffect(() => {
    async function fetchReviews() {
      try {
        setLoading(true);
        setError(null);

      
        const { data, error } = await supabase
          .from('review')
          .select('*')
          .order('review_id', { ascending: true }); 

        if (error) {
          throw error;
        }

        setReviews(data);
      } catch (err) {
        console.error('Error fetching reviews from Supabase:', err.message);
        setError('Failed to load reviews. Please check your network and RLS policies.');
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading reviews...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="customer-reviews">
      <h2>Customer <span className="highli"> Reviews</span></h2>
      <div className="reviews-wrapper">
        {reviews.length === 0 ? (
          <p className="text-center">No reviews available yet. Ensure RLS policies are set up correctly.</p>
        ) : (
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <div key={review.review_id || index} className="review-card"> 
                <img
                  src={getPublicImageUrl(CUSTOMER_IMAGES_BUCKET, review.customer_image)}
                  alt={`${review.user_name}'s profile`}
                  className="review-image"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100?text=Customer"; }}
                />
                <div className="review-content">
                  <h3>{review.user_name}</h3>
                  <p className="rating">Rating: {'⭐'.repeat(review.rating)}</p>
                  <p className="review-text">"{review.comment}"</p>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;
