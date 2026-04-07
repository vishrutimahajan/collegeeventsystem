import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BottomNav.css';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'nav-item active' : 'nav-item';

  // Professional SVG Icons
  const icons = {
    home: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    ),
    calendar: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    reports: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </svg>
    ),
    communities: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M7 21v-2a4 4 0 0 1 3-3.87"></path>
        <circle cx="12" cy="7" r="4"></circle>
        <circle cx="18" cy="8" r="3"></circle>
        <circle cx="6" cy="8" r="3"></circle>
      </svg>
    ),
    profile: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    )
  };

  return (
    <div className="bottom-nav">
      <div className={isActive('/home')} onClick={() => navigate('/home')}>
        <span className="nav-icon">{icons.home}</span>
        <span className="nav-label">Home</span>
      </div>
      
      <div className={isActive('/communities')} onClick={() => navigate('/communities')}>
        <span className="nav-icon">{icons.communities}</span>
        <span className="nav-label">Communities</span>
      </div>

      <div className={isActive('/my-events')} onClick={() => navigate('/my-events')}>
        <span className="nav-icon">{icons.calendar}</span>
        <span className="nav-label">My Events</span>
      </div>

      <div className={isActive('/reports')} onClick={() => navigate('/reports')}>
        <span className="nav-icon">{icons.reports}</span>
        <span className="nav-label">Reports</span>
      </div>

      <div className={isActive('/account')} onClick={() => navigate('/account')}>
        <span className="nav-icon">{icons.profile}</span>
        <span className="nav-label">Profile</span>
      </div>
    </div>
  );
};

export default BottomNav;