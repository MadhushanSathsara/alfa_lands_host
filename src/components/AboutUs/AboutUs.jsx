import React from 'react';
import './AboutUs.css';
import { MdHomeRepairService } from 'react-icons/md';

const AboutUs = () => {
  return (
    <div>
    <div className='container'>
      <div className='services-section'>
        <div className='service-col'>
          <div className='service-box'>
            <MdHomeRepairService size={"1.8rem"} />
            <h1 className='service-title'>Good Services</h1>
            <p className='service-description'>lorem ipsum dolor sit</p>
          </div>
          <div className='service-box'>
            <MdHomeRepairService size={"1.8rem"} />
            <h1 className='service-title'>Good Services</h1>
            <p className='service-description'>lorem ipsum dolor sit</p>
          </div>
        </div>
        <div className='service-col'>
          <div className='service-box'>
            <MdHomeRepairService size={"1.8rem"} />
            <h1 className='service-title'>Good Services</h1>
            <p className='service-description'>lorem ipsum dolor sit</p>
          </div>
          <div className='service-box'>
            <MdHomeRepairService size={"1.8rem"} />
            <h1 className='service-title'>Good Services</h1>
            <p className='service-description'>lorem ipsum dolor sit</p>
          </div>
        </div>
      </div>
      

      <div className='about-us-text'>
        <h1 className='about-title'>
          Know<span className='highlight'> About us</span>
        </h1>
        <p className='about-description'>At Alfa Land, we believe that every dream starts with a vision. Founded with the mission of turning aspirations into reality, we specialize in providing premium real estate opportunities in prime locations. Whether you're seeking to buy land for your dream home or invest in future development, our expert team is here to guide you every step of the way. With a deep understanding of the local market and a commitment to transparency, we offer reliable and personalized services that make your real estate journey seamless and fulfilling. At Alfa Land, your dreams are our foundation.</p><br/>
        <button className='read'>Read More</button>
      </div>

      </div>

      {/* <div className="center ml-5 bg-white w-100">
        <h1 className="text-italic"> Contact us via..</h1>
        <br/>
        <div>
            <h5 className="bold" id="hotLine" >Call us by our hot line</h5>
             <button variant="success" type="call" href="tel:0355682233"> <h5> 011 2255775</h5> </button>
             
             <h5>Email us</h5>
             <button variant="success" type="email" href="mailto:janashashi5@gmail.com"> <h6> info@dreamlands.lk</h6> </button>
            
             <h5>Address</h5>
               <button variant="success" href="https://goo.gl/maps/uiSHst9NSS4wLYkW7"> <h6> No 155, New Kandy Road,Kothlawala,Kaduwela</h6> </button>
               <br></br>
               
             <div className="font-italic">
           <p><h5>Make your Appointment through the <span style={{color:'maroon'}}><b>DREAM</b></span><span
            style={{color:'green'}}> Lands</span>  website, we contact you as soon as possible..
                There you can make some resevations, bookings and contact our site agents by an easy way..</h5>
            </p>
            </div>
          </div>
      </div> */}

    </div>
  );
};

export default AboutUs;
