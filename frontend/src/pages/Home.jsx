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

  // Styles
  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0f172a',
      color: '#fff',
    },
    navbar: {
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    hero: {
      padding: '6rem 2rem 4rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, rgba(0,212,255,0.12) 0%, rgba(0,153,255,0.08) 100%)',
      borderBottom: '1px solid rgba(0,212,255,0.2)',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: 'inset 0 0 60px rgba(0,212,255,0.1)',
    },
    heroTitle: {
      fontSize: 'clamp(2.5rem, 6vw, 4rem)',
      fontWeight: '800',
      margin: '0 0 1.5rem 0',
      lineHeight: '1.2',
    },
    heroSubtitle: {
      fontSize: '1.25rem',
      opacity: 0.8,
      maxWidth: '600px',
      margin: '0 auto 2.5rem auto',
      lineHeight: '1.6',
    },
    ctaButton: {
      padding: '1rem 2.5rem',
      background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
      color: '#000',
      border: 'none',
      borderRadius: '50px',
      fontSize: '1.05rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 32px rgba(0,212,255,0.3)',
      transition: 'all 0.3s ease',
      display: 'inline-block',
    },
    featuresSection: {
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      textAlign: 'center',
      marginBottom: '3rem',
      background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '2rem',
      marginBottom: '3rem',
    },
    featureCard: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(0,212,255,0.2)',
      padding: '2rem',
      borderRadius: '16px',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    featureIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
    },
    featureTitle: {
      fontSize: '1.3rem',
      fontWeight: '700',
      marginBottom: '0.75rem',
    },
    featureDesc: {
      fontSize: '0.95rem',
      opacity: 0.7,
      lineHeight: '1.6',
    },
    stepsSection: {
      padding: '4rem 2rem',
      background: 'rgba(0,212,255,0.05)',
      borderTop: '1px solid rgba(0,212,255,0.2)',
      borderBottom: '1px solid rgba(0,212,255,0.2)',
    },
    stepsContainer: {
      maxWidth: '1000px',
      margin: '0 auto',
    },
    stepsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '2rem',
      marginTop: '2.5rem',
    },
    stepCard: {
      textAlign: 'center',
      position: 'relative',
    },
    stepNumber: {
      width: '60px',
      height: '60px',
      background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.8rem',
      fontWeight: 'bold',
      margin: '0 auto 1rem auto',
      color: '#000',
    },
    stepTitle: {
      fontSize: '1.1rem',
      fontWeight: '700',
      marginBottom: '0.5rem',
    },
    stepDesc: {
      fontSize: '0.9rem',
      opacity: 0.7,
    },
    lapanganSection: {
      padding: '4rem 2rem',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    lapanganGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: '2rem',
      marginTop: '2rem',
    },
    lapanganCard: {
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(0,212,255,0.3)',
      borderRadius: '16px',
      overflow: 'hidden',
      backdropFilter: 'blur(10px)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
    },
    lapanganCardHeader: {
      padding: '2rem',
      background: 'linear-gradient(135deg, rgba(0,212,255,0.2) 0%, rgba(0,153,255,0.2) 100%)',
      borderBottom: '1px solid rgba(0,212,255,0.2)',
    },
    lapanganCardBody: {
      padding: '2rem',
    },
    lapanganTitle: {
      fontSize: '1.4rem',
      fontWeight: '800',
      marginBottom: '0.5rem',
    },
    statusBadge: {
      display: 'inline-block',
      background: '#10b981',
      padding: '0.4rem 1rem',
      borderRadius: '20px',
      fontSize: '0.8rem',
      fontWeight: '700',
      marginBottom: '1rem',
    },
    priceGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid rgba(0,212,255,0.1)',
    },
    priceItem: {
      background: 'rgba(0,212,255,0.1)',
      padding: '1rem',
      borderRadius: '10px',
      textAlign: 'center',
    },
    priceTime: {
      fontSize: '0.85rem',
      opacity: 0.7,
      marginBottom: '0.4rem',
    },
    priceAmount: {
      fontSize: '1.3rem',
      fontWeight: '700',
      color: '#00d4ff',
    },
    bookButton: {
      width: '100%',
      padding: '0.9rem',
      background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)',
      color: '#000',
      border: 'none',
      borderRadius: '10px',
      fontSize: '0.95rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    footer: {
      padding: '3rem 2rem',
      background: 'rgba(0,0,0,0.5)',
      borderTop: '1px solid rgba(0,212,255,0.2)',
      textAlign: 'center',
    },
    footerText: {
      fontSize: '1.1rem',
      marginBottom: '1.5rem',
      opacity: 0.9,
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src="/images/logosatria.png" 
            alt="Logo Satria" 
            style={{ height: '50px', width: 'auto' }}
          />
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
            Satria Volleyball
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <a 
            href="/admin/login"
            style={{
              color: '#fff',
              textDecoration: 'none',
              fontSize: '0.95rem',
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
            style={{
              ...styles.ctaButton,
              padding: '0.6rem 1.8rem',
              fontSize: '0.95rem',
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 40px rgba(0,212,255,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 32px rgba(0,212,255,0.3)';
            }}
          >
            Booking Sekarang
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div style={styles.hero}>
        {/* Background Gradient Effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}></div>

        {/* Animated Volleyball Elements */}
        <div style={{
          position: 'absolute',
          top: '80px',
          left: '10%',
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle at 35% 35%, #fff, #00d4ff)',
          borderRadius: '50%',
          boxShadow: '0 0 20px rgba(0,212,255,0.5)',
          opacity: 0.6,
          zIndex: 1,
        }} className="animate-ball-float-1">
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid #0099ff',
            boxSizing: 'border-box',
          }}></div>
        </div>

        <div style={{
          position: 'absolute',
          bottom: '80px',
          right: '15%',
          width: '50px',
          height: '50px',
          background: 'radial-gradient(circle at 35% 35%, #fff, #0099ff)',
          borderRadius: '50%',
          boxShadow: '0 0 15px rgba(0,153,255,0.5)',
          opacity: 0.5,
          zIndex: 1,
        }} className="animate-ball-float-2">
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid #00d4ff',
            boxSizing: 'border-box',
          }}></div>
        </div>

        {/* Animated Net */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '1px',
          height: '150px',
          background: 'linear-gradient(to bottom, transparent, rgba(0,212,255,0.3), transparent)',
          opacity: 0.6,
          zIndex: 0,
        }} className="animate-net-wave"></div>

        {/* Player Jump Animation */}
        <div style={{
          position: 'absolute',
          top: '100px',
          right: '5%',
          fontSize: '3rem',
          opacity: 0.7,
          zIndex: 1,
        }} className="animate-player-jump">
          🏐
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={styles.heroTitle} className="animate-fade-in-up">
            Pesan Lapangan Voli <br />
          <span style={{ color: '#00d4ff' }}>Dengan Mudah</span>
        </h1>
        <p style={styles.heroSubtitle} className="animate-fade-in-up-delay-1">
          Nikmati pengalaman booking lapangan voli yang cepat, transparan, dan terpercaya. 
          Tersedia setiap hari dari jam 07:00 hingga 22:00.
        </p>
        <button
          style={styles.ctaButton}
          className="animate-fade-in-up-delay-2"
          onClick={() => navigate('/booking')}
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
      <div style={styles.featuresSection}>
        <h2 style={styles.sectionTitle} className="animate-fade-in-up">Mengapa Pilih Kami?</h2>
        <div style={styles.featuresGrid}>
          {[
            { icon: '⚡', title: 'Booking Instan', desc: 'Pesan lapangan hanya dalam 2 menit, langsung dikonfirmasi via WhatsApp' },
            { icon: '💰', title: 'Harga Transparan', desc: 'Tidak ada biaya tersembunyi. Harga yang Anda lihat adalah harga yang Anda bayar' },
            { icon: '🕐', title: 'Jam Fleksibel', desc: 'Tersedia 7:00 pagi hingga 10:00 malam, sesuai dengan jadwal Anda' },
            { icon: '🎯', title: 'Konfirmasi Cepat', desc: 'Tim kami akan langsung mengkonfirmasi booking Anda dalam hitungan menit' },
          ].map((feature, idx) => (
            <div
              key={idx}
              style={styles.featureCard}
              className={`animate-fade-in-up-delay-${(idx % 4) + 1}`}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={styles.featureIcon} className="animate-float">
                {feature.icon}
              </div>
              <div style={styles.featureTitle}>{feature.title}</div>
              <div style={styles.featureDesc}>{feature.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div style={styles.stepsSection}>
        <div style={styles.stepsContainer}>
          <h2 style={styles.sectionTitle} className="animate-fade-in-up">Cara Booking</h2>
          <div style={styles.stepsGrid}>
            {[
              { num: '1', title: 'Pilih Lapangan', desc: 'Lihat daftar lapangan yang tersedia' },
              { num: '2', title: 'Pilih Waktu', desc: 'Tentukan tanggal dan jam yang diinginkan' },
              { num: '3', title: 'Konfirmasi', desc: 'Masukkan data dan kirim permintaan' },
              { num: '4', title: 'Selesai', desc: 'Dapatkan konfirmasi via WhatsApp' },
            ].map((step, idx) => (
              <div key={idx} style={styles.stepCard} className={`animate-fade-in-up-delay-${(idx % 4) + 1}`}>
                <div style={styles.stepNumber} className="animate-bounce">
                  {step.num}
                </div>
                <div style={styles.stepTitle}>{step.title}</div>
                <div style={styles.stepDesc}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lapangan Section */}
      <div style={styles.lapanganSection}>
        <h2 style={styles.sectionTitle} className="animate-fade-in-up">Lapangan Tersedia</h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', opacity: 0.7 }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="animate-float">⏳</div>
            <p>Memuat lapangan...</p>
          </div>
        ) : lapangans.length > 0 ? (
          <div style={styles.lapanganGrid}>
            {lapangans.map((lapangan, idx) => (
              <div
                key={lapangan.id}
                style={styles.lapanganCard}
                className={`animate-fade-in-up-delay-${(idx % 4) + 1}`}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.6)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                }}
              >
                <div style={styles.lapanganCardHeader}>
                  <div style={styles.statusBadge} className="animate-pulse">✓ Tersedia</div>
                  <h3 style={styles.lapanganTitle}>{lapangan.nama}</h3>
                  <p style={{ margin: '0.5rem 0 0 0', opacity: 0.7, fontSize: '0.95rem' }}>
                    {lapangan.deskripsi}
                  </p>
                </div>

                <div style={styles.lapanganCardBody}>
                  <div style={styles.priceGrid}>
                    <div style={styles.priceItem}>
                      <div style={styles.priceTime}>🌅 Pagi</div>
                      <div style={styles.priceAmount}>15K</div>
                    </div>
                    <div style={styles.priceItem}>
                      <div style={styles.priceTime}>☀️ Siang</div>
                      <div style={styles.priceAmount}>20K</div>
                    </div>
                  </div>
                  <div style={styles.priceGrid}>
                    <div style={styles.priceItem}>
                      <div style={styles.priceTime}>🌙 Malam</div>
                      <div style={styles.priceAmount}>30K</div>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/booking')}
                    style={styles.bookButton}
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

      {/* Footer CTA */}
      <div style={{
        padding: '2rem',
        textAlign: 'center',
        opacity: 0,
        pointerEvents: 'none',
        height: 0,
      }}>
      </div>
    </div>
  );
};

export default Home;
