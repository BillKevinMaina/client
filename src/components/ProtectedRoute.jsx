// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useApp();

  // If Firebase checks its records and confirms no one is logged in...
  if (!currentUser) {
    // ...kick the user back to the login page immediately!
    return <Navigate to="/" replace />;
  }

  // If they ARE logged in, open the gates and let them see the page.
  return children;
}