import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AgentProperties.css';

const AgentProperties = ({ agent_id: propAgentId }) => {
  const agent_id = propAgentId || localStorage.getItem("agent_id"); // ✅ get from localStorage if not passed

  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  const API_URL = `http://localhost/estate/backend/api/agent.properties.api.php`;

  useEffect(() => {
    if (agent_id) {
      fetchProperties();
    }
  }, [agent_id]);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}?agent_id=${agent_id}`);
      const data = Array.isArray(response.data) ? response.data : [];
      setProperties(data);
      setFilteredProperties(data);
    } catch (error) {
      console.error("Error fetching properties", error);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredProperties(
      category === 'All'
        ? properties
        : properties.filter(prop => prop.property_category === category)
    );
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL, { data: { id } });
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property", error);
    }
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const handleSaveChanges = async () => {
    try {
      await axios.put(API_URL, selectedProperty);
      fetchProperties();
      handleClose();
    } catch (error) {
      console.error("Error updating property", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProperty(prev => ({
      ...prev,
      [name]: name === 'property_price' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="property-container">
      <h1>Your Properties</h1>
      {properties.length === 0 ? (
        <p style={{ color: 'gray', fontStyle: 'italic' }}>
          You haven’t been assigned any property.
        </p>
      ) : (
        <ul>
          {/* {properties.map((property) => (
            <li key={property.property_id}>
              <strong>{property.property_name}</strong> - {property.property_address}
            </li>
          ))} */}
        </ul>
      )}

      <div className="filter-bar">
        <div className="filter-buttons">
          {['All', 'House', 'Apartment', 'Commercial', 'Land', 'Villa', 'Cabin'].map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="property-cards">
        {filteredProperties.map(property => (
          <div key={property.property_id} className="property-card">
            <img
              src={property.property_image || 'http://localhost/estate/backend/api/Images/property/default.jpg'}
              alt={property.property_name}
              className="property-image"
            />
            <div className="property-body">
              <h3 className="property-title">{property.property_name}</h3>
              <p><strong>Price:</strong> ${property.property_price}</p>
              <p><strong>Location:</strong> {property.property_address}</p>
              <p><strong>Category:</strong> {property.property_category}</p>
              <p><strong>Description:</strong> {property.property_description}</p>
              <p><strong>State:</strong> {property.property_state}</p>
              <div className="card-buttons">
                <button className="delete-btn" onClick={() => handleDelete(property.property_id)}>Delete</button>
                <button className="edit-btn" onClick={() => handleEdit(property)}>Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedProperty && (
        <div className="propertyModalOverlay" onClick={handleClose}>
          <div className="propertyModalContent" onClick={(e) => e.stopPropagation()}>
            <div className="propertyModalHeader">
              <h5>Edit Property</h5>
              <button onClick={handleClose} className="propertyModalClose">&times;</button>
            </div>
            <div className="propertyModalBody">
              <div className="propertyFormGroup">
                <label>Name</label>
                <input
                  name="property_name"
                  value={selectedProperty.property_name}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>Price</label>
                <input
                  name="property_price"
                  type="number"
                  value={selectedProperty.property_price}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>Location</label>
                <input
                  name="property_address"
                  value={selectedProperty.property_address}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>Description</label>
                <textarea
                  name="property_description"
                  value={selectedProperty.property_description}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>State</label>
                <select
                  name="property_state"
                  value={selectedProperty.property_state}
                  onChange={handleChange}
                  className="propertyFormControl"
                >
                  {['Available', 'Sold', 'Pending'].map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="propertyFormGroup">
                <label>Category</label>
                <select
                  name="property_category"
                  value={selectedProperty.property_category}
                  onChange={handleChange}
                  className="propertyFormControl"
                >
                  {['House', 'Apartment', 'Commercial', 'Land', 'Villa', 'Cabin'].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="propertyModalFooter">
                <button onClick={handleClose} className="propertyBtnSecondary">Close</button>
                <button onClick={handleSaveChanges} className="propertyBtnPrimary">Save Changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentProperties;
