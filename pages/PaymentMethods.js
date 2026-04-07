import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentMethods.css'; // We will create this next

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    holderName: '',
    expiry: '',
    cvv: ''
  });

  // 1. Fetch Cards on Load
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = () => {
    fetch('https://backendcems.onrender.com/api/payment')
      .then(res => res.json())
      .then(data => setCards(data))
      .catch(err => console.error("Error fetching cards:", err));
  };

  // 2. Handle Adding a Card
  const handleAddCard = (e) => {
    e.preventDefault();
    fetch('https://backendcems.onrender.com/api/payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCard)
    })
    .then(res => res.json())
    .then(() => {
      alert("Card Added!");
      setShowForm(false); // Hide form
      setNewCard({ cardNumber: '', holderName: '', expiry: '', cvv: '' }); // Reset form
      fetchCards(); // Refresh list
    });
  };

  // 3. Handle Deleting a Card
  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to remove this card?")) {
      fetch(`https://backendcems.onrender.com/api/payment/${id}`, { method: 'DELETE' })
      .then(() => fetchCards());
    }
  };

  return (
    <div className="payment-page-wrapper">
      <div className="payment-container">
        
        {/* Header */}
        <div className="payment-header">
          <button className="back-btn" onClick={() => navigate('/')}>←</button>
          <h2>Payment Methods</h2>
          <div className="spacer"></div>
        </div>

        <div className="scrollable-content">
          
          {/* Card List */}
          <div className="cards-list">
            {cards.map(card => (
              <div key={card.id} className="credit-card">
                <div className="card-top">
                  <span className="card-type">{card.card_type}</span>
                  <button className="delete-card-btn" onClick={() => handleDelete(card.id)}>×</button>
                </div>
                <div className="card-number">•••• •••• •••• {card.last_four}</div>
                <div className="card-bottom">
                  <div className="card-info">
                    <span>Card Holder</span>
                    <strong>{card.holder_name}</strong>
                  </div>
                  <div className="card-info">
                    <span>Expires</span>
                    <strong>{card.expiry}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Button or Form */}
          {!showForm ? (
            <button className="add-card-btn" onClick={() => setShowForm(true)}>
              + Add New Card
            </button>
          ) : (
            <form onSubmit={handleAddCard} className="add-card-form">
              <h3>Add New Card</h3>
              <input 
                type="text" placeholder="Card Number" maxLength="19" required
                value={newCard.cardNumber}
                onChange={e => setNewCard({...newCard, cardNumber: e.target.value})}
              />
              <input 
                type="text" placeholder="Card Holder Name" required
                value={newCard.holderName}
                onChange={e => setNewCard({...newCard, holderName: e.target.value})}
              />
              <div className="form-row">
                <input 
                  type="text" placeholder="MM/YY" maxLength="5" required
                  value={newCard.expiry}
                  onChange={e => setNewCard({...newCard, expiry: e.target.value})}
                />
                <input 
                  type="text" placeholder="CVV" maxLength="3" required
                  value={newCard.cvv}
                  onChange={e => setNewCard({...newCard, cvv: e.target.value})}
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="save-card-btn">Save Card</button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default PaymentMethods;