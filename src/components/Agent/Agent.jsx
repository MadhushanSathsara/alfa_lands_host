import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './Agent.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    { breakpoint: 768, settings: { slidesToShow: 1 } },
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
  ],
};

const Agent = () => {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    fetch('http://localhost/estate/backend/api/get_agents.php')
      .then(res => res.json())
      .then(data => {
        const normalizedAgents = data.map(agent => {
          // Handle different formats of agent_social
          let socialData = {};
          
          try {
            // Try to parse as JSON if it's a string
            if (typeof agent.agent_social === 'string') {
              socialData = JSON.parse(agent.agent_social);
            } else if (agent.agent_social) {
              socialData = agent.agent_social;
            }
            
            // Handle case where agent_social is just a Facebook URL
            if (!socialData.facebook && agent.agent_social_link) {
              socialData.facebook = agent.agent_social_link;
            }
            
            // Ensure all social fields exist
            return {
              ...agent,
              agent_social: {
                linkedin: socialData.linkedin || '',
                facebook: socialData.facebook || '',
                twitter: socialData.twitter || '',
                instagram: socialData.instagram || ''
              }
            };
          } catch (error) {
            console.error('Error parsing social data:', error);
            return {
              ...agent,
              agent_social: {
                linkedin: '',
                facebook: agent.agent_social_link || '',
                twitter: '',
                instagram: ''
              }
            };
          }
        });
        
        setAgents(normalizedAgents);
      })
      .catch(err => console.error('Error fetching agents:', err));
  }, []);

  return (
    <div className="agent-carousel">
      <h2>Meet Our <span className="highli">Agents</span></h2>
      <Slider {...sliderSettings}>
        {agents.map((agent, index) => (
          <div key={index} className="agent-card">
            <img
              src={`http://localhost/estate/backend/api/images/agent/${agent.agent_image}`}
              alt={agent.agent_name}
              className="agent-image"
            />
            <div className="agent-content">
              <h3>{agent.agent_name}</h3>
              <p className="position">{`${agent.agent_position} - ${agent.agent_address || 'Location not specified'}`}</p>
              <p className="about">{`Email: ${agent.agent_email}`}</p>
              {agent.agent_telephone && <p className="about">{`Phone: ${agent.agent_telephone}`}</p>}
              
              <div className="social-media">
                {agent.agent_social.linkedin && (
                  <a href={agent.agent_social.linkedin} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faLinkedin} />
                  </a>
                )}
                {agent.agent_social.facebook && (
                  <a href={agent.agent_social.facebook} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faFacebook} />
                  </a>
                )}
                {agent.agent_social.twitter && (
                  <a href={agent.agent_social.twitter} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faTwitter} />
                  </a>
                )}
                {agent.agent_social.instagram && (
                  <a href={agent.agent_social.instagram} target="_blank" rel="noopener noreferrer">
                    <FontAwesomeIcon icon={faInstagram} />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Agent;