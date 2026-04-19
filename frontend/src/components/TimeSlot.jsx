import React from 'react';

const TimeSlot = ({ slot, isSelected, onSelect }) => {
  const handleClick = () => {
    if (!slot.tersedia) return;
    onSelect(slot);
  };

  const getStatusText = () => {
    if (slot.passed) {
      return 'Sudah lewat';
    }
    return slot.tersedia ? 'Tersedia' : 'Terisi';
  };

  return (
    <div
      className={`time-slot ${!slot.tersedia || slot.passed ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
      onClick={handleClick}
      style={{ minHeight: '44px', opacity: slot.passed ? 0.5 : 1 }}
      title={slot.passed ? `Jam ini sudah lewat` : ''}
    >
      <div style={{ fontWeight: 'bold' }}>
        {slot.jam_mulai} - {slot.jam_selesai}
      </div>
      <div style={{ fontSize: '0.85rem' }}>
        {getStatusText()}
      </div>
      {slot.harga && (
        <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>
          {Number(slot.harga).toLocaleString('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          })}
        </div>
      )}
    </div>
  );
};

export default TimeSlot;
