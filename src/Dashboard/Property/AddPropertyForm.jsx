import React, { useState } from 'react';
import axios from 'axios';
import './AddPropertyForm.css';

const AddPropertyForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    image: null,
    price: '',
    location: '',
    postal_code: '',
    size: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    states: '',
    category: ''
  });

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
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataWithImage = new FormData();
    for (const key in formData) {
        formDataWithImage.append(key, formData[key]);
    }

    try {
      const response = await axios.post('http://localhost/estate/Backend/api/addproperty.php', formDataWithImage, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(response.data.message || 'Property added successfully');
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property. Please try again.');
    }
  };

  return (
    <div className="property-form-container">
      <h2>Add New Property</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="property-form">
        <div className="property-form-group">
          <label>Property Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div className="property-form-group">
          <label>Price (USD):</label>
          <input type="number" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label>Postal Code:</label>
          <input type="text" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label>Size (sq ft):</label>
          <input type="number" name="size" value={formData.size} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label>Bedrooms:</label>
          <input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label>Bathrooms:</label>
          <input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required />
        </div>

        <div className="property-form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
        </div>

        <div className="property-form-group">
          <label>Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} required>
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
          <label>Status:</label>
          <select name="states" value={formData.states} onChange={handleChange} required>
            <option value="">Select Status</option>
            <option value="BestDeal">Best Deal</option>
            <option value="NewestDeal">Newest Deal</option>
            <option value="SoldOut">Sold Out</option>
          </select>
        </div>

        <div className="property-form-group">
          <label>Image:</label>
          <input type="file" name="image" onChange={handleFileChange} />
        </div>

        <div className="property-form-buttons">
          <button type="button" className="property-form-button property-form-button-discard">Discard Changes</button>
          <button type="submit" className="property-form-button property-form-button-save">Add Property</button>
        </div>
      </form>
    </div>
  );
};

export default AddPropertyForm;
