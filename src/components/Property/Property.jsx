import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Property1.css'; // Assuming this CSS file contains your styling
import { IoBedOutline, IoLocateOutline } from 'react-icons/io5';
import { GiBathtub, GiHomeGarage } from 'react-icons/gi';
import { supabase } from '../../supabaseClient'; // Make sure this path is correct for your project

const Property = () => {
  const [dealsData, setDealsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        setError(null);

        // Fetch properties from your Supabase 'property' table
        // We use .limit(10) to get the first 10 properties, similar to your original slice(0, 10)
        // .order('property_id', { ascending: true }) is added to ensure consistent ordering
        const { data, error } = await supabase
          .from('property')
          .select('*')
          .order('property_id', { ascending: true }) // Order by ID to ensure consistent 10 items
          .limit(10);

        if (error) {
          throw error;
        }

        setDealsData(data);
      } catch (err) {
        console.error('Error fetching properties from Supabase:', err.message);
        setError('Failed to load properties. Please check your network and RLS policies.');
      } finally {
        setLoading(false);
      }
    }

    fetchProperties();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  // --- IMPORTANT: Update this line with your actual Supabase Project Reference ---
  // You can find your Project Reference (e.g., 'abcdefg12345') in your Supabase project settings
  // It's the part of your Supabase URL that comes before '.supabase.co'.
  const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; // <<< REPLACE THIS!
  const SUPABASE_BUCKET_NAME = 'propertyimages'; // Your new bucket name

  const supabaseStorageUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`;

  return (
    <div className="property-listing">
      <h1 className="property-title1">Property <span className="highli">Showcase</span></h1>

      <div className="property-grid">
        {dealsData.length === 0 ? (
          <p className="text-center col-span-full">No properties available yet. Ensure RLS policies are set up correctly.</p>
        ) : (
          dealsData.map(deal => (
            <Link to={`/property/${deal.property_id}`} key={deal.property_id} className="deal-link">
              <div className="property-cardd">
                <div className="image-wrapper">
                  {/* Construct the image URL from Supabase Storage */}
                  <img
                    src={deal.property_image ? `${supabaseStorageUrl}${deal.property_image}` : 'https://placehold.co/300x200?text=No+Image'}
                    alt={`Property: ${deal.property_name}`}
                    className="property-image"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200?text=Image+Error"; }}
                  />
                </div>
                <div className="property-info">
                  <div className="features">
                    <div className="feature"><IoBedOutline /> <span>{deal.beds} Beds</span></div>
                    <div className="feature"><GiBathtub /> <span>{deal.baths} Baths</span></div>
                    <div className="feature"><GiHomeGarage /> <span>{deal.garage} Garage</span></div>
                  </div>
                  <div className="location"><IoLocateOutline /> <span>{deal.property_address}</span></div>
                  {/* Ensure property_price is treated as a number for toLocaleString() */}
                  <p className="price">LKR {deal.property_price ? parseFloat(deal.property_price).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </Link>
          ))
        )}
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
