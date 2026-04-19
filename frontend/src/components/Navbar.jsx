import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img 
              src="/images/logosatria.png" 
              alt="Lapangan Voli Satria" 
              style={{ height: '40px', width: 'auto' }}
            />
            <span>Satria Volleyball</span>
          </Link>
          
          {/* Hamburger Menu Button */}
          <button 
            className="navbar-toggle" 
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <ul className={`navbar-nav ${isOpen ? 'active' : ''}`}>
            <li>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/booking" 
                className={`nav-link ${location.pathname === '/booking' ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Booking
              </Link>
            </li>
            <li>
              <Link 
                to="/admin/login" 
                className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                🔑 Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
