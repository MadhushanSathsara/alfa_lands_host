import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';

import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

import Content from './components/Content/Content';
import BestDeals from './components/BestDeals/BestDeals';
import AboutUs from './components/AboutUs/AboutUs';
import PropertyOverview from './components/PropertyOverview/PropertyOverview';
import NewestDeal from './components/NewestDeal/NewestDeal';
import Property from './components/Property/Property';
import AllProperties from './components/Property/AllProperties';
import CustomerReviews from './components/Customer review/CustomerReviews';
import Agent from './components/Agent/Agent';

import Login from './Dashboard/Login/Login';
import DashboardLayout from './Dashboard/DashboardLayout/DashboardLayout';
import AgentDashboardLayout from './Dashboard/DashboardLayout/AgentDashboardLayout';

import AgentDashboard from './Dashboard/AgentDashboard/AgentDashboard';
import Dashboard from './Dashboard/Dashboard/Dashboard';
import Properties from './Dashboard/Property/Property';
import Agents from './Dashboard/Agent/Agent';
import AddAgentForm from './Dashboard/Agent/AddAgentForm';
import AddPropertyForm from './Dashboard/Property/AddPropertyForm';
import ContactAgent from './Dashboard/AgentDashboard/ContactAgent';
import AgentProperties from './Dashboard/AgentDashboard/AgentProperties';
import Profile from './Dashboard/Profile/Profile';
import AgentProfile from './Dashboard/Profile/AgentProfile';

import ProtectedRoute from './utils/ProtectedRoute';
import dealsData from './assets/dealsData';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Content />} />
        <Route path="/login" element={<Login />} />
        <Route path="/content" element={<Content />} />
        <Route path="/bestdeals" element={<BestDeals />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/property/:id" element={<PropertyOverview dealsData={dealsData} />} />
        <Route path="/newestdeals" element={<NewestDeal />} />
        <Route path="/property" element={<Property />} />
        <Route path="/all-properties" element={<AllProperties />} />
        <Route path="/customerreview" element={<CustomerReviews />} />
        <Route path="/agent" element={<Agent />} />

        {/* Admin Dashboard Protected Routes */}
          <Route path="/admin_dashboard" element={
          <ProtectedRoute allowedRole="admin">
            <DashboardLayout />
          </ProtectedRoute>
        }>
          
            <Route index element={<Dashboard />} />
            <Route path="property" element={<Properties />} />
            <Route path="addproperty" element={<AddPropertyForm />} />
            <Route path="agents" element={<Agents />} />
            <Route path="addagent" element={<AddAgentForm />} />
            <Route path="profile" element={<Profile />} />
          </Route>
      

        {/* Agent Dashboard Protected Routes */}
          <Route path="/agent_dashboard" element={
          <ProtectedRoute allowedRole={['agent', 'executive team', 'marketing team', 'inspector', 'supervise team']}>
            <AgentDashboardLayout />
          </ProtectedRoute>
        }>

            <Route index element={<AgentDashboard />} />
            <Route path="agentproperties" element={<AgentProperties />} />
            <Route path="messages" element={<ContactAgent />} />
            <Route path="agentprofile" element={<AgentProfile />} />
        
        </Route>

      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
