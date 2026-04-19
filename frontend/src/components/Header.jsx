import React from 'react';

const Header = ({ title, subtitle, image, badge }) => {
  return (
    <div className="page-header">
      <div className="header-overlay"></div>
      {image && (
        <div className="header-image">
          <img src={image} alt={title} />
        </div>
      )}
      <div className="container">
        <div className="header-content">
          {badge && (
            <div className="header-badge">
              <span className="badge-icon">{badge.icon}</span>
              <span className="badge-text">{badge.text}</span>
            </div>
          )}
          <h1 className="header-title">{title}</h1>
          {subtitle && <p className="header-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default Header;
