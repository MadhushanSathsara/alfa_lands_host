import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../supabaseClient'; // Ensure this path is correct
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for images
import './Property1.css'; // Assuming your CSS file contains your styling

// Custom Modal component for Confirm/Alert messages instead of window.confirm/alert
const CustomAlertDialog = ({ message, onConfirm, onCancel, showConfirm = true }) => {
  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          {showConfirm && <button onClick={onConfirm} className="modal-button confirm">Yes</button>}
          <button onClick={onCancel} className="modal-button cancel">{showConfirm ? 'No' : 'Close'}</button>
        </div>
      </div>
    </div>
  );
};

const Property = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [allAgents, setAllAgents] = useState([]);
  const [assignedAgents, setAssignedAgents] = useState([]); // Stores agent objects for assigned agents
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [existingImages, setExistingImages] = useState([]); // Stores just the filenames (e.g., 'image1.jpg')
  const [newImages, setNewImages] = useState([]); // Stores File objects for new uploads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for custom alerts/confirms
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [isConfirmation, setIsConfirmation] = useState(false);


  // Supabase Storage Bucket details
  // IMPORTANT: Replace 'hddobdmhmzmmdqtmktse' with YOUR actual Supabase Project Reference
  const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse';
  const SUPABASE_BUCKET_NAME = 'propertyimages'; // Your Supabase Storage bucket name
  const supabaseStorageUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`;


  // Fetch all properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('property')
          .select('*')
          .order('property_id', { ascending: true }); // Ensure consistent ordering

        if (error) throw error;

        const fetchedData = Array.isArray(data) ? data : [];
        setProperties(fetchedData);
        setFilteredProperties(fetchedData);
      } catch (err) {
        console.error("Error fetching properties:", err.message);
        setError("Failed to load properties. Please check your network and RLS policies.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  // Fetch data for modal when it opens and a property is selected
  useEffect(() => {
    if (showModal && selectedProperty?.property_id) {
      const fetchDataForModal = async () => {
        try {
          // Fetch all agents
          const { data: agentsData, error: agentsError } = await supabase
            .from('agents')
            .select('agent_id, agent_name'); // Select only necessary fields

          if (agentsError) throw agentsError;
          setAllAgents(Array.isArray(agentsData) ? agentsData : []);

          // Fetch assigned agents for this property
          // This assumes `property_agents` is a join table with `property_id` and `agent_id`
          // We are also joining to get the agent's name for display
          const { data: assignedData, error: assignedError } = await supabase
            .from('property_agents')
            .select('agent_id, agents(agent_name)') // Select agent_id and join agent_name from agents table
            .eq('property_id', selectedProperty.property_id);

          if (assignedError) throw assignedError;

          // Map assigned agents data to a flat array of objects { agent_id, agent_name }
          const mappedAssignedAgents = Array.isArray(assignedData)
            ? assignedData.map(item => ({
                agent_id: item.agent_id,
                agent_name: item.agents?.agent_name || `Agent ${item.agent_id}` // Use joined name or fallback
              }))
            : [];
          setAssignedAgents(mappedAssignedAgents);

          // List images from Supabase Storage for the selected property's folder
          const { data: imagesList, error: imagesError } = await supabase.storage
            .from(SUPABASE_BUCKET_NAME)
            .list(`${selectedProperty.property_id}/`, {
              // Can add options like `limit`, `offset`, `search`
            });

          if (imagesError) throw imagesError;

          const imageFilenames = Array.isArray(imagesList)
            ? imagesList.map(img => img.name).filter(name => name !== '.emptyFolderPlaceholder') // Filter out placeholder files
            : [];
          setExistingImages(imageFilenames);

        } catch (err) {
          console.error('Error fetching modal data:', err.message);
          setAllAgents([]);
          setAssignedAgents([]);
          setExistingImages([]);
          // Optionally show an error message to the user here
        }
      };
      fetchDataForModal();
    }
  }, [showModal, selectedProperty]); // Dependencies should include Supabase bucket name if it changes dynamically, but typically it's static.

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setFilteredProperties(
      category === 'All'
        ? properties
        : properties.filter(prop => prop.property_category === category)
    );
  };

  // --- Custom Alert/Confirm Functions (replacing window.confirm/alert) ---
  const showCustomAlert = (message, isConfirm = false, onConfirm = null) => {
    setAlertMessage(message);
    setIsConfirmation(isConfirm);
    setOnConfirmAction(() => onConfirm); // Use a functional update to store the callback
    setShowAlert(true);
  };

  const hideCustomAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
    setIsConfirmation(false);
    setOnConfirmAction(null);
  };

  const handleAlertConfirm = () => {
    if (onConfirmAction) {
      onConfirmAction();
    }
    hideCustomAlert();
  };
  // --- END Custom Alert/Confirm Functions ---


  // Delete Property: Deletes images from storage first, then the property record
  const handleDelete = (property_id) => {
    showCustomAlert("Are you sure you want to delete this property and all its images?", true, async () => {
      try {
        // First, delete associated entries in property_agents table
        const { error: agentLinkError } = await supabase
          .from('property_agents')
          .delete()
          .eq('property_id', property_id);

        if (agentLinkError) {
          console.error("Error deleting agent links for property:", agentLinkError.message);
          // Don't throw, try to delete the property anyway
        } else {
          console.log(`Successfully deleted agent links for property ${property_id}`);
        }

        // Next, delete associated images from Supabase Storage
        const { data: imagesList, error: listError } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .list(`${property_id}/`);

        if (listError) {
          console.error("Error listing images for deletion:", listError.message);
          // Don't throw, try to delete the property anyway
        } else if (imagesList.length > 0) {
          // Construct full paths for removal
          const filesToDelete = imagesList.map(img => `${property_id}/${img.name}`);
          const { error: removeError } = await supabase.storage
            .from(SUPABASE_BUCKET_NAME)
            .remove(filesToDelete);

          if (removeError) {
            console.error("Error deleting property images from storage:", removeError.message);
            // Don't block property deletion if images fail
          } else {
            console.log(`Successfully deleted ${filesToDelete.length} images for property ${property_id}`);
          }
        }

        // Finally, delete the property record from the database
        const { error: dbError } = await supabase
          .from('property')
          .delete()
          .eq('property_id', property_id);

        if (dbError) throw dbError;

        showCustomAlert("Property deleted successfully!", false);
        setProperties(prev => prev.filter(p => p.property_id !== property_id));
        setFilteredProperties(prev => prev.filter(p => p.property_id !== property_id));
      } catch (err) {
        console.error("Delete property error:", err.message);
        showCustomAlert("Error deleting property: " + err.message, false);
      }
    });
  };

  const handleEdit = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedProperty(null);
    setNewImages([]);
    setExistingImages([]); // Clear existing images on close too
    setSelectedAgentId(""); // Clear selected agent
    setAllAgents([]); // Clear agents
    setAssignedAgents([]); // Clear assigned agents
  };

  // Save changes to property details
  const handleSaveChanges = async () => {
    if (!selectedProperty) return;

    try {
      const updateData = {
        property_name: selectedProperty.property_name,
        property_address: selectedProperty.property_address,
        property_description: selectedProperty.property_description,
        property_price: parseFloat(selectedProperty.property_price), // Ensure price is a number
        property_state: selectedProperty.property_state,
        property_category: selectedProperty.property_category,
        beds: selectedProperty.beds,
        baths: selectedProperty.baths,
        garage: selectedProperty.garage,
        // property_image is not updated here, it's managed by separate image upload/delete
      };

      const { data, error } = await supabase
        .from('property')
        .update(updateData)
        .eq('property_id', selectedProperty.property_id)
        .select(); // Select the updated row to get fresh data

      if (error) throw error;

      showCustomAlert("Property updated successfully!", false);
      // Update local state with the newly updated property data
      setProperties(prev => prev.map(p =>
        p.property_id === selectedProperty.property_id ? data[0] : p
      ));
      setFilteredProperties(prev => prev.map(p =>
        p.property_id === selectedProperty.property_id ? data[0] : p
      ));
      handleClose(); // Close modal after successful update
    } catch (err) {
      console.error("Error updating property:", err.message);
      showCustomAlert(`Failed to update property: ${err.message}`, false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedProperty(prev => ({
      ...prev,
      // Convert relevant fields to numbers
      [name]: (name === 'property_price' || name === 'beds' || name === 'baths' || name === 'garage')
              ? (value === '' ? null : parseFloat(value)) // Handle empty string for numbers
              : value
    }));
  };

  // Delete a single image from Supabase Storage
  const handleDeleteImage = (filename) => {
    showCustomAlert("Delete this image?", true, async () => {
      try {
        if (!selectedProperty?.property_id) {
          showCustomAlert("Property ID not found for image deletion.", false);
          return;
        }

        const filePath = `${selectedProperty.property_id}/${filename}`;
        const { error: removeError } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .remove([filePath]);

        if (removeError) throw removeError;

        showCustomAlert("Image deleted!", false);
        setExistingImages(prev => prev.filter(img => img !== filename));

        // If the deleted image was the main property_image, update the property record
        if (selectedProperty.property_image === filename) {
          // Try to set another existing image as the main one, or null if no others
          const remainingImages = existingImages.filter(img => img !== filename);
          const newMainImage = remainingImages.length > 0 ? remainingImages[0] : null;

          const { error: updatePropError } = await supabase
            .from('property')
            .update({ property_image: newMainImage })
            .eq('property_id', selectedProperty.property_id);

          if (updatePropError) {
            console.error("Error updating main property image after delete:", updatePropError.message);
          } else {
            setSelectedProperty(prev => ({ ...prev, property_image: newMainImage }));
          }
        }

      } catch (err) {
        console.error("Error deleting image:", err.message);
        showCustomAlert(`Failed to delete image: ${err.message}`, false);
      }
    });
  };

  // Upload new images to Supabase Storage
  const uploadNewImages = async () => {
    if (newImages.length === 0) {
      showCustomAlert("No new images selected for upload.", false);
      return;
    }
    if (!selectedProperty?.property_id) {
      showCustomAlert("Property ID not found for image upload.", false);
      return;
    }

    const uploadedImageNames = [];
    let uploadErrors = [];
    let initialMainImageSet = false; // Flag to track if main image has been set

    for (const file of newImages) {
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${uuidv4()}.${fileExtension}`; // Generate unique filename
      const filePath = `${selectedProperty.property_id}/${uniqueFileName}`; // Path in storage bucket

      try {
        const { data, error } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600', // Cache for 1 hour
            upsert: false // Do not overwrite existing files with same name
          });

        if (error) throw error;
        uploadedImageNames.push(uniqueFileName); // Store just the filename

        // If this is the first image being uploaded AND property_image is null/empty, set it as main
        if (!selectedProperty.property_image && !initialMainImageSet) {
          const { error: updatePropError } = await supabase
            .from('property')
            .update({ property_image: uniqueFileName })
            .eq('property_id', selectedProperty.property_id);

          if (updatePropError) {
            console.error("Error setting main property image:", updatePropError.message);
          } else {
            setSelectedProperty(prev => ({ ...prev, property_image: uniqueFileName }));
            initialMainImageSet = true; // Mark as set
          }
        }

      } catch (err) {
        console.error(`Error uploading ${file.name}:`, err.message);
        uploadErrors.push(file.name);
      }
    }

    if (uploadErrors.length > 0) {
      showCustomAlert(`Failed to upload some images: ${uploadErrors.join(', ')}`, false);
    } else {
      showCustomAlert('Images uploaded successfully!', false);
    }

    setNewImages([]); // Clear new images selection
    // Update existing images state to include newly uploaded ones
    setExistingImages(prev => [...prev, ...uploadedImageNames]);
  };

  // Assign agent to property
  const handleAssignAgent = async () => {
    if (!selectedAgentId) {
      showCustomAlert("Please select an agent first.", false);
      return;
    }

    const agentId = parseInt(selectedAgentId);
    if (isNaN(agentId)) {
      showCustomAlert("Invalid agent selected.", false);
      return;
    }

    // Check if agent is already assigned locally (optimistic check)
    if (assignedAgents.some(agent => agent.agent_id === agentId)) {
      showCustomAlert("This agent is already assigned to the property.", false);
      return;
    }

    try {
      // Insert into the join table `property_agents`
      const { error } = await supabase
        .from('property_agents')
        .insert({
          property_id: selectedProperty.property_id,
          agent_id: agentId
        });

      if (error) throw error;

      showCustomAlert("Agent assigned successfully.", false);
      const assignedAgent = allAgents.find(agent => agent.agent_id === agentId);
      if (assignedAgent) {
        setAssignedAgents(prev => [...prev, assignedAgent]);
        setSelectedAgentId(""); // Clear selected agent after assignment
      }
    } catch (err) {
      console.error("Error assigning agent:", err.message);
      showCustomAlert(`Failed to assign agent: ${err.message}`, false);
    }
  };

  // Remove agent from property
  const handleRemoveAgent = (agentId) => {
    showCustomAlert("Remove this agent from the property?", true, async () => {
      try {
        const { error } = await supabase
          .from('property_agents')
          .delete()
          .eq('property_id', selectedProperty.property_id)
          .eq('agent_id', agentId);

        if (error) throw error;

        showCustomAlert("Agent removed successfully.", false);
        setAssignedAgents(prev => prev.filter(a => a.agent_id !== agentId));
      } catch (err) {
        console.error("Error removing agent:", err.message);
        showCustomAlert(`Failed to remove agent: ${err.message}`, false);
      }
    });
  };

  if (loading) {
    return <div className="text-center p-4">Loading properties...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

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
        {filteredProperties.length === 0 ? (
          <p className="text-center col-span-full">No properties available for this category.</p>
        ) : (
          filteredProperties.map(property => (
            <div key={property.property_id} className="property-card">
              <img
                src={property.property_image ? `${supabaseStorageUrl}${property.property_image}` : 'https://placehold.co/300x200?text=No+Image'}
                alt={property.property_name}
                className="property-image"
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200?text=Image+Load+Error"; }}
              />
              <div className="property-body">
                <h3 className="property-title">{property.property_name}</h3>
                <p><strong>Price:</strong> ${property.property_price ? property.property_price.toLocaleString() : 'N/A'}</p>
                <p><strong>Location:</strong> {property.property_address}</p>
                <p><strong>Category:</strong> {property.property_category}</p>
                <p><strong>Description:</strong> {property.property_description}</p>
                <p><strong>State:</strong> {property.property_state}</p>
                {/* Assuming beds, baths, garage exist now in property table */}
                <p><strong>Beds:</strong> {property.beds || 'N/A'}</p>
                <p><strong>Baths:</strong> {property.baths || 'N/A'}</p>
                <p><strong>Garage:</strong> {property.garage || 'N/A'}</p>

                <div className="card-buttons">
                  <button className="delete-btn" onClick={() => handleDelete(property.property_id)}>
                    Delete
                  </button>
                  <button className="edit-btn" onClick={() => handleEdit(property)}>Edit</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Property Modal */}
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
                  value={selectedProperty.property_name || ''}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>Price</label>
                <input
                  name="property_price"
                  type="number"
                  value={selectedProperty.property_price || 0}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>Location</label>
                <input
                  name="property_address"
                  value={selectedProperty.property_address || ''}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>Description</label>
                <textarea
                  name="property_description"
                  value={selectedProperty.property_description || ''}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>State</label>
                <select
                  name="property_state"
                  value={selectedProperty.property_state || 'Available'}
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
                  value={selectedProperty.property_category || 'House'}
                  onChange={handleChange}
                  className="propertyFormControl"
                >
                  {['House', 'Apartment', 'Commercial', 'Land', 'Villa', 'Cabin'].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              {/* Added Beds, Baths, Garage inputs */}
              <div className="propertyFormGroup">
                <label>Beds</label>
                <input
                  name="beds"
                  type="number"
                  value={selectedProperty.beds || 0}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>Baths</label>
                <input
                  name="baths"
                  type="number"
                  value={selectedProperty.baths || 0}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
              </div>
              <div className="propertyFormGroup">
                <label>Garage</label>
                <input
                  name="garage"
                  type="number"
                  value={selectedProperty.garage || 0}
                  onChange={handleChange}
                  className="propertyFormControl"
                />
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
                  {/* Display existing images from Supabase Storage */}
                  {existingImages.map((filename, idx) => (
                    <div key={idx} className="image-preview-container">
                      <img
                        // Construct the image URL for existing images from Supabase Storage
                        src={`${supabaseStorageUrl}${selectedProperty.property_id}/${filename}`}
                        alt={`Property Image ${idx}`}
                        className="image-preview"
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x100?text=Image+Load+Error"; }}
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

                  {/* Display newly selected images (before upload) as local URLs */}
                  {newImages.map((file, idx) => (
                    <div key={`new-${idx}`} className="image-preview-container">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New Upload ${idx}`}
                        className="image-preview"
                        onLoad={() => URL.revokeObjectURL(file.preview)} // Clean up object URL after load
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

      {/* Custom Alert/Confirm Modal */}
      {showAlert && (
        <CustomAlertDialog
          message={alertMessage}
          onConfirm={handleAlertConfirm}
          onCancel={hideCustomAlert}
          showConfirm={isConfirmation}
        />
      )}
    </div>
  );
};

export default Property;
