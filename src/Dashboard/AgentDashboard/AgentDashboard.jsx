import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const [agentData, setAgentData] = useState({ name: '', id: '', error: '' });

  useEffect(() => {
    const fetchAgentData = async () => {
      const agentId = localStorage.getItem("agent_id"); 
      if (!agentId) {
        setAgentData({ name: '', id: '', error: 'No agent ID found' });
        return;
      }
  
      try {
        const response = await fetch(`http://localhost/estate/Backend/api/getAgentData.php?agent_id=${agentId}`);
        const data = await response.json();
        if (data.error) {
          setAgentData({ name: '', id: '', error: data.error });
        } else {
          setAgentData({ name: data.username, id: data.agent_id, error: '' });
        }
      } catch (error) {
        setAgentData({ name: '', id: '', error: 'Fetch failed' });
      }
    };
  
    fetchAgentData();
  }, []);
  
  

  return (
    <div>
      <div className="dashboard-container">
        <main className="dashboard-main">
          <header className="dashboard-header">
            <div className="dashboard-greeting">
              <h2>Hi, {agentData.name || 'Agent'}</h2> 
              <p>Ready to start your day with some pitch decks?</p>
            </div>
            <div className="dashboard-profile">
              <div className="dashboard-notifications">
                <FaEnvelope className="dashboard-icon" />
                <FaBell className="dashboard-icon" />
              </div>
              <div className="dashboard-profile-info">
                <div className="dashboard-profile-initials">{agentData.name ? agentData.name[0] : 'A'}</div> 
                <span>{agentData.name || 'Agent Name'}</span> 
              </div>
            </div>
          </header>

          <section className="dashboard-agent-id">
            <h4>User ID: {agentData.id || 'N/A'}</h4> 
          </section>

          <section className="dashboard-overview">
            <div className="dashboard-stat">
              <h3>83%</h3>
              <p>Open Rate</p>
            </div>
            <div className="dashboard-stat">
              <h3>77%</h3>
              <p>Complete</p>
            </div>
            <div className="dashboard-stat">
              <h3>91</h3>
              <p>Unique Views</p>
            </div>
            <div className="dashboard-stat">
              <h3>126</h3>
              <p>Total Views</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AgentDashboard;
