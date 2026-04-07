import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../component/BottomNav';
import { FaShieldAlt } from 'react-icons/fa';
import './Home.css';

const API = 'https://backendcems.onrender.com/';

// How many cards show before "See All"
const EVENTS_INITIAL  = 6;
const WINNERS_INITIAL = 3;

const CHIP = {
  'Winner':      { icon: '🥇', bg: 'linear-gradient(135deg,#fffbea,#fef9c3)', border: '#d97706', color: '#78350f', label: '1ST' },
  'Runner-up':   { icon: '🥈', bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', border: '#2563eb', color: '#1e3a8a', label: '2ND' },
  'Third Place': { icon: '🥉', bg: 'linear-gradient(135deg,#faf5ff,#e9d5ff)', border: '#9333ea', color: '#581c87', label: '3RD' },
};
const TAG_ORDER = ['Winner', 'Runner-up', 'Third Place'];

// ── Single winner card — fetches its own winners ──────────────────────────────
const WinnerCard = ({ event, onReady }) => {
  const [winners, setWinners] = useState([]);
  const notified = useRef(false);

  useEffect(() => {
    fetch(`${API}/api/events/${event.id}/winners`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data) && data.length) {
          setWinners(data);
          if (!notified.current) { notified.current = true; onReady(event.id); }
        }
      })
      .catch(() => {});
  }, [event.id]);

  if (!winners.length) return null;

  const sorted = TAG_ORDER.map(t => winners.find(w => w.winner_tag === t)).filter(Boolean);
  const coverStyle = event.cover_image
    ? { backgroundImage: `url(${event.cover_image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: event.color || '#961c46' };

  return (
    <div className="wcard">
      {/* Cover strip */}
      <div className="wcard-cover" style={coverStyle}>
        <span className="wcard-trophy">🏆</span>
        <div className="wcard-overlay">
          <div className="wcard-title">{event.title}</div>
          <div className="wcard-date">
            {new Date(event.time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        </div>
      </div>
      {/* Winner rows */}
      <div className="wcard-body">
        {sorted.map(w => {
          const c = CHIP[w.winner_tag];
          return (
            <div key={w.id} className="wcard-row" style={{ background: c.bg, borderColor: c.border }}>
              <span className="wcard-medal">{c.icon}</span>
              <span className="wcard-name" style={{ color: c.color }}>{w.name}</span>
              <span className="wcard-badge" style={{ background: c.border }}>{c.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Winners section — tracks which events actually have winners ───────────────
const WinnersSection = ({ events }) => {
  const [readyIds, setReadyIds]   = useState([]);
  const [showAll, setShowAll]     = useState(false);

  const handleReady = (id) => setReadyIds(prev => prev.includes(id) ? prev : [...prev, id]);

  const visibleIds = showAll ? readyIds : readyIds.slice(0, WINNERS_INITIAL);
  const extra      = readyIds.length - WINNERS_INITIAL;

  return (
    <>
      <div className="winners-grid">
        {events.map(ev => (
          <div key={ev.id} style={{ display: visibleIds.includes(ev.id) ? 'block' : 'none' }}>
            <WinnerCard event={ev} onReady={handleReady} />
          </div>
        ))}
        {/* Still render hidden ones so they can fetch and call onReady */}
        {events
          .filter(ev => !visibleIds.includes(ev.id))
          .map(ev => (
            <div key={ev.id} style={{ display: 'none' }}>
              <WinnerCard event={ev} onReady={handleReady} />
            </div>
          ))}
      </div>

      {readyIds.length > WINNERS_INITIAL && (
        <button className="see-all-btn" onClick={() => setShowAll(v => !v)}>
          {showAll
            ? '↑ See Less'
            : `↓ See All ${readyIds.length} Winner Cards`}
        </button>
      )}

      {readyIds.length === 0 && (
        <p style={{ color: '#bbb', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          No winners tagged yet.
        </p>
      )}
    </>
  );
};

// ── Home ──────────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const [events, setEvents]               = useState([]);
  const [user, setUser]                   = useState(null);
  const [searchTerm, setSearchTerm]       = useState('');
  const [myCommunities, setMyCommunities] = useState([]);
  const [loadingComms, setLoadingComms]   = useState(true);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser) { navigate('/login'); return; }
    setUser(storedUser);

    fetch(`${API}/api/events`)
      .then(r => r.json())
      .then(setEvents)
      .catch(console.error);

    fetch(`${API}/api/my-communities?user_id=${storedUser.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { if (Array.isArray(data)) setMyCommunities(data); })
      .catch(() => {})
      .finally(() => setLoadingComms(false));
  }, [navigate]);

  const filtered = events.filter(ev =>
    ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ev.location || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const visibleEvents = showAllEvents ? filtered : filtered.slice(0, EVENTS_INITIAL);
  const hasMore       = filtered.length > EVENTS_INITIAL;

  if (!user) return null;

  return (
    <div className="home-wrapper">

      {/* ── HEADER ── */}
      <div className="home-header">
        <div className="header-text">
          <span className="sub-text">WELCOME BACK</span>
          <h2>{user.name.split(' ')[0]} 👋</h2>
        </div>
        <div className="header-actions">
          {user.role === 'admin' && (
            <button className="admin-pill" onClick={() => navigate('/admin')}>
              <FaShieldAlt size={11} /> Dashboard
            </button>
          )}
          <div className="profile-btn" onClick={() => navigate('/profile')}>
            <img
              src={user.profile_pic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=961c46&color=fff`}
              alt="Profile"
            />
          </div>
        </div>
      </div>

      <div className="home-body">

        {/* ── SEARCH ── */}
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search events, locations..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setShowAllEvents(false); }}
          />
          {searchTerm
            ? <span className="search-clear" onClick={() => setSearchTerm('')}>✕</span>
            : <span className="search-icon" style={{ opacity: 0.5 }}>⚡</span>
          }
        </div>

        {/* ── MY COMMUNITIES ── */}
        <div className="section-row">
          <h3 className="section-title">My Communities</h3>
          <span className="see-all-link" onClick={() => navigate('/communities')}>See All</span>
        </div>
        <div className="comms-row">
          {loadingComms
            ? [1,2,3].map(i => <div key={i} className="comm-skel" />)
            : myCommunities.length === 0
              ? <span className="comms-empty" onClick={() => navigate('/communities')}>
                  Join communities to see them here →
                </span>
              : myCommunities.map(c => (
                  <div key={c.id} className="comm-pill" onClick={() => navigate(`/communities?id=${c.id}`)}>
                    <div className="comm-dot" style={{ background: (c.color || '#961c46') + '22' }}>
                      {c.icon || '🏫'}
                    </div>
                    <span className="comm-name">{c.name}</span>
                    {c.role === 'admin' && <span style={{ fontSize: 10 }}>👑</span>}
                  </div>
                ))
          }
        </div>

        {/* ── TRENDING NOW ── */}
        <div className="section-row">
          <h3 className="section-title">Trending Now</h3>
          {hasMore && (
            <span className="see-all-link" onClick={() => setShowAllEvents(v => !v)}>
              {showAllEvents ? '↑ See Less' : `↓ See All (${filtered.length})`}
            </span>
          )}
        </div>

        <div className="events-grid">
          {filtered.length === 0
            ? <p className="no-results">
                {searchTerm ? `No results for "${searchTerm}"` : 'No events yet.'}
              </p>
            : visibleEvents.map(ev => (
                <div key={ev.id} className="ecard" onClick={() => navigate(`/event/${ev.id}`)}>
                  <div className="ecard-img"
                    style={{
                      background: ev.color || '#961c46',
                      backgroundImage: ev.cover_image ? `url(${ev.cover_image})` : 'none',
                      backgroundSize: 'cover', backgroundPosition: 'center',
                    }}
                  >
                    {!ev.cover_image && <span className="ecard-emoji">{ev.category === 'Music' ? '🎵' : '✨'}</span>}
                  </div>
                  <div className="ecard-info">
                    <h4 className="ecard-name">{ev.title}</h4>
                    <p className="ecard-loc">📍 {ev.location}</p>
                    <div className="ecard-tag"><span className="etag-dot" />{ev.time}</div>
                  </div>
                </div>
              ))
          }
        </div>

        {/* Show collapsed count badge */}
        {!showAllEvents && hasMore && !searchTerm && (
          <button className="see-all-btn" onClick={() => setShowAllEvents(true)}>
            ↓ See All {filtered.length} Events
          </button>
        )}
        {showAllEvents && hasMore && (
          <button className="see-all-btn" onClick={() => { setShowAllEvents(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            ↑ See Less
          </button>
        )}

        {/* ── EVENT WINNERS ── */}
        <div className="section-row" style={{ marginTop: 8 }}>
          <h3 className="section-title">🏆 Event Winners</h3>
        </div>
        <WinnersSection events={events} />

      </div>

      <BottomNav />
    </div>
  );
};

export default Home;