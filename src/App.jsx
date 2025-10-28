import React, { useState } from 'react';
import Sidebar from './Sidebar';
import UserManagement from './UserManagement';
import Environment from './Environment';

export default function App() {
  const [page, setPage] = useState('environment');

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar setPage={setPage} />
      <div style={{ flex: 1, padding: 20 }}>
        {page === 'environment' && <Environment />}
        {page === 'userManagement' && <UserManagement />}
      </div>
    </div>
  );
}
