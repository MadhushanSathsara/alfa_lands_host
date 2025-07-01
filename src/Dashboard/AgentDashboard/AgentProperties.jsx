import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../supabaseClient'; // Make sure this path is correct for your project
import './AgentProperties.css'; // Assuming this CSS file contains your styling

// Supabase Storage Bucket details
// IMPORTANT: Replace 'hddobdmhmzmmdqtmktse' with YOUR actual Supabase Project Reference
const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; // <<< VERIFY THIS!
const SUPABASE_BUCKET_NAME = 'propertyimages'; // Your Supabase Storage bucket name
const supabaseStorageUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`;

// Custom Modal component for Confirm/Alert messages (reused from Agent component)
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

const AgentProperties = ({ agent_id: propAgentId }) => {
    // Get agent_id from props or localStorage (prefer props if provided)
    const agent_id = propAgentId || localStorage.getItem("agent_id");

    const [properties, setProperties] = useState([]);
    const [filteredProperties, setFilteredProperties] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for custom alerts/confirms
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [onConfirmAction, setOnConfirmAction] = useState(null);
    const [isConfirmation, setIsConfirmation] = useState(false);

    // --- Custom Alert/Confirm Functions ---
    const showCustomAlert = (message, isConfirm = false, onConfirm = null) => {
        setAlertMessage(message);
        setIsConfirmation(isConfirm);
        setOnConfirmAction(() => onConfirm); // Store the callback
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


    const fetchProperties = useCallback(async () => {
        if (!agent_id) {
            setError('Agent ID not found. Please log in.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase
                .from('property')
                .select('*')
                .eq('agent_id', agent_id) // Filter properties by the assigned agent_id
                .order('property_id', { ascending: true }); // Order for consistent display

            if (error) throw error;

            setProperties(data || []);
            setFilteredProperties(data || []);
        } catch (err) {
            console.error("Error fetching properties from Supabase:", err.message);
            setError(`Failed to load properties: ${err.message}. Please check your network and RLS policies.`);
            showCustomAlert(`Failed to load properties: ${err.message}. Please check your network and RLS policies.`, false);
        } finally {
            setLoading(false);
        }
    }, [agent_id]); // Dependency on agent_id

    useEffect(() => {
        fetchProperties();
    }, [fetchProperties]); // Dependency on fetchProperties memoized function


    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setFilteredProperties(
            category === 'All'
                ? properties
                : properties.filter(prop => prop.property_category === category)
        );
    };

    const handleDelete = (propertyId, propertyImageFileName) => {
        showCustomAlert("Are you sure you want to delete this property?", true, async () => {
            try {
                // 1. Delete property image from Supabase Storage (if exists)
                if (propertyImageFileName) {
                    const { error: removeError } = await supabase.storage
                        .from(SUPABASE_BUCKET_NAME)
                        .remove([propertyImageFileName]); // Pass the filename

                    if (removeError) {
                        console.error("Error deleting property image from storage:", removeError.message);
                        // Do not throw, attempt to delete property record anyway
                        showCustomAlert(`Warning: Image deletion failed: ${removeError.message}. Proceeding to delete property record.`, false);
                    } else {
                        console.log(`Successfully deleted image ${propertyImageFileName}`);
                    }
                }

                // 2. Delete property record from the database
                const { error: dbError } = await supabase
                    .from('property')
                    .delete()
                    .eq('property_id', propertyId);

                if (dbError) throw dbError;

                showCustomAlert("Property deleted successfully!", false);
                fetchProperties(); // Re-fetch to update UI
            } catch (err) {
                console.error("Error deleting property:", err.message);
                showCustomAlert(`Error deleting property: ${err.message}`, false);
            }
        });
    };

    const handleEdit = (property) => {
        setSelectedProperty(property);
        setShowModal(true);
    };

    const handleCloseModal = () => setShowModal(false);

    const handleSaveChanges = async () => {
        if (!selectedProperty) return;

        try {
            // Note: This implementation only updates text fields.
            // If you need to update images, you'll need file input,
            // Supabase Storage upload, and deletion of old images.
            const { error } = await supabase
                .from('property')
                .update({
                    property_name: selectedProperty.property_name,
                    property_price: parseFloat(selectedProperty.property_price), // Ensure it's a number
                    property_address: selectedProperty.property_address,
                    property_description: selectedProperty.property_description,
                    property_state: selectedProperty.property_state,
                    property_category: selectedProperty.property_category,
                    // Add other fields you want to update
                    beds: selectedProperty.beds,
                    baths: selectedProperty.baths,
                    garage: selectedProperty.garage,
                })
                .eq('property_id', selectedProperty.property_id);

            if (error) throw error;

            showCustomAlert('Property updated successfully!', false);
            handleCloseModal();
            fetchProperties(); // Re-fetch to show updated data
        } catch (err) {
            console.error("Error updating property:", err.message);
            showCustomAlert(`Failed to update property: ${err.message}`, false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedProperty(prev => ({
            ...prev,
            [name]: name === 'property_price' ? parseFloat(value) : value // Convert price to number
        }));
    };

    if (loading) {
        return <div className="property-container"><p>Loading properties...</p></div>;
    }

    if (error) {
        return <div className="property-container"><p className="error-message">{error}</p></div>;
    }

    return (
        <div className="property-container">
            <h1>Your Properties</h1>

            {properties.length === 0 && !loading && !error ? (
                <p style={{ color: 'gray', fontStyle: 'italic' }}>
                    You haven’t been assigned any property.
                </p>
            ) : (
                <>
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
                                    // Construct the public URL for the property's image
                                    src={property.property_image ? `${supabaseStorageUrl}${property.property_image}` : `https://placehold.co/300x200?text=No+Image`}
                                    alt={property.property_name || 'Property Image'}
                                    className="property-image"
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/300x200?text=Image+Error"; }}
                                />
                                <div className="property-body">
                                    <h3 className="property-title">{property.property_name}</h3>
                                    <p><strong>Price:</strong> LKR {property.property_price ? parseFloat(property.property_price).toLocaleString() : 'N/A'}</p>
                                    <p><strong>Location:</strong> {property.property_address}</p>
                                    <p><strong>Category:</strong> {property.property_category}</p>
                                    <p><strong>Description:</strong> {property.property_description}</p>
                                    <p><strong>State:</strong> {property.property_state}</p>
                                    {/* Display beds, baths, garage if available */}
                                    {(property.beds || property.baths || property.garage) && (
                                        <p>
                                            {property.beds ? `${property.beds} Beds | ` : ''}
                                            {property.baths ? `${property.baths} Baths | ` : ''}
                                            {property.garage ? `${property.garage} Garage` : ''}
                                        </p>
                                    )}
                                    <div className="card-buttons">
                                        <button className="delete-btn" onClick={() => handleDelete(property.property_id, property.property_image)}>Delete</button>
                                        <button className="edit-btn" onClick={() => handleEdit(property)}>Edit</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {showModal && selectedProperty && (
                <div className="propertyModalOverlay" onClick={handleCloseModal}>
                    <div className="propertyModalContent" onClick={(e) => e.stopPropagation()}>
                        <div className="propertyModalHeader">
                            <h5>Edit Property</h5>
                            <button onClick={handleCloseModal} className="propertyModalClose">&times;</button>
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
                                    value={selectedProperty.property_price || ''}
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
                                    value={selectedProperty.property_state || ''}
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
                                    value={selectedProperty.property_category || ''}
                                    onChange={handleChange}
                                    className="propertyFormControl"
                                >
                                    {['House', 'Apartment', 'Commercial', 'Land', 'Villa', 'Cabin'].map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                             {/* Add inputs for beds, baths, garage if you want to edit them */}
                            <div className="propertyFormGroup">
                                <label>Beds</label>
                                <input
                                    name="beds"
                                    type="number"
                                    value={selectedProperty.beds || ''}
                                    onChange={handleChange}
                                    className="propertyFormControl"
                                />
                            </div>
                            <div className="propertyFormGroup">
                                <label>Baths</label>
                                <input
                                    name="baths"
                                    type="number"
                                    value={selectedProperty.baths || ''}
                                    onChange={handleChange}
                                    className="propertyFormControl"
                                />
                            </div>
                            <div className="propertyFormGroup">
                                <label>Garage</label>
                                <input
                                    name="garage"
                                    type="number"
                                    value={selectedProperty.garage || ''}
                                    onChange={handleChange}
                                    className="propertyFormControl"
                                />
                            </div>
                            <div className="propertyModalFooter">
                                <button onClick={handleCloseModal} className="propertyBtnSecondary">Close</button>
                                <button onClick={handleSaveChanges} className="propertyBtnPrimary">Save Changes</button>
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

export default AgentProperties;