import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Property1.css';

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [allAgents, setAllAgents] = useState([]);
  const [assignedAgents, setAssignedAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const API_URL = 'http://localhost/estate/backend/api/property.api.php';

  // Fetch all properties
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = Array.isArray(response.data) ? response.data : [];
        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error fetching properties", error);
      }
    };
    fetchProperties();
  }, []);

  // Fetch agents and assigned agents when modal opens
  useEffect(() => {
    if (showModal && selectedProperty?.property_id) {
      const fetchAgents = async () => {
        try {
          // Fetch all available agents
          const agentsResponse = await axios.get('http://localhost/estate/backend/api/agents.api.php');
          setAllAgents(Array.isArray(agentsResponse.data) ? agentsResponse.data : []);

          // Fetch agents assigned to this property
          const assignedResponse = await axios.get(
            `http://localhost/estate/backend/api/property_agent.api.php?property_id=${selectedProperty.property_id}`
          );
          setAssignedAgents(Array.isArray(assignedResponse.data) ? assignedResponse.data : []);

          // Fetch property images
          const imagesResponse = await axios.get(
            `http://localhost/estate/backend/api/property.images.api.php?property_id=${selectedProperty.property_id}`
          );
          if (imagesResponse.data.success && Array.isArray(imagesResponse.data.additional_images)) {
            setExistingImages(imagesResponse.data.additional_images);
          } else {
            setExistingImages([]);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setAllAgents([]);
          setAssignedAgents([]);
          setExistingImages([]);
        }
      };
      fetchAgents();
    }
  }, [showModal, selectedProperty]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredProperties(
      category === 'All'
        ? properties
        : properties.filter(prop => prop.property_category === category)
    );
  };

  const handleDelete = async (property_id) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await axios.delete(API_URL, {
        data: { property_id },
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status) {
        alert("Property deleted successfully!");
        setProperties(prev => prev.filter(p => p.property_id !== property_id));
        setFilteredProperties(prev => prev.filter(p => p.property_id !== property_id));
      } else {
        alert("Delete failed: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting property. See console for details.");
    }
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProperty(null);
    setNewImages([]);
  };

  const handleSaveChanges = async () => {
    try {
      const updateData = {
        property_id: selectedProperty.property_id,
        property_name: selectedProperty.property_name,
        property_address: selectedProperty.property_address,
        property_description: selectedProperty.property_description,
        property_price: selectedProperty.property_price,
        property_state: selectedProperty.property_state,
        property_category: selectedProperty.property_category
      };

      const response = await axios.put(API_URL, updateData);

      if (response.data.status) {
        alert("Property updated successfully!");
        setProperties(prev => prev.map(p => 
          p.property_id === selectedProperty.property_id ? {...p, ...updateData} : p
        ));
        setFilteredProperties(prev => prev.map(p => 
          p.property_id === selectedProperty.property_id ? {...p, ...updateData} : p
        ));
        handleClose();
      } else {
        alert(`Update failed: ${response.data.message}`);
      }
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProperty(prev => ({
      ...prev,
      [name]: name === 'property_price' ? parseFloat(value) : value
    }));
  };

  const handleDeleteImage = async (filename) => {
    if (!window.confirm("Delete this image?")) return;

    try {
      const response = await axios.delete('http://localhost/estate/backend/api/property.images.api.php', {
        data: {
          filename,
          property_id: selectedProperty.property_id,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        setExistingImages(prev => prev.filter(img => img !== filename));
        alert("Image deleted");
      } else {
        alert("Failed to delete image: " + response.data.message);
      }
    } catch (err) {
      console.error("Delete error", err);
      alert("Error deleting image. See console.");
    }
  };

  const uploadNewImages = async () => {
    if (newImages.length === 0) return;

    try {
      const formData = new FormData();
      formData.append('property_id', selectedProperty.property_id);
      newImages.forEach(img => formData.append('images[]', img));

      const response = await axios.post(
        'http://localhost/estate/backend/api/property.images.api.php', 
        formData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.success) {
        alert('Images uploaded!');
        setNewImages([]);
        setExistingImages(prev => [...prev, ...response.data.uploadedImages]);
      } else {
        alert('Image upload failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Image upload error:', err);
      alert('Image upload error, see console.');
    }
  };

  const handleAssignAgent = async () => {
    if (!selectedAgentId) {
      alert("Please select an agent first.");
      return;
    }

    const agentId = parseInt(selectedAgentId);
    if (isNaN(agentId)) {
      alert("Invalid agent selected.");
      return;
    }

   
    if (assignedAgents.some(agent => agent.agent_id === agentId)) {
      alert("This agent is already assigned to the property.");
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost/estate/backend/api/property_agent.api.php', 
        {
          property_id: selectedProperty.property_id,
          agent_id: agentId
        }
      );

      if (response.data.success) {
        const assignedAgent = allAgents.find(agent => agent.agent_id == agentId);
        if (assignedAgent) {
          setAssignedAgents(prev => [...prev, assignedAgent]);
          setSelectedAgentId("");
          alert("Agent assigned successfully.");
        } else {
          alert("Agent assigned but not found in local list. Please refresh.");
        }
      } else {
        alert("Failed to assign agent: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error assigning agent:", error);
      alert("Error assigning agent. See console for details.");
    }
  };

  const handleRemoveAgent = async (agentId) => {
    if (!window.confirm("Remove this agent from the property?")) return;

    try {
      const response = await axios.delete(
        'http://localhost/estate/backend/api/property_agent.api.php', 
        { 
          data: { 
            property_id: selectedProperty.property_id, 
            agent_id: agentId 
          } 
        }
      );

      if (response.data.success) {
        setAssignedAgents(prev => prev.filter(a => a.agent_id !== agentId));
        alert("Agent removed successfully.");
      } else {
        alert("Failed to remove agent: " + (response.data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error removing agent:", error);
      alert("Error removing agent. See console for details.");
    }
  };

  return (
    <div className="property-container">
      <h1>Our Properties</h1>

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
          <div className="add-property-btn">
            <Link to="/admin_dashboard/AddProperty" className="propertyAddLink">
              <button>+ Add Property</button>
            </Link>
          </div>
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
                <button className="delete-btn" onClick={() => handleDelete(property.property_id)}>
                  Delete
                </button>
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

              <div className="propertyFormGroup">
                <label>Assigned Agents</label>
                <div className="agent-select-wrapper">
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    className="form-control"
                  >
                    <option value="">Select an agent</option>
                    {allAgents.map(agent => (
                      <option key={agent.agent_id} value={agent.agent_id}>
                        {agent.agent_name} (ID: {agent.agent_id})
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignAgent}
                    className="btn btn-primary"
                    disabled={!selectedAgentId}
                  >
                    Add Agent
                  </button>
                </div>

                <div className="assigned-agents-list">
                  {assignedAgents.map(agent => (
                    agent && agent.agent_id && (
                      <div key={agent.agent_id} className="assigned-agent-item">
                        {agent.agent_name} (ID: {agent.agent_id})
                        <button
                          onClick={() => handleRemoveAgent(agent.agent_id)}
                          className="remove-agent-btn"
                        >
                          &times;
                        </button>
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div className="propertyFormGroup">
                <label>Property Images</label>
                <div className="custom-file-upload">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    id="propertyImageInput"
                    onChange={(e) => setNewImages(Array.from(e.target.files))}
                  />
                  <label htmlFor="propertyImageInput">📁 Choose Images</label>
                  <span className="file-count">
                    {newImages.length > 0 ? `${newImages.length} image(s) selected` : 'No images selected'}
                  </span>
                </div>

                <div className="imagePreviewWrapper">
                  {existingImages.map((filename, idx) => (
                    <div key={idx} className="image-preview-container">
                      <img
                        src={`http://localhost/estate/backend/api/Images/property/${filename}`}
                        alt={`Property Image ${idx}`}
                        className="image-preview"
                      />
                      <button
                        className="delete-image-btn"
                        onClick={() => handleDeleteImage(filename)}
                        title="Delete Image"
                      >
                        &times;
                      </button>
                    </div>
                  ))}

                  {newImages.map((file, idx) => (
                    <div key={`new-${idx}`} className="image-preview-container">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New Upload ${idx}`}
                        className="image-preview"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="propertyModalFooter">
                <button onClick={handleClose} className="propertyBtnSecondary">Close</button>
                <button onClick={handleSaveChanges} className="propertyBtnPrimary">Save Changes</button>
                {newImages.length > 0 && (
                  <button onClick={uploadNewImages} className="propertyBtnPrimary" style={{marginLeft: '10px'}}>
                    Upload New Images
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Property;