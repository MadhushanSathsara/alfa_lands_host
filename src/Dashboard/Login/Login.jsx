import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login1.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost/estate/Backend/api/authenticate.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        console.log('Logged in successfully:', data);

    
        localStorage.setItem("user_role", data.role);
        if (data.agent_id) {
          localStorage.setItem("agent_id", data.agent_id);
        }

  
        if (data.role === 'admin') {
          navigate('/admin_dashboard');
        } else {
          navigate('/agent_dashboard');
        }
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="login-box-container">
      <h2 className="login-box-title">Login</h2>
      {error && <p className="login-box-error">{error}</p>}
      <form onSubmit={handleLogin}>
        <label className="login-box-label">Username</label>
        <input
          className="login-box-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label className="login-box-label">Password</label>
        <input
          className="login-box-input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="login-box-button" type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
