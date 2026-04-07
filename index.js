import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'; // <--- IMPORT THIS

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* Wrap your entire App in BrowserRouter here */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);