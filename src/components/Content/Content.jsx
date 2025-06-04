import React from 'react'
import Home from '../Home/Home'
import Discover from '../Discover/Discover'
import BestDeals from '../BestDeals/BestDeals'
import NewestDeal from '../NewestDeal/NewestDeal'
import Property from '../Property/Property'
import AllProperties from '../Property/AllProperties'
import CustomerReviews from '../Customer review/CustomerReviews'
import Agent from '../Agent/Agent'
import AboutUs from '../AboutUs/AboutUs'
import Footer from '../Footer/Footer'
import '../../App.css'
import Header from '../Header/Header'


function Content() {
  return (
    <div className="app-container">
      <Header/>
       <Home/>
      <Discover/>
      <BestDeals/>
      {/* <NewestDeal/> */}
      <Property/>
      <CustomerReviews />
      <Agent/>
      <AboutUs/>
      
    </div>
  )
}

export default Content
