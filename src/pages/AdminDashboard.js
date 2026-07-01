import React from 'react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Active Motorists', value: '1,245' },
    { label: 'Verified Mechanics', value: '342' },
    { label: 'Pending Verifications', value: '12' },
    { label: 'Ongoing Repairs', value: '28' }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <header style={{ marginBottom: '30px', borderBottom: '2px solid #D32F2F', paddingBottom: '10px' }}>
        <h1 style={{ margin: 0, color: '#333' }}>Platform Overview</h1>
        <p style={{ color: '#666', margin: '5px 0 0 0' }}>Admin Control Center</p>
    </header>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        {stats.map((stat, index) => (
        <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #eaeaea' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#757575', fontWeight: 'normal' }}>{stat.label}</h4>
            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: '#D32F2F' }}>{stat.value}</span>
        </div>
        ))}
    </div>

    <div style={{ marginTop: '40px', backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #eaeaea' }}>
        <h3 style={{ marginTop: 0 }}>Recent System Alerts</h3>
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>🟢 M-Pesa API Status: <strong>Operational</strong></li>
        <li style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>🟡 3 Mechanic payouts pending review.</li>
        <li style={{ padding: '10px 0' }}>🔴 Disputed Transaction: Booking #BK-4821</li>
        </ul>
      </div>
    </div>
  );
}