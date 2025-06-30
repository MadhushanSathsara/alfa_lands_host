import React, { useState } from 'react';
import './Home.css';
import homeImg from '../../assets/home_img.jpg';
// import axios from 'axios'; // No longer needed for Supabase search
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Import your pre-initialized Supabase client

// --- IMPORTANT: Supabase Storage Configuration ---
// Replace 'YOUR_SUPABASE_PROJECT_REF' with your actual Supabase Project Reference
// (e.g., 'abcdefg12345' from your Supabase URL like https://abcdefg12345.supabase.co)
// Replace 'YOUR_SUPABASE_BUCKET_NAME' with the actual name of your storage bucket for images.
const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; // <<< VERIFY THIS IS YOUR CORRECT REFERENCE
const SUPABASE_BUCKET_NAME = 'propertyimages'; // <<< VERIFY THIS IS YOUR CORRECT BUCKET NAME

const supabaseStorageUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`;
// --- End Supabase Storage Configuration ---

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
      // Using Supabase client to query the 'property' table
      // .from('property') - replace 'property' with your actual table name if different
      // .select('*') - selects all columns
      // .ilike('property_address', `%${searchTerm}%`) - performs a case-insensitive search
      //                                                on the 'property_address' column.
      //                                                Adjust 'property_address' if your column is named differently.
      const { data, error } = await supabase
        .from('property')
        .select('*')
        .ilike('property_address', `%${searchTerm}%`);

      if (error) {
        throw error;
      }

      setResults(data);
    } catch (error) {
      console.error('Search failed', error.message); // Supabase errors often have a .message property
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

        {/* Map through results from Supabase */}
        {results.map((property) => (
          <div key={property.property_id} className="home__result-card">
            {/* Construct image URL from Supabase Storage.
                Ensure 'property_image' column stores the path/filename within your bucket. */}
            <img
              src={property.property_image ? `${supabaseStorageUrl}${property.property_image}` : 'https://placehold.co/300x200?text=No+Image'}
              alt={property.property_name}
              className="result-image"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/300x200?text=Image+Error"; }}
            />
            {/* Ensure these column names match your Supabase table */}
            <h4>{property.property_name}</h4>
            <p>{property.property_address}</p>
            <p>Price: ${property.property_price}</p>
            <Link to={`/Property/${property.property_id}`} className="viewb">View More</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;