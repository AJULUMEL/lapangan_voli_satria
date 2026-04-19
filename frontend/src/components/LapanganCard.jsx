import React from 'react';

const LapanganCard = ({ lapangan }) => {
  const handleChatClick = () => {
    const message = `Halo, saya ingin booking ${lapangan.nama}. Bisa tolong infokan ketersediaan dan prosesnya?`;
    window.location.href = `https://wa.me/6285923419636?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="card">
      <div className="badge" style={{background:'#eff6ff', color:'#1d4ed8', marginBottom:'0.6rem'}}>
        {lapangan.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
      </div>
      <h3 className="card-title">{lapangan.nama}</h3>
      <p className="card-subtitle">{lapangan.deskripsi}</p>
      <div className="card-price">
        Rp 15.000 - 30.000 / jam
      </div>
      <div className="divider" style={{margin:'0.75rem 0'}}></div>
      <div className="feature-item" style={{marginBottom:'0.5rem'}}>
        <div className="feature-icon">📅</div>
        <div className="muted">Operasional 07:00 - 22:00 (break 17:00 - 18:00)</div>
      </div>
      <div className="feature-item" style={{marginBottom:'0.5rem'}}>
        <div className="feature-icon">💰</div>
        <div className="muted">Pagi 15K • Siang 20K • Malam 30K</div>
      </div>
      <div className="feature-item" style={{marginBottom:'1rem'}}>
        <div className="feature-icon">🎁</div>
        <div className="muted">Bonus: Net + 2 bola gratis!</div>
      </div>
      <button 
        className="btn btn-primary mt-2" 
        onClick={handleChatClick}
        disabled={lapangan.status !== 'tersedia'}
        style={{ width: '100%' }}
      >
        {lapangan.status === 'tersedia' ? 'Chat Untuk Booking' : 'Tidak Tersedia'}
      </button>
    </div>
  );
};

export default LapanganCard;
