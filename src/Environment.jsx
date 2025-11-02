import React, { useState, useEffect } from 'react';

export default function Environment() {
  const [envList, setEnvList] = useState([]);
  const [envName, setEnvName] = useState('');
  const [oktaUrl, setOktaUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchEnvironments();
  }, []);

  const fetchEnvironments = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/environment/read');
      if (response.ok) {
        const data = await response.json();
        setEnvList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Error fetching environments:', err);
    }
  };

  const handleSave = async () => {
    const payload = { envName, oktaUrl, apiKey };
    try {
      const response = await fetch('http://localhost:3000/api/environment/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Save failed');

      alert('Environment saved successfully');
      setIsEditing(false);
      setEnvName('');
      setOktaUrl('');
      setApiKey('');
      fetchEnvironments();
    } catch (err) {
      console.error(err);
      alert('Error saving environment');
    }
  };

  const redactKey = key => {
    if (!key) return '';
    return key.length > 6 ? key.slice(0, 4) + '••••••' : '••••';
  };

  const handleEditClick = env => {
    setEnvName(env.envName);
    setOktaUrl(env.oktaUrl);
    setApiKey('');
    setSelectedEnv(env.envName);
    setIsEditing(true);
  };

  const handleAddClick = () => {
    setEnvName('');
    setOktaUrl('');
    setApiKey('');
    setSelectedEnv(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0e7ff, #fef9c3)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '35px 40px',
        borderRadius: '10px',
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
        width: '500px',
        maxWidth: '90%',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '25px',
          color: '#1f2937'
        }}>
          Environment Configuration
        </h2>

        {/* Existing Environments */}
        {!isEditing && envList.length > 0 && (
          <div>
            <h3 style={{ marginBottom: '10px', color: '#111827' }}>Saved Environments</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {envList.map((env, idx) => (
                <div key={idx} style={{
                  background: '#f9fafb',
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600 }}>{env.envName}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>{env.oktaUrl}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      Key: {redactKey(env.apiKey)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditClick(env)}
                    style={{
                      padding: '6px 10px',
                      backgroundColor: '#2563eb',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddClick}
              style={{
                marginTop: '20px',
                padding: '10px 14px',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Add New Environment
            </button>
          </div>
        )}

        {!isEditing && envList.length === 0 && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: '#4b5563', marginBottom: '10px' }}>No environment configurations found.</p>
            <button
              onClick={handleAddClick}
              style={{
                padding: '10px 14px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Add Configuration
            </button>
          </div>
        )}

        {/* Edit/Add Form */}
        {isEditing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '10px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151' }}>
                Environment Name
              </label>
              <input
                type="text"
                placeholder="Environment name"
                value={envName}
                onChange={e => setEnvName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151' }}>
                Okta URL
              </label>
              <input
                type="text"
                placeholder="https://your-okta-domain"
                value={oktaUrl}
                onChange={e => setOktaUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: '#374151' }}>
                API Key
              </label>
              <input
                type="password"
                placeholder="Enter API key"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  fontSize: '14px'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
              <button
                onClick={handleSave}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  backgroundColor: '#2563eb',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  backgroundColor: '#9ca3af',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
