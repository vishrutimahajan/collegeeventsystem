import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import './Account.css';
import BottomNav from '../component/BottomNav';
import userDP from '../img/userD.png';

const Account = () => {
  const navigate = useNavigate();

  const getStoredUser = () => {
    const rawData = localStorage.getItem('user');
    if (!rawData || rawData === "undefined") return null;
    try { return JSON.parse(rawData); } catch { return null; }
  };

  const user     = getStoredUser();
  const userId   = user ? user.id   : null;
  const userRole = user ? user.role : 'student';

  const [profileData, setProfileData]         = useState({ name: "Loading...", email: "" });
  const [profilePic, setProfilePic]           = useState(userDP);
  const [realCertificates, setRealCertificates] = useState([]);
  const [loadingCerts, setLoadingCerts]       = useState(true);

  useEffect(() => {
    if (!userId) { navigate('/login'); return; }
    fetch(`http://localhost:5000/api/profile?user_id=${userId}`)
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setProfileData(data);
          if (data.profile_pic) {
            const fullUrl = data.profile_pic.startsWith('http')
              ? data.profile_pic
              : `http://localhost:5000/static/uploads/${data.profile_pic}`;
            setProfilePic(fullUrl);
          }
        }
      })
      .catch(console.error);
  }, [userId, navigate]);

  useEffect(() => {
    if (userId && userRole === 'student') {
      fetch(`http://localhost:5000/api/my-events/${userId}`)
        .then(r => r.json())
        .then(data => {
          setRealCertificates(data.filter(e => e.status.toLowerCase() === 'attended'));
          setLoadingCerts(false);
        })
        .catch(() => setLoadingCerts(false));
    } else {
      setLoadingCerts(false);
    }
  }, [userId, userRole]);

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file || !userId) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);
    fetch('http://localhost:5000/api/upload', { method: 'POST', body: formData })
      .then(r => r.json())
      .then(data => {
        if (data.url) {
          const fullUrl = `http://localhost:5000${data.url}`;
          setProfilePic(fullUrl);
          localStorage.setItem('user', JSON.stringify({ ...user, profile_pic: fullUrl }));
          alert("Profile picture updated!");
        }
      })
      .catch(console.error);
  }, [userId, user]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop, accept: { 'image/*': [] }, multiple: false,
  });

  return (
    <div className="account-page-wrapper">

      {/* ── HERO ── */}
      <div className="account-hero">
        <div {...getRootProps()} className="account-avatar-wrap">
          <input {...getInputProps()} />
          <img src={profilePic} alt="Profile" />
          <div className="avatar-edit-badge">✏️</div>
        </div>
        <h1 className="user-name">{profileData.name}</h1>
        <div className="role-badge">{userRole === 'admin' ? '🛡️' : '🎓'} {userRole}</div>
        <p className="user-email">{profileData.email}</p>
      </div>

      {/* ── BODY ── */}
      <div className="account-body">

        {userRole === 'admin' ? (
          <div className="account-section" style={{ padding: 18 }}>
            <button className="admin-enter-btn" onClick={() => navigate('/admin')}>
              ⚙️ Enter Admin Dashboard
            </button>
            <p className="admin-hint">Manage events, users, and approvals from here.</p>
          </div>
        ) : (
          <div className="account-section">
            <div className="account-section-header">
              <h3 className="account-section-title">🏆 My Certificates</h3>
              <span className="count-badge">{realCertificates.length}</span>
            </div>
            {loadingCerts ? (
              <p className="certs-empty">Loading certificates...</p>
            ) : realCertificates.length > 0 ? (
              <div className="certificates-horizontal-scroll">
                {realCertificates.map(cert => (
                  <div
                    key={cert.id}
                    className="cert-card-v2"
                    onClick={() => navigate(`/ticket/${cert.id}`, { state: { status: 'attended' } })}
                  >
                    <div className="cert-icon-box" style={{ background: cert.color || '#961c46' }}>📜</div>
                    <div className="cert-card-info">
                      <h4>{cert.title}</h4>
                      <p>{cert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="certs-empty">No certificates yet — attend events to earn them!</p>
            )}
          </div>
        )}

        {/* ── MENU ── */}
        <div className="account-section">
          <div className="menu-item" onClick={() => navigate('/edit-profile')}>
            <span className="menu-label">Edit Profile</span>
            <span className="menu-arrow">›</span>
          </div>
          {userRole !== 'admin' && (
            <div className="menu-item" onClick={() => navigate('/payment-methods')}>
              <span className="menu-label">Payment Methods</span>
              <span className="menu-arrow">›</span>
            </div>
          )}
          <div className="menu-item" onClick={() => navigate('/notifications')}>
            <span className="menu-label">Notifications</span>
            <span className="menu-arrow">›</span>
          </div>
          <div className="menu-item" onClick={() => navigate('/help-support')}>
            <span className="menu-label">Help & Support</span>
            <span className="menu-arrow">›</span>
          </div>
        </div>

        <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>
          Log Out
        </button>

      </div>

      <BottomNav />
    </div>
  );
};

export default Account;