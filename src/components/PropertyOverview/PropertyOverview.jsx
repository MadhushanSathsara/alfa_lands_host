import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Form, Nav, Carousel } from "react-bootstrap"; // Removed Alert, will use custom message
import "./PropertyOverview1.css";
import Modal from "react-bootstrap/Modal"; // Keep Bootstrap Modal for now
import { FaBed, FaBath, FaCar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShareAlt, FaTrain, FaBus, FaRoad } from "react-icons/fa";
import Loader from "../../components/Loader/Loader"; // Keep your Loader component
import { supabase } from '../../supabaseClient'; // Import Supabase client

const PropertyOverview = () => {
  const { id } = useParams(); // property_id from URL
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submissionMessage, setSubmissionMessage] = useState(null); // For contact form feedback
  const [contactData, setContactData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    message: "",
    contact_method: "message", // Default value
    agent_id: null, // Will be set when "Enquire Now" is clicked
    property_id: parseInt(id), // Ensure it's an integer
  });

  // Supabase Storage URL configuration
  const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; // <<< REPLACE THIS with your actual project ref!
  const PROPERTY_IMAGES_BUCKET = 'propertyimages'; // Your property images bucket name
  const AGENT_IMAGES_BUCKET = 'agentimages'; // Assuming you have an agent images bucket

  const getPublicImageUrl = (bucket, imageName) => {
    if (!imageName) return 'https://placehold.co/300x200?text=No+Image';
    return `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${bucket}/${imageName}`;
  };

  useEffect(() => {
    const fetchPropertyAndRelatedData = async () => {
      try {
        setLoading(true);
        setSubmissionMessage(null); // Clear any previous messages

        // 1. Fetch main property details
        const { data: propertyData, error: propertyError } = await supabase
          .from('property')
          .select('*')
          .eq('property_id', id)
          .single(); // Use single() because we expect one property

        if (propertyError) {
          throw new Error(`Error fetching property: ${propertyError.message}`);
        }
        if (!propertyData) {
          throw new Error("Property not found.");
        }

        // 2. Fetch additional property images
        const { data: additionalImagesData, error: imagesError } = await supabase
          .from('property_images')
          .select('image_name')
          .eq('property_id', id);

        if (imagesError) {
          console.error("Error fetching property images:", imagesError.message);
          // Don't throw, just log, as missing images shouldn't break the page
        }
        const additionalImages = additionalImagesData ? additionalImagesData.map(img => img.image_name) : [];


        // 3. Fetch agents associated with this property via the property_agent join table
        const { data: propertyAgentsData, error: paError } = await supabase
          .from('property_agent')
          .select('agent_id')
          .eq('property_id', id);

        if (paError) {
          console.error("Error fetching property agents link:", paError.message);
          // Don't throw, just log
        }

        let agentsForProperty = [];
        if (propertyAgentsData && propertyAgentsData.length > 0) {
          const agentIds = propertyAgentsData.map(pa => pa.agent_id);
          const { data: agentsData, error: agentsError } = await supabase
            .from('agent')
            .select('*')
            .in('agent_id', agentIds); // Fetch all agent details in one go

          if (agentsError) {
            console.error("Error fetching agent details:", agentsError.message);
          } else {
            agentsForProperty = agentsData;
          }
        }

        // Combine all fetched data into a single property object
        setProperty({
          ...propertyData,
          additional_images: additionalImages,
          agents: agentsForProperty, // Attach agents array to the property object
        });

      } catch (err) {
        console.error("Error fetching property data:", err.message);
        setSubmissionMessage(`Error: ${err.message}. Please check RLS policies and data.`);
        setProperty(null); // Clear property on error
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyAndRelatedData();
  }, [id]); // Rerun effect if 'id' changes

  // Function to handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();

    if (!contactData.user_name || !contactData.user_phone || !contactData.message) {
      setSubmissionMessage("Please fill in all required fields (Name, Phone, Message).");
      return;
    }

    try {
      // Insert into the 'agent_contacts' table
      const { data, error } = await supabase
        .from('agent_contacts')
        .insert([contactData]);

      if (error) {
        throw error;
      }

      setSubmissionMessage("Your enquiry has been submitted successfully!");
      setShowModal(false);
      // Reset form fields
      setContactData(prev => ({
        ...prev,
        user_name: "",
        user_email: "",
        user_phone: "",
        message: "",
        contact_method: "message",
        // agent_id and property_id remain as they are for potential next submission
      }));
    } catch (error) {
      console.error("Error submitting enquiry:", error.message);
      setSubmissionMessage(`Failed to submit enquiry: ${error.message}. Please check RLS policies for agent_contacts.`);
    }
  };

  if (loading) {
    return <Loader />; // Display your custom loader
  }

  if (!property) {
    return (
      <div className="error-message p-4 text-center">
        {submissionMessage || "Property data could not be loaded. Please check the property ID and database connection."}
      </div>
    );
  }

  // Determine which image to show as the main one for the carousel
  const carouselImages = [];
  if (property.property_image) {
    carouselImages.push(property.property_image); // Main image from property table
  }
  if (property.additional_images && property.additional_images.length > 0) {
    carouselImages.push(...property.additional_images); // Additional images from property_images table
  }


  return (
    <div className="property-overview-container">
      <div className="property-header">
        <div className="container">
          <div className="property-title-wrapper">
            <h1 className="property-title">{property.property_name}</h1>
            <h4 className="property-subtitle">Everything starts with a dream</h4>
          </div>
          <div className="property-meta">
            <span className="price">LKR {property.property_price ? parseFloat(property.property_price).toLocaleString() : 'N/A'}</span>
            <span className="location">
              <FaMapMarkerAlt /> {property.district} District, {property.nearby_town}
            </span>
          </div>
        </div>
      </div>

      <div className="container main-content">
        <div className="row">
          <div className="col-lg-8">
            <div className="property-gallery">
              {carouselImages.length > 0 ? (
                <Carousel interval={null}>
                  {carouselImages.map((imgName, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={getPublicImageUrl(PROPERTY_IMAGES_BUCKET, imgName)}
                        alt={`Property ${index + 1}`}
                        onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/800x600?text=Image+Load+Error"; }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <img
                  className="d-block w-100"
                  src="https://placehold.co/800x600?text=No+Images+Available"
                  alt="No images available"
                />
              )}
            </div>

            <div className="property-details-section">
              <Nav variant="tabs" activeKey={activeTab} onSelect={(key) => setActiveTab(key)}>
                <Nav.Item>
                  <Nav.Link eventKey="overview" className="lin">Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="features" className="lin">Features</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="location" className="lin">Location</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="payment" className="lin">Payment Plans</Nav.Link>
                </Nav.Item>
              </Nav>

              <div className="tab-content">
                {activeTab === "overview" && (
                  <div className="overview-content">
                    <h3>Property Description</h3>
                    {property.property_description && property.property_description.split('•').map((item, index) =>
                      item.trim() ? (
                        <li key={index}>{item.trim()}</li>
                      ) : null
                    )}
                    <br />
                    <p className="state">{property.property_state}</p>
                  </div>
                )}

                {activeTab === "features" && (
                  <div className="features-content">
                    <div className="features-grid">
                      <div className="feature-item">
                        <FaBed /> <span>{property.beds} Bedrooms</span>
                      </div>
                      <div className="feature-item">
                        <FaBath /> <span>{property.baths} Bathrooms</span>
                      </div>
                      <div className="feature-item">
                        <FaCar /> <span>{property.garage} Parking</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "location" && (
                  <div className="location-content">
                    <h3>Location Details</h3><br />
                    <div className="location-grid">
                      <div className="location-item">
                        <h4> Full Address</h4>
                        <p>{property.property_address}</p>
                      </div>
                      <hr className="hr1"></hr>

                      <div className="location-item">
                        <h5>District</h5>
                        <p>{property.district}</p>
                      </div>
                      <hr></hr>

                      <div className="location-item">
                        <h5>Nearby Town</h5>
                        <p>{property.nearby_town} ({property.distance_to_town})</p>
                      </div>
                      <hr></hr>

                      <div className="location-item">
                        <h5> Key Landmarks</h5>
                        <p>{property.landmarks}</p>
                      </div>
                      <hr></hr>

                      <div className="location-item">
                        <h4><FaRoad /> Accessibility</h4>
                        <p>{property.accessibility}</p>
                      </div>
                      <hr></hr>

                      <div className="location-item full-width">
                        <h4><FaBus /> Transport Links</h4>
                        <ul className="transport-links">
                          {property.transport_links && property.transport_links.split(',').map((link, index) => (
                            <li key={index}>
                              {link.includes('Bus') && <FaBus />}
                              {link.includes('Train') && <FaTrain />}
                              {link.trim()}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="map-placeholder">
                      <p>Map would display here showing property location in {property.district}</p>
                    </div>
                  </div>
                )}

                {activeTab === "payment" && (
                  <div className="payment-content">
                    <h3>Flexible Payment Plans</h3>
                    <ul className="payment-plans">
                      <li>10% Down Payment - 40 months installment plan</li>
                      <li>15% Down Payment - 12 months interest-free</li>
                      <li>20% Down Payment - 12 months interest-free</li>
                      <li>25% Down Payment - 18 months interest-free</li>
                    </ul>
                    <p className="note">Bank loan facilities available through our partners</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="agent-contact-card">
              <h3>Contact Agent</h3>
              {property.agents && property.agents.length > 0 ? (
                property.agents.map((agent) => (
                  <div key={agent.agent_id} className="agent-info">
                    <img
                      src={getPublicImageUrl(AGENT_IMAGES_BUCKET, agent.agent_image)}
                      alt={agent.agent_name}
                      className="agent-image"
                      onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100?text=Agent"; }}
                    />
                    <div className="agent-details">
                      <h4>{agent.agent_name}</h4>
                      <p className="position">{agent.agent_position}</p>
                      <div className="contact-methods">
                        <a href={`tel:${agent.agent_telephone}`} className="contact-link">
                          <FaPhone /> {agent.agent_telephone}
                        </a>
                        <a href={`mailto:${agent.agent_email}`} className="contact-link">
                          <FaEnvelope /> {agent.agent_email}
                        </a>
                      </div>
                      <button
                        className="enquire-btn"
                        onClick={() => {
                          setContactData(prev => ({
                            ...prev,
                            agent_id: agent.agent_id
                          }));
                          setShowModal(true);
                        }}
                      >
                        Enquire Now
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No agents available for this property</p>
              )}
            </div>

            <div className="property-summary">
              <h3>Property Summary</h3>
              <ul className="summary-list">
                <li>
                  <span>Price:</span>
                  <span>LKR {property.property_price ? parseFloat(property.property_price).toLocaleString() : 'N/A'}</span>
                </li>
                <li>
                  <span>Location:</span>
                  <span>{property.district} District</span>
                </li>
                <li>
                  <span>Nearby Town:</span>
                  <span>{property.nearby_town} ({property.distance_to_town})</span>
                </li>
                <li>
                  <span>Bedrooms:</span>
                  <span>{property.beds}</span>
                </li>
                <li>
                  <span>Bathrooms:</span>
                  <span>{property.baths}</span>
                </li>
                <li>
                  <span>Parking:</span>
                  <span>{property.garage}</span>
                </li>
              </ul>
              <button className="share-btn">
                <FaShareAlt /> Share This Property
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Modal for Submission Message instead of Alert */}
      {submissionMessage && (
        <Modal show={true} onHide={() => setSubmissionMessage(null)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Message</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{submissionMessage}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSubmissionMessage(null)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}

   
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enquire About This Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleContactSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Name</Form.Label>
              <Form.Control
                type="text"
                name="user_name"
                value={contactData.user_name}
                onChange={(e) => setContactData({...contactData, user_name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="user_email"
                value={contactData.user_email}
                onChange={(e) => setContactData({...contactData, user_email: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                name="user_phone"
                value={contactData.user_phone}
                onChange={(e) => setContactData({...contactData, user_phone: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="message"
                value={contactData.message}
                onChange={(e) => setContactData({...contactData, message: e.target.value})}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="submit-btn">
              Submit Enquiry
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PropertyOverview;
