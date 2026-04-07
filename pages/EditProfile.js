import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditProfile.css';
import userDP from '../img/userD.png'; 

const EditProfile = () => {
  const navigate = useNavigate();

  // 1. SAFE USER RETRIEVAL
  const getStoredUser = () => {
    const rawData = localStorage.getItem('user');
    if (!rawData || rawData === "undefined" || rawData === "null") return null;
    try {
      return JSON.parse(rawData);
    } catch (e) {
      return null;
    }
  };

  const user = getStoredUser();
  const userId = user ? user.id : null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: ""
  });
  const [profilePic, setProfilePic] = useState(userDP);
  const [isLoading, setIsLoading] = useState(true);

  // 2. FETCH DATA ON LOAD
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }

    fetch(`https://backendcems.onrender.com/api/profile?user_id=${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then(data => {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || ""
        });
        if (data.profile_pic) {
          setProfilePic(data.profile_pic.startsWith('http') 
            ? data.profile_pic 
            : `https://backendcems.onrender.com/static/uploads/${data.profile_pic}`);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Fetch Error:", err);
        setIsLoading(false);
      });
  }, [userId, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. SAVE CHANGES
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Construct the payload including user_id
    const updatePayload = { ...formData, user_id: userId };

    fetch('https://backendcems.onrender.com/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatePayload)
    })
    .then(res => {
      if (!res.ok) throw new Error("Server rejected update");
      return res.json();
    })
    .then(data => {
      // Update storage so the new name/email reflects globally
      const updatedUser = { 
        ...user, 
        name: formData.name, 
        email: formData.email 
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert("Profile updated successfully!");

      // Navigate to /account, NOT the landing page (/)
      setTimeout(() => {
        navigate('/account'); 
      }, 100);
    })
    .catch(err => {
      console.error("Update Error:", err);
      alert("Error saving: " + err.message);
    });
  };

  return (
    <div className="edit-page-wrapper">
      <div className="edit-container">
        
        <div className="edit-header">
          <button className="back-btn" onClick={() => navigate(-1)} type="button">←</button>
          <h2>Edit Profile</h2>
          <div className="spacer"></div>
        </div>

        <div className="scrollable-content">
          <div className="edit-avatar-section">
            <img src={profilePic} alt="User" className="edit-avatar" />
            <p className="change-photo-text" onClick={() => navigate('/account')}>
              Change Photo on Account Page
            </p>
          </div>

          <form onSubmit={handleSubmit} className="edit-form">
            <div className="input-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="Enter full name"
                value={formData.name} 
                onChange={handleChange} 
                required
              />
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Enter email"
                value={formData.email} 
                onChange={handleChange} 
                required
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                placeholder="Enter phone number"
                value={formData.phone} 
                onChange={handleChange} 
              />
            </div>

            <div className="input-group">
              <label>Bio</label>
              <textarea 
                name="bio" 
                rows="3" 
                placeholder="Tell us about yourself"
                value={formData.bio} 
                onChange={handleChange} 
              />
            </div>

            <button type="submit" className="save-btn" disabled={isLoading}>
              {isLoading ? "Connecting..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;