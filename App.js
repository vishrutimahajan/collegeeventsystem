import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Account from './pages/Account';
import EditProfile from './pages/EditProfile';
import PaymentMethods from './pages/PaymentMethods';
import HelpSupport from './pages/HelpSupport';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import LecturerProfile from './pages/LecturerProfile';
import EventRegister from './pages/EventRegister';
import MyEvents from './pages/MyEvents';
import TicketPage from './pages/TicketPage';
import AdminDashboard from './pages/AdminDashboard';
import LecturerSignup from './pages/LecturerSignup';
import Communityapp from "./pages/Community";
import ReportsPage from './pages/ReportsPage';
function App() {
  return (
    <div className="App">

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/login" element={<Login />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/payment-methods" element={<PaymentMethods />} />
        <Route path="/help-support" element={<HelpSupport />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/home" element={<Home />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/lecturer/:id" element={<LecturerProfile />} />
        <Route path="/register-event/:id" element={<EventRegister />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/ticket/:id" element={<TicketPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/lecturer-signup" element={<LecturerSignup />} />
        <Route path="/communities" element={<Communityapp />} />
        <Route path="/reports" element={<ReportsPage />} />
      </Routes>
    
    </div>
  );
}

export default App;