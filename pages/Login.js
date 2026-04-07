import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole]     = useState('student');
  const [view, setView]     = useState('login'); // 'login' | 'forgot' | 'reset'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [remember, setRemember]   = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg]     = useState('');
  const [resetData, setResetData]     = useState({ token: '', password: '', confirm: '' });
  const [resetMsg, setResetMsg]       = useState('');

  // On mount: restore remembered email
  useEffect(() => {
    const saved = localStorage.getItem('remembered_email');
    if (saved) { setFormData(f => ({ ...f, email: saved })); setRemember(true); }
  }, []);

  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await fetch('https://backendcems.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        if (remember) {
          localStorage.setItem('remembered_email', formData.email);
        } else {
          localStorage.removeItem('remembered_email');
        }
        // Store in sessionStorage if not "remember me", localStorage if remember me
        const store = remember ? localStorage : sessionStorage;
        store.setItem('user', JSON.stringify(data.user));
        // Always keep localStorage in sync so the rest of the app works
        localStorage.setItem('user', JSON.stringify(data.user));

        if (data.user.role === 'admin') navigate('/admin');
        else navigate('/home');
      } else {
        alert(data.message || 'Invalid credentials');
      }
    } catch { alert('Error connecting to server.'); }
    setLoading(false);
  };

  // ── FORGOT PASSWORD ────────────────────────────────────────────────────────
  const handleForgot = async e => {
    e.preventDefault();
    setLoading(true); setForgotMsg('');
    try {
      const res  = await fetch('https://backendcems.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      setForgotMsg(res.ok
        ? '✅ Reset link sent! Check your email.'
        : (data.message || '❌ Email not found.'));
    } catch { setForgotMsg('❌ Server error. Try again later.'); }
    setLoading(false);
  };

  // ── RESET PASSWORD ─────────────────────────────────────────────────────────
  const handleReset = async e => {
    e.preventDefault();
    if (resetData.password !== resetData.confirm) { setResetMsg('❌ Passwords do not match.'); return; }
    if (resetData.password.length < 6) { setResetMsg('❌ Password must be at least 6 characters.'); return; }
    setLoading(true); setResetMsg('');
    try {
      const res  = await fetch('https://backendcems.onrender.com/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetData.token, password: resetData.password }),
      });
      const data = await res.json();
      if (res.ok) {
        setResetMsg('✅ Password reset! You can now log in.');
        setTimeout(() => setView('login'), 2000);
      } else {
        setResetMsg(data.message || '❌ Invalid or expired token.');
      }
    } catch { setResetMsg('❌ Server error.'); }
    setLoading(false);
  };

  const isAdmin = role === 'admin';

  return (
    <div className="login-wrapper">
      <div className="login-card">

        {/* ── LEFT: FORM ── */}
        <div className="login-form-section">

          {/* ROLE TOGGLE */}
          {view === 'login' && (
            <div className="role-toggle-container">
              <button type="button" className={`role-btn ${!isAdmin ? 'active' : ''}`} onClick={() => setRole('student')}>Student</button>
              <button type="button" className={`role-btn ${isAdmin  ? 'active' : ''}`} onClick={() => setRole('admin')}>Admin</button>
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {view === 'login' && (
            <>
              <div className="user-avatar">{isAdmin ? '🛡️' : '👤'}</div>
              <h2 style={{ color: isAdmin ? '#1a1a2e' : '#961c46' }}>
                {isAdmin ? 'ADMIN LOGIN' : 'STUDENT LOGIN'}
              </h2>
              <form onSubmit={handleLogin}>
                <div className="input-container">
                  <span className="input-icon">📧</span>
                  <input type="email" name="email" placeholder="EMAIL"
                    value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input type="password" name="password" placeholder="PASSWORD"
                    value={formData.password} onChange={handleChange} required />
                </div>
                <div className="form-links">
                  <label className="remember-me">
                    <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)} />
                    Remember me
                  </label>
                  <span className="forgot-pass" onClick={() => setView('forgot')}>Forgot password?</span>
                </div>
                <button type="submit" className={`login-btn ${isAdmin ? 'admin-theme' : ''}`} disabled={loading}>
                  {loading ? 'Signing in…' : 'LOGIN'}
                </button>
              </form>
              <div style={{ marginTop: 20, textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: '#d65db1', cursor: 'pointer', fontWeight: 'bold' }}
                  onClick={() => navigate('/lecturer-signup')}>
                  Are you a Lecturer? Apply Here →
                </span>
              </div>
            </>
          )}

          {/* ── FORGOT PASSWORD FORM ── */}
          {view === 'forgot' && (
            <>
              <div className="user-avatar">📧</div>
              <h2 style={{ color: '#961c46' }}>FORGOT PASSWORD</h2>
              <p style={{ fontSize: 13, color: '#888', textAlign: 'center', marginBottom: 20, lineHeight: 1.5 }}>
                Enter your registered email and we'll send you a reset link.
              </p>
              <form onSubmit={handleForgot}>
                <div className="input-container">
                  <span className="input-icon">📧</span>
                  <input type="email" placeholder="YOUR EMAIL"
                    value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} required />
                </div>
                {forgotMsg && (
                  <p style={{ fontSize: 13, textAlign: 'center', color: forgotMsg.startsWith('✅') ? '#28a745' : '#dc3545', marginBottom: 10 }}>
                    {forgotMsg}
                  </p>
                )}
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Sending…' : 'SEND RESET LINK'}
                </button>
              </form>
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: '#961c46', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setView('login')}>← Back to Login</span>
              </div>
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <span style={{ fontSize: 12, color: '#888', cursor: 'pointer' }}
                  onClick={() => setView('reset')}>Already have a token? Reset now →</span>
              </div>
            </>
          )}

          {/* ── RESET PASSWORD FORM ── */}
          {view === 'reset' && (
            <>
              <div className="user-avatar">🔑</div>
              <h2 style={{ color: '#961c46' }}>RESET PASSWORD</h2>
              <form onSubmit={handleReset}>
                <div className="input-container">
                  <span className="input-icon">🔑</span>
                  <input type="text" placeholder="RESET TOKEN (from email)"
                    value={resetData.token} onChange={e => setResetData({ ...resetData, token: e.target.value })} required />
                </div>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input type="password" placeholder="NEW PASSWORD"
                    value={resetData.password} onChange={e => setResetData({ ...resetData, password: e.target.value })} required />
                </div>
                <div className="input-container">
                  <span className="input-icon">🔒</span>
                  <input type="password" placeholder="CONFIRM PASSWORD"
                    value={resetData.confirm} onChange={e => setResetData({ ...resetData, confirm: e.target.value })} required />
                </div>
                {resetMsg && (
                  <p style={{ fontSize: 13, textAlign: 'center', color: resetMsg.startsWith('✅') ? '#28a745' : '#dc3545', marginBottom: 10 }}>
                    {resetMsg}
                  </p>
                )}
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Resetting…' : 'RESET PASSWORD'}
                </button>
              </form>
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <span style={{ fontSize: 13, color: '#961c46', cursor: 'pointer', fontWeight: 600 }}
                  onClick={() => setView('login')}>← Back to Login</span>
              </div>
            </>
          )}

        </div>

        {/* ── RIGHT: WELCOME PANEL ── */}
        <div className={`login-text-section ${isAdmin ? 'admin-bg' : ''}`}>
          <h1>
            {view === 'forgot' ? 'Reset Access.' : view === 'reset' ? 'New Password.' : isAdmin ? 'Admin Portal.' : 'Welcome.'}
          </h1>
          <p>
            {view === 'forgot' || view === 'reset'
              ? 'Forgot your password? No worries — we\'ll get you back in quickly and securely.'
              : isAdmin
                ? 'Access the Eventi Command Center to manage events, track registrations, and view platform analytics.'
                : 'Please log in to access the student portal and manage your profile, payments, and notifications.'}
          </p>
          {view === 'login' && !isAdmin && (
            <p className="signup-prompt">
              Not a member? <span onClick={() => navigate('/register')}>Sign up now</span>
            </p>
          )}
        </div>

      </div>
    </div>
  );
};

export default Login;