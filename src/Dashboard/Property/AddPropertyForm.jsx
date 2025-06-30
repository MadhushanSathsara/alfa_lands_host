import React, { useState } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure this path is correct
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for images and property
import './AddPropertyForm.css';

// Custom Modal component for Alert/Confirm messages
const CustomAlertDialog = ({ message, onConfirm, onCancel, showConfirm = false }) => {
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

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    property_name: '',
    main_image_file: null, // This will hold the File object for the main image
    property_price: '',
    property_address: '',
    property_postal_code: '', // Assuming this column exists in your DB
    area_sqft: '', // Assuming 'size' maps to 'area_sqft' in your DB
    beds: '', // Renamed from 'bedrooms'
    baths: '', // Renamed from 'bathrooms'
    garage: '', // Added based on your Property.jsx
    property_description: '',
    property_state: '', // Renamed from 'states'
    property_category: ''
  });

  const [loading, setLoading] = useState(false);
  // State for custom alerts
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Supabase Storage Bucket details
  const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; // Your Supabase Project Reference
  const SUPABASE_BUCKET_NAME = 'propertyimages'; // Your Supabase Storage bucket name
  // Note: supabaseStorageUrl is not strictly needed in this component as we directly upload,
  // but keeping it for consistency if needed for other image interactions later.
  const supabaseStorageUrl = `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${SUPABASE_BUCKET_NAME}/`;

  // --- Custom Alert Functions (replacing window.alert) ---
  const showCustomAlert = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideCustomAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };
  // --- END Custom Alert Functions ---

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      main_image_file: e.target.files[0], // Store the File object
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      let mainImageFilename = null; // To store the filename of the uploaded main image
      let newPropertyId = null; // To store the property_id from the database

      // 1. Insert property data into Supabase `property` table
      // Ensure column names match your Supabase table exactly
      const propertyDataToInsert = {
        property_name: formData.property_name,
        property_price: parseFloat(formData.property_price), // Ensure price is number
        property_address: formData.property_address,
        property_postal_code: formData.property_postal_code,
        area_sqft: parseFloat(formData.area_sqft), // Ensure size is number
        beds: parseInt(formData.beds), // Ensure beds is integer
        baths: parseInt(formData.baths), // Ensure baths is integer
        garage: parseInt(formData.garage), // Ensure garage is integer
        property_description: formData.property_description,
        property_state: formData.property_state,
        property_category: formData.property_category,
        // property_image will be updated after image upload
      };

      // Use .insert() and .select() to get the auto-generated property_id
      const { data: insertedProperty, error: insertError } = await supabase
        .from('property')
        .insert([propertyDataToInsert])
        .select('property_id'); // Select only property_id for efficiency

      if (insertError) {
        throw new Error(`Supabase insert error: ${insertError.message}`);
      }
      if (!insertedProperty || insertedProperty.length === 0) {
        throw new Error('Property insert failed: No data returned.');
      }

      newPropertyId = insertedProperty[0].property_id;
      console.log('Property inserted successfully with ID:', newPropertyId);

      // 2. Upload the main image to Supabase Storage
      if (formData.main_image_file && newPropertyId) {
        const file = formData.main_image_file;
        const fileExtension = file.name.split('.').pop();
        // Use a UUID for the image filename to ensure uniqueness
        mainImageFilename = `${uuidv4()}.${fileExtension}`;
        // Store images in a subfolder named after the property_id
        const filePath = `${newPropertyId}/${mainImageFilename}`;

        const { error: uploadError } = await supabase.storage
          .from(SUPABASE_BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: '3600', // Cache for 1 hour
            upsert: false, // Do not overwrite if file exists (unlikely with UUID)
          });

        if (uploadError) {
          // If image upload fails, consider deleting the property record as well
          console.error(`Error uploading image for property ${newPropertyId}: ${uploadError.message}`);
          await supabase.from('property').delete().eq('property_id', newPropertyId);
          throw new Error(`Image upload failed: ${uploadError.message}. Property record rolled back.`);
        }
        console.log('Main image uploaded successfully:', mainImageFilename);

        // 3. Update the property record with the main image filename
        const { error: updateError } = await supabase
          .from('property')
          .update({ property_image: mainImageFilename })
          .eq('property_id', newPropertyId); // Update the newly created property

        if (updateError) {
          throw new Error(`Supabase update error (setting image): ${updateError.message}`);
        }
        console.log('Property record updated with main image filename.');
      } else {
        console.warn('No main image selected for upload, or property ID not available yet.');
      }

      // Reset form on success
      setFormData({
        property_name: '',
        main_image_file: null,
        property_price: '',
        property_address: '',
        property_postal_code: '',
        area_sqft: '',
        beds: '',
        baths: '',
        garage: '',
        property_description: '',
        property_state: '',
        property_category: ''
      });

      showCustomAlert('Property added successfully!');

    } catch (error) {
      console.error('Error adding property:', error.message);
      showCustomAlert(`Failed to add property: ${error.message}`);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="property-form-container">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit} className="property-form">
        <div className="property-form-group">
          <label htmlFor="property_name">Property Name:</label>
          <input type="text" id="property_name" name="property_name" value={formData.property_name} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label htmlFor="property_price">Price (USD):</label>
          <input type="number" id="property_price" name="property_price" value={formData.property_price} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label htmlFor="property_address">Location:</label>
          <input type="text" id="property_address" name="property_address" value={formData.property_address} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label htmlFor="property_postal_code">Postal Code:</label>
          <input type="text" id="property_postal_code" name="property_postal_code" value={formData.property_postal_code} onChange={handleChange} />
          {/* Note: This field is not required in the original code, removed 'required' here */}
        </div>

        <div className="property-form-group">
          <label htmlFor="area_sqft">Size (sq ft):</label>
          <input type="number" id="area_sqft" name="area_sqft" value={formData.area_sqft} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label htmlFor="beds">Bedrooms:</label>
          <input type="number" id="beds" name="beds" value={formData.beds} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label htmlFor="baths">Bathrooms:</label>
          <input type="number" id="baths" name="baths" value={formData.baths} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label htmlFor="garage">Garage:</label>
          <input type="number" id="garage" name="garage" value={formData.garage} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label htmlFor="property_description">Description:</label>
          <textarea id="property_description" name="property_description" value={formData.property_description} onChange={handleChange} required></textarea>
        </div>

        <div className="property-form-group">
          <label htmlFor="property_category">Category:</label>
          <select id="property_category" name="property_category" value={formData.property_category} onChange={handleChange} required>
            <option value="">Select Category</option>
            <option value="Apartment">Apartment</option>
            <option value="House">House</option>
            <option value="Commercial">Commercial</option>
            <option value="Land">Land</option>
            <option value="Villa">Villa</option>
            <option value="Cabin">Cabin</option>
          </select>
        </div>

        <div className="property-form-group">
          <label htmlFor="property_state">Status:</label>
          <select id="property_state" name="property_state" value={formData.property_state} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="Available">Available</option> {/* Changed from BestDeal to Available for common state */}
            <option value="Sold">Sold</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="property-form-group">
          <label htmlFor="main_image_file">Main Image:</label>
          <input type="file" id="main_image_file" name="main_image_file" onChange={handleFileChange} accept="image/*" />
          {formData.main_image_file && (
            <div className="image-preview-container">
              <img
                src={URL.createObjectURL(formData.main_image_file)}
                alt="Selected Preview"
                className="image-preview"
                // Revoke object URL after image loads to free up memory
                onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x100?text=Preview+Error"; }}
              />
            </div>
          )}
        </div>

        <div className="property-form-buttons">
          <button type="button" className="property-form-button property-form-button-discard" onClick={() => setFormData({ // Reset form on discard
            property_name: '', main_image_file: null, property_price: '', property_address: '',
            property_postal_code: '', area_sqft: '', beds: '', baths: '', garage: '',
            property_description: '', property_state: '', property_category: ''
          })}>Discard Changes</button>
          <button type="submit" className="property-form-button property-form-button-save" disabled={loading}>
            {loading ? 'Adding...' : 'Add Property'}
          </button>
        </div>
      </form>

      {/* Custom Alert Modal */}
      {showAlert && (
        <CustomAlertDialog
          message={alertMessage}
          onCancel={hideCustomAlert} // Just 'Close' button for alerts
        />
      )}
    </div>
  );
};

export default AddPropertyForm;
