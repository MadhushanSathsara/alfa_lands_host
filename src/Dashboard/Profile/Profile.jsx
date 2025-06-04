import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { FiEdit, FiLogOut, FiLock } from 'react-icons/fi';
import './Profile.css';

const Profile = () => {
  const [formData, setFormData] = useState({
    agent_name: '',
    agent_address: '',
    agent_position: '',
    agent_email: '',
    agent_username: '',
    agent_password: '',
    agent_telephone: '',
    agent_team: '',
    agent_image: ''
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const agentId = localStorage.getItem('agent_id');
    if (!agentId) {
      alert("Agent ID missing. Please log in.");
      return;
    }

    fetch(`http://localhost/estate/backend/api/profile.php?agent_id=${agentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFormData(data.agent);
        } else {
          alert(data.message);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Fetch error:', err);
        setLoading(false);
        alert('Error loading profile.');
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const agentId = localStorage.getItem('agent_id');

    fetch('http://localhost/estate/backend/api/profile.php', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId, ...formData })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setLoading(false);
      })
      .catch(err => {
        console.error('Update error:', err);
        setLoading(false);
        alert('Error updating profile.');
      });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      <aside className="sidebar1">
        <img
          src={formData.agent_image || 'http://localhost/estate/images/agent/admin.jpg'}
          alt="Agent"
          className="profile-image"
        />
        <h2>{formData.agent_name}</h2>
        <p className="job-title">{formData.agent_position}</p>
        <nav className="menu">
          <button className={`menu-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            <FiEdit /> Personal Information
          </button>
          <button className={`menu-item ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>
            <FiLock /> Login & Password
          </button>
        </nav>
      </aside>

      <div className="personal-info">
        {activeTab === 'profile' && (
          <>
            <h2>Edit Profile</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group"><label>Full Name</label><input type="text" name="agent_name" value={formData.agent_name} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Email</label><input type="email" name="agent_email" value={formData.agent_email} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Telephone</label><input type="text" name="agent_telephone" value={formData.agent_telephone} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Address</label><input type="text" name="agent_address" value={formData.agent_address} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Position</label><input type="text" name="agent_position" value={formData.agent_position} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Team</label>
                <select name="agent_team" value={formData.agent_team} onChange={handleInputChange}>
                  <option>Agent</option>
                  <option>Inspector</option>
                  <option>Marketing Team</option>
                  <option>Executive Team</option>
                  <option>Supervise Team</option>
                </select>
              </div>
              <div className="form-buttons">
                <button type="submit" className="save-button">Save Changes</button>
              </div>
            </form>
          </>
        )}

        {activeTab === 'login' && (
          <>
            <h2>Login & Password</h2>
            <form className="profile-form" onSubmit={handleSubmit}>
              <div className="form-group"><label>Username</label><input type="text" name="agent_username" value={formData.agent_username} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Password</label><input type="text" name="agent_password" value={formData.agent_password} onChange={handleInputChange} /></div>
              <div className="form-buttons">
                <button type="submit" className="save-button">Update Login</button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
