import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
// IMPORT THE CORRECT FILE NAME HERE:
import bgImage from '../img/Landing.jpg'; 

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="landing-overlay">
        
        
        
        <button className="get-started-btn" onClick={() => navigate('/register')}>
          Get Started
        </button>

      </div>
    </div>
  );
};

export default Landing;