import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Agent1.css';

const teamList = ['All', 'Agent', 'Inspector', 'Supervise Team', 'Executive Team', 'Marketing Team'];
const posList = ['All', 'Senior', 'Junior'];
const API = 'http://localhost/estate/backend/api/agent.api.php';

const Agent = () => {
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [filtered, setFiltered] = useState([]);
  const [team, setTeam] = useState('All');
  const [pos, setPos] = useState('All');
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchAgents = async () => {
    try {
      const res = await axios.get(API);
      if (Array.isArray(res.data)) {
        setAgents(res.data);
        setFiltered(res.data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    const filtered = agents.filter(agent => {
      const nameMatch = (agent.agent_name || '').toLowerCase().includes(search.toLowerCase());
      const emailMatch = (agent.agent_email || '').toLowerCase().includes(search.toLowerCase());
      const teamMatch = team === 'All' || agent.agent_team === team;
      const posMatch = pos === 'All' || agent.agent_position === pos;
      return (nameMatch || emailMatch) && teamMatch && posMatch;
    });
    setFiltered(filtered);
  }, [search, team, pos, agents]);

  const handleEdit = (agent) => {
    setSelected({ ...agent, newImage: null });
    setShow(true);
  };

  const handleSave = async () => {
    try {
      const form = new FormData();
      form.append('agent_id', selected.agent_id);
      form.append('agent_name', selected.agent_name);
      form.append('agent_email', selected.agent_email);
      form.append('agent_username', selected.agent_username || '');
      form.append('agent_password', selected.agent_password || '');
      form.append('agent_position', selected.agent_position || '');
      form.append('agent_team', selected.agent_team || '');
      form.append('existing_image', selected.agent_image?.split('/').pop() || 'default.jpg');

      if (selected.newImage) {
        form.append('agent_image', selected.newImage);
      }

      const res = await axios.post(API, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.status) {
        setShow(false);
        fetchAgents();
      } else {
        console.error('Update failed:', res.data.message);
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  const handleDelete = async (agentId) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;

    try {
      const form = new FormData();
      form.append('delete_agent', 'true');
      form.append('agent_id', agentId);

      const res = await axios.post(API, form);

      if (res.data.status) {
        setAgents(prev => prev.filter(agent => agent.agent_id !== agentId));
        setFiltered(prev => prev.filter(agent => agent.agent_id !== agentId));
      } else {
        console.error("Delete failed:", res.data.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="ag-wrap">
      <h1>Agent List</h1>

      <div className="ag-filters">
        <input
          type="text"
          placeholder="Search name/email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <h3>Team</h3>
        <select value={team} onChange={e => setTeam(e.target.value)}>
          {teamList.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <h3>Position</h3>
        <select value={pos} onChange={e => setPos(e.target.value)}>
          {posList.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div className="ag-add">
        <Link to="/admin_dashboard/AddAgent">
          <button>+ Add Agent</button>
        </Link>
      </div>

      <div className="ag-cards">
        {filtered.map((agent, i) => (
          <div key={i} className="ag-card">
            <img
              src={agent.agent_image || 'http://localhost/estate/Backend/api/images/agent/default.jpg'}
              alt={agent.agent_name}
              className="ag-img"
            />
            <h3>{agent.agent_name}</h3>
            <p><b>ID:</b> {agent.agent_id}</p>
            <p><b>Email:</b> {agent.agent_email}</p>
            <p><b>Phone:</b> {agent.agent_telephone}</p>
            <p><b>Position:</b> {agent.agent_position}</p>
            <p><b>Team:</b> {agent.agent_team}</p>
            <button onClick={() => handleEdit(agent)} className="edit-btn">Edit</button>
            <button onClick={() => handleDelete(agent.agent_id)} className="delete-btn">Delete</button>
          </div>
        ))}
      </div>

      {show && selected && (
        <div className="ag-modal-bg" onClick={() => setShow(false)}>
          <div className="ag-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ag-modal-header">
              <h2>Edit Agent</h2>
              <button className="ag-close" onClick={() => setShow(false)}>✖</button>
            </div>
            <h6>Name</h6>
            <input type="text" value={selected.agent_name} onChange={e => setSelected({ ...selected, agent_name: e.target.value })} />
            <h6>Email</h6>
            <input type="email" value={selected.agent_email} onChange={e => setSelected({ ...selected, agent_email: e.target.value })} />
            <h6>Username</h6>
            <input type="text" value={selected.agent_username} onChange={e => setSelected({ ...selected, agent_username: e.target.value })} />
            <h6>Password</h6>
            <input type="text" value={selected.agent_password} onChange={e => setSelected({ ...selected, agent_password: e.target.value })} />
            <h6>Position</h6>
            <select value={selected.agent_position} onChange={e => setSelected({ ...selected, agent_position: e.target.value })}>
              {posList.slice(1).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            <h6>Team</h6>
            <select value={selected.agent_team} onChange={e => setSelected({ ...selected, agent_team: e.target.value })}>
              {teamList.slice(1).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <h6>Picture</h6>
            <input type="file" onChange={e => setSelected({ ...selected, newImage: e.target.files[0] })} />
            <button className="save-btn" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agent;
