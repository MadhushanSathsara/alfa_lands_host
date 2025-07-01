import React, { useState, useEffect } from 'react';
import { FaBell, FaEnvelope } from 'react-icons/fa';
import { supabase } from '../../supabaseClient'; // Ensure this path is correct for your project
import './AgentDashboard.css';

const AgentDashboard = () => {
    const [agentData, setAgentData] = useState({ name: '', id: '', error: '' });
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchAgentData = async () => {
            setLoading(true); // Start loading
            const agentId = localStorage.getItem("agent_id");

            if (!agentId) {
                setAgentData({ name: '', id: '', error: 'No agent ID found in local storage. Please log in.' });
                setLoading(false);
                return;
            }

            try {
                // Fetch agent data from the 'agents' table
                // We select 'agent_username' and 'agent_id'
                // and filter by the agent_id from local storage.
                // .single() is used to get a single record.
                const { data, error } = await supabase
                    .from('agents')
                    .select('agent_username, agent_id')
                    .eq('agent_id', agentId)
                    .single(); // Expecting a single matching row

                if (error) {
                    console.error('Supabase fetch error:', error.message);
                    setAgentData({ name: '', id: '', error: `Failed to load agent data: ${error.message}. Check RLS policies.` });
                } else if (data) {
                    setAgentData({ name: data.agent_username, id: data.agent_id, error: '' });
                } else {
                    // This case handles when .single() doesn't find a matching row (data is null)
                    setAgentData({ name: '', id: '', error: 'Agent data not found for the provided ID.' });
                }
            } catch (error) {
                console.error('Unexpected error fetching agent data:', error);
                setAgentData({ name: '', id: '', error: 'An unexpected error occurred while fetching agent data.' });
            } finally {
                setLoading(false); // End loading
            }
        };

        fetchAgentData();
    }, []);

    // Display loading state
    if (loading) {
        return (
            <div className="dashboard-container">
                <main className="dashboard-main">
                    <p>Loading agent data...</p>
                </main>
            </div>
        );
    }

    // Display error state
    if (agentData.error) {
        return (
            <div className="dashboard-container">
                <main className="dashboard-main">
                    <p className="error-message">Error: {agentData.error}</p>
                    <p>Please ensure you are logged in and your Supabase RLS policies allow agents to view their own data.</p>
                </main>
            </div>
        );
    }

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
                                <div className="dashboard-profile-initials">{agentData.name ? agentData.name[0].toUpperCase() : 'A'}</div>
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