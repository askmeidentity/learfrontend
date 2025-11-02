import React, { useState } from 'react';
import Sidebar from './Sidebar';
import BulkPwReset from './BulkPwReset';
import BulkMfaReset from './BulkMfaReset';
import Environment from './Environment';

export default function App() {
  const [page, setPage] = useState('environment');

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Sidebar setPage={setPage} />
      <div style={{ flex: 1, padding: 20 }}>
        {page === 'environment' && <Environment />}
        {page === 'bulkpwreset' && <BulkPwReset />}
        {page === 'bulkMfareset' && <BulkMfaReset />}
      </div>
    </div>
  );
}
