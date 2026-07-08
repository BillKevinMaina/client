import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';


// Views
import AuthView from './views/AuthView';
import MotoristHomeView from './views/MotoristHomeView';
import MotoristDashboard from './views/MotoristDashboard';
import MechanicDiscoveryView from './views/MechanicDiscoveryView';
import LiveTrackingView from './views/LiveTrackingView';
import MechanicProfileSetupView from './views/MechanicProfileSetupView';
import MechanicDashboardView from './views/MechanicDashboardView';
import MechanicRoutingView from './views/MechanicRoutingView';
import ProfileView from './views/ProfileView';

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App w-full h-[100dvh] overflow-hidden bg-slate-900">
          <Routes>
            {/* PUBLIC ROUTE - Anyone can see the login screen */}
            <Route path="/" element={<AuthView />} />
            
            {/* PROTECTED MOTORIST ROUTES */}
            <Route path="/motorist-home" element={
              <ProtectedRoute><MotoristHomeView /></ProtectedRoute>
            } />
            <Route path="/motorist-dashboard" element={
              <ProtectedRoute><MotoristDashboard /></ProtectedRoute>
            } />
            <Route path="/discovery" element={
              <ProtectedRoute><MechanicDiscoveryView /></ProtectedRoute>
            } />
            <Route path="/tracking" element={
              <ProtectedRoute><LiveTrackingView /></ProtectedRoute>
            } />

            {/* PROTECTED MECHANIC ROUTES */}
            <Route path="/mechanic-setup" element={
              <ProtectedRoute><MechanicProfileSetupView /></ProtectedRoute>
            } />
            <Route path="/mechanic-dashboard" element={
              <ProtectedRoute><MechanicDashboardView /></ProtectedRoute>
            } />
            <Route path="/mechanic-routing" element={
              <ProtectedRoute><MechanicRoutingView /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfileView /></ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}