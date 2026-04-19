import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-section footer-about">
            <div className="footer-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <img 
                src="/images/logosatria.png" 
                alt="Satria Logo" 
                style={{ height: '40px', width: 'auto' }}
              />
              <span className="brand-text">Lapangan Voli Satria</span>
            </div>
            <p className="footer-desc">
              Lapangan voli outdoor terbaik dengan sistem booking online yang mudah, transparan, dan terpercaya. 
              Siap melayani latihan rutin, scrimmage, hingga turnamen profesional.
            </p>
            <div className="footer-contact">
              <a href="https://maps.app.goo.gl/CeDXPJth4qdn9TxP6" className="contact-item" target="_blank" rel="noopener noreferrer">
                <span className="contact-icon">📍</span>
                <span>Jl. Tenaga No.2c, Blimbing, Kec. Blimbing, Kota Malang, Jawa Timur 65126</span>
              </a>
              <a href="tel:+6285923419636" className="contact-item">
                <span className="contact-icon">📞</span>
                <span>+62 859-2341-9636</span>
              </a>
              <a href="mailto:info@lapanganvolisatria.com" className="contact-item">
                <span className="contact-icon">✉️</span>
                <span>info@lapanganvolisatria.com</span>
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Menu</h4>
            <ul className="footer-links">
              <li><Link to="/">🏠 Beranda</Link></li>
              <li><Link to="/booking">📅 Booking</Link></li>
              <li><a href="#lapangan">🏐 Lapangan Tersedia</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Jam & Harga</h4>
            <div className="operating-hours">
              <div className="hours-item">
                <span className="hours-icon">📅</span>
                <div>
                  <span className="hours-label">Senin - Minggu</span>
                  <span className="hours-value">07:00 - 22:00 WIB</span>
                </div>
              </div>
              <div className="hours-item">
                <span className="hours-icon">🌅</span>
                <div>
                  <span className="hours-label">Pagi (07:00-14:00)</span>
                  <span className="hours-value">Rp 15.000/jam</span>
                </div>
              </div>
              <div className="hours-item">
                <span className="hours-icon">☀️</span>
                <div>
                  <span className="hours-label">Siang (14:00-17:00)</span>
                  <span className="hours-value">Rp 20.000/jam</span>
                </div>
              </div>
              <div className="hours-item">
                <span className="hours-icon">🌙</span>
                <div>
                  <span className="hours-label">Malam (18:00-22:00)</span>
                  <span className="hours-value">Rp 30.000/jam</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-section footer-map">
            <h4 className="footer-title">Lokasi Kami</h4>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3951.0!2d112.643644!3d-7.942843!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zN8KwNTYnMzQuMiJTIDExMsKwMzgnMzcuMSJF!5e0!3m2!1sen!2sid!4v1234567890"
                width="100%"
                height="200"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi Lapangan Voli Satria"
              ></iframe>
              <a 
                href="https://maps.app.goo.gl/CeDXPJth4qdn9TxP6" 
                className="map-link" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="map-icon">📍</span>
                <span>Buka di Google Maps</span>
                <span className="map-arrow">→</span>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-divider"></div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-left">
              <p className="copyright">© 2026 Dandi Azrul Syahputra</p>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
