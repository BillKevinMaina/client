import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function AdminRoute({ children }) {
  const { currentUser, authLoading } = useApp();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!currentUser) {
        setChecking(false);
        return;
      }
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists() && userDoc.data().role === 'admin') {
        setIsAdmin(true);
      }
      setChecking(false);
    };
    checkAdmin();
  }, [currentUser]);

  if (authLoading || checking) return <div className="p-10 text-white">Authenticating...</div>;
  
  // If not logged in OR not an admin, boot them to the login page
  if (!currentUser || !isAdmin) return <Navigate to="/" replace />;
  
  return children;
}