import React, { useState } from 'react';
import axios from 'axios';
import './AddAgentForm.css';

const AddAgentForm = () => {
  const [formData, setFormData] = useState({
    agent_name: '',
    agent_email: '',
    agent_telephone: '',
    agent_address: '',
    agent_position: '',
    agent_team: '',
    agent_username: '',
    agent_password: '',
    agent_image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      agent_image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    for (const key in formData) {
      form.append(key, formData[key]);
    }

    try {
      const res = await axios.post(
        'http://localhost/estate/backend/api/agent.api.php',
        form,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      alert(res.data.message || 'Agent added successfully!');
    } catch (err) {
      console.error('Error adding agent:', err);
      alert('Failed to add agent. Please try again.');
    }
  };

  return (
    <div className="agent-form-container">
      <h2>Add New Agent</h2>
      <form onSubmit={handleSubmit} className="agent-form" encType="multipart/form-data">
        <div className="agent-form-group">
          <label>Name:</label>
          <input
            type="text"
            name="agent_name"
            value={formData.agent_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="agent-form-group">
          <label>Email:</label>
          <input
            type="email"
            name="agent_email"
            value={formData.agent_email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="agent-form-group">
          <label>Telephone:</label>
          <input
            type="text"
            name="agent_telephone"
            value={formData.agent_telephone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="agent-form-group">
          <label>Address:</label>
          <input
            type="text"
            name="agent_address"
            value={formData.agent_address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="agent-form-group">
          <label>Team:</label>
          <select name="agent_team" value={formData.agent_team} onChange={handleChange} required>
            <option value="">Select Team</option>
            <option value="Agent">Agent</option>
            <option value="Inspector">Inspector</option>
            <option value="Supervise Team">Supervise Team</option>
            <option value="Executive Team">Executive Team</option>
            <option value="Marketing Team">Marketing Team</option>
          </select>
        </div>

        <div className="agent-form-group">
          <label>Position:</label>
          <select
            name="agent_position"
            value={formData.agent_position}
            onChange={handleChange}
            required
          >
            <option value="">Select Position</option>
            <option value="Senior">Senior</option>
            <option value="Junior">Junior</option>
          </select>
        </div>

        <div className="agent-form-group">
          <label>Username:</label>
          <input
            type="text"
            name="agent_username"
            value={formData.agent_username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="agent-form-group">
          <label>Password:</label>
          <input
            type="password"
            name="agent_password"
            value={formData.agent_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="agent-form-group">
          <label>Image:</label>
          <input
            type="file"
            name="agent_image"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <div className="agent-form-buttons">
          <button type="reset" className="agent-form-button-discard">
            Discard Changes
          </button>
          <button type="submit" className="agent-form-button-save">
            Add Agent
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddAgentForm;
