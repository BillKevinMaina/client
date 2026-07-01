import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Tracks if Firebase is still checking the session
  const [activeIncident, setActiveIncident] = useState(null);

  // LISTEN TO FIREBASE FOR LOGIN/LOGOUT CHANGES
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false); // Finished checking
    });
    return unsubscribe; // Cleanup listener when app closes
  }, []);

  const createIncidentPayload = (payload) => setActiveIncident({ ...payload, status: 'pending' });
  const updateIncidentStatus = (status) => activeIncident && setActiveIncident({ ...activeIncident, status: status });
  const clearIncident = () => setActiveIncident(null);

  return (
    <AppContext.Provider value={{ 
      currentUser, setCurrentUser, authLoading,
      activeIncident, createIncidentPayload, updateIncidentStatus, clearIncident 
    }}>
      {/* Wait for Firebase to check auth status before rendering the app */}
      {!authLoading && children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};