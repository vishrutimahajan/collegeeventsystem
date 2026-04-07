import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EventRegister.css';

const EventRegister = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // 1. GET LOGGED-IN USER
  const user = JSON.parse(localStorage.getItem('user'));
  
  // 2. STATE
  const [event, setEvent] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form State (Prefilled if data exists, but NOT locked)
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    email: user && user.email ? user.email : '', // Prefill if available
    rollNo: '',
    phone: ''
  });

  useEffect(() => {
    if (!user) {
        navigate('/login');
        return;
    }

    // 3. FETCH EVENT DETAILS
    fetch('https://backendcems.onrender.com/api/events')
      .then(res => res.json())
      .then(data => {
        const found = data.find(e => e.id === parseInt(id));
        setEvent(found);
      })
      .catch(err => console.error("Error fetching event:", err));
  }, [id, navigate, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 4. SUBMIT REGISTRATION
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('https://backendcems.onrender.com/api/event/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_id: id,
          user_id: user.id 
        })
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/my-events');
        }, 2000);
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Server error. Is Python running?");
    }
  };

  if (!event) return (
    <div className="er-loading">
      <div className="er-spinner" />
      <p>Loading event details…</p>
    </div>
  );

  return (
    <div className="er-page">

      {/* ── COVER HERO ── */}
      <div className="er-hero"
        style={{
          background: event.cover_image
            ? `url(${event.cover_image}) center/cover no-repeat`
            : (event.color || '#961c46'),
        }}
      >
        <div className="er-scrim" />
        <button className="er-back" onClick={() => navigate(-1)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div className="er-hero-badge">FREE</div>
        <div className="er-hero-info">
          <span className="er-hero-eyebrow">You are registering for</span>
          <h1 className="er-hero-title">{event.title}</h1>
          <div className="er-hero-meta">
            <span>📅 {event.time}</span>
            <span>📍 {event.location}</span>
          </div>
        </div>
      </div>

      {/* ── FORM CARD floats over hero ── */}
      <div className="er-card">
        <h2 className="er-card-heading">Your Details</h2>
        <p className="er-card-sub">These will appear on your confirmation.</p>

        <form className="er-form" onSubmit={handleSubmit}>
          <div className="er-field">
            <label>Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="er-field">
            <label>Student ID / Roll No</label>
            <input type="text" name="rollNo" placeholder="e.g. 21BCS055" value={formData.rollNo} onChange={handleChange} required />
          </div>
          <div className="er-field">
            <label>Email Address</label>
            <input type="email" name="email" placeholder="rahul@college.edu" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="er-field">
            <label>Phone Number</label>
            <input type="tel" name="phone" placeholder="+91 99999 99999" value={formData.phone} onChange={handleChange} required />
          </div>
          <button type="submit" className="er-submit">Confirm Registration</button>
        </form>
      </div>

      {/* ── SUCCESS OVERLAY ── */}
      {showSuccess && (
        <div className="er-success-overlay">
          <div className="er-success-box">
            <div className="er-check">✓</div>
            <h3>You're in!</h3>
            <p>Registered for <strong>{event.title}</strong>.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventRegister;