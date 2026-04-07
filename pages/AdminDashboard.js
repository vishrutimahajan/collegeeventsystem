import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import QRCode from 'react-qr-code';
import {
  FaHome, FaCalendarAlt, FaUsers, FaTicketAlt, FaPlus,
  FaUserCircle, FaSignOutAlt, FaMoon, FaSun, FaChevronDown, FaUserPlus,
  FaHistory, FaMapMarkerAlt, FaClock, FaFileUpload, FaQrcode, FaDownload,
  FaExternalLinkAlt, FaVideo, FaDoorOpen, FaExclamationTriangle, FaCheckCircle,
  FaTrophy, FaMedal, FaAward, FaTimes, FaTrash, FaUserCheck,
  FaFileAlt, FaRobot, FaEdit, FaImage, FaCheck, FaBell, FaBullhorn
} from 'react-icons/fa';
import './AdminDashboard.css';

const API = 'https://backendcems.onrender.com';

// ─────────────────────────────────────────────────────────────────────────────
// COMMUNITY SELECTOR
// ─────────────────────────────────────────────────────────────────────────────
const CommunitySelector = ({ eventId, selectedIds, onChange }) => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [open, setOpen]               = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const allData = await fetch(`${API}/api/admin/communities`).then(r => r.json());
        if (!cancelled) setCommunities(Array.isArray(allData) ? allData : []);
        if (eventId) {
          const linked = await fetch(`${API}/api/admin/events/${eventId}/communities`).then(r => r.json());
          if (!cancelled) onChange((Array.isArray(linked) ? linked : []).map(c => c.id));
        }
      } catch (err) { console.error('CommunitySelector error:', err); }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const toggle = (id) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter(x => x !== id) : [...selectedIds, id]);
  };

  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ marginBottom: 10, border: '2px dashed #961c46', padding: '12px', borderRadius: '8px', background: '#fff0f5' }}>
        <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#961c46', display: 'block', marginBottom: '8px' }}>
          👥 Assign to Communities
        </label>
        {selectedIds.length > 0 ? (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#28a745', fontWeight: 'bold', fontSize: 13 }}>
              ✓ {selectedIds.length} {selectedIds.length === 1 ? 'community' : 'communities'} selected
            </span>
            <button type="button" onClick={() => setOpen(true)} style={{
              background: '#961c46', color: 'white', border: 'none',
              padding: '6px 14px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold'
            }}>Change</button>
          </div>
        ) : (
          <button type="button" onClick={() => setOpen(true)} style={{
            width: '100%', padding: '10px', background: '#961c46', color: 'white',
            border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'
          }}>
            {loading ? 'Loading…' : 'Select Communities'}
          </button>
        )}
      </div>

      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <div className="modal-box" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>👥 Assign to Communities</h3>
              <span className="close-x" onClick={() => setOpen(false)}>×</span>
            </div>
            <p style={{ fontSize: 12, color: '#b08090', margin: '0 0 14px' }}>
              Event appears <strong>only</strong> in selected communities' Events tab.
            </p>
            {loading ? (
              <p style={{ textAlign: 'center', padding: 20, color: '#999' }}>Loading communities…</p>
            ) : !communities.length ? (
              <p style={{ textAlign: 'center', padding: 20, color: '#999' }}>No communities yet.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, maxHeight: 340, overflowY: 'auto', paddingRight: 4 }}>
                {communities.map(c => {
                  const on = selectedIds.includes(c.id);
                  return (
                    <button key={c.id} type="button" onClick={() => toggle(c.id)} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '12px',
                      borderRadius: 12, cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
                      border: `2px solid ${on ? c.color : '#f0d8e0'}`,
                      background: on ? `${c.color}15` : '#fff',
                      boxShadow: on ? `0 3px 10px ${c.color}30` : 'none',
                      transition: 'all 0.15s',
                    }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                        background: on ? `${c.color}25` : '#fdf6f8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
                        border: `1.5px solid ${on ? c.color : '#f0d8e0'}`,
                      }}>{c.icon}</div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#2d1520', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                        <div style={{ fontSize: 11, color: '#b08090' }}>{c.member_count} members</div>
                      </div>
                      <div style={{
                        width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                        border: `2px solid ${on ? c.color : '#dcc4cc'}`,
                        background: on ? c.color : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        {on && <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            <button onClick={() => setOpen(false)} style={{
              marginTop: 18, width: '100%', padding: '12px',
              background: '#961c46', color: 'white', border: 'none',
              borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: 14,
            }}>
              ✓ Done ({selectedIds.length} selected)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOM AVAILABILITY MODAL
// ─────────────────────────────────────────────────────────────────────────────
const RoomAvailabilityModal = ({ startTime, endTime, onSelectRoom, onClose }) => {
  const [availability, setAvailability] = useState({ available: [], unavailable: [] });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchAvailability = async () => {
      if (startTime && endTime) {
        try {
          const res = await fetch(`${API}/api/rooms/available`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ start_time: startTime, end_time: endTime })
          });
          const data = await res.json();
          setAvailability(data);
          setLoading(false);
        } catch (err) {
          console.error('Error checking availability:', err);
          alert('Error checking room availability. Check server connection.');
          setLoading(false);
        }
      }
    };
    fetchAvailability();
  }, [startTime, endTime]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: '700px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🏢 Room Availability</h3>
          <span className="close-x" onClick={onClose}>×</span>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '30px' }}>Checking availability...</p>
        ) : (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#28a745', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FaCheckCircle /> Available Rooms ({availability.available?.length || 0})
              </h4>
              {availability.available && availability.available.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  {availability.available.map(room => (
                    <div
                      key={room.id}
                      onClick={() => onSelectRoom(room)}
                      style={{ border: '2px solid #28a745', borderRadius: '10px', padding: '15px', cursor: 'pointer', background: '#f0fff4', transition: 'all 0.2s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <h5 style={{ margin: '0 0 5px 0', color: '#28a745' }}>{room.room_name}</h5>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>{room.room_type} • {room.capacity} capacity</p>
                      <p style={{ fontSize: '10px', color: '#888', margin: '5px 0 0 0' }}>{room.floor}, {room.building}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#999', fontSize: '14px', marginTop: '10px' }}>No rooms available for this time slot</p>
              )}
            </div>
            {availability.unavailable && availability.unavailable.length > 0 && (
              <div>
                <h4 style={{ color: '#dc3545', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaExclamationTriangle /> Unavailable Rooms ({availability.unavailable.length})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', marginTop: '10px' }}>
                  {availability.unavailable.map(room => (
                    <div key={room.id} style={{ border: '2px solid #dc3545', borderRadius: '8px', padding: '12px', background: '#fff5f5', opacity: 0.7 }}>
                      <h5 style={{ margin: '0 0 5px 0', color: '#dc3545' }}>{room.room_name}</h5>
                      <p style={{ fontSize: '11px', color: '#666', margin: 0 }}>{room.room_type} • {room.capacity} capacity</p>
                      {room.conflict && (
                        <div style={{ marginTop: '8px', padding: '6px', background: '#ffe0e0', borderRadius: '4px', fontSize: '10px' }}>
                          <strong>Conflict:</strong> {room.conflict.event_title}<br />
                          {new Date(room.conflict.start_time).toLocaleString()} - {new Date(room.conflict.end_time).toLocaleTimeString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <button onClick={onClose} style={{ marginTop: '20px', width: '100%', padding: '12px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC PROJECTOR
// ─────────────────────────────────────────────────────────────────────────────
const DynamicProjector = ({ eventId, onClose }) => {
  const [qrString, setQrString] = useState("Loading...");
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    const fetchQR = async () => {
      try {
        const res = await fetch(`${API}/api/admin/dynamic-qr/${eventId}`);
        const data = await res.json();
        if (data.qr_data) { setQrString(data.qr_data); setTimeLeft(10); }
      } catch (err) { console.error("Projector Error:", err); }
    };
    fetchQR();
    const interval = setInterval(fetchQR, 10000);
    const timer = setInterval(() => setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    return () => { clearInterval(interval); clearInterval(timer); };
  }, [eventId]);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '25px', textAlign: 'center', width: '90%', maxWidth: '400px', position: 'relative' }}>
        <h2 style={{ color: '#961c46', marginBottom: '10px' }}>🔴 Live Check-In</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Code refreshes every 10 seconds</p>
        <div style={{ background: 'white', padding: '10px', border: '4px solid #961c46', borderRadius: '15px', display: 'inline-block' }}>
          <QRCode value={qrString} size={250} />
        </div>
        <h3 style={{ marginTop: '20px', color: '#333' }}>Next refresh: <span style={{ color: '#961c46' }}>{timeLeft}s</span></h3>
        <button onClick={onClose} style={{ marginTop: '25px', width: '100%', padding: '15px', background: '#961c46', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(150, 28, 70, 0.3)' }}>
          Stop Session ⏹
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WINNER TAGGING MODAL
// ─────────────────────────────────────────────────────────────────────────────
const WINNER_TAGS = ['Winner', 'Runner-up', 'Third Place'];
const TAG_STYLES = {
  'Winner':      { bg: '#fff8e1', border: '#f5c518', color: '#b8860b', icon: '🥇' },
  'Runner-up':   { bg: '#f0f4ff', border: '#5c7cfa', color: '#3451b2', icon: '🥈' },
  'Third Place': { bg: '#fff0f6', border: '#f06595', color: '#c2255c', icon: '🥉' },
};

const WinnerTagModal = ({ eventId, eventTitle, onClose }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [saving, setSaving]             = useState(null);
  const [fetchError, setFetchError]     = useState('');

  const fetchParticipants = async () => {
    setLoading(true); setFetchError('');
    try {
      const [attendeesRes, winnersRes] = await Promise.all([
        fetch(`${API}/api/admin/attendees/${eventId}`),
        fetch(`${API}/api/admin/events/${eventId}/winners`).catch(() => null)
      ]);
      if (!attendeesRes.ok) { setFetchError(`Server error ${attendeesRes.status}`); setLoading(false); return; }
      const attendees = await attendeesRes.json();
      let winnerMap = {};
      if (winnersRes && winnersRes.ok) {
        const winners = await winnersRes.json();
        if (Array.isArray(winners)) winners.forEach(w => { winnerMap[w.id] = w.winner_tag; });
      }
      setParticipants((Array.isArray(attendees) ? attendees : []).map(p => ({
        ...p, winner_tag: winnerMap[p.id] !== undefined ? winnerMap[p.id] : (p.winner_tag ?? null)
      })));
    } catch (err) { setFetchError('Network error — check server connection.'); }
    setLoading(false);
  };

  useEffect(() => { fetchParticipants(); }, [eventId]);

  const postTag = async (userId, tag) => {
    const res = await fetch(`${API}/api/admin/events/${eventId}/winners/${userId}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ winner_tag: tag }),
    });
    let data = {}; try { data = await res.json(); } catch(e) {}
    if (!res.ok) throw new Error(data.error || `Server error ${res.status}`);
    return data;
  };

  const handleTag = async (userId, tag) => {
    setSaving(userId); setFetchError('');
    try {
      await postTag(userId, tag);
      setParticipants(prev => prev.map(p => {
        if (p.id === userId) return { ...p, winner_tag: tag };
        if (tag && p.winner_tag === tag) return { ...p, winner_tag: null };
        return p;
      }));
    } catch (err) { setFetchError(err.message); }
    setSaving(null);
  };

  const handleClear = async (userId) => {
    setSaving(userId); setFetchError('');
    try {
      await postTag(userId, null);
      setParticipants(prev => prev.map(p => p.id === userId ? { ...p, winner_tag: null } : p));
    } catch (err) { setFetchError(err.message); }
    setSaving(null);
  };

  const tagged   = participants.filter(p => p.winner_tag);
  const untagged = participants.filter(p => !p.winner_tag);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box large-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 660, maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}><FaTrophy style={{ color: '#f5c518' }} /> Tag Winners — {eventTitle}</h3>
          <span className="close-x" onClick={onClose}>×</span>
        </div>
        <p style={{ fontSize: 12, color: '#888', margin: '0 0 14px', lineHeight: 1.5 }}>
          Click 🥇 🥈 🥉 next to a participant to assign their placement.
        </p>
        {fetchError && (
          <div style={{ background: '#fff0f0', border: '1px solid #f5c6cb', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#dc3545', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {fetchError}</span>
            <button onClick={() => setFetchError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc3545', fontWeight: 700, fontSize: 16 }}>×</button>
          </div>
        )}
        {loading ? (
          <p style={{ textAlign: 'center', padding: 30, color: '#999' }}>Loading participants…</p>
        ) : participants.length === 0 ? (
          <p style={{ textAlign: 'center', padding: 30, color: '#999' }}>No registrations found for this event.</p>
        ) : (
          <>
            {tagged.length > 0 && (
              <div style={{ marginBottom: 22 }}>
                <h4 style={{ fontSize: 13, color: '#b5174e', marginBottom: 12, fontWeight: 700 }}>🏆 Current Winners</h4>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10, marginBottom: 16, padding: '0 10px' }}>
                  {(() => { const p = tagged.find(t => t.winner_tag === 'Runner-up'); return (
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p ? p.name : '—'}</div>
                      <div style={{ background: p ? 'linear-gradient(180deg,#c8d8ff,#8fa8f0)' : '#f0f0f0', borderRadius: '8px 8px 0 0', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🥈</div>
                      <div style={{ background: '#5c7cfa', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 0', borderRadius: '0 0 6px 6px' }}>2nd</div>
                    </div>
                  ); })()}
                  {(() => { const p = tagged.find(t => t.winner_tag === 'Winner'); return (
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: '#2d1520', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p ? p.name : '—'}</div>
                      <div style={{ background: p ? 'linear-gradient(180deg,#fff3b0,#f5c518)' : '#f0f0f0', borderRadius: '8px 8px 0 0', height: 95, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34 }}>🥇</div>
                      <div style={{ background: '#e6a817', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 0', borderRadius: '0 0 6px 6px' }}>1st</div>
                    </div>
                  ); })()}
                  {(() => { const p = tagged.find(t => t.winner_tag === 'Third Place'); return (
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#555', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p ? p.name : '—'}</div>
                      <div style={{ background: p ? 'linear-gradient(180deg,#ffd6e8,#f06595)' : '#f0f0f0', borderRadius: '8px 8px 0 0', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>🥉</div>
                      <div style={{ background: '#c2255c', color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 0', borderRadius: '0 0 6px 6px' }}>3rd</div>
                    </div>
                  ); })()}
                </div>
                {['Winner','Runner-up','Third Place'].map(tag => {
                  const p = tagged.find(t => t.winner_tag === tag);
                  if (!p) return null;
                  const s = TAG_STYLES[tag];
                  return (
                    <div key={tag} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 14px', borderRadius: 10, marginBottom: 6, background: s.bg, border: `1.5px solid ${s.border}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: s.border, color: '#fff', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{s.icon} {tag}</span>
                        <span style={{ fontWeight: 700, color: '#2d1520', fontSize: 14 }}>{p.name}</span>
                        <span style={{ fontSize: 11, color: '#aaa' }}>{p.email}</span>
                      </div>
                      <button onClick={() => handleClear(p.id)} disabled={saving === p.id} style={{ background: 'none', border: '1px solid #dc3545', borderRadius: 6, color: '#dc3545', cursor: 'pointer', padding: '3px 8px', fontSize: 12, opacity: saving === p.id ? 0.5 : 1 }}><FaTimes /></button>
                    </div>
                  );
                })}
              </div>
            )}
            {untagged.length > 0 && (
              <div>
                <h4 style={{ fontSize: 13, color: '#555', marginBottom: 10, fontWeight: 700 }}>👥 All Participants ({untagged.length} untagged)</h4>
                <div style={{ maxHeight: 320, overflowY: 'auto', paddingRight: 2 }}>
                  {untagged.map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, marginBottom: 7, background: '#fafafa', border: '1.5px solid #eee' }}>
                      <div>
                        <span style={{ fontWeight: 600, color: '#2d1520', fontSize: 14 }}>{p.name}</span>
                        <span style={{ fontSize: 11, color: '#aaa', marginLeft: 8 }}>{p.roll_no !== 'N/A' ? p.roll_no : p.email}</span>
                        <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: p.status === 'Attended' ? '#28a745' : '#999', background: p.status === 'Attended' ? '#e6f9ed' : '#f5f5f5', borderRadius: 999, padding: '2px 8px' }}>{p.status}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 5 }}>
                        {WINNER_TAGS.map(tag => {
                          const s = TAG_STYLES[tag];
                          const alreadyTaken = tagged.some(t => t.winner_tag === tag);
                          return (
                            <button key={tag} onClick={() => handleTag(p.id, tag)} disabled={saving === p.id}
                              style={{ background: alreadyTaken ? '#fff8e1' : s.bg, border: `1.5px solid ${s.border}`, borderRadius: 7, color: s.color, cursor: 'pointer', padding: '4px 9px', fontSize: 11, fontWeight: 700, opacity: saving === p.id ? 0.5 : 1, transition: 'transform 0.1s' }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >{s.icon}</button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <button onClick={onClose} style={{ marginTop: 20, width: '100%', padding: '12px', background: '#b5174e', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>
          Done
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// REPORT FORM MODAL (inside AdminDashboard)
// ─────────────────────────────────────────────────────────────────────────────
const ReportFormModal = ({ events, editReport, onClose, onSaved }) => {
  const [eventId, setEventId]     = useState(editReport?.event_id || '');
  const [title, setTitle]         = useState(editReport?.title || '');
  const [content, setContent]     = useState(editReport?.content || '');
  const [images, setImages]       = useState([]);
  const [existingImgs, setExistingImgs] = useState(editReport?.images || []);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const fileRef = useRef();

// ─────────────────────────────────────────────────────────────────────────────
// UPDATED handleAIGenerate (Inside ReportFormModal)
// ─────────────────────────────────────────────────────────────────────────────
const handleAIGenerate = async () => {
  if (!eventId) { setError('Please select an event first.'); return; }
  setAiLoading(true); setError('');
  try {
    const res = await fetch(`${API}/api/reports/ai-generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId }),
    });
    
    const data = await res.json();
    
    if (!res.ok) throw new Error(data.error || 'AI generation failed.');

    // FIX: Match the keys from your server.py return
    if (data.title) setTitle(data.title);
    
    // Check for 'report' (new server key) OR 'content' (old server key)
    if (data.report) {
      setContent(data.report);
    } else if (data.content) {
      setContent(data.content);
    }
    
  } catch (e) { 
    setError(e.message || 'AI generation failed. Check server.'); 
  }
  setAiLoading(false);
};

  const handleSubmit = async () => {
    if (!eventId || !title.trim() || !content.trim()) { setError('Event, title, and content are required.'); return; }
    setSaving(true); setError('');
    try {
      const fd = new FormData();
      fd.append('event_id', eventId);
      fd.append('title', title.trim());
      fd.append('content', content.trim());
      fd.append('existing_images', JSON.stringify(existingImgs));
      images.forEach(f => fd.append('images', f));
      const url    = editReport ? `${API}/api/reports/${editReport.id}` : `${API}/api/reports`;
      const method = editReport ? 'PUT' : 'POST';
      const res    = await fetch(url, { method, body: fd });
      if (!res.ok) throw new Error(await res.text());
      onSaved(); onClose();
    } catch (e) { setError(e.message || 'Save failed.'); }
    setSaving(false);
  };

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(15,5,10,0.55)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 20, width: '100%', maxWidth: 560, maxHeight: '92vh', overflowY: 'auto', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Header */}
        <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f0e8ec', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#fff', zIndex: 1, borderRadius: '20px 20px 0 0' }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#1a0a12' }}>{editReport ? '✏️ Edit Report' : '📋 New Event Report'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#961c46' }}><FaTimes /></button>
        </div>

        <div style={{ padding: '16px 20px 24px' }}>
          {error && (
            <div style={{ background: '#fff0f5', border: '1px solid #f5c6d5', borderRadius: 10, padding: '10px 14px', marginBottom: 14, fontSize: 13, color: '#961c46' }}>
              ⚠️ {error}
            </div>
          )}

          <label style={rptLabel}>Select Event *</label>
          <select value={eventId} onChange={e => setEventId(e.target.value)} style={rptInput}>
            <option value="">— Choose an event —</option>
            {events.map(ev => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
          </select>

          {/* AI Generate */}
          <button type="button" onClick={handleAIGenerate} disabled={aiLoading || !eventId}
            style={{ width: '100%', padding: '12px', background: aiLoading || !eventId ? '#e0d0d8' : 'linear-gradient(135deg, #7c3aed, #961c46)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 800, cursor: aiLoading || !eventId ? 'not-allowed' : 'pointer', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {aiLoading
              ? <><span style={{ display: 'inline-block', width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', marginRight: 6 }} />Generating…</>
              : <><FaRobot /> ✨ AI Generate Report (Gemini)</>
            }
          </button>

          <label style={rptLabel}>Report Title *</label>
          <input placeholder="e.g. Annual Music Fest 2025 – Highlights" value={title} onChange={e => setTitle(e.target.value)} style={rptInput} />

          <label style={rptLabel}>Report Content *</label>
          <textarea placeholder="Write the event summary, highlights, outcomes…" value={content} onChange={e => setContent(e.target.value)} rows={7} style={{ ...rptInput, resize: 'vertical', lineHeight: 1.6 }} />

          <label style={rptLabel}>📷 Upload Photos</label>
          <div onClick={() => fileRef.current?.click()} style={{ border: '2px dashed #f5c6d5', borderRadius: 12, padding: '14px 16px', textAlign: 'center', cursor: 'pointer', marginBottom: 12, background: '#fff8fb', color: '#b08090', fontSize: 13 }}>
            <FaImage style={{ marginBottom: 4, fontSize: 20, display: 'block', margin: '0 auto 4px' }} />
            <div>Click to add images</div>
            <div style={{ fontSize: 11, marginTop: 2 }}>JPG, PNG, WebP · Multiple allowed</div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => setImages(prev => [...prev, ...Array.from(e.target.files)])} />

          {images.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {images.map((f, i) => (
                <div key={i} style={{ position: 'relative' }}>
                  <img src={URL.createObjectURL(f)} alt="preview" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, border: '2px solid #f5c6d5' }} />
                  <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes /></button>
                </div>
              ))}
            </div>
          )}

          {existingImgs.length > 0 && (
            <div>
              <label style={{ ...rptLabel, marginBottom: 6 }}>Existing Photos</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                {existingImgs.map((img, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img src={`${API}/${img}`} alt="existing" style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, border: '2px solid #f5c6d5' }} />
                    <button onClick={() => setExistingImgs(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: '#dc3545', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FaTimes /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleSubmit} disabled={saving} style={{ width: '100%', padding: '14px', background: saving ? '#e0d0d8' : '#961c46', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            {saving ? 'Saving…' : <><FaCheck /> {editReport ? 'Save Changes' : 'Publish Report'}</>}
          </button>
          <button onClick={onClose} style={{ width: '100%', padding: '12px', background: '#f5eef1', color: '#7a5c6a', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ADMIN REPORTS PANEL
// ─────────────────────────────────────────────────────────────────────────────
const AdminReportsPanel = ({ events }) => {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchReports = () => {
    setLoading(true);
    fetch(`${API}/api/reports`)
      .then(r => r.json())
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(fetchReports, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this report? This cannot be undone.')) return;
    setDeleting(id);
    await fetch(`${API}/api/reports/${id}`, { method: 'DELETE' });
    setDeleting(null);
    fetchReports();
  };

  return (
    <div style={{ padding: '0 0 40px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#1a0a12' }}>📋 Event Reports</h2>
          <p style={{ margin: '3px 0 0', fontSize: 13, color: '#b08090' }}>Create post-event summaries visible to all students.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          style={{ background: '#961c46', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <FaPlus /> New Report
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#b08090' }}>⏳ Loading reports…</div>
      ) : reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#b08090', background: '#fff', borderRadius: 18, border: '1px dashed #f0d8e4' }}>
          <div style={{ fontSize: 42, marginBottom: 10 }}>📭</div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 15 }}>No reports yet</p>
          <p style={{ margin: '6px 0 0', fontSize: 13 }}>Click "New Report" and use the ✨ AI button to generate one instantly!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {reports.map(report => (
            <div key={report.id} style={{ background: '#fff', borderRadius: 18, border: '1px solid #f0e8ec', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              {/* Image strip */}
              {report.images?.length > 0 && (
                <div style={{ display: 'flex', gap: 3, height: 70, overflow: 'hidden' }}>
                  {report.images.slice(0, 5).map((img, i) => (
                    <img key={i} src={`${API}/${img}`} alt="thumb" style={{ flex: '1 1 0', objectFit: 'cover', display: 'block' }} />
                  ))}
                </div>
              )}
              <div style={{ padding: '14px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#961c46', background: '#fff0f5', padding: '2px 10px', borderRadius: 20, display: 'inline-block', marginBottom: 5 }}>
                      {report.event_title}
                    </span>
                    <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#1a0a12', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.title}</h4>
                    <p style={{ margin: '5px 0 0', fontSize: 12, color: '#7a5c6a', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{report.content}</p>
                    <span style={{ fontSize: 11, color: '#b08090', display: 'block', marginTop: 7 }}>
                      📅 {report.created_at ? new Date(report.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      {report.images?.length > 0 && ` · 📷 ${report.images.length} photo${report.images.length > 1 ? 's' : ''}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, flexShrink: 0 }}>
                    <button onClick={() => { setEditing(report); setShowForm(true); }} style={{ background: '#f0f4ff', color: '#4c6ef5', border: 'none', padding: '7px 14px', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><FaEdit /> Edit</button>
                    <button onClick={() => handleDelete(report.id)} disabled={deleting === report.id} style={{ background: '#fff0f5', color: '#dc3545', border: 'none', padding: '7px 14px', borderRadius: 9, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}><FaTrash /> {deleting === report.id ? '…' : 'Delete'}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <ReportFormModal
          events={events}
          editReport={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={fetchReports}
        />
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};


// ─────────────────────────────────────────────────────────────────────────────
// BROADCAST MODAL
// Send a message to all registered attendees (venue change, custom, etc.)
// Backend: POST /api/admin/broadcast
//   body: { event_id, type, message, new_venue? }
// ─────────────────────────────────────────────────────────────────────────────
const BROADCAST_TYPES = [
  { id: 'venue_change', icon: '📍', label: 'Venue Change',    color: '#e65100' },
  { id: 'reminder',     icon: '⏰', label: 'Reminder',        color: '#1565c0' },
  { id: 'custom',       icon: '📢', label: 'Custom Message',  color: '#4f46e5' },
];

const BroadcastModal = ({ event, onClose }) => {
  const [type, setType]       = useState('venue_change');
  const [message, setMessage] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  const prefillMessage = (t) => {
    if (t === 'venue_change') {
      setMessage(`⚠️ Important Update: The venue for "${event.title}" has been changed. Please see the new location below and update your plans accordingly.`);
    } else if (t === 'reminder') {
      const d = new Date(event.time);
      setMessage(`📅 Reminder: Don't forget — "${event.title}" is coming up on ${d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} at ${d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}. See you there!`);
    } else {
      setMessage('');
    }
  };

  const handleTypeSelect = (t) => { setType(t); setError(''); prefillMessage(t); };

  useEffect(() => { prefillMessage('venue_change'); }, []);

  const finalMessage = type === 'venue_change' && newVenue.trim()
    ? message + `\n\n📍 New Venue: ${newVenue}`
    : message;

  const handleSend = async () => {
    if (!finalMessage.trim()) { setError('Please enter a message before sending.'); return; }
    if (type === 'venue_change' && !newVenue.trim()) { setError('Please enter the new venue name.'); return; }
    setSending(true); setError('');
    try {
      const res = await fetch(`${API}/api/admin/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: event.id, type, message: finalMessage, new_venue: newVenue || undefined }),
      });
      const data = await res.json();
      if (res.ok) { setSent(true); }
      else { setError(data.error || data.message || 'Failed to send. Check server.'); }
    } catch { setError('Server error — is the backend running?'); }
    setSending(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 500, padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ margin: 0, color: '#fff', fontSize: 17, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}><FaBullhorn /> Broadcast Notification</h3>
            <p style={{ margin: '3px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>Send a message to all registered attendees</p>
          </div>
          <span onClick={onClose} style={{ color: '#fff', cursor: 'pointer', fontSize: 22, lineHeight: 1, opacity: 0.8 }}>×</span>
        </div>

        <div style={{ padding: '20px 20px 24px', overflowY: 'auto', maxHeight: '75vh' }}>

          {/* Event chip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: '#f8f4ff', borderRadius: 10, border: '1px solid #e0d8f8', marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: event.color || '#961c46', backgroundImage: event.cover_image ? `url(${event.cover_image})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center', flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#1a0a12', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{event.title}</div>
              <div style={{ fontSize: 11, color: '#7c3aed', marginTop: 1 }}>Notifying all registered attendees</div>
            </div>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '28px 0' }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>✅</div>
              <h4 style={{ margin: '0 0 8px', color: '#1a7a3c', fontWeight: 800, fontSize: 17 }}>Notification Sent!</h4>
              <p style={{ fontSize: 13, color: '#555', margin: '0 0 20px', lineHeight: 1.6 }}>All registered attendees have been notified successfully.</p>
              <button onClick={onClose} style={{ padding: '10px 30px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>Done</button>
            </div>
          ) : (
            <>
              {/* Type selector */}
              <p style={{ fontSize: 12, fontWeight: 700, color: '#555', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notification Type</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                {BROADCAST_TYPES.map(bt => (
                  <button key={bt.id} type="button" onClick={() => handleTypeSelect(bt.id)}
                    style={{ padding: '10px 6px', borderRadius: 10, border: `2px solid ${type === bt.id ? bt.color : '#eee'}`, background: type === bt.id ? `${bt.color}12` : '#fafafa', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, transition: 'all 0.15s' }}>
                    <span style={{ fontSize: 20 }}>{bt.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: type === bt.id ? bt.color : '#888' }}>{bt.label}</span>
                  </button>
                ))}
              </div>

              {/* New venue input */}
              {type === 'venue_change' && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>📍 New Venue *</label>
                  <input type="text" placeholder="e.g. Main Auditorium, Block A"
                    value={newVenue} onChange={e => setNewVenue(e.target.value)}
                    style={{ width: '100%', padding: '10px 13px', borderRadius: 9, border: `1.5px solid ${newVenue ? '#4f46e5' : '#e0d8e8'}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.2s' }} />
                </div>
              )}

              {/* Message textarea */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Message *</label>
                <textarea rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Type your message..."
                  style={{ width: '100%', padding: '10px 13px', borderRadius: 9, border: '1.5px solid #e0d8e8', fontSize: 13, outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6, boxSizing: 'border-box' }} />
                <div style={{ fontSize: 10, color: '#b08090', textAlign: 'right', marginTop: 3 }}>{message.length} characters</div>
              </div>

              {error && (
                <div style={{ background: '#fff5f5', border: '1px solid #fcc', borderRadius: 8, padding: '9px 13px', fontSize: 12, color: '#dc3545', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                  ⚠️ {error}
                </div>
              )}

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleSend} disabled={sending}
                  style={{ flex: 1, padding: '13px', background: sending ? '#9994d4' : 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: sending ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'opacity 0.2s' }}>
                  {sending ? 'Sending…' : <><FaBullhorn size={13} /> Send to All Attendees</>}
                </button>
                <button onClick={onClose} style={{ padding: '13px 16px', background: '#f5eef1', color: '#7a5c6a', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Cancel</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULED REMINDERS PANEL
// Shown inside the event details modal — configure day-before & day-of alerts
// Backend: GET/PUT /api/admin/events/:id/notification-settings
//   shape: { day_before: bool, day_of: bool }
// The backend cron job reads these settings and dispatches at the right time.
// ─────────────────────────────────────────────────────────────────────────────
const ScheduledRemindersPanel = ({ event }) => {
  const [settings, setSettings] = useState({ day_before: true, day_of: true });
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [status,   setStatus]   = useState('');   // '' | 'saved' | 'error'

  useEffect(() => {
    fetch(`${API}/api/admin/events/${event.id}/notification-settings`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSettings(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [event.id]);

  const toggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    setStatus('');
  };

  const handleSave = async () => {
    setSaving(true); setStatus('');
    try {
      const res = await fetch(`${API}/api/admin/events/${event.id}/notification-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setStatus(res.ok ? 'saved' : 'error');
    } catch { setStatus('error'); }
    setSaving(false);
    if (status !== 'error') setTimeout(() => setStatus(''), 2500);
  };

  const ROWS = [
    { key: 'day_before', icon: '📅', label: '24-hour reminder',  sub: 'Sent the day before the event' },
    { key: 'day_of',     icon: '⏰', label: 'Day-of reminder',   sub: 'Sent the morning of the event' },
  ];

  return (
    <div style={{ marginTop: 16, padding: '14px 16px', background: '#f6f4ff', borderRadius: 12, border: '1px solid #ddd8f8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <FaBell style={{ color: '#4f46e5', fontSize: 14 }} />
        <span style={{ fontWeight: 800, fontSize: 13, color: '#1a0a12' }}>Scheduled Reminders</span>
        <span style={{ fontSize: 11, color: '#888', marginLeft: 'auto' }}>Auto-sent to all attendees</span>
      </div>

      {loading ? (
        <p style={{ margin: 0, fontSize: 12, color: '#888', textAlign: 'center', padding: '8px 0' }}>Loading…</p>
      ) : (
        <>
          {ROWS.map(row => (
            <div key={row.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', borderRadius: 10, padding: '11px 13px', marginBottom: 8, border: '1px solid #ede8fc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>{row.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#1a0a12' }}>{row.label}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{row.sub}</div>
                </div>
              </div>
              {/* Toggle switch */}
              <div onClick={() => toggle(row.key)}
                style={{ width: 44, height: 24, borderRadius: 12, cursor: 'pointer', flexShrink: 0, position: 'relative', background: settings[row.key] ? '#4f46e5' : '#e0e0e0', transition: 'background 0.25s' }}>
                <div style={{ position: 'absolute', top: 3, left: settings[row.key] ? 23 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
              </div>
            </div>
          ))}

          <button onClick={handleSave} disabled={saving}
            style={{ width: '100%', padding: '10px', marginTop: 4, background: saving ? '#aaa8e8' : '#4f46e5', color: '#fff', border: 'none', borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'background 0.2s' }}>
            {saving ? 'Saving…' : status === 'saved' ? '✓ Saved!' : status === 'error' ? '✗ Error — try again' : <><FaBell size={12} /> Save Reminder Settings</>}
          </button>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const navigate = useNavigate();

  let user = null;
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== "undefined") user = JSON.parse(storedUser);
  } catch (err) { localStorage.removeItem('user'); }
  const userRole = user ? user.role : 'student';

  const [activeView, setActiveView]           = useState('dashboard');
  const [expandedRequestId, setExpandedRequestId] = useState(null);
  const [darkMode, setDarkMode]               = useState(false);
  const [date, setDate]                       = useState(new Date());

  const [stats, setStats]           = useState({ users: 0, events: 0, registrations: 0 });
  const [events, setEvents]         = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [rooms, setRooms]           = useState([]);

  const [showModal, setShowModal]           = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showProjector, setShowProjector]   = useState(false);
  const [showRoomPicker, setShowRoomPicker] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [showBroadcast, setShowBroadcast] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [attendees, setAttendees]         = useState([]);

  const [formData, setFormData] = useState({
    title: '', date: '', end_date: '', location: '', description: '',
    lecturerName: '', qrFile: null, certFile: null, coverFile: null,
    room_id: null, room_name: ''
  });
  const [adminForm, setAdminForm]       = useState({ name: '', email: '', password: '' });
  const [createCommIds, setCreateCommIds] = useState([]);
  const [detailCommIds, setDetailCommIds] = useState([]);
  const [savingComms, setSavingComms]   = useState(false);
  const [saveCommsMsg, setSaveCommsMsg] = useState('');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (user.role === 'student') { navigate('/home'); return; }
    fetchStats(); fetchEvents(); fetchRooms(); fetchPendingUsers();
  }, []);

  const fetchStats        = () => fetch(`${API}/api/admin/stats`).then(r => r.json()).then(setStats).catch(console.error);
  const fetchEvents       = () => fetch(`${API}/api/events`).then(r => r.json()).then(setEvents).catch(console.error);
  const fetchPendingUsers = () => fetch(`${API}/api/admin/pending-users`).then(r => r.json()).then(setPendingUsers).catch(console.error);
  const fetchRooms        = () => fetch(`${API}/api/rooms`).then(r => r.json()).then(setRooms).catch(console.error);

  const fetchAttendees = async (eventId) => {
    try {
      const res  = await fetch(`${API}/api/admin/attendees/${eventId}`);
      const data = await res.json();
      setAttendees(data);
    } catch (err) { console.error(err); }
  };

  const handleMarkAttendance = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Attended' ? 'Registered' : 'Attended';
    try {
      await fetch(`${API}/api/mark-attendance`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, event_id: selectedEvent.id, status: newStatus }),
      });
      setAttendees(prev => prev.map(a => a.id === userId ? { ...a, status: newStatus } : a));
    } catch (err) { console.error('Attendance error:', err); }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setDetailCommIds([]);
    setSaveCommsMsg('');
    fetchAttendees(event.id);
    setShowEventDetails(true);
  };

  const handleSaveCommunityLinks = async () => {
    if (!selectedEvent || !user) return;
    setSavingComms(true); setSaveCommsMsg('');
    try {
      const res  = await fetch(`${API}/api/admin/events/${selectedEvent.id}/communities`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ community_ids: detailCommIds, admin_id: user.id }),
      });
      const data = await res.json();
      setSaveCommsMsg(res.ok ? (data.message || '✓ Saved!') : `Error: ${data.error || 'unknown'}`);
    } catch (err) { setSaveCommsMsg('Error saving — check server.'); }
    setSavingComms(false);
  };

  const handleRoomSelection = (room) => {
    setFormData({ ...formData, room_id: room.id, room_name: room.room_name, location: `${room.room_name}, ${room.building}` });
    setShowRoomPicker(false); setShowModal(true);
  };

  const handleCheckAvailability = () => {
    if (!formData.date || !formData.end_date) { alert('Please select both start and end times first'); return; }
    if (new Date(formData.end_date) <= new Date(formData.date)) { alert('End time must be after start time'); return; }
    setShowModal(false); setShowRoomPicker(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!formData.date || !formData.end_date) { alert('Please select both start and end times'); return; }
    if (new Date(formData.end_date) <= new Date(formData.date)) { alert('End time must be after start time'); return; }
    try {
      const res = await fetch(`${API}/api/admin/events`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title, date: formData.date, end_date: formData.end_date,
          location: formData.location, description: formData.description,
          category: 'Academic', color: '#961c46',
          speaker_name: formData.lecturerName || 'TBA',
          room_id: formData.room_id, communities: createCommIds, created_by: user?.id
        })
      });
      const data = await res.json();
      if (res.status === 409) { alert(`⚠️ BOOKING CONFLICT!\n\n${data.message}`); return; }
      const eventId = data.id;
      if (eventId) {
        if (formData.qrFile) { const fd = new FormData(); fd.append('file', formData.qrFile); await fetch(`${API}/api/admin/upload-qr/${eventId}`, { method: 'POST', body: fd }); }
        if (formData.certFile) { const fd = new FormData(); fd.append('file', formData.certFile); await fetch(`${API}/api/admin/upload-template/${eventId}`, { method: 'POST', body: fd }); }
        if (formData.coverFile) { const fd = new FormData(); fd.append('file', formData.coverFile); await fetch(`${API}/api/admin/upload-cover/${eventId}`, { method: 'POST', body: fd }); }
        if (createCommIds.length > 0) {
          await fetch(`${API}/api/admin/events/${eventId}/communities`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ community_ids: createCommIds, admin_id: user?.id }),
          });
        }
        alert("✅ Event Created Successfully!");
        setShowModal(false); setCreateCommIds([]);
        setFormData({ title: '', date: '', end_date: '', location: '', description: '', lecturerName: '', qrFile: null, certFile: null, coverFile: null, room_id: null, room_name: '' });
        fetchEvents(); fetchStats();
      } else { throw new Error("Server did not return an event ID"); }
    } catch (err) { console.error("Event Creation Failed:", err); alert("❌ Error creating event. Check server connection."); }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    await fetch(`${API}/api/admin/create-admin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(adminForm) });
    alert("New Admin Created!"); setShowAdminModal(false);
  };

  const isSameDay = (d1, d2) => {
    const a = new Date(d1), b = new Date(d2);
    return a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear();
  };

  const selectedDateEvents = events.filter(ev => isSameDay(ev.time, date));
  const pastEvents = events.filter(ev => {
    const end = ev.end_time ? new Date(ev.end_time) : new Date(ev.time);
    return end < new Date();
  });

  const handleApprove = async (id, e) => { e.stopPropagation(); await fetch(`${API}/api/admin/approve-user/${id}`, { method: 'PUT' }); alert("User Approved!"); fetchPendingUsers(); };

  const handleDeleteEvent = async (id, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      const res = await fetch(`${API}/api/admin/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) { fetchEvents(); fetchStats(); } else { alert(data.message || 'Delete failed.'); }
    } catch (err) { alert('Network error — check server.'); }
  };

  const toggleExpand = (id) => setExpandedRequestId(expandedRequestId === id ? null : id);

  const eventRowDeleteBtn = (ev) => (
    <button
      onClick={(e) => handleDeleteEvent(ev.id, ev.title, e)}
      style={{ background: '#fff0f0', border: '1.5px solid #f5c6cb', borderRadius: 8, color: '#dc3545', cursor: 'pointer', padding: '5px 9px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, transition: 'all 0.15s' }}
      onMouseEnter={e => { e.currentTarget.style.background='#dc3545'; e.currentTarget.style.color='#fff'; }}
      onMouseLeave={e => { e.currentTarget.style.background='#fff0f0'; e.currentTarget.style.color='#dc3545'; }}
    >
      <FaTrash style={{fontSize:11}} /> Delete
    </button>
  );

  const eventThumb = (ev) => (
    <div style={{
      width: 42, height: 42, borderRadius: 8, flexShrink: 0,
      background: ev.cover_image ? 'transparent' : (ev.color || '#961c46'),
      backgroundImage: ev.cover_image ? `url(${ev.cover_image})` : 'none',
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
    }}>
      {!ev.cover_image && '✨'}
    </div>
  );

  return (
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>

      {/* ── SIDEBAR ── */}
      <aside className="sidebar">
        <div className="brand-logo">E<span>.</span></div>
        <nav className="nav-icons">
          <div className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')} title="Dashboard"><FaHome /></div>
          {userRole === 'admin' && (
            <div className={`nav-item ${activeView === 'users' ? 'active' : ''}`} onClick={() => setActiveView('users')} title="User Requests">
              <div style={{ position: 'relative' }}><FaUsers />{pendingUsers.length > 0 && <span className="sidebar-badge">{pendingUsers.length}</span>}</div>
            </div>
          )}
          {/* ── Reports nav item ── */}
          <div
            className={`nav-item ${activeView === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveView('reports')}
            title="Event Reports"
            style={{ position: 'relative' }}
          >
            <FaFileAlt />
          </div>
          {userRole === 'admin' && <div className="nav-item" onClick={() => setShowAdminModal(true)} title="Create Admin"><FaUserPlus /></div>}
          <div className="nav-item" onClick={() => navigate('/home')} title="Go to Main Site"><FaExternalLinkAlt /></div>
          <div className="nav-item logout" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }} title="Logout"><FaSignOutAlt /></div>
        </nav>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1>{activeView === 'reports' ? 'Event Reports' : activeView === 'users' ? 'User Approvals' : 'Dashboard'}</h1>
            <p>Welcome, {userRole}</p>
          </div>
          <div className="header-right">
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>{darkMode ? <FaSun /> : <FaMoon />}</button>
            <button className="add-event-btn" onClick={() => { setCreateCommIds([]); setShowModal(true); }}><FaPlus /> New Event</button>
            <div className="profile-pic"><FaUserCircle /></div>
          </div>
        </header>

        {/* ── DASHBOARD VIEW ── */}
        {activeView === 'dashboard' && (
          <div className="content-grid">
            <div className="left-col">
              <div className="card calendar-card"><Calendar onChange={setDate} value={date} className="custom-calendar" /></div>
              <div className="stats-mini-row">
                <div className="mini-stat"><span>{stats.users}</span><label>Users</label></div>
                <div className="mini-stat"><span>{events.length}</span><label>Events</label></div>
                <div className="mini-stat highlight"><span>{stats.registrations}</span><label>Tickets</label></div>
              </div>
            </div>

            <div className="right-col">
              <div className="schedule-section">
                <div className="section-head"><h3>📅 Events on {date.toDateString()}</h3></div>
                <div className="event-list-scroll">
                  {selectedDateEvents.length > 0 ? selectedDateEvents.map(ev => (
                    <div key={ev.id} className="event-row highlight-row" onClick={() => handleEventClick(ev)}>
                      <div className="event-left" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {eventThumb(ev)}
                        <div>
                          <h4 style={{ margin: 0 }}>{ev.title}</h4>
                          <p style={{ margin: '2px 0 0' }}>{new Date(ev.time).toLocaleString()} — {ev.end_time ? new Date(ev.end_time).toLocaleTimeString() : 'No End Time'}</p>
                          {ev.room_name && <p style={{ fontSize: '11px', color: '#961c46', margin: 0 }}><FaDoorOpen /> {ev.room_name}</p>}
                        </div>
                      </div>
                      <div className="event-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="status-tag active">Manage</span>
                        {eventRowDeleteBtn(ev)}
                      </div>
                    </div>
                  )) : <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>No events scheduled</p>}
                </div>
              </div>

              <div className="schedule-section history-section">
                <div className="section-head"><h3><FaHistory /> Past Events</h3></div>
                <div className="event-list-scroll">
                  {pastEvents.map(ev => (
                    <div key={ev.id} className="event-row past-row" onClick={() => handleEventClick(ev)}>
                      <div className="event-left" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {eventThumb(ev)}
                        <div>
                          <h4 style={{ margin: 0 }}>{ev.title}</h4>
                          <p style={{ fontSize: 11, color: '#666', margin: '2px 0 0' }}>{new Date(ev.time).toDateString()}</p>
                          {ev.room_name && <p style={{ fontSize: '10px', color: '#888', margin: 0 }}><FaDoorOpen /> {ev.room_name}</p>}
                        </div>
                      </div>
                      <div className="event-right" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="status-tag" style={{ background: '#eee', color: '#555' }}>Completed</span>
                        {eventRowDeleteBtn(ev)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS VIEW ── */}
        {activeView === 'users' && userRole === 'admin' && (
          <div className="requests-container">
            <h3>Pending Approvals</h3>
            {pendingUsers.map(req => (
              <div key={req.id} className="request-card" onClick={() => toggleExpand(req.id)}>
                <div className="request-header"><h4>{req.name} ({req.role})</h4><FaChevronDown /></div>
                {expandedRequestId === req.id && (
                  <div className="request-details">
                    <p>{req.email}</p>
                    <button className="approve-btn" onClick={(e) => handleApprove(req.id, e)}>Approve</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── REPORTS VIEW ── */}
        {activeView === 'reports' && (
          <AdminReportsPanel events={events} />
        )}
      </main>

      {/* ── ROOM AVAILABILITY PICKER ── */}
      {showRoomPicker && (
        <RoomAvailabilityModal
          startTime={formData.date} endTime={formData.end_date}
          onSelectRoom={handleRoomSelection}
          onClose={() => setShowRoomPicker(false)}
        />
      )}

      {/* ── LIVE PROJECTOR ── */}
      {showProjector && selectedEvent && (
        <DynamicProjector eventId={selectedEvent.id} onClose={() => setShowProjector(false)} />
      )}

      {/* ── EVENT DETAILS MODAL ── */}
      {showEventDetails && selectedEvent && !showProjector && (
        <div className="modal-overlay">
          <div className="modal-box large-modal" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{
              width: '100%', height: selectedEvent.cover_image ? 160 : 8,
              background: selectedEvent.cover_image ? `url(${selectedEvent.cover_image}) center/cover no-repeat` : (selectedEvent.color || '#961c46'),
              position: 'relative', flexShrink: 0,
            }}>
              {selectedEvent.cover_image && (
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.55))', display: 'flex', alignItems: 'flex-end', padding: '14px 18px' }}>
                  <h3 style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 800, textShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>{selectedEvent.title}</h3>
                </div>
              )}
              <span className="close-x" onClick={() => setShowEventDetails(false)} style={{ position: 'absolute', top: 10, right: 14, color: selectedEvent.cover_image ? '#fff' : '#961c46', fontSize: 22, cursor: 'pointer', background: 'rgba(0,0,0,0.18)', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</span>
            </div>

            <div style={{ padding: '16px 20px 20px', overflowY: 'auto', maxHeight: '75vh' }}>
              {!selectedEvent.cover_image && (
                <div className="modal-header" style={{ padding: 0, marginBottom: 12 }}><h3>{selectedEvent.title}</h3></div>
              )}
              <div className="event-summary-box">
                <p><FaClock /> {new Date(selectedEvent.time).toLocaleString()} - {selectedEvent.end_time ? new Date(selectedEvent.end_time).toLocaleTimeString() : 'N/A'}</p>
                <p><FaMapMarkerAlt /> {selectedEvent.location}</p>
                {selectedEvent.room_name && <p><FaDoorOpen /> {selectedEvent.room_name}</p>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center', marginBottom: 20, alignItems: 'center' }}>
                <button onClick={() => setShowProjector(true)} className="add-event-btn" style={{ width: '85%', height: '55px', display: 'flex', justifyContent: 'center', gap: '10px', fontSize: '16px' }}>
                  <FaVideo /> Start Live Attendance
                </button>

                <p style={{ margin: 0, fontSize: 12, color: '#961c46' }}>OR</p>

                <a href={`${API}/static/uploads/qr_${selectedEvent.id}.png`} download={`Event_QR_${selectedEvent.id}.png`}
                  style={{ textDecoration: 'none', color: '#961c46', background: '#fff0f5', padding: '12px 25px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', border: '1px solid #961c46', width: '60%', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <FaDownload /> Download Static QR
                </a>

                <p style={{ margin: 0, fontSize: 12, color: '#961c46' }}>OR</p>

                <button
                  onClick={() => setShowBroadcast(true)}
                  style={{ width: '85%', height: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: '15px', fontWeight: 700, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 15px rgba(79,70,229,0.3)' }}
                >
                  <FaBullhorn /> Broadcast Notification
                </button>

                {new Date(selectedEvent.end_time || selectedEvent.time) < new Date() && (
                  <>
                    <p style={{ margin: 0, fontSize: 12, color: '#961c46' }}>OR</p>
                    <button onClick={() => setShowWinnerModal(true)} style={{ width: '85%', height: '55px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #f5c518 0%, #e6a817 100%)', color: '#2d1520', border: 'none', borderRadius: 12, cursor: 'pointer', boxShadow: '0 4px 15px rgba(245,197,24,0.35)' }}>
                      <FaTrophy /> Tag Winners
                    </button>
                  </>
                )}
              </div>

              {/* Winners podium preview */}
              {attendees.some(a => a.winner_tag) && (
                <div style={{ marginBottom: 18, padding: '14px 16px', background: 'linear-gradient(135deg,#fffdf0,#fff8e1)', border: '1.5px solid #f5c518', borderRadius: 14 }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 700, color: '#b8860b', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaTrophy style={{ color: '#f5c518' }} /> Event Winners
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 10 }}>
                    {['Runner-up', 'Winner', 'Third Place'].map((tag, i) => {
                      const heights = [65, 88, 48];
                      const p = attendees.find(a => a.winner_tag === tag);
                      const s = TAG_STYLES[tag];
                      return (
                        <div key={tag} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{ fontSize: 11, fontWeight: p ? 700 : 400, color: p ? '#2d1520' : '#ccc', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p ? p.name : '—'}</div>
                          <div style={{ background: p ? s.bg : '#f5f5f5', border: `2px solid ${p ? s.border : '#e0e0e0'}`, borderRadius: '6px 6px 0 0', height: heights[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: i === 1 ? 28 : 22 }}>{s.icon}</div>
                          <div style={{ background: p ? s.border : '#ddd', color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 0', borderRadius: '0 0 4px 4px' }}>{tag}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Attendance table */}
              <div className="attendance-section">
                <h4>Registered Students ({attendees.length})</h4>
                <div className="table-wrapper">
                  <table className="attendance-table">
                    <thead><tr><th>Name</th><th>Status</th><th>Award</th></tr></thead>
                    <tbody>
                      {attendees.map((student, index) => (
                        <tr key={index}>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: 13 }}>{student.name}</div>
                            <div style={{ fontSize: 10, color: '#aaa' }}>{student.email}</div>
                          </td>
                          <td>
                            <button onClick={() => handleMarkAttendance(student.id, student.status)}
                              style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, background: student.status === 'Attended' ? '#e6f9ed' : '#fff3cd', color: student.status === 'Attended' ? '#1a7a3c' : '#856404', border: `1.5px solid ${student.status === 'Attended' ? '#b7ebc8' : '#ffeeba'}`, transition: 'all 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                              <FaUserCheck style={{ fontSize: 10 }} />
                              {student.status === 'Attended' ? 'Attended' : 'Registered'}
                            </button>
                          </td>
                          <td>
                            {student.winner_tag ? (
                              <span style={{ fontSize: 11, fontWeight: 700, borderRadius: 999, padding: '3px 10px', background: TAG_STYLES[student.winner_tag]?.bg || '#f5f5f5', color: TAG_STYLES[student.winner_tag]?.color || '#555', border: `1px solid ${TAG_STYLES[student.winner_tag]?.border || '#ccc'}` }}>
                                {TAG_STYLES[student.winner_tag]?.icon} {student.winner_tag}
                              </span>
                            ) : <span style={{ color: '#ccc', fontSize: 12 }}>—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Community assignment */}
              <div style={{ marginTop: 16, padding: 16, background: '#fdf6f8', borderRadius: 12, border: '1px solid #f5dce4' }}>
                <CommunitySelector eventId={selectedEvent.id} selectedIds={detailCommIds} onChange={setDetailCommIds} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <button onClick={handleSaveCommunityLinks} disabled={savingComms}
                    style={{ padding: '9px 22px', borderRadius: 10, border: 'none', background: savingComms ? '#e0b0be' : '#b5174e', color: '#fff', fontWeight: 700, fontSize: 13, cursor: savingComms ? 'not-allowed' : 'pointer' }}>
                    {savingComms ? 'Saving…' : '💾 Save Community Links'}
                  </button>
                  {saveCommsMsg && (
                    <span style={{ fontSize: 12, fontWeight: 600, color: saveCommsMsg.startsWith('Error') ? '#dc3545' : '#28a745' }}>{saveCommsMsg}</span>
                  )}
                </div>
              </div>

              {/* ── Scheduled Reminders ── */}
              <ScheduledRemindersPanel event={selectedEvent} />

            </div>
          </div>
        </div>
      )}

      {/* ── CREATE EVENT MODAL ── */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: '500px' }}>
            <h3>Create New Event</h3>
            <form onSubmit={handleCreateEvent}>
              <input placeholder="Event Title" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <div style={{ flex: 1, minWidth: '0' }}>
                  <label style={{ fontSize: '11px', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>Start Date/Time</label>
                  <input type="datetime-local" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div style={{ flex: 1, minWidth: '0' }}>
                  <label style={{ fontSize: '11px', color: '#666', fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>End Date/Time</label>
                  <input type="datetime-local" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} required />
                </div>
              </div>

              {/* Room selection */}
              <div style={{ marginBottom: '15px', border: '2px dashed #961c46', padding: '12px', borderRadius: '8px', background: '#fff0f5' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#961c46', display: 'block', marginBottom: '8px' }}><FaDoorOpen /> Select Room/Location</label>
                {formData.room_name ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ {formData.room_name}</span>
                    <button type="button" onClick={() => setFormData({ ...formData, room_id: null, room_name: '', location: '' })} style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '5px', fontSize: '12px', cursor: 'pointer' }}>Remove</button>
                  </div>
                ) : (
                  <button type="button" onClick={handleCheckAvailability} style={{ width: '100%', padding: '10px', background: '#961c46', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>Check Room Availability</button>
                )}
              </div>

              {/* Community selector */}
              <div style={{ padding: 12, background: '#fdf6f8', borderRadius: 10, border: '1px solid #f5dce4', marginBottom: 12 }}>
                <CommunitySelector eventId={null} selectedIds={createCommIds} onChange={setCreateCommIds} />
              </div>

              <input placeholder="Additional Location Details (Optional)" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
              <textarea placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="modal-textarea" />

              <div style={{ marginBottom: 10 }}>
                <label style={{ fontSize: 12, fontWeight: 'bold', color: '#555' }}>Link Lecturer Profile (Optional):</label>
                <input placeholder="Enter Lecturer Name" value={formData.lecturerName} onChange={e => setFormData({ ...formData, lecturerName: e.target.value })} />
              </div>

              <div style={{ marginBottom: 10, border: '1px dashed #ccc', padding: 8, borderRadius: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>📷 Upload Static QR (Optional)</label>
                <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, qrFile: e.target.files[0] })} />
              </div>

              <div style={{ marginBottom: 10, border: '1px dashed #ccc', padding: 8, borderRadius: 5 }}>
                <label style={{ fontSize: 12, fontWeight: 'bold', display: 'block', marginBottom: 5 }}>📜 Upload Certificate Template (Optional)</label>
                <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, certFile: e.target.files[0] })} />
              </div>

              <div style={{ marginBottom: 20, border: '2px dashed #961c46', padding: 10, borderRadius: 8, background: '#fff8fb' }}>
                <label style={{ fontSize: 12, fontWeight: 'bold', color: '#961c46', display: 'block', marginBottom: 6 }}>🖼️ Event Cover Image (Optional)</label>
                <p style={{ fontSize: 11, color: '#b08090', margin: '0 0 8px' }}>Displays on event cards instead of the colour block.</p>
                {formData.coverFile ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <img src={URL.createObjectURL(formData.coverFile)} alt="preview" style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, border: '2px solid #961c46' }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: '#28a745' }}>✓ {formData.coverFile.name}</div>
                      <button type="button" onClick={() => setFormData({ ...formData, coverFile: null })} style={{ background: 'none', border: 'none', color: '#dc3545', fontSize: 11, cursor: 'pointer', padding: 0, marginTop: 3 }}>Remove</button>
                    </div>
                  </div>
                ) : (
                  <input type="file" accept="image/*" onChange={e => setFormData({ ...formData, coverFile: e.target.files[0] })} />
                )}
              </div>

              <button type="submit" className="save-btn">Create Event</button>
              <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* ── CREATE ADMIN MODAL ── */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>New Admin</h3>
            <form onSubmit={handleCreateAdmin}>
              <input placeholder="Name" onChange={e => setAdminForm({ ...adminForm, name: e.target.value })} />
              <input placeholder="Email" onChange={e => setAdminForm({ ...adminForm, email: e.target.value })} />
              <input placeholder="Password" type="password" onChange={e => setAdminForm({ ...adminForm, password: e.target.value })} />
              <button type="submit" className="save-btn">Create</button>
              <button type="button" onClick={() => setShowAdminModal(false)} className="cancel-btn">Cancel</button>
            </form>
          </div>
        </div>
      )}

      {/* ── BROADCAST MODAL ── */}
      {showBroadcast && selectedEvent && (
        <BroadcastModal
          event={selectedEvent}
          onClose={() => setShowBroadcast(false)}
        />
      )}

      {/* ── WINNER TAGGING MODAL ── */}
      {showWinnerModal && selectedEvent && (
        <WinnerTagModal
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          onClose={() => { setShowWinnerModal(false); fetchAttendees(selectedEvent.id); }}
        />
      )}

    </div>
  );
};

export default AdminDashboard;

// ── Shared styles for report form ─────────────────────────────────────────────
const rptLabel = {
  fontSize: 12, fontWeight: 800, color: '#3d2030',
  display: 'block', marginBottom: 5, marginTop: 12,
};
const rptInput = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  border: '1.5px solid #f0d8e4', fontSize: 14, color: '#1a0a12',
  boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
  marginBottom: 4,
};