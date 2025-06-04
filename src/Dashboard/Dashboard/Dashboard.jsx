import React from 'react';
import { FaEnvelope, FaBell } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="dashboard-greeting">
            <h2>Hi, Monika</h2>
            <p>"Hello, Let's get started with today's pitch decks!</p>
          </div>
          <div className="dashboard-profile">
            <div className="dashboard-notifications">
              <FaEnvelope className="dashboard-icon" />
              <FaBell className="dashboard-icon" />
            </div>
            <div className="dashboard-profile-info">
              <div className="dashboard-profile-initials">MT</div>
              <span>Monika Tisowmy</span>
            </div>
          </div>
        </header>

        <section className="dashboard-overview">
          <div className="dashboard-stat">
            <h3>83%</h3>
            <p>Open Rate</p>
          </div>
          <div className="dashboard-stat">
            <h3>87%</h3>
            <p>Complete</p>
          </div>
          <div className="dashboard-stat">
            <h3>91 562k</h3>
            <p>Unique Views</p>
          </div>
          <div className="dashboard-stat">
            <h3>126 526k</h3>
            <p>Total Views</p>
          </div>
        </section>

        <section className="dashboard-pitches">
          <h3>Overview</h3>
          {["Today's Real Estate News","Market Trends", "Hot Properties","Recent Property Deals"].map((pitch, index) => (
            <div key={index} className="dashboard-pitch-card">
              <div className="dashboard-pitch-details">
                <h4>{pitch}</h4>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                <p>10 Slides</p>
              </div>
              <div className="dashboard-public-toggle">
                <span>{index % 2 === 0 ? "Public" : "Private"}</span>
                <input
                  type="checkbox"
                  checked={index % 2 === 0}
                  onChange={() => {}}
                />
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
