import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../component/BottomNav';
import './MyEvents.css'; 

const MyEvents = () => {
  const navigate = useNavigate();
  const [myEvents, setMyEvents] = useState([]);

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? user.id : null;

  useEffect(() => {
    if (!userId) {
        navigate('/login');
        return;
    }

    fetch(`https://backendcems.onrender.com/api/my-events/${userId}`)
      .then(res => res.json())
      .then(data => {
        const formattedEvents = data.map(e => ({
          ...e,
          date: e.time,
          icon: "📅",
          status: e.status || 'Registered' 
        }));
        setMyEvents(formattedEvents);
      })
      .catch(err => console.error("Error fetching my events:", err));
  }, [userId, navigate]);

  return (
    <div className="home-wrapper my-events-page">
      
      {/* HEADER */}
      <div className="my-events-header">
        <h2>My Schedule</h2>
        <div className="user-avatar" onClick={() => navigate('/profile')}>
           {user && user.profile_pic ? (
             <img src={user.profile_pic} alt="User" style={{width:'100%', height:'100%', borderRadius:'50%'}} />
           ) : (
             <img src={`https://ui-avatars.com/api/?name=${user ? user.name : 'User'}&background=961c46&color=fff`} alt="User" style={{width:'100%', height:'100%', borderRadius:'50%'}} />
           )}
        </div>
      </div>

      {/* TABS */}
      <div className="filter-tabs">
        <span className="tab active">Upcoming</span>
        <span className="tab">History</span>
      </div>

      {/* EVENTS LIST */}
      <div className="events-list">
        {myEvents.length === 0 ? (
          <p style={{textAlign: 'center', marginTop: 20, color: '#888'}}>No upcoming events.</p>
        ) : (
          myEvents.map((event) => (
            <div key={event.id} className="ticket-card-row">

              {/* ── Title: full width on top, never truncated ── */}
              <div className="event-title-row">
                <h4>{event.title}</h4>
              </div>

              {/* ── Bottom row: icon + meta + action ── */}
              <div className="card-bottom-row">

                {/* Left: Icon */}
                <div className="event-icon-box" style={{background: event.color || '#961c46'}}>
                  {event.icon}
                </div>

                {/* Middle: Time + Location */}
                <div className="event-details">
                  <p className="event-time">{event.date}</p>
                  <p className="event-loc">📍 {event.location}</p>
                </div>

                {/* Right: Status + Action */}
                <div className="action-area">
                  <span className={`status-pill ${event.status.toLowerCase()}`}>
                    {event.status}
                  </span>

                  {(event.status === 'Registered' || event.status === 'Confirmed') && (
                    <button 
                      className="view-ticket-btn"
                      onClick={() => navigate(`/ticket/${event.id}`)}
                    >
                      View Ticket 🎫
                    </button>
                  )}

                  {event.status === 'Attended' && (
                    <a 
                      href={`https://backendcems.onrender.com/api/certificate/${event.id}/${userId}`} 
                      className="view-ticket-btn"
                      style={{background: '#27ae60', textDecoration: 'none', textAlign: 'center', color: 'white'}}
                    >
                      Download Cert 🎓
                    </a>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default MyEvents;