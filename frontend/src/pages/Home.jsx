import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lapanganService } from '../services/api';
import '../styles/home-animations.css';

const Home = () => {
  const navigate = useNavigate();
  const [lapangans, setLapangans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLapangans();
  }, []);

  const fetchLapangans = async () => {
    try {
      const response = await lapanganService.getAll();
      if (response.success) {
        setLapangans(response.data);
      }
    } catch (err) {
      console.error('Error fetching lapangans:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      {/* Navbar */}
      <div className="home-navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img 
            src="/images/logosatria.png" 
            alt="Logo Satria" 
            style={{ height: '40px', width: 'auto' }}
          />
          <div className="home-navbar-logo" style={{ fontSize: '1.2rem', margin: 0 }}>
            Satria Volleyball
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <a 
            href="/admin/login"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.9rem',
              opacity: 0.7,
              cursor: 'pointer',
              transition: 'opacity 0.3s ease'
            }}
            onMouseOver={(e) => e.target.style.opacity = '1'}
            onMouseOut={(e) => e.target.style.opacity = '0.7'}
          >
            🔑 Admin
          </a>
          <button
            onClick={() => navigate('/booking')}
            className="hero-cta-button"
            style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,212,255,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,212,255,0.3)';
            }}
          >
            Booking
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}></div>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 className="hero-title animate-fade-in-up">
            Pesan Lapangan Voli <br />
            <span style={{ color: '#00d4ff' }}>Dengan Mudah</span>
          </h1>
          <p className="hero-subtitle animate-fade-in-up-delay-1">
            Nikmati pengalaman booking lapangan voli yang cepat, transparan, dan terpercaya. 
            Tersedia setiap hari dari jam 07:00 hingga 22:00.
          </p>
          <button
            onClick={() => navigate('/booking')}
            className="hero-cta-button animate-fade-in-up-delay-2"
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-4px)';
              e.target.style.boxShadow = '0 16px 48px rgba(0,212,255,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,212,255,0.3)';
            }}
          >
            ⚡ Mulai Booking Sekarang
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title animate-fade-in-up">Mengapa Pilih Kami?</h2>
        <div className="features-grid">
          {[
            { icon: '⚡', title: 'Booking Instan', desc: 'Pesan lapangan hanya dalam 2 menit, langsung dikonfirmasi via WhatsApp' },
            { icon: '💰', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar' },
            { icon: '🕐', title: 'Jam Fleksibel', desc: 'Tersedia 7:00 pagi hingga 10:00 malam, sesuai dengan jadwal Anda' },
            { icon: '🎯', title: 'Konfirmasi Cepat', desc: 'Tim kami akan langsung mengkonfirmasi booking Anda dalam hitungan menit' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="feature-card animate-fade-in-up-delay-1"
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div className="feature-icon animate-float">
                {feature.icon}
              </div>
              <div className="feature-title">{feature.title}</div>
              <div className="feature-desc">{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="steps-section">
        <div className="steps-container">
          <h2 className="section-title animate-fade-in-up">Cara Booking</h2>
          <div className="steps-grid">
            {[
              { num: '1', title: 'Pilih Lapangan', desc: 'Lihat daftar lapangan yang tersedia' },
              { num: '2', title: 'Pilih Waktu', desc: 'Tentukan tanggal dan jam yang diinginkan' },
              { num: '3', title: 'Konfirmasi', desc: 'Masukkan data dan kirim permintaan' },
              { num: '4', title: 'Selesai', desc: 'Dapatkan konfirmasi via WhatsApp' },
            ].map((step, idx) => (
              <div key={idx} className="step-card animate-fade-in-up-delay-1">
                <div className="step-number animate-bounce">
                  {step.num}
                </div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lapangan Section */}
      <div className="lapangan-section">
        <h2 className="section-title animate-fade-in-up">Lapangan Tersedia</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.7 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="animate-float">⏳</div>
            <p>Memuat lapangan...</p>
          </div>
        ) : lapangans.length > 0 ? (
          <div className="lapangan-grid">
            {lapangans.map((lapangan, idx) => (
              <div
                key={lapangan.id}
                className="lapangan-card animate-fade-in-up-delay-1"
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                }}
              >
                <div className="lapangan-card-header">
                  <div className="status-badge animate-pulse">✓ Tersedia</div>
                  <h3 className="lapangan-title">{lapangan.nama}</h3>
                  <p style={{ margin: '0.5rem 0 0 0', opacity: 0.7, fontSize: '0.95rem' }}>
                    {lapangan.deskripsi}
                  </p>
                </div>

                <div className="lapangan-card-body">
                  <div className="price-grid">
                    <div className="price-item">
                      <div className="price-time">🌅 Pagi</div>
                      <div className="price-amount">15K</div>
                    </div>
                    <div className="price-item">
                      <div className="price-time">☀️ Siang</div>
                      <div className="price-amount">20K</div>
                    </div>
                  </div>
                  <div className="price-grid">
                    <div className="price-item">
                      <div className="price-time">🌙 Malam</div>
                      <div className="price-amount">30K</div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/booking')}
                    className="book-button"
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 8px 24px rgba(0,212,255,0.3)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    📅 Pesan Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.7 }}>
            <p>Belum ada lapangan yang tersedia saat ini</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
