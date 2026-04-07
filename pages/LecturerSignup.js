import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; // Re-using the beautiful CSS

const LecturerSignup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '', expertise: '', bio: '', social_links: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
        alert("Application Sent! 📝\nPlease wait for Admin approval.");
        navigate('/');
      } else {
        alert(data.message);
      }
    } catch (error) { alert("Server Error"); }
  };

  return (
    <div className="register-container">
      <div className="register-card" style={{maxWidth: 500}}> {/* Slightly wider for Bio */}
        
        <h2>👨‍🏫 Lecturer Application</h2>
        <p>Join us to host events. Profile requires approval.</p>
        
        <form onSubmit={handleSubmit}>
          
          {/* Row 1: Name & Expertise */}
          <div style={{display: 'flex', gap: '10px'}}>
             <div className="input-group" style={{flex: 1}}>
                <label className="input-label">Full Name</label>
                <input type="text" name="name" placeholder="Dr. Smith" required onChange={handleChange} />
             </div>
             <div className="input-group" style={{flex: 1}}>
                <label className="input-label">Expertise</label>
                <input type="text" name="expertise" placeholder="AI, Physics" required onChange={handleChange} />
             </div>
          </div>

          {/* Row 2: Email & Password */}
          <div className="input-group">
            <label className="input-label">Official Email</label>
            <input type="email" name="email" placeholder="prof@college.edu" required onChange={handleChange} />
          </div>

          <div className="input-group">
            <label className="input-label">Create Password</label>
            <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
          </div>

          {/* Row 3: Bio & Socials (Moved here!) */}
          <div className="input-group">
            <label className="input-label">Bio <span className="optional-tag">(Optional)</span></label>
            <textarea name="bio" placeholder="Short professional bio..." onChange={handleChange} />
          </div>

          <div className="input-group">
            <label className="input-label">Portfolio / LinkedIn <span className="optional-tag">(Optional)</span></label>
            <input type="text" name="social_links" placeholder="https://..." onChange={handleChange} />
          </div>
          
          <button type="submit" className="register-btn" style={{background: '#d65db1'}}>Submit Application</button>
        </form>
        
        <p className="switch-text" onClick={() => navigate('/')}>← Back to Home</p>
      </div>
    </div>
  );
};

export default LecturerSignup;