// import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './screens/home/Home';
import Login from './screens/login/Login';
import Register from './screens/register/Register';
import Logout from './screens/logout/Logout';
import { OutletPage } from './screens/outlet';
import { SettingsPage } from './screens/settings';

function App() {
  // Create a home page that has two buttons, one for login and one for register which navigate to the respective pages
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/outlet/:outlet" element={<OutletPage />} />
    </Routes>
  );

}

export default App;