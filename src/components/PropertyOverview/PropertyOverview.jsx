import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Button, Form, Nav, Alert, Carousel } from "react-bootstrap";
import "./PropertyOverview1.css";
import Modal from "react-bootstrap/Modal";
import { FaBed, FaBath, FaCar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaShareAlt, FaTrain, FaBus, FaRoad } from "react-icons/fa";
import Loader from "../../components/Loader/Loader";




const PropertyOverview = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState({
    user_name: "",
    user_email: "",
    user_phone: "",
    message: "",
    contact_method: "message",
    agent_id: null,
    property_id: id,
  });

    useEffect(() => {
   
    const timer = setTimeout(() => setLoading(false), 1000); // 1s delay
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const response = await fetch(`http://localhost/estate/Backend/api/property.php?property_id=${id}`);
        const data = await response.json();
        if (data.message) {
          alert(data.message);
        } else {
          setProperty(data);
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
        alert("Error fetching property data.");
      }
    };
    fetchPropertyData();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!property) {
    return <div className="error-message">Property data could not be loaded.</div>;
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
            <span className="price">LKR {property.property_price.toLocaleString()}</span>
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
              <Carousel interval={null}>
                <Carousel.Item>
                  <img
                    className="d-block w-100"
                    src={`http://localhost/estate/Backend/api/images/property/${property.property_image}`}
                    alt="Main property"
                  />
                </Carousel.Item>
                {property.additional_images?.map((img, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={`http://localhost/estate/Backend/api/images/property/${img}`}
                      alt={`Property ${index + 1}`}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
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
                    <p>{property.property_description}</p>
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
                    <h3>Location Details</h3><br></br>
                    <div className="location-grid">
                      <div className="location-item">
                        <h4> Full Address</h4>
                        <p>{property.property_address}</p>
                      </div>
                      
                      <div className="location-item">
                        <h5>District</h5>
                        <p>{property.district}</p>
                      </div>
                      
                      <div className="location-item">
                        <h5>Nearby Town</h5>
                        <p>{property.nearby_town} ({property.distance_to_town})</p>
                      </div>
                      
                      <div className="location-item">
                        <h5> Key Landmarks</h5>
                        <p>{property.landmarks}</p>
                      </div>
                      
                      <div className="location-item">
                        <h4><FaRoad /> Accessibility</h4>
                        <p>{property.accessibility}</p>
                      </div>
                      
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
              {property.agents?.length > 0 ? (
                property.agents.map((agent) => (
                  <div key={agent.agent_id} className="agent-info">
                    <img
                      src={`http://localhost/estate/Backend/api/Images/agent/${agent.agent_image}`}
                      alt={agent.agent_name}
                      className="agent-image"
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
                  <span>LKR {property.property_price.toLocaleString()}</span>
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

    
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enquire About This Property</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={async (e) => {
      e.preventDefault();
      
 
      if (!contactData.user_name || !contactData.user_phone || !contactData.message) {
        alert("Please fill in all required fields");
        return;
      }

      try {
        const response = await fetch("http://localhost/estate/Backend/api/contact.agent.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(contactData),
        });

        const result = await response.json();

        if (result.status) {
          alert("Your enquiry has been submitted successfully!");
          setShowModal(false);
       
          setContactData({
            user_name: "",
            user_email: "",
            user_phone: "",
            message: "",
            contact_method: "message",
            agent_id: contactData.agent_id, 
            property_id: id,
          });
        } else {
          alert(result.message || "Failed to submit enquiry. Please try again.");
        }
      } catch (error) {
        console.error("Error submitting enquiry:", error);
        alert("An error occurred. Please try again later.");
      }
    }}>
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