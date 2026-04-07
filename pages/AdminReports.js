import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaPlus, FaTrash, FaImage, FaTimes, FaEdit, FaCheck } from 'react-icons/fa';

const API = 'https://backendcems.onrender.com/';

// ── Spinner ───────────────────────────────────────────────────────────────────
const Spinner = () => (
  <span style={{
    display: 'inline-block', width: 14, height: 14,
    border: '2px solid rgba(255,255,255,0.4)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
    verticalAlign: 'middle', marginRight: 6,
  }} />
);

// ── ReportFormModal ───────────────────────────────────────────────────────────
const ReportFormModal = ({ events, editReport, onClose, onSaved }) => {
  const [eventId, setEventId]   = useState(editReport?.event_id || '');
  const [title, setTitle]       = useState(editReport?.title || '');
  const [content, setContent]   = useState(editReport?.content || '');
  const [images, setImages]     = useState([]);           // new File objects
  const [existingImgs, setExistingImgs] = useState(editReport?.images || []);
  const [aiLoading, setAiLoading] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState('');
  const fileRef = useRef();

  const selectedEvent = events.find(e => String(e.id) === String(eventId));

  // ── AI Generate ──────────────────────────────────────────────────────────
  const handleAIGenerate = async () => {
    if (!selectedEvent) { setError('Please select an event first.'); return; }
    setAiLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/reports/ai-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event_id: selectedEvent.id }),
      });
      const data = await res.json();
      if (data.title)   setTitle(data.title);
      if (data.content) setContent(data.content);
    } catch {
      setError('AI generation failed. Check server connection.');
    }
    setAiLoading(false);
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!eventId || !title.trim() || !content.trim()) {
      setError('Event, title, and content are required.');
      return;
    }
    setSaving(true);
    setError('');
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
      onSaved();
      onClose();
    } catch (e) {
      setError(e.message || 'Save failed.');
    }
    setSaving(false);
  };

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 2000,
          background: 'rgba(15,5,10,0.55)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16,
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: '#fff', borderRadius: 20,
            width: '100%', maxWidth: 560,
            maxHeight: '92vh', overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
          }}
        >
          {/* Modal header */}
          <div style={{
            padding: '18px 20px 14px',
            borderBottom: '1px solid #f0e8ec',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            position: 'sticky', top: 0, background: '#fff', zIndex: 1,
            borderRadius: '20px 20px 0 0',
          }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: '#1a0a12' }}>
              {editReport ? '✏️ Edit Report' : '📋 New Event Report'}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 20, color: '#961c46', lineHeight: 1 }}>
              <FaTimes />
            </button>
          </div>

          <div style={{ padding: '16px 20px 24px' }}>
            {error && (
              <div style={{
                background: '#fff0f5', border: '1px solid #f5c6d5',
                borderRadius: 10, padding: '10px 14px', marginBottom: 14,
                fontSize: 13, color: '#961c46',
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Event selector */}
            <label style={labelStyle}>Select Event *</label>
            <select
              value={eventId}
              onChange={e => setEventId(e.target.value)}
              style={inputStyle}
            >
              <option value="">— Choose an event —</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>

            {/* AI generate button */}
            <button
              type="button"
              onClick={handleAIGenerate}
              disabled={aiLoading || !eventId}
              style={{
                width: '100%', padding: '12px',
                background: aiLoading || !eventId
                  ? '#e0d0d8'
                  : 'linear-gradient(135deg, #7c3aed, #961c46)',
                color: '#fff', border: 'none',
                borderRadius: 12, fontSize: 14, fontWeight: 800,
                cursor: aiLoading || !eventId ? 'not-allowed' : 'pointer',
                marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                transition: 'opacity 0.15s',
              }}
            >
              {aiLoading ? <><Spinner />Generating…</> : <><FaRobot />✨ AI Generate Report</>}
            </button>

            {/* Title */}
            <label style={labelStyle}>Report Title *</label>
            <input
              placeholder="e.g. Annual Music Fest 2025 – Highlights"
              value={title}
              onChange={e => setTitle(e.target.value)}
              style={inputStyle}
            />

            {/* Content */}
            <label style={labelStyle}>Report Content *</label>
            <textarea
              placeholder="Write the event summary, highlights, outcomes…"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={7}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
            />

            {/* Image upload */}
            <label style={labelStyle}>📷 Upload Photos</label>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: '2px dashed #f5c6d5', borderRadius: 12,
                padding: '14px 16px', textAlign: 'center',
                cursor: 'pointer', marginBottom: 12,
                background: '#fff8fb', color: '#b08090', fontSize: 13,
              }}
            >
              <FaImage style={{ marginBottom: 4, fontSize: 20 }} />
              <div>Click to add images</div>
              <div style={{ fontSize: 11, marginTop: 2 }}>JPG, PNG, WebP · Multiple allowed</div>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              onChange={e => setImages(prev => [...prev, ...Array.from(e.target.files)])}
            />

            {/* Preview new images */}
            {images.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                {images.map((f, i) => (
                  <div key={i} style={{ position: 'relative' }}>
                    <img
                      src={URL.createObjectURL(f)}
                      alt="preview"
                      style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, border: '2px solid #f5c6d5' }}
                    />
                    <button
                      onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                      style={{
                        position: 'absolute', top: -6, right: -6,
                        width: 20, height: 20, borderRadius: '50%',
                        background: '#dc3545', color: '#fff', border: 'none',
                        cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Existing images (edit mode) */}
            {existingImgs.length > 0 && (
              <div>
                <label style={{ ...labelStyle, marginBottom: 6 }}>Existing Photos</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                  {existingImgs.map((img, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img
                        src={`${API}/${img}`}
                        alt="existing"
                        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 10, border: '2px solid #f5c6d5' }}
                      />
                      <button
                        onClick={() => setExistingImgs(prev => prev.filter((_, j) => j !== i))}
                        style={{
                          position: 'absolute', top: -6, right: -6,
                          width: 20, height: 20, borderRadius: '50%',
                          background: '#dc3545', color: '#fff', border: 'none',
                          cursor: 'pointer', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{
                width: '100%', padding: '14px',
                background: saving ? '#e0d0d8' : '#961c46',
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer',
                marginBottom: 10,
              }}
            >
              {saving ? <><Spinner />Saving…</> : <><FaCheck style={{ marginRight: 6 }} />{editReport ? 'Save Changes' : 'Publish Report'}</>}
            </button>
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '12px',
                background: '#f5eef1', color: '#7a5c6a', border: 'none',
                borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ── AdminReports ──────────────────────────────────────────────────────────────
// Drop this component into the AdminDashboard's "Reports" tab.
const AdminReports = ({ events = [], adminUser }) => {
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
    if (!window.confirm('Delete this report?')) return;
    setDeleting(id);
    await fetch(`${API}/api/reports/${id}`, { method: 'DELETE' });
    setDeleting(null);
    fetchReports();
  };

  return (
    <div style={{ padding: '0 0 32px' }}>
      {/* Section header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 18,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#1a0a12' }}>📋 Event Reports</h2>
          <p style={{ margin: '2px 0 0', fontSize: 13, color: '#b08090' }}>
            Create post-event summaries visible to all students.
          </p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          style={{
            background: '#961c46', color: '#fff', border: 'none',
            padding: '10px 16px', borderRadius: 12,
            fontSize: 13, fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}
        >
          <FaPlus /> New Report
        </button>
      </div>

      {/* Reports list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#b08090' }}>⏳ Loading…</div>
      ) : reports.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: 48, color: '#b08090',
          background: '#fff', borderRadius: 16, border: '1px dashed #f0d8e4',
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
          <p style={{ margin: 0, fontWeight: 700 }}>No reports yet</p>
          <p style={{ margin: '4px 0 0', fontSize: 13 }}>
            Click "New Report" to create the first one — or use the AI button!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reports.map(report => (
            <div
              key={report.id}
              style={{
                background: '#fff', borderRadius: 16,
                border: '1px solid #f0e8ec',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                overflow: 'hidden',
              }}
            >
              {/* Thumbnail row */}
              {report.images?.length > 0 && (
                <div style={{ display: 'flex', gap: 4, height: 60, overflow: 'hidden' }}>
                  {report.images.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={`${API}/${img}`}
                      alt="thumb"
                      style={{
                        flex: '1 1 0', objectFit: 'cover', display: 'block',
                        filter: i === 3 && report.images.length > 4 ? 'brightness(0.5)' : 'none',
                      }}
                    />
                  ))}
                </div>
              )}

              <div style={{ padding: '12px 16px' }}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, color: '#961c46',
                      background: '#fff0f5', padding: '2px 8px', borderRadius: 20,
                      display: 'inline-block', marginBottom: 4,
                    }}>
                      {report.event_title}
                    </span>
                    <h4 style={{
                      margin: 0, fontSize: 14, fontWeight: 800, color: '#1a0a12',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {report.title}
                    </h4>
                    <p style={{
                      margin: '4px 0 0', fontSize: 12, color: '#7a5c6a',
                      overflow: 'hidden', textOverflow: 'ellipsis',
                      display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {report.content}
                    </p>
                    <span style={{ fontSize: 11, color: '#b08090', display: 'block', marginTop: 6 }}>
                      📅 {report.created_at ? new Date(report.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      {report.images?.length > 0 && ` · 📷 ${report.images.length} photo${report.images.length > 1 ? 's' : ''}`}
                    </span>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    <button
                      onClick={() => { setEditing(report); setShowForm(true); }}
                      style={{
                        background: '#f0f4ff', color: '#4c6ef5', border: 'none',
                        padding: '6px 12px', borderRadius: 8,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      disabled={deleting === report.id}
                      style={{
                        background: '#fff0f5', color: '#dc3545', border: 'none',
                        padding: '6px 12px', borderRadius: 8,
                        fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <FaTrash /> {deleting === report.id ? '…' : 'Delete'}
                    </button>
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
    </div>
  );
};

export default AdminReports;

// ── Shared styles ─────────────────────────────────────────────────────────────
const labelStyle = {
  fontSize: 12, fontWeight: 800, color: '#3d2030',
  display: 'block', marginBottom: 5, marginTop: 12,
};

const inputStyle = {
  width: '100%', padding: '10px 12px', borderRadius: 10,
  border: '1.5px solid #f0d8e4', fontSize: 14, color: '#1a0a12',
  boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit',
  marginBottom: 4,
};