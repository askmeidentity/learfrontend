import React from 'react';

export default function Sidebar({ setPage }) {
  return (
    <div style={{ width: 200, height: '100vh', background: '#222', color: 'white', padding: 10 }}>
      <h2>Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li style={{ padding: '10px 0', cursor: 'pointer' }} onClick={() => setPage('environment')}>Environment</li>
        <li style={{ padding: '10px 0', cursor: 'pointer' }} onClick={() => setPage('userManagement')}>User Management</li>
      </ul>
    </div>
  );
}
