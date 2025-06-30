import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom'; // Import useNavigate here
import {MdAdminPanelSettings,MdDashboard,MdHomeWork,MdPeople,MdPerson,MdLogout} from 'react-icons/md';
import './DashboardLayout.css';

// handleLogout needs to be inside the component to use useNavigate
const DashboardLayout = () => {
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
          <MdAdminPanelSettings style={{ marginRight: '8px' }} />
          Admin
        </h2>

        <nav>
          <ul>
            <li>
              <Link to="/admin_dashboard">
                <MdDashboard style={{ marginRight: '6px' }} />
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin_dashboard/Property">
                <MdHomeWork style={{ marginRight: '6px' }} />
                Properties
              </Link>
            </li>
            <li>
              <Link to="/admin_dashboard/agents">
                <MdPeople style={{ marginRight: '6px' }} />
                Agents
              </Link>
            </li>
            <li>
              <Link to="/admin_dashboard/profile">
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

export default DashboardLayout;