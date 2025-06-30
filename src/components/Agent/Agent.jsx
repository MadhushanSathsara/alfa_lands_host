import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import './Agent.css'; // Assuming this CSS file contains your styling
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { supabase } from '../../supabaseClient'; // Import Supabase client

// React-slick CSS imports - make sure these are installed
// npm install react-slick slick-carousel
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

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
    { breakpoint: 1200, settings: { slidesToShow: 3 } }, // Added an extra breakpoint for better control
  ],
};

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- IMPORTANT: Update this line with your actual Supabase Project Reference ---
  // You can find your Project Reference (e.g., 'abcdefg12345') in your Supabase project settings
  const SUPABASE_PROJECT_REF = 'hddobdmhmzmmdqtmktse'; // <<< REPLACE THIS with your actual project ref!
  const AGENT_IMAGES_BUCKET = 'agentimages'; // Your bucket name for agent images

  const getPublicImageUrl = (bucket, imageName) => {
    if (!imageName) return 'https://placehold.co/100x100?text=Agent';
    return `https://${SUPABASE_PROJECT_REF}.supabase.co/storage/v1/object/public/${bucket}/${imageName}`;
  };

  useEffect(() => {
    async function fetchAgents() {
      try {
        setLoading(true);
        setError(null);

        // Fetch agents from your Supabase 'agent' table
        const { data, error } = await supabase
          .from('agent')
          .select('*')
          .order('agent_id', { ascending: true }); 

        if (error) {
          throw error;
        }

      
        const normalizedAgents = data.map(agent => {
          let socialData = agent.agent_social;

  
          if (typeof socialData === 'string') {
            try {
              socialData = JSON.parse(socialData);
            } catch (parseError) {
              console.error('Error parsing agent_social JSON for agent:', agent.agent_name, parseError);
              socialData = {}; 
            }
          } else if (!socialData) {
            socialData = {}; 
          }

     
          if (!socialData.facebook && agent.agent_social_link) {
            socialData.facebook = agent.agent_social_link;
          }

          return {
            ...agent,
            agent_social: {
              linkedin: socialData.linkedin || '',
              facebook: socialData.facebook || '',
              twitter: socialData.twitter || '',
              instagram: socialData.instagram || ''
            }
          };
        });

        setAgents(normalizedAgents);
      } catch (err) {
        console.error('Error fetching agents from Supabase:', err.message);
        setError('Failed to load agents. Please check your network and RLS policies.');
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading agents...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="agent-carousel">
      <h2>Meet Our <span className="highli">Agents</span></h2>
      <div className="reviews-wrapper">
        {agents.length === 0 ? (
          <p className="text-center">No agents available yet. Ensure RLS policies are set up correctly.</p>
        ) : (
          <Slider {...sliderSettings}>
            {agents.map((agent) => (
              <div key={agent.agent_id} className="agent-card"> 
                <img
                  src={getPublicImageUrl(AGENT_IMAGES_BUCKET, agent.agent_image)}
                  alt={agent.agent_name}
                  className="agent-image"
                  onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/100x100?text=Agent"; }}
                />
                <div className="agent-content">
                  <h3>{agent.agent_name}</h3>
                  <p className="position">{`${agent.agent_position} - ${agent.agent_address || 'Location not specified'}`}</p>
                  <p className="about">{`Email: ${agent.agent_email}`}</p>
                  {agent.agent_telephone && <p className="about">{`Phone: ${agent.agent_telephone}`}</p>}

                  <div className="social-media">
                  
                    {agent.agent_social?.linkedin && (
                      <a href={agent.agent_social.linkedin} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faLinkedin} />
                      </a>
                    )}
                    {agent.agent_social?.facebook && (
                      <a href={agent.agent_social.facebook} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faFacebook} />
                      </a>
                    )}
                    {agent.agent_social?.twitter && (
                      <a href={agent.agent_social.twitter} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faTwitter} />
                      </a>
                    )}
                    {agent.agent_social?.instagram && (
                      <a href={agent.agent_social.instagram} target="_blank" rel="noopener noreferrer">
                        <FontAwesomeIcon icon={faInstagram} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default Agent;
