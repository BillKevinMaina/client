import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../config/firebaseConfig'; 
import { onAuthStateChanged, signOut } from 'firebase/auth'; 
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore'; 

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); 
  const [activeIncident, setActiveIncident] = useState(null);

  // LISTEN TO FIREBASE FOR LOGIN/LOGOUT CHANGES
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false); 
    });
    return unsubscribe; 
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setActiveIncident(null); 
    } catch (error) {
      console.error("Firebase Logout Error:", error);
    }
  };

  // 1. CREATE INCIDENT
  const createIncidentPayload = async (payload) => {
    try {
      const docRef = await addDoc(collection(db, 'incidents'), {
        ...payload,
        motoristId: currentUser?.uid, // 🚨 THE FIX: Invisibly stamp the user's ID on the job!
        status: 'pending',
        timestamp: new Date().toISOString()
      });
      
      setActiveIncident({ 
        ...payload, 
        id: docRef.id, 
        status: 'pending' 
      });
      
      return true;
    } catch (error) {
      console.error("Firebase Write Error:", error);
      throw error;
    }
  };

  // 2. UPDATE STATUS
  const updateIncidentStatus = async (status) => {
    if (!activeIncident?.id) return;
    try {
      const incidentRef = doc(db, 'incidents', activeIncident.id);
      await updateDoc(incidentRef, { status: status });
      setActiveIncident({ ...activeIncident, status: status });
    } catch (error) {
      console.error("Firebase Update Error:", error);
    }
  };

  // 3. CLEAR INCIDENT
  const clearIncident = async () => {
    if (activeIncident?.id) {
      try {
        const incidentRef = doc(db, 'incidents', activeIncident.id);
        await updateDoc(incidentRef, { status: 'recalled' });
      } catch (error) {
        console.error("Firebase Clear Error:", error);
      }
    }
    setActiveIncident(null);
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, setCurrentUser, authLoading,
      activeIncident, createIncidentPayload, updateIncidentStatus, clearIncident,
      logout 
    }}>
      {!authLoading && children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useApp must be used within an AppProvider');
  return context;
};