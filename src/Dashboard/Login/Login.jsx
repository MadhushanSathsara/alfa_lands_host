import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login1.css';

// *** IMPORTANT: ONLY THESE IMPORTS ARE NEEDED FOR YOUR REACT FRONTEND LOGIN COMPONENT ***
// The Deno/Supabase Edge Function specific imports are removed.

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when login starts
    setError(''); // Clear any previous errors

    try {
      // Your Edge Function URL remains the same
      // This URL refers to the deployed Edge Function on Supabase's cloud.
      const edgeFunctionUrl = 'https://hddobdmhmzmmdqtmktse.supabase.co/functions/v1/authenticate-user';

      const response = await fetch(edgeFunctionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json(); // Parse the JSON response from the Edge Function

      // The Edge Function returns { success: true/false, message, role, agent_id }
      if (response.ok && data.success) { // Check both HTTP status (200) and the custom 'success' flag
        console.log('Logged in successfully:', data);

        // Store user details received from the Edge Function
        localStorage.setItem("user_role", data.role);
        if (data.agent_id) {
          localStorage.setItem("agent_id", data.agent_id);
        }
        // Optionally store the username or any other data you get back
        localStorage.setItem("loggedInUsername", username);

        // Navigate based on role
        if (data.role === 'admin') {
          navigate('/admin_dashboard');
        } else { // This else will now specifically catch 'agent' role due to Edge Function changes
          navigate('/agent_dashboard');
        }
      } else {
        // Handle errors returned by the Edge Function
        console.error('Login failed:', data.message || 'Unknown error');
        setError(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login request:', error);
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false); // Always set loading to false when the process finishes
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
        <button className="login-box-button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
