import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import '../styles/admin.css';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAdmin();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!username || !password) {
      setLocalError('Username dan password harus diisi');
      return;
    }

    const result = await login(username, password);
    if (result.success) {
      navigate('/admin/dashboard');
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img 
            src="/images/logosatria.png" 
            alt="Satria Logo" 
            style={{ height: '75px', width: 'auto', marginBottom: '0.5rem' }}
          />
          <h1>Admin Panel</h1>
          <p>Lapangan Voli Satria</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {(error || localError) && (
            <div className="alert alert-error">
              {error || localError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>

        <div className="admin-login-footer">
          <p className="text-muted" style={{ fontSize: '0.85rem', textAlign: 'center' }}>
            Hanya untuk admin Lapangan Voli Satria
          </p>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              ← Kembali ke Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
