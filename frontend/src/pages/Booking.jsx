import React, { useState, useEffect } from 'react';
import { lapanganService, bookingService } from '../services/api';

const Booking = () => {
    const [lapangans, setLapangans] = useState([]);
    const [selectedLapangan, setSelectedLapangan] = useState(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [jadwal, setJadwal] = useState([]);
    const [selectedSlots, setSelectedSlots] = useState([]);
    const [paketInfo, setPaketInfo] = useState(null);
    const [jadwalTutupHariIni, setJadwalTutupHariIni] = useState(false);
    
    const [formData, setFormData] = useState({
        nama_penyewa: '',
        no_hp: '',
    });

    const [loadingJadwal, setLoadingJadwal] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [totalHarga, setTotalHarga] = useState(0);

    // Initialize
    useEffect(() => {
        fetchLapangans();
        const today = new Date().toISOString().split('T')[0];
        setSelectedDate(today);
    }, []);

    // Fetch jadwal when lapangan or date changes
    useEffect(() => {
        if (selectedLapangan && selectedDate) {
            fetchJadwal();
        }
    }, [selectedLapangan, selectedDate]);

    // Calculate total price when slots change
    useEffect(() => {
        if (selectedSlots.length > 0) {
            // Check if slots match paket siang (14:00-17:00)
            if (selectedSlots.length === 3 && 
                selectedSlots[0].jam_mulai === '14:00' && 
                selectedSlots[selectedSlots.length - 1].jam_selesai === '17:00') {
                setTotalHarga(50000); // Paket siang
            }
            // Check if slots match paket malam (18:00-22:00)
            else if (selectedSlots.length === 4 && 
                selectedSlots[0].jam_mulai === '18:00' && 
                selectedSlots[selectedSlots.length - 1].jam_selesai === '22:00') {
                setTotalHarga(100000); // Paket malam
            }
            // Regular calculation for other selections
            else {
                const harga = selectedSlots.reduce((sum, slot) => sum + (slot.harga || 0), 0);
                setTotalHarga(harga);
            }
        } else {
            setTotalHarga(0);
        }
    }, [selectedSlots]);

    const fetchLapangans = async () => {
        try {
            const response = await lapanganService.getAll();
            if (response.success && response.data.length > 0) {
                setLapangans(response.data);
                setSelectedLapangan(response.data[0]);
            }
        } catch (err) {
            console.error('Error fetching lapangans:', err);
        }
    };

    const fetchJadwal = async () => {
        try {
            setLoadingJadwal(true);
            setError(null);
            setSelectedSlots([]);
            setTotalHarga(0);

            const response = await bookingService.getJadwal(selectedLapangan.id, selectedDate);
            if (response.success) {
                // Check jika booking untuk hari ini, tambahkan flag 'passed' untuk slot yang sudah lewat
                const today = new Date().toISOString().split('T')[0];
                const isToday = selectedDate === today;
                
                let jadwalWithPassed = response.data.jadwal || [];
                if (isToday) {
                    const now = new Date();
                    const currentHour = now.getHours();
                    const currentMinute = now.getMinutes();
                    
                    jadwalWithPassed = jadwalWithPassed.map(slot => ({
                        ...slot,
                        passed: false, // Backend sudah filter, tapi untuk display tetap mark
                        tersedia: slot.tersedia && true // Keep tersedia true unless booking exists
                    }));
                }
                
                setJadwal(jadwalWithPassed);
                setJadwalTutupHariIni(response.data.jadwal_tutup_untuk_hari_ini || false);
                setPaketInfo({
                    paket_siang: response.data.paket_siang,
                    paket_malam: response.data.paket_malam
                });
            }
        } catch (err) {
            setError('Gagal memuat jadwal');
            console.error('Error fetching jadwal:', err);
            // Set default paket info even if API fails
            setPaketInfo({
                paket_siang: {
                    jam_mulai: '14:00',
                    jam_selesai: '17:00',
                    harga: 50000,
                    harga_normal: 60000,
                    hemat: 10000,
                    tersedia: true
                },
                paket_malam: {
                    jam_mulai: '18:00',
                    jam_selesai: '22:00',
                    harga: 100000,
                    harga_normal: 120000,
                    hemat: 20000,
                    tersedia: true
                }
            });
        } finally {
            setLoadingJadwal(false);
        }
    };

    const handleLapanganChange = (e) => {
        const lapangan = lapangans.find(l => l.id === parseInt(e.target.value));
        setSelectedLapangan(lapangan);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeSlotSelect = (slot) => {
        // Jangan bisa select slot yang sudah passed atau tidak tersedia
        if (slot.passed || !slot.tersedia) {
            setError('Tidak bisa memilih slot yang sudah tidak tersedia');
            setTimeout(() => setError(null), 3000);
            return;
        }

        const exists = selectedSlots.find(
            (s) => s.jam_mulai === slot.jam_mulai && s.jam_selesai === slot.jam_selesai
        );

        let next = exists
            ? selectedSlots.filter((s) => s.jam_mulai !== slot.jam_mulai)
            : [...selectedSlots, slot];

        // Sort by start time
        next = next.sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));

        // Enforce contiguous selection
        if (next.length > 1) {
            const isContiguous = next.every((s, idx) => idx === 0 || s.jam_mulai === next[idx - 1].jam_selesai);
            if (!isContiguous) {
                next = [slot];
            }
        }

        setSelectedSlots(next);
    };

    const handlePaketSelect = (paket) => {
        const paketSlots = [
            {
                jam_mulai: paket.jam_mulai,
                jam_selesai: paket.jam_selesai,
                harga: paket.harga,
                isPaket: true
            }
        ];
        setSelectedSlots(paketSlots);
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleWhatsAppBooking = async (e) => {
        e.preventDefault();

        if (selectedSlots.length === 0) {
            setError('Silakan pilih jam booking');
            return;
        }

        if (!formData.nama_penyewa || !formData.no_hp) {
            setError('Nama dan nomor HP harus diisi');
            return;
        }

        try {
            setLoadingSubmit(true);
            const firstSlot = selectedSlots[0];
            const lastSlot = selectedSlots[selectedSlots.length - 1];
            const tanggalFormat = new Date(selectedDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });

            // Create WhatsApp message
            const message = `Halo, saya ingin mengkonfirmasi booking:

📍 Lapangan: ${selectedLapangan.nama}
📅 Tanggal: ${tanggalFormat}
⏰ Jam: ${firstSlot.jam_mulai} - ${lastSlot.jam_selesai} (${selectedSlots.length} jam)
👤 Nama: ${formData.nama_penyewa}
📱 No HP: ${formData.no_hp}
💰 Total: Rp ${totalHarga.toLocaleString('id-ID')}

Terima kasih!`;

            // Send to WhatsApp
            const whatsappUrl = `https://wa.me/6285923419636?text=${encodeURIComponent(message)}`;
            window.location.href = whatsappUrl;
            
            setSuccess('✅ Membuka WhatsApp untuk konfirmasi...');
        } catch (err) {
            setError('Gagal memproses booking');
            console.error(err);
        } finally {
            setLoadingSubmit(false);
        }
    };

    const getTimeSlotColor = (harga) => {
        if (harga <= 15000) return '#dbeafe'; // Pagi - biru muda
        if (harga <= 20000) return '#fef3c7'; // Siang - kuning
        return '#fecaca'; // Malam - merah muda
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', paddingTop: '2rem', paddingBottom: '3rem' }}>
            <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
                        📅 Booking Lapangan Voli
                    </h1>
                    <p style={{ color: '#6b7280', margin: 0 }}>Pesan lapangan favorit Anda dengan mudah</p>
                </div>

                {/* Alert */}
                {error && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        background: '#fee2e2',
                        border: '1px solid #fecaca',
                        borderRadius: '8px',
                        color: '#991b1b'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: '1rem',
                        marginBottom: '1.5rem',
                        background: '#dcfce7',
                        border: '1px solid #86efac',
                        borderRadius: '8px',
                        color: '#166534'
                    }}>
                        {success}
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                    {/* Card 1: Pilih Lapangan & Tanggal */}
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', margin: '0 0 1rem 0' }}>
                            1️⃣ Pilih Lapangan & Tanggal
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                Lapangan
                            </label>
                            <select
                                value={selectedLapangan?.id || ''}
                                onChange={handleLapanganChange}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer'
                                }}
                            >
                                {lapangans.map((lap) => (
                                    <option key={lap.id} value={lap.id}>
                                        {lap.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                Tanggal
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '6px',
                                    fontSize: '0.95rem',
                                    fontFamily: 'inherit',
                                    cursor: 'pointer'
                                }}
                            />
                        </div>

                        {/* Info Box */}
                        {selectedLapangan && (
                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                                <p style={{ fontWeight: '600', marginBottom: '0.75rem' }}>💰 Harga Per Jam:</p>
                                <div style={{ fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1rem' }}>
                                    <div>🌅 07:00-14:00: <strong>Rp 15.000</strong></div>
                                    <div>☀️ 14:00-17:00: <strong>Rp 20.000</strong></div>
                                    <div>🌙 18:00-22:00: <strong>Rp 30.000</strong></div>
                                </div>
                                <div style={{
                                    padding: '0.75rem',
                                    background: '#fef3c7',
                                    border: '1px solid #fcd34d',
                                    borderRadius: '6px',
                                    fontSize: '0.85rem'
                                }}>
                                    <strong>⚡ Paket Hemat Tersedia!</strong>
                                    <div style={{ marginTop: '0.5rem' }}>
                                        • Siang 3jam (14-17): Rp 50K
                                        <br />• Malam 4jam (18-22): Rp 100K
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Card 2: Pilih Jam */}
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1rem 0' }}>
                            2️⃣ Pilih Jam Booking
                        </h3>

                        {loadingJadwal ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0', color: '#6b7280' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</div>
                                <p>Memuat jadwal...</p>
                            </div>
                        ) : jadwal.length > 0 ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                                {jadwal.map((slot, idx) => {
                                    const isSelected = selectedSlots.some(
                                        (s) => s.jam_mulai === slot.jam_mulai && s.jam_selesai === slot.jam_selesai
                                    );
                                    const bgColor = getTimeSlotColor(slot.harga);
                                    
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => handleTimeSlotSelect(slot)}
                                            style={{
                                                padding: '0.75rem',
                                                border: isSelected ? '2px solid #3b82f6' : '1px solid #d1d5db',
                                                background: isSelected ? '#dbeafe' : bgColor,
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontWeight: isSelected ? '600' : 'normal',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            <div>{slot.jam_mulai} - {slot.jam_selesai}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.2rem' }}>
                                                Rp {slot.harga?.toLocaleString('id-ID') || '-'}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ) : jadwalTutupHariIni ? (
                            <div style={{
                                padding: '2rem 1rem',
                                textAlign: 'center',
                                background: '#fee2e2',
                                borderRadius: '8px',
                                color: '#991b1b',
                                border: '1px solid #fecaca'
                            }}>
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🏁</div>
                                <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>Lapangan Sudah Tutup</p>
                                <p style={{ margin: 0, fontSize: '0.9rem' }}>Jadwal operasional berakhir jam 22:00. Silakan pilih tanggal berikutnya.</p>
                            </div>
                        ) : (
                            <div style={{
                                padding: '2rem 1rem',
                                textAlign: 'center',
                                background: '#f0fdf4',
                                borderRadius: '8px',
                                color: '#4b5563'
                            }}>
                                <p style={{ margin: 0 }}>ℹ️ Tidak ada jadwal tersedia</p>
                            </div>
                        )}

                        {/* Selected Info */}
                        {selectedSlots.length > 0 && (
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                background: '#e0f2fe',
                                border: '2px solid #0284c7',
                                borderRadius: '8px'
                            }}>
                                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    ⏰ <strong>{selectedSlots[0].jam_mulai} - {selectedSlots[selectedSlots.length - 1].jam_selesai}</strong>
                                    <span style={{ marginLeft: '0.5rem', color: '#6b7280' }}>
                                        {selectedSlots[0].isPaket ? '(Paket)' : `(${selectedSlots.length} jam)`}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    color: '#0c4a6e',
                                    marginTop: '0.75rem'
                                }}>
                                    💰 Rp {totalHarga.toLocaleString('id-ID')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Card 3: Form & Tombol WhatsApp */}
                {selectedSlots.length > 0 && (
                    <div style={{
                        background: 'white',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: '0 0 1.5rem 0' }}>
                            3️⃣ Data Penyewa & Konfirmasi
                        </h3>

                        <form onSubmit={handleWhatsAppBooking}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Nama Penyewa *
                                    </label>
                                    <input
                                        type="text"
                                        name="nama_penyewa"
                                        value={formData.nama_penyewa}
                                        onChange={handleInputChange}
                                        placeholder="Nama lengkap"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        Nomor HP *
                                    </label>
                                    <input
                                        type="tel"
                                        name="no_hp"
                                        value={formData.no_hp}
                                        onChange={handleInputChange}
                                        placeholder="08xxxxxxxxxx"
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.75rem',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px',
                                            fontSize: '0.95rem',
                                            fontFamily: 'inherit',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Summary */}
                            <div style={{
                                padding: '1rem',
                                background: '#f0f9ff',
                                border: '1px solid #bfdbfe',
                                borderRadius: '8px',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem'
                            }}>
                                <div style={{ marginBottom: '0.5rem' }}>
                                    <strong>📍 {selectedLapangan.nama}</strong>
                                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                        {new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </div>
                                </div>
                                <div>
                                    <strong>⏰ {selectedSlots[0].jam_mulai} - {selectedSlots[selectedSlots.length - 1].jam_selesai}</strong>
                                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                        {selectedSlots.length} jam × Rp {(totalHarga / selectedSlots.length).toLocaleString('id-ID')} = <strong>Rp {totalHarga.toLocaleString('id-ID')}</strong>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loadingSubmit || !formData.nama_penyewa || !formData.no_hp}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: '#16a34a',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: loadingSubmit || !formData.nama_penyewa || !formData.no_hp ? 'not-allowed' : 'pointer',
                                    opacity: loadingSubmit || !formData.nama_penyewa || !formData.no_hp ? 0.6 : 1,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {loadingSubmit ? '⏳ Membuka WhatsApp...' : '💬 Konfirmasi via WhatsApp'}
                            </button>

                            <p style={{ fontSize: '0.8rem', color: '#6b7280', textAlign: 'center', marginTop: '1rem', margin: '1rem 0 0 0' }}>
                                ✅ Booking tersimpan otomatis dan langsung ke WhatsApp untuk konfirmasi
                            </p>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Booking;
