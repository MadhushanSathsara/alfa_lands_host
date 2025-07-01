import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Ensure this path is correct for your project
import './ContactAgent.css';

const ContactAgent = () => {
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const agentId = localStorage.getItem('agent_id');

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            setError(null); // Clear previous errors

            if (!agentId) {
                setError('Agent ID not found in local storage. Cannot fetch messages.');
                setLoading(false);
                return;
            }

            try {
                // Fetch messages from your Supabase 'contact_messages' table
                // Filter messages where 'agent_id' matches the current agent's ID
                // Order them by 'created_at' in descending order (most recent first)
                const { data, error } = await supabase
                    .from('contact_messages')
                    .select('*') // Select all columns
                    .eq('agent_id', agentId) // Filter by agent_id
                    .order('created_at', { ascending: false }); // Latest messages first

                if (error) {
                    throw error;
                }

                setMessages(data || []);
                // If there are messages, automatically select the first one
                if (data && data.length > 0) {
                    setSelectedMessage(data[0]);
                } else {
                    setSelectedMessage(null); // No messages, so nothing selected
                }
            } catch (err) {
                console.error('Error fetching messages from Supabase:', err.message);
                setError(`Failed to load messages: ${err.message}. Please check your network and RLS policies.`);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [agentId]); // Re-run effect if agentId changes

    if (loading) {
        return <div className="chat-container"><p className="loading-message">Loading messages...</p></div>;
    }

    if (error) {
        return <div className="chat-container"><p className="error-message">Error: {error}</p></div>;
    }

    return (
        <div className="chat-container">
            <div className="chat-list">
                {messages.length === 0 ? (
                    <p className="no-messages">You haven't received any messages yet.</p>
                ) : (
                    messages.map(msg => (
                        <div
                            key={msg.contact_id}
                            className={`chat-item ${selectedMessage?.contact_id === msg.contact_id ? 'active' : ''}`}
                            onClick={() => setSelectedMessage(msg)}
                        >
                            <div className="chat-user">{msg.user_name}</div>
                            {/* Display only the first 40 characters of the message */}
                            <div className="chat-preview">{msg.message ? `${msg.message.slice(0, 40)}...` : 'No message content'}</div>
                            {/* Format timestamp to a more readable local string */}
                            <div className="chat-time">{msg.created_at ? new Date(msg.created_at).toLocaleString() : 'N/A'}</div>
                        </div>
                    ))
                )}
            </div>

            <div className="chat-detail">
                {selectedMessage ? (
                    <div className="chat-bubble">
                        <h3>{selectedMessage.user_name}</h3>
                        <p>
                            <strong>Email:</strong>{' '}
                            <a href={`mailto:${selectedMessage.user_email}`} className="chat-link">
                                {selectedMessage.user_email}
                            </a>
                        </p>
                        <p>
                            <strong>Phone:</strong>{' '}
                            <a href={`tel:${selectedMessage.user_phone}`} className="chat-link">
                                {selectedMessage.user_phone}
                            </a>
                        </p>
                        <p className="chat-message">{selectedMessage.message}</p>
                        <p className="chat-method">Contacted via: {selectedMessage.contact_method}</p>
                    </div>
                ) : (
                    <p className="chat-placeholder">Select a message to view full details.</p>
                )}
            </div>
        </div>
    );
};

export default ContactAgent;