import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import '../styles/admin.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { admin, logout, token, isLoggedIn } = useAdmin();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [lapangans, setLapangans] = useState([]);
  const [selectedLapangan, setSelectedLapangan] = useState('');

  // Check if logged in
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  // Fetch lapangans
  useEffect(() => {
    fetchLapangans();
  }, []);

  // Fetch bookings
  useEffect(() => {
    if (token) {
      fetchBookings();
    }
  }, [filter, selectedLapangan, token]);

  const fetchLapangans = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/lapangans');
      const data = await response.json();
      if (data.success) {
        setLapangans(data.data);
      }
    } catch (err) {
      console.error('Error fetching lapangans:', err);
    }
  };

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = 'http://localhost:8000/api/v1/admin/bookings';
      const params = new URLSearchParams();

      if (filter) {
        params.append('status', filter);
      }
      if (selectedLapangan) {
        params.append('lapangan_id', selectedLapangan);
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setBookings(data.data);
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    if (!window.confirm('Approve booking ini?')) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/bookings/${bookingId}/approve`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('Booking berhasil di-approve!');
        fetchBookings();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleReject = async (bookingId) => {
    const alasan = prompt('Masukkan alasan penolakan (opsional):');
    if (alasan === null) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/admin/bookings/${bookingId}/reject`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ alasan }),
        }
      );

      const data = await response.json();
      if (data.success) {
        alert('Booking berhasil di-reject!');
        fetchBookings();
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Logout?')) {
      logout();
      navigate('/admin/login');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: '#fbbf24', bg: '#fef3c7', label: '⏳ Pending' },
      approved: { color: '#10b981', bg: '#d1fae5', label: '✅ Approved' },
      rejected: { color: '#ef4444', bg: '#fee2e2', label: '❌ Rejected' },
      cancelled: { color: '#6b7280', bg: '#f3f4f6', label: '🚫 Cancelled' },
    };
    const s = statusMap[status] || statusMap.pending;
    return (
      <span
        style={{
          display: 'inline-block',
          padding: '0.35rem 0.75rem',
          borderRadius: '6px',
          background: s.bg,
          color: s.color,
          fontSize: '0.85rem',
          fontWeight: '600',
        }}
      >
        {s.label}
      </span>
    );
  };

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-header">
        <div className="admin-header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => navigate('/')}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              ← Home
            </button>
            <img 
              src="/images/logosatria.png" 
              alt="Satria Logo" 
              style={{ height: '40px', width: 'auto' }}
            />
            <div>
              <h1>Admin Dashboard</h1>
              <p>Kelola booking lapangan voli</p>
            </div>
          </div>
        </div>
        <div className="admin-header-user">
          <div className="user-info">
            <p style={{ margin: '0', fontSize: '0.9rem' }}>
              👤 {admin?.nama || 'Admin'}
            </p>
            <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#6b7280' }}>
              {admin?.username}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="admin-content">
        {/* Filters */}
        <div className="admin-filters card">
          <h3 style={{ marginTop: 0 }}>Filter Booking</h3>
          <div className="filter-group">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-control"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Lapangan</label>
              <select
                className="form-control"
                value={selectedLapangan}
                onChange={(e) => setSelectedLapangan(e.target.value)}
              >
                <option value="">Semua Lapangan</option>
                {lapangans.map((lap) => (
                  <option key={lap.id} value={lap.id}>
                    {lap.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        <div className="admin-bookings card">
          <h3>Daftar Booking ({bookings.length})</h3>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Memuat booking...</p>
            </div>
          ) : bookings.length > 0 ? (
            <div className="bookings-table">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Lapangan</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Tanggal</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Jam</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Penyewa</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>No HP</th>
                    <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                    <th style={{ padding: '0.75rem', textAlign: 'center' }}>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '0.75rem' }}>
                        <strong>{booking.lapangan?.nama || 'N/A'}</strong>
                      </td>
                      <td style={{ padding: '0.75rem' }}>{booking.tanggal}</td>
                      <td style={{ padding: '0.75rem' }}>
                        {booking.jam_mulai} - {booking.jam_selesai}
                      </td>
                      <td style={{ padding: '0.75rem' }}>{booking.nama_penyewa}</td>
                      <td style={{ padding: '0.75rem' }}>{booking.no_hp}</td>
                      <td style={{ padding: '0.75rem' }}>{getStatusBadge(booking.status)}</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                        {booking.status === 'pending' && (
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button
                              onClick={() => handleApprove(booking.id)}
                              className="btn"
                              style={{
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.85rem',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              ✓ Approve
                            </button>
                            <button
                              onClick={() => handleReject(booking.id)}
                              className="btn"
                              style={{
                                padding: '0.35rem 0.75rem',
                                fontSize: '0.85rem',
                                background: '#ef4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                              }}
                            >
                              ✕ Reject
                            </button>
                          </div>
                        )}
                        {booking.status !== 'pending' && (
                          <span style={{ color: '#6b7280', fontSize: '0.9rem' }}>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="alert alert-info">
              Tidak ada booking dengan filter yang dipilih.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
