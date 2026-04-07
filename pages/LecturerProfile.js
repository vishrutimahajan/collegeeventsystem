import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LecturerSignup.css'; 

const LecturerSignup = () => {
  const navigate = useNavigate();
  
  // State for form fields
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    expertise: '' 
  });

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('https://backendcems.onrender.com/api/lecturer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert("Application Sent Successfully! 📝\nPlease wait for Admin approval.");
        navigate('/'); // Redirect to Landing Page
      } else {
        alert(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Failed to connect to server.");
    }
  };

  return (
    <div className="lecturer-signup-container">
      <div className="lecturer-signup-card">
        
        {/* Header */}
        <h2 style={{color: '#961c46'}}>👨‍🏫 Lecturer Application</h2>
        <p>Join Eventi to host and manage campus events.</p>
        <div className="status-badge">Requires Admin Approval</div>
        
        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Full Name (e.g. Dr. Anya Sharma)" 
              required 
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className="input-group">
            <input 
              type="email" 
              placeholder="Official Email Address" 
              required 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              placeholder="Create Password" 
              required 
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Area of Expertise (e.g. AI, Physics)" 
              required 
              value={formData.expertise}
              onChange={e => setFormData({...formData, expertise: e.target.value})} 
            />
          </div>
          
          <button type="submit" className="submit-btn">
            Submit Application
          </button>
        </form>
        
        {/* Footer Link */}
        <p className="back-link" onClick={() => navigate('/')}>
          ← Back to Home
        </p>

      </div>
    </div>
  );
};

export default LecturerSignup;