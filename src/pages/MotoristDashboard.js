import React, { useState } from 'react';

export default function MotoristDashboard() {
  const [issue, setIssue] = useState('');
  const [vehicle, setVehicle] = useState('2019 Honda Fit Hybrid');

  const handleRequestService = (e) => {
    e.preventDefault();
    alert(`Service requested for ${vehicle}: ${issue}`);
    // Future: Push this request to Firebase Firestore here
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Top Navbar */}
      <header style={{ backgroundColor: '#D32F2F', color: 'white', padding: '15px', display: 'flex', justifyContent: 'space-between' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>MechNomads</h2>
        <button style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}>☰ Menu</button>
      </header>

      {/* Simulated Map View */}
      <div style={{ flex: 1, backgroundColor: '#e0e0e0', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#757575', fontSize: '1.2rem' }}>[ Google Maps API Integration Here ]</p>
        {/* Placeholder Blue Pin for User Location */}
        <div style={{ position: 'absolute', width: '20px', height: '20px', backgroundColor: '#2196F3', borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 5px rgba(0,0,0,0.3)' }}></div>
      </div>

      {/* Request Bottom Sheet */}
      <div style={{ padding: '20px', backgroundColor: 'white', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', marginTop: '-20px', zIndex: 10 }}>
        <h3 style={{ marginTop: 0 }}>Request Roadside Assistance</h3>
        <form onSubmit={handleRequestService}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Vehicle Details</label>
          <input 
            type="text" 
            value={vehicle}
            onChange={(e) => setVehicle(e.target.value)}
            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />

          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem' }}>Describe the Issue</label>
          <textarea 
            placeholder="E.g., Flat tire, engine won't start, hybrid battery error..."
            value={issue}
            onChange={(e) => setIssue(e.target.value)}
            rows="3"
            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
          />

          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#D32F2F', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
            Find Nearby Mechanics
          </button>
        </form>
      </div>
    </div>
  );
}