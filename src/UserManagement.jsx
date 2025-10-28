import React, { useState } from 'react';
import Papa from 'papaparse';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [statusMessages, setStatusMessages] = useState([]);
  const [isProcessing, setProcessing] = useState(false);

  const [useCsvPassword, setUseCsvPassword] = useState(false);
  const [commonPassword, setCommonPassword] = useState('');
  const [expireNow, setExpireNow] = useState(true);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setUsers(results.data);
      },
      error: (err) => {
        alert('Error parsing CSV: ' + err.message);
      }
    });
  };

  const resetPasswords = async () => {
    if (users.length === 0) return alert('Please upload a valid CSV file first.');
    if (!useCsvPassword && !commonPassword) return alert('Please enter a common password or use password from CSV.');

    setProcessing(true);
    const results = [];

    for (const user of users) {
      const { userId } = user;
      const passwordToUse = useCsvPassword ? (user.newPassword || commonPassword) : commonPassword;

      try {
        const res = await fetch('http://localhost:3000/api/users/credentials/set-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, newPassword: passwordToUse, expireNow })
        });
        const json = await res.json();
        if (res.ok) {
          results.push(`Success: ${json.message} for ${json.data?.profile?.login || userId}`);
        } else {
          results.push(`Failed for ${userId}: ${json.error}`);
        }
      } catch (err) {
        results.push(`Error for ${userId}: ${err.message}`);
      }
      setStatusMessages([...results]);
    }
    setProcessing(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>User Management - Bulk Password Reset</h3>
      <input type="file" accept=".csv" onChange={handleFileUpload} />

      <div style={{ marginTop: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={useCsvPassword}
            onChange={(e) => setUseCsvPassword(e.target.checked)}
          />
          {' '}Use password from CSV file
        </label>
      </div>

      {!useCsvPassword && (
        <div style={{ marginTop: 10 }}>
          <label>
            Common password:{' '}
            <input
              type="password"
              value={commonPassword}
              onChange={(e) => setCommonPassword(e.target.value)}
              placeholder="Enter common password"
            />
          </label>
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        <label>
          <input
            type="checkbox"
            checked={expireNow}
            onChange={(e) => setExpireNow(e.target.checked)}
          />
          {' '}Require password change on next login
        </label>
      </div>

      <button
        style={{ marginTop: 20 }}
        onClick={resetPasswords}
        disabled={users.length === 0 || isProcessing || (!useCsvPassword && !commonPassword)}
      >
        {isProcessing ? 'Processing...' : 'Reset Passwords'}
      </button>

      <div style={{ marginTop: 20, whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto', background: '#eee', padding: 10 }}>
        {statusMessages.join('\n')}
      </div>
    </div>
  );
}
