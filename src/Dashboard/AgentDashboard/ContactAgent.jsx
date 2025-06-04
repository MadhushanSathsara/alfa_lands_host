import React, { useEffect, useState } from 'react';
import './ContactAgent.css';

const ContactAgent = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const agentId = localStorage.getItem('agent_id');

  useEffect(() => {
    fetch('http://localhost/estate/Backend/api/get.agent.messages.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agent_id: agentId })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setMessages(data.messages);
        }
      })
      .catch(err => console.error(err));
  }, [agentId]);

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
              <div className="chat-preview">{msg.message.slice(0, 40)}...</div>
              <div className="chat-time">{new Date(msg.created_at).toLocaleString()}</div>
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
