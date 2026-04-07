import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://backendcems.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Account Created Successfully! 🎉\nPlease Login.");
        navigate('/login');
      } else {
        alert(data.message);
      }
    } catch (err) { alert("Server Error"); }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Account 🚀</h2>
        <p>Join the campus community.</p>

        <form onSubmit={handleRegister}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input type="text" name="name" placeholder="e.g. Rahul Verma" required onChange={handleChange} />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input type="email" name="email" placeholder="student@college.edu" required onChange={handleChange} />
          </div>
          
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" name="password" placeholder="••••••••" required onChange={handleChange} />
          </div>
          
          <button type="submit" className="register-btn">Create Account</button>
        </form>

        <p className="switch-text">Already have an account? <span onClick={() => navigate('/login')}>Login</span></p>
        <div className="divider"></div>
        <p className="lecturer-link" onClick={() => navigate('/lecturer-signup')}>Are you a Lecturer? Apply Here →</p>
      </div>
    </div>
  );
};

export default Register;