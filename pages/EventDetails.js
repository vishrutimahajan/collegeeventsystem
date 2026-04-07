import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. DEFINE STATE FIRST (Crucial Step)
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. FETCH DATA
  useEffect(() => {
    fetch('https://backendcems.onrender.com/api/events')
      .then(res => res.json())
      .then(data => {
        const found = data.find(e => e.id === parseInt(id));
        setEvent(found);
        setLoading(false);
      })
      .catch(err => console.error("Error:", err));
  }, [id]);

  // 3. CHECK LOADING (Before trying to use 'event')
  if (loading) return <div style={{padding: 20}}>Loading Event Info...</div>;
  if (!event) return <div style={{padding: 20}}>Event not found!</div>;

  // 4. CALCULATE SPEAKER DATA (Now safe because 'event' exists)
  const speakerName = event.speaker_name || "Guest Speaker";
  const speakerRole = event.speaker_role || "Special Guest";
  // Generate a dynamic avatar based on the name
  const speakerImage = `https://ui-avatars.com/api/?name=${speakerName}&background=ffd1dc&color=961c46`;

  return (
    <div className="home-wrapper details-page">
      
      {/* HEADER */}
      <div className="details-header">
        <button className="back-btn" onClick={() => navigate('/home')}>←</button>
        <h3>Event Details</h3>
        <div style={{width: 24}}></div>
      </div>

      <div className="home-scroll-content">
        
        {/* BANNER */}
        <div className="event-banner" style={{background: event.color || '#961c46'}}>
          <span className="banner-icon">✨</span>
        </div>

        <div className="details-info">
          <h1>{event.title}</h1>
          
          <div className="meta-row">
            <div className="meta-item">
              <span className="icon">📅</span> {event.time} 
            </div>
          </div>
          
          <div className="meta-item location">
            <span className="icon">📍</span> {event.location}
          </div>

          <h3>About Event</h3>
          <p className="description">
            {event.description || "No description provided."}
          </p>
        </div>

        {/* SPEAKER CARD */}
        <h3>Guest Speaker</h3>
        <div className="speaker-card">
          <img src={speakerImage} alt="Speaker" />
          <div className="speaker-info">
            <h4>{speakerName}</h4>
            <p>{speakerRole}</p>
          </div>
          <div className="arrow-icon">→</div>
        </div>

      </div>

      {/* REGISTER BUTTON */}
      <div className="bottom-action-bar">
        <button 
          className="main-action-btn" 
          onClick={() => navigate(`/register-event/${id}`)}
        >
          Register Now
        </button>
      </div>

    </div>
  );
};

export default EventDetails;