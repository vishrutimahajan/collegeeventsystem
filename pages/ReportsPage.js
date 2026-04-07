import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../component/BottomNav';

const API = 'https://backendcems.onrender.com';

const fmt = (iso) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '';

const CAT_COLOR = {
  Music: '#7c3aed', Sports: '#0891b2',
  Clubs: '#d63384', Academic: '#961c46', Other: '#374151',
};
const getAccent = (cat) => CAT_COLOR[cat] || CAT_COLOR.Other;

// ─────────────────────────────────────────────────────────────────────────────
// ReportCard
// ─────────────────────────────────────────────────────────────────────────────
const ReportCard = ({ report, onClick }) => {
  const ac    = getAccent(report.event_category);
  const thumb = report.images?.[0];

  return (
    <div
      onClick={() => onClick(report)}
      style={{
        background: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 1px 8px rgba(0,0,0,0.08)',
        border: '1px solid #ede4e8',
        cursor: 'pointer',
        WebkitTapHighlightColor: 'transparent',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {thumb ? (
        <img
          src={`${API}/${thumb}`}
          alt="cover"
          style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block', flexShrink: 0 }}
        />
      ) : (
        <div style={{ height: 5, background: ac, flexShrink: 0 }} />
      )}

      <div style={{ padding: '11px 13px 13px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* badge */}
        <span style={{
          display: 'inline-block', fontSize: 10, fontWeight: 700, color: ac,
          background: `${ac}18`, borderRadius: 20, padding: '2px 9px',
          marginBottom: 7, alignSelf: 'flex-start',
        }}>
          {report.event_category || 'Event'}
        </span>

        {/* title */}
        <h3 style={{
          margin: '0 0 5px', fontSize: 13, fontWeight: 800, color: '#1a0a12',
          lineHeight: 1.35, display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {report.title}
        </h3>

        {/* preview */}
        <p style={{
          margin: '0 0 10px', fontSize: 12, color: '#7a5c6a', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1,
        }}>
          {report.content}
        </p>

        {/* footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{ fontSize: 10, color: '#b08090' }}>📅 {fmt(report.created_at)}</span>
          {report.images?.length > 0 && (
            <span style={{ fontSize: 10, fontWeight: 700, color: ac, background: `${ac}15`, borderRadius: 10, padding: '2px 8px' }}>
              📷 {report.images.length}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ReportModal — proper bottom-sheet, works on both mobile & web
// ─────────────────────────────────────────────────────────────────────────────
const ReportModal = ({ report, onClose }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const ac     = getAccent(report.event_category);
  const images = report.images || [];

  // Lock background scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',      // sheet rises from bottom
        justifyContent: 'center',
      }}
    >
      {/* Sheet */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 600,             // cap width on wide screens
          maxHeight: '88vh',
          background: '#fff',
          borderRadius: '20px 20px 0 0',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Drag handle */}
        <div style={{ textAlign: 'center', padding: '10px 0 2px', flexShrink: 0 }}>
          <div style={{ display: 'inline-block', width: 36, height: 4, borderRadius: 2, background: '#ddd' }} />
        </div>

        {/* Close X */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 12, right: 16,
            background: 'rgba(0,0,0,0.08)', border: 'none',
            borderRadius: '50%', width: 30, height: 30,
            fontSize: 16, cursor: 'pointer', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: '#555', zIndex: 2,
          }}
        >×</button>

        {/* Scrollable body */}
        <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>

          {/* Header */}
          <div style={{ padding: '8px 18px 14px', borderBottom: `3px solid ${ac}` }}>
            <span style={{
              display: 'inline-block', fontSize: 11, fontWeight: 700, color: ac,
              background: `${ac}15`, borderRadius: 20, padding: '3px 10px', marginBottom: 8,
            }}>
              {report.event_category || 'Event'} · {report.event_title}
            </span>
            <h2 style={{ margin: '0 0 5px', fontSize: 17, fontWeight: 900, color: '#1a0a12', lineHeight: 1.3 }}>
              {report.title}
            </h2>
            <span style={{ fontSize: 12, color: '#b08090' }}>📅 {fmt(report.created_at)}</span>
          </div>

          {/* Image gallery */}
          {images.length > 0 && (
            <div style={{ padding: '14px 18px 0' }}>
              <img
                src={`${API}/${images[imgIdx]}`}
                alt={`img ${imgIdx + 1}`}
                style={{ width: '100%', height: 190, objectFit: 'cover', borderRadius: 12, display: 'block' }}
              />
              {images.length > 1 && (
                <div style={{ display: 'flex', gap: 7, marginTop: 8, overflowX: 'auto', paddingBottom: 2 }}>
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={`${API}/${img}`}
                      alt={`t${i}`}
                      onClick={() => setImgIdx(i)}
                      style={{
                        width: 50, height: 50, objectFit: 'cover', borderRadius: 8,
                        flexShrink: 0, cursor: 'pointer',
                        border: `2.5px solid ${i === imgIdx ? ac : 'transparent'}`,
                        opacity: i === imgIdx ? 1 : 0.5,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Report text */}
          <div style={{ padding: '16px 18px' }}>
            <p style={{
              margin: '0 0 6px', fontSize: 11, fontWeight: 800, color: ac,
              textTransform: 'uppercase', letterSpacing: 1,
            }}>
              ── Report Summary
            </p>
            <p style={{ margin: 0, fontSize: 14, color: '#2d1520', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
              {report.content}
            </p>
          </div>

          {/* Bottom close button */}
          <div style={{ padding: '4px 18px 28px' }}>
            <button
              onClick={onClose}
              style={{
                width: '100%', padding: '13px', background: ac,
                color: '#fff', border: 'none', borderRadius: 12,
                fontSize: 15, fontWeight: 700, cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ReportsPage
// ─────────────────────────────────────────────────────────────────────────────
const ReportsPage = () => {
  const navigate = useNavigate();
  const [reports,  setReports]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [selected, setSelected] = useState(null);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('All');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { navigate('/login'); return; }
    fetch(`${API}/api/reports`)
      .then(r => r.json())
      .then(data => { setReports(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [navigate]);

  const CATS = ['All', 'Academic', 'Music', 'Sports', 'Clubs'];

  const visible = reports.filter(r => {
    const q = search.toLowerCase();
    const matchSearch = !q || r.title?.toLowerCase().includes(q) || r.event_title?.toLowerCase().includes(q);
    const matchFilter = filter === 'All' || (r.event_category || 'Other') === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f0f3',
      paddingBottom: 84,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg,#961c46,#c0295f)',
        padding: '48px 16px 18px',
        position: 'sticky', top: 0, zIndex: 20,
      }}>
        <h2 style={{ margin: '0 0 1px', color: '#fff', fontSize: 19, fontWeight: 900 }}>
          📋 Event Reports
        </h2>
        <p style={{ margin: '0 0 11px', color: 'rgba(255,255,255,0.7)', fontSize: 12 }}>
          Post-event summaries &amp; highlights
        </p>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '8px 12px',
        }}>
          <span style={{ fontSize: 14, opacity: 0.8 }}>🔍</span>
          <input
            placeholder="Search reports…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              outline: 'none', color: '#fff', fontSize: 14,
            }}
          />
          {search && (
            <span
              onClick={() => setSearch('')}
              style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
            >×</span>
          )}
        </div>
      </div>

      {/* ── Category pills ── */}
      <div style={{
        display: 'flex', gap: 7, padding: '11px 14px 4px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {CATS.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            style={{
              flexShrink: 0, padding: '5px 14px', borderRadius: 20,
              border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: filter === cat ? '#961c46' : '#fff',
              color:      filter === cat ? '#fff'    : '#7a5c6a',
              boxShadow:  filter === cat
                ? '0 2px 8px rgba(150,28,70,0.3)'
                : '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >{cat}</button>
        ))}
      </div>

      {/* ── Cards ── */}
      <div style={{ padding: '10px 14px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#b08090' }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>⏳</div>
            <p style={{ margin: 0, fontSize: 14 }}>Loading reports…</p>
          </div>
        ) : visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#b08090' }}>
            <div style={{ fontSize: 38, marginBottom: 8 }}>📭</div>
            <p style={{ margin: 0, fontWeight: 700 }}>No reports found</p>
            <p style={{ margin: '4px 0 0', fontSize: 12 }}>Check back after events conclude.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            /* 1 col on phones, 2 on tablet, 3 on desktop */
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 12,
          }}>
            {visible.map(r => (
              <ReportCard key={r.id} report={r} onClick={setSelected} />
            ))}
          </div>
        )}
      </div>

      {selected && <ReportModal report={selected} onClose={() => setSelected(null)} />}
      <BottomNav />
    </div>
  );
};

export default ReportsPage;