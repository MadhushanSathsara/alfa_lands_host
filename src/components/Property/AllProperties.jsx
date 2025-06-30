import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AllProperties.css'; // Assuming this CSS file contains your styling
import { IoBedOutline, IoLocateOutline } from 'react-icons/io5';
import { GiBathtub, GiHomeGarage } from 'react-icons/gi';
// Removed axios as we are now using Supabase
import { supabase } from '../../supabaseClient'; // Make sure this path is correct for your project

const AllProperties = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allPropertiesData, setAllPropertiesData] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; 
  const SUPABASE_BUCKET_NAME = 'propertyimages'; 

  const supabaseStorageUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`;


  const fetchAllProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('property')
        .select('*')
        .order('property_id', { ascending: true });

      if (error) {
        throw error;
      }
      setAllPropertiesData(data);
    } catch (err) {
      console.error('Error fetching all properties from Supabase:', err.message);
      setError('Failed to load properties. Please check your network and RLS policies.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProperties(); 
  }, []);


  const handleSearch = async () => {
    const trimmedSearchTerm = searchTerm.trim();

    if (trimmedSearchTerm === '') {
      setShowSearchResults(false);
      setHasSearched(false);
      
      fetchAllProperties();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

     
      const { data, error } = await supabase
        .from('property')
        .select('*')
        .or(`property_address.ilike.%${trimmedSearchTerm}%,district.ilike.%${trimmedSearchTerm}%,nearby_town.ilike.%${trimmedSearchTerm}%`);

      if (error) {
        throw error;
      }
      setSearchResults(data);
      setShowSearchResults(true);
    } catch (err) {
      console.error('Search failed:', err.message);
      setError('Search failed. Please try again.');
      setSearchResults([]);
      setShowSearchResults(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const displayProperties = showSearchResults ? searchResults : allPropertiesData;

  if (loading) {
    return <div className="text-center p-4">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="all-properties-listing">
      <h1 className="all-properties-title">All <span className="highli">Properties</span></h1>

      <div className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by location (address, district, town)..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>

        {hasSearched && searchResults.length === 0 && showSearchResults && (
          <p className="no-results">No properties found matching "{searchTerm}"</p>
        )}
      </div>

      <div className="property-grid">
        {displayProperties.length === 0 && !loading && !error ? (
          <p className="text-center col-span-full">No properties available yet. Ensure RLS policies are set up correctly.</p>
        ) : (
          displayProperties.map((property) => (
            <Link
              to={`/property/${property.property_id}`}
              key={property.property_id}
              className="deal-link"
            >
              <div className="property-card">
                <div className="image-wrapper">
                 
                  <img
                    src={property.property_image ? `${supabaseStorageUrl}${property.property_image}` : 'https://placehold.co/300x200?text=No+Image'}
                    alt={`Property: ${property.property_name}`}
                    className="property-image"
                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200?text=Image+Error"; }}
                  />
                </div>
                <div className="property-info">
                  <h3 className="property-title">{property.property_name}</h3>
                  <p className="price">
                    LKR {property.property_price ? parseFloat(property.property_price).toLocaleString() : 'N/A'}
                  </p>
                  <div className="features">
                    <div className="feature">
                      <IoBedOutline /> <span>{property.beds} Beds</span>
                    </div>
                    <div className="feature">
                      <GiBathtub /> <span>{property.baths} Baths</span>
                    </div>
                    <div className="feature">
                      <GiHomeGarage /> <span>{property.garage} Garage</span>
                    </div>
                  </div>
                  <div className="location">
                    <IoLocateOutline /> <span>{property.property_address}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default AllProperties;
