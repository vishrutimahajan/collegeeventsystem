import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HelpSupport.css';

const HelpSupport = () => {
  const navigate = useNavigate();
  
  // State for the Contact Form
  const [formData, setFormData] = useState({
    name: "Somya", // Auto-filled for convenience
    email: "somya@example.com",
    issueType: "General Inquiry",
    message: ""
  });

  // State for FAQ toggles (which question is open?)
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleFAQ = (index) => {
    setOpenQuestion(openQuestion === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('https://backendcems.onrender.com/api/support', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      setFormData({...formData, message: ""}); // Clear message after sending
    })
    .catch(err => alert("Error sending ticket"));
  };

  const faqs = [
    { question: "How do I update my profile picture?", answer: "Go to the Account page and simply drag and drop your new image onto your current profile picture." },
    { question: "Is my payment information safe?", answer: "Yes, we use industry-standard encryption. We only store the last 4 digits of your card for verification." },
    { question: "How can I delete my account?", answer: "Please contact support using the form below, and we will process your deletion request within 24 hours." }
  ];

  return (
    <div className="help-page-wrapper">
      <div className="help-container">
        
        {/* Header */}
        <div className="help-header">
          <button className="back-btn" onClick={() => navigate('/account')}>←</button>
          <h2>Help & Support</h2>
          <div className="spacer"></div>
        </div>

        <div className="scrollable-content">
          
          {/* Section 1: FAQ */}
          <h3 className="section-title">Frequently Asked Questions</h3>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item" onClick={() => toggleFAQ(index)}>
                <div className="faq-question">
                  {faq.question}
                  <span>{openQuestion === index ? '−' : '+'}</span>
                </div>
                {openQuestion === index && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>

          {/* Section 2: Contact Form */}
          <h3 className="section-title">Contact Us</h3>
          <form onSubmit={handleSubmit} className="contact-form">
            <label>Issue Type</label>
            <select 
              value={formData.issueType}
              onChange={(e) => setFormData({...formData, issueType: e.target.value})}
            >
              <option>General Inquiry</option>
              <option>Payment Issue</option>
              <option>Bug Report</option>
              <option>Account Access</option>
            </select>

            <label>Message</label>
            <textarea 
              rows="4" 
              placeholder="Describe your issue..." 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />

            <button type="submit" className="submit-ticket-btn">Submit Ticket</button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default HelpSupport;