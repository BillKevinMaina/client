// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { currentUser } = useApp();

  // If no user is detected by Firebase, kick them to the login screen ("/")
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  // If they are logged in, render the page they asked for
  return children;
}