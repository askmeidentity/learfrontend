import React, { useState } from 'react';
import Papa from 'papaparse';

export default function BulkMfaReset() {
  const [users, setUsers] = useState([]);
  const [statusMessages, setStatusMessages] = useState([]);
  const [isProcessing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // MFA factor selection state
  const [resetOktaVerify, setResetOktaVerify] = useState(false);
  const [resetOktaTOTP, setResetOktaTOTP] = useState(false);
  const [resetSMS, setResetSMS] = useState(false);
  const [resetSecurityQuestion, setResetSecurityQuestion] = useState(false);

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => setUsers(results.data),
      error: err => alert('Error parsing CSV: ' + err.message),
    });
  };

  const resetMfa = async () => {
    if (users.length === 0) return alert('Please upload a valid CSV file first.');
    if (!resetOktaVerify && !resetSMS && !resetSecurityQuestion)
      return alert('Please select at least one MFA factor to reset.');

    setProcessing(true);
    setStatusMessages([]);
    setProgress(0);

    const results = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const userId = user.userId || user.email || user.username;
      if (!userId) {
        results.push(`Skipping user with missing ID at row ${i + 1}`);
        setStatusMessages([...results]);
        continue;
      }

      // Prepare factor reset flags for the API request
      const factorsToReset = {
        push: resetOktaVerify,
        sms: resetSMS,
        question: resetSecurityQuestion,
        'token:software:totp': resetOktaTOTP,
      };

      try {
        const res = await fetch('http://localhost:3000/api/users/credentials/reset-mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, factorsToReset }),
        });
        const json = await res.json();
        if (res.ok) {
          results.push(`Success: MFA reset for ${userId}`);
        } else {
          results.push(`Failed for ${userId}: ${json.error || 'Unknown error'}`);
        }
      } catch (err) {
        results.push(`Error for ${userId}: ${err.message}`);
      }

      setStatusMessages([...results]);
      setProgress(Math.round(((i + 1) / users.length) * 100));
    }

    setProcessing(false);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '100vh',
        background:
          'linear-gradient(135deg, #e0e7ff, #fef9c3)',
        fontFamily: 'Inter, sans-serif',
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px 45px',
          borderRadius: 12,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
          width: 520,
          maxWidth: '95%',
        }}
      >
        <h2
          style={{
            textAlign: 'center',
            color: '#1f2937',
            marginBottom: 25,
            fontSize: 22,
            fontWeight: 600,
          }}
        >
          User Management - Bulk MFA Reset
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label
            style={{
              fontWeight: 500,
              color: '#374151',
              display: 'block',
            }}
          >
            Upload CSV File
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              style={{
                marginTop: 8,
                padding: '6px 8px',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                width: '100%',
                background: '#f9fafb',
              }}
              disabled={isProcessing}
            />
          </label>

          <fieldset
            style={{
              border: '1px solid #d1d5db',
              borderRadius: 6,
              padding: 12,
            }}
          >
            <legend style={{ fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              Select MFA Factors to Reset
            </legend>

            <label style={{ display: 'block', marginBottom: 6, color: '#374151' }}>
              <input
                type="checkbox"
                checked={resetOktaVerify}
                onChange={e => setResetOktaVerify(e.target.checked)}
                style={{ marginRight: 6 }}
                disabled={isProcessing}
              />
              Okta Verify Push
            </label>

            <label style={{ display: 'block', marginBottom: 6, color: '#374151' }}>
              <input
                type="checkbox"
                checked={resetOktaTOTP}
                onChange={e => setResetOktaTOTP(e.target.checked)}
                style={{ marginRight: 6 }}
                disabled={isProcessing}
              />
              Okta Verify TOTP
            </label>

            <label style={{ display: 'block', marginBottom: 6, color: '#374151' }}>
              <input
                type="checkbox"
                checked={resetSMS}
                onChange={e => setResetSMS(e.target.checked)}
                style={{ marginRight: 6 }}
                disabled={isProcessing}
              />
              SMS
            </label>

            <label style={{ display: 'block', color: '#374151' }}>
              <input
                type="checkbox"
                checked={resetSecurityQuestion}
                onChange={e => setResetSecurityQuestion(e.target.checked)}
                style={{ marginRight: 6 }}
                disabled={isProcessing}
              />
              Secureity Question
            </label>
          </fieldset>

          <button
            onClick={resetMfa}
            disabled={
              users.length === 0 ||
              isProcessing ||
              (!resetOktaVerify && !resetSMS && !resetSecurityQuestion)
            }
            style={{
              marginTop: 10,
              backgroundColor:
                isProcessing ? '#1d4ed8aa' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: 6,
              padding: '12px 16px',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              fontWeight: 500,
              fontSize: 15,
              transition: 'background-color 0.2s ease',
            }}
          >
            {isProcessing ? 'Processing...' : 'Reset MFA'}
          </button>

          {isProcessing && (
            <div
              style={{
                marginTop: 16,
                height: 20,
                width: '100%',
                backgroundColor: '#e5e7eb',
                borderRadius: 10,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: '#2563eb',
                  transition: 'width 0.3s ease-in-out',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '-24px',
                  transform: 'translateX(-50%)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#2563eb',
                }}
              >
                {progress}%
              </span>
            </div>
          )}

          <div
            style={{
              marginTop: 25,
              fontSize: 13,
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              maxHeight: 300,
              overflowY: 'auto',
              background: '#f9fafb',
              padding: 12,
              borderRadius: 6,
              border: '1px solid #e5e7eb',
              color: '#374151',
              fontFamily: 'monospace',
            }}
          >
            {statusMessages.length > 0
              ? statusMessages.join('\n')
              : 'No actions performed yet. Status updates will appear here.'}
          </div>
        </div>
      </div>
    </div>
  );
}
