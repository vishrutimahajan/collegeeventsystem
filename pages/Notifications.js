import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications on load
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));

  const load = () => {
    fetch(`https://backendcems.onrender.com/api/notifications/${user.id}`)
      .then(res => res.json())
      .then(data => setNotifications(data));
  };

  load();
  const interval = setInterval(load, 10000);

  return () => clearInterval(interval);
}, []);

  // Clear All function
  const handleClearAll = () => {
    const user = JSON.parse(localStorage.getItem("user"));

fetch(`https://backendcems.onrender.com/api/notifications/${user.id}`, {
  method: 'DELETE'
}).then(() => setNotifications([]));
  };

const markAsRead = (id) => {
  fetch(`https://backendcems.onrender.com/api/notifications/${id}/read`, {
    method: "POST"
  })
  .then(res => res.json())
  .then(() => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      )
    );
  });
};

const deleteNotification = (id) => {
  fetch(`https://backendcems.onrender.com/api/notifications/${id}`, {
    method: "DELETE"
  }).then(() => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  });
};

  const getIcon = (type) => {
    switch(type) {
      case 'alert': return '⚠️';
      case 'success': return '✅';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  return (
    <div className="notif-page-wrapper">
      <div className="notif-container">
        
        {/* Header */}
        <div className="notif-header">
          <button className="back-btn" onClick={() => navigate('/account')}>←</button>
          <h2>Notifications</h2>
          <div className="spacer"></div>
        </div>

        <div className="scrollable-content">
          
          <div className="notif-actions">
            <span className="notif-count">You have {notifications.length} notifications</span>
            {notifications.length > 0 && (
              <button className="clear-btn" onClick={handleClearAll}>Clear All</button>
            )}
          </div>

          <div className="notif-list">
            {notifications.length === 0 ? (
              <div className="empty-state">No new notifications</div>
            ) : (
notifications.map(notif => (
  <div key={notif.id} className={`notif-item ${notif.type} ${notif.is_read ? "read" : "unread"}`}>

    <div className="notif-icon">{getIcon(notif.type)}</div>

    <div className="notif-content">
      <h4>{notif.title}</h4>
      <p>{notif.message}</p>
      <span className="notif-date">{notif.date}</span>

      <div className="notif-actions-btn">
        {!notif.is_read && (
          <button onClick={() => markAsRead(notif.id)}>
            Mark Read
          </button>
        )}

        <button onClick={() => deleteNotification(notif.id)}>
          Delete
        </button>
      </div>
    </div>

  </div>
))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Notifications;