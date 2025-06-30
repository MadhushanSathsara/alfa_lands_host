import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate here
import { MdDashboard, MdHomeWork, MdPeople, MdPerson, MdLogout, MdSupervisedUserCircle } from 'react-icons/md';

import './DashboardLayout.css'; // Ensure this path is correct

// handleLogout needs to be inside the component to use useNavigate
const AgentDashboardLayout = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = () => {
    localStorage.removeItem('user_role');
    localStorage.removeItem('agent_id');
    localStorage.removeItem('loggedInUsername'); // Good practice to clear this too
    navigate('/login'); // Now navigate is accessible
  };

  return (
    <div className="layout-container">
      <aside className="side_bar">
        <h2>
          <MdSupervisedUserCircle style={{ marginRight: '8px' }} />
          Agent
        </h2>

        <nav>
          <ul>
            <li>
              <Link to="/agent_dashboard">
                <MdDashboard style={{ marginRight: '6px' }} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/agent_dashboard/agentproperties">
                <MdHomeWork style={{ marginRight: '6px' }} />
                Manage Properties
              </Link>
            </li>
            <li>
              <Link to="/agent_dashboard/messages">
                <MdPeople style={{ marginRight: '6px' }} />
                Messages
              </Link>
            </li>
            <li>
              <Link to="/agent_dashboard/AgentProfile">
                <MdPerson style={{ marginRight: '6px' }} />
                Profile
              </Link>
            </li>
            <br />
            <li>
              {/* Call handleLogout when the link is clicked */}
              <Link onClick={handleLogout}>
                <MdLogout style={{ marginRight: '6px' }} />
                Logout
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
};

export default AgentDashboardLayout;