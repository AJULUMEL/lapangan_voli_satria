<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'lapangan_id',
        'tanggal',
        'jam_mulai',
        'jam_selesai',
        'nama_penyewa',
        'no_hp',
        'status',
        'keterangan',
        'tipe_booking',
        'total_harga',
        'payment_status',
        'payment_method',
        'transaction_id',
        'payment_url',
        'paid_at',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'total_harga' => 'decimal:2',
    ];

    // Konstanta harga
    const HARGA_PAGI = 15000; // 07:00 - 14:00
    const HARGA_SIANG = 20000; // 14:00 - 17:00
    const HARGA_MALAM = 30000; // 18:00 - 22:00
    const HARGA_PAKET_SIANG = 50000; // Paket 14:00 - 17:00 (3 jam)
    const HARGA_PAKET_MALAM = 100000; // Paket 18:00 - 22:00 (4 jam)

    /**
     * Get lapangan for this booking
     */
    public function lapangan()
    {
        return $this->belongsTo(Lapangan::class);
    }

    /**
     * Check if time slot overlaps with existing bookings
     */
    public static function isTimeSlotAvailable($lapangan_id, $tanggal, $jam_mulai, $jam_selesai, $exclude_id = null)
    {
        $query = self::where('lapangan_id', $lapangan_id)
            ->where('tanggal', $tanggal)
            ->where('status', '!=', 'cancelled')
            ->where(function ($q) use ($jam_mulai, $jam_selesai) {
                $q->whereBetween('jam_mulai', [$jam_mulai, $jam_selesai])
                  ->orWhereBetween('jam_selesai', [$jam_mulai, $jam_selesai])
                  ->orWhere(function ($q2) use ($jam_mulai, $jam_selesai) {
                      $q2->where('jam_mulai', '<=', $jam_mulai)
                         ->where('jam_selesai', '>=', $jam_selesai);
                  });
            });

        if ($exclude_id) {
            $query->where('id', '!=', $exclude_id);
        }

        return $query->count() === 0;
    }

    /**
     * Get booked time slots for a specific date and lapangan (hanya approved bookings)
     */
    public static function getBookedSlots($lapangan_id, $tanggal)
    {
        return self::where('lapangan_id', $lapangan_id)
            ->where('tanggal', $tanggal)
            ->where('status', 'approved')
            ->orderBy('jam_mulai')
            ->get(['jam_mulai', 'jam_selesai']);
    }

    /**
     * Cek apakah booking adalah paket malam (18:00 - 22:00)
     */
    public static function isPaketMalam($jam_mulai, $jam_selesai)
    {
        return $jam_mulai === '18:00' && $jam_selesai === '22:00';
    }

    /**
     * Cek apakah booking adalah paket siang (14:00 - 17:00)
     */
    public static function isPaketSiang($jam_mulai, $jam_selesai)
    {
        return $jam_mulai === '14:00' && $jam_selesai === '17:00';
    }

    /**
     * Validasi jam break (17:00 - 18:00)
     */
    public static function isBreakTime($jam_mulai, $jam_selesai)
    {
        $mulai = Carbon::parse($jam_mulai);
        $selesai = Carbon::parse($jam_selesai);
        $breakStart = Carbon::parse('17:00');
        $breakEnd = Carbon::parse('18:00');

        // Cek apakah ada overlap dengan jam break
        return ($mulai->hour >= 17 && $mulai->hour < 18) || 
               ($selesai->hour > 17 && $selesai->hour <= 18) ||
               ($mulai->hour < 17 && $selesai->hour > 18);
    }

    /**
     * Hitung total harga berdasarkan jam mulai dan jam selesai
     */
    public static function hitungHarga($jam_mulai, $jam_selesai, $tipe_booking = 'reguler')
    {
        // Jika paket siang
        if ($tipe_booking === 'paket_siang' && self::isPaketSiang($jam_mulai, $jam_selesai)) {
            return self::HARGA_PAKET_SIANG;
        }

        // Jika paket malam
        if ($tipe_booking === 'paket_malam' && self::isPaketMalam($jam_mulai, $jam_selesai)) {
            return self::HARGA_PAKET_MALAM;
        }

        $mulai = Carbon::parse($jam_mulai);
        $selesai = Carbon::parse($jam_selesai);
        $totalHarga = 0;

        // Loop setiap jam
        while ($mulai < $selesai) {
            $hour = $mulai->hour;
            
            // 07:00 - 14:00 = Rp 15.000/jam
            if ($hour >= 7 && $hour < 14) {
                $totalHarga += self::HARGA_PAGI;
            }
            // 14:00 - 17:00 = Rp 20.000/jam
            elseif ($hour >= 14 && $hour < 17) {
                $totalHarga += self::HARGA_SIANG;
            }
            // 18:00 - 22:00 = Rp 30.000/jam
            elseif ($hour >= 18 && $hour < 22) {
                $totalHarga += self::HARGA_MALAM;
            }

            $mulai->addHour();
        }

        return $totalHarga;
    }
}
