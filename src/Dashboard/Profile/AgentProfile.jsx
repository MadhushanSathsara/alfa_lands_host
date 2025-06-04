import React, { useState, useEffect } from 'react';
import { FiEdit, FiLock } from 'react-icons/fi';
import axios from 'axios';
import './AgentProfile.css';

// Personal Info Section
const PersonalInfoForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <div className="personal-info">
      <h2>Edit Profile</h2>
      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="agent_name"
            value={formData.agent_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="agent_email"
            value={formData.agent_email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Telephone</label>
          <input
            type="text"
            name="agent_telephone"
            value={formData.agent_telephone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="agent_address"
            value={formData.agent_address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Position</label>
          <input
            type="text"
            name="agent_position"
            value={formData.agent_position}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="agent_username"
            value={formData.agent_username}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Team</label>
          <select
            name="agent_team"
            value={formData.agent_team}
            onChange={handleChange}
          >
            <option>Agent</option>
            <option>Inspector</option>
            <option>Marketing Team</option>
            <option>Executive Team</option>
            <option>Supervise Team</option>
          </select>
        </div>
        <div className="form-buttons">
          <button type="submit" className="save-button">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

// Login & Password Section
const UpdateLoginForm = ({ handleSubmit }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || newPassword !== confirmPassword) {
      setMessage('Please fill all fields correctly.');
      return;
    }

    try {
      const response = await axios.post('http://localhost/update-login', {
        currentPassword,
        newPassword,
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error updating login details.');
    }
  };

  return (
    <div className="update-login-container">
      <h2>Update Login Details</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleLoginSubmit}>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="text"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="text"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="text"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          Update Details
        </button>
      </form>
    </div>
  );
};

// Main AgentProfile Component
const AgentProfile = () => {
  const [formData, setFormData] = useState({
    agent_name: '',
    agent_address: '',
    agent_position: '',
    agent_team: '',
    agent_email: '',
    agent_username: '',
    agent_telephone: '',
    agent_image: ''
  });

  const [activeTab, setActiveTab] = useState('personal'); // default is 'personal'

  const agentId = localStorage.getItem('agent_id');

  useEffect(() => {
    fetch(`http://localhost/estate/backend/api/agent.profile.php?agent_id=${agentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormData(data.agent);
        } else {
          console.error('Failed to load profile:', data.message);
        }
      })
      .catch(err => console.error('Error fetching profile:', err));
  }, [agentId]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost/estate/backend/api/agent.profile.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        agent_id: agentId,
        ...formData
      }).toString()
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
      })
      .catch((err) => console.error('Update error:', err));
  };

  return (
    <div className="profile-container">
      <aside className="sidebar1">
        <img
          src={formData.agent_image || 'http://localhost/estate/images/default.jpg'}
          alt="Agent"
          className="profile-image"
        />
        <h2>{formData.agent_name}</h2>
        <p className="job-title">{formData.agent_position}</p>
        <nav className="menu">
          <button
            className={`menu-item ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            <FiEdit /> Personal Info
          </button>
          <button
            className={`menu-item ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            <FiLock /> Login & Password
          </button>
        </nav>
      </aside>

      <div className="main-content">
        {activeTab === 'personal' ? (
          <PersonalInfoForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        ) : (
          <UpdateLoginForm handleSubmit={handleSubmit} />
        )}
      </div>
    </div>
  );
};

export default AgentProfile;
