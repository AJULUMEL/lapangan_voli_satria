<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Lapangan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Get jadwal booking untuk lapangan tertentu di tanggal tertentu
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function jadwal(Request $request)
    {
        try {
            // Set timezone explicitly to Asia/Jakarta
            date_default_timezone_set('Asia/Jakarta');
            
            $validator = Validator::make($request->all(), [
                'lapangan_id' => 'required|exists:lapangans,id',
                'tanggal' => 'required|date|date_format:Y-m-d',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $lapangan_id = $request->lapangan_id;
            $tanggal = $request->tanggal;

            // Ambil semua booking yang sudah ada
            $bookedSlots = Booking::getBookedSlots($lapangan_id, $tanggal);

            // Check apakah booking untuk hari ini
            $today = Carbon::now('Asia/Jakarta')->format('Y-m-d');
            $isToday = ($tanggal === $today);
            $currentTime = Carbon::now('Asia/Jakarta');

            // Generate jam operasional (07:00 - 22:00)
            $jamOperasional = [];
            for ($hour = 7; $hour < 22; $hour++) {
                // Skip jam break (17:00 - 18:00)
                if ($hour == 17) {
                    continue;
                }

                $jamMulai = str_pad($hour, 2, '0', STR_PAD_LEFT) . ':00';
                $jamSelesai = str_pad($hour + 1, 2, '0', STR_PAD_LEFT) . ':00';
                
                // Jika booking untuk hari ini, skip slot yang sudah lewat
                if ($isToday) {
                    // Buat Carbon object untuk slot ini dengan tanggal dan jam yang tepat
                    $slotStartTime = Carbon::createFromFormat('Y-m-d H:i', $tanggal . ' ' . $jamMulai);
                    
                    // Jika jam mulai <= jam sekarang, skip (sudah tidak bisa dipilih)
                    if ($slotStartTime <= $currentTime) {
                        continue;
                    }
                }
                
                // Tentukan harga per jam berdasarkan tier waktu
                if ($hour >= 7 && $hour < 14) {
                    $harga = 15000; // Pagi: 07:00-14:00
                } elseif ($hour >= 14 && $hour < 17) {
                    $harga = 20000; // Siang: 14:00-17:00
                } else {
                    $harga = 30000; // Malam: 18:00-22:00
                }
                
                // Check apakah jam ini sudah dibooking
                $isBooked = false;
                foreach ($bookedSlots as $slot) {
                    $slotMulai = Carbon::parse($slot->jam_mulai)->format('H:i');
                    $slotSelesai = Carbon::parse($slot->jam_selesai)->format('H:i');
                    
                    if (($jamMulai >= $slotMulai && $jamMulai < $slotSelesai) ||
                        ($jamSelesai > $slotMulai && $jamSelesai <= $slotSelesai) ||
                        ($jamMulai <= $slotMulai && $jamSelesai >= $slotSelesai)) {
                        $isBooked = true;
                        break;
                    }
                }
                
                $jamOperasional[] = [
                    'jam_mulai' => $jamMulai,
                    'jam_selesai' => $jamSelesai,
                    'harga' => $harga,
                    'tersedia' => !$isBooked
                ];
            }

            // Tambahkan info paket siang
            $paketSiangTersedia = true;
            foreach ($bookedSlots as $slot) {
                $slotMulai = Carbon::parse($slot->jam_mulai)->format('H:i');
                $slotSelesai = Carbon::parse($slot->jam_selesai)->format('H:i');
                
                // Cek apakah ada booking yang overlap dengan 14:00-17:00
                if (($slotMulai >= '14:00' && $slotMulai < '17:00') ||
                    ($slotSelesai > '14:00' && $slotSelesai <= '17:00') ||
                    ($slotMulai <= '14:00' && $slotSelesai >= '17:00')) {
                    $paketSiangTersedia = false;
                    break;
                }
            }

            // Tambahkan info paket malam
            $paketMalamTersedia = true;
            foreach ($bookedSlots as $slot) {
                $slotMulai = Carbon::parse($slot->jam_mulai)->format('H:i');
                $slotSelesai = Carbon::parse($slot->jam_selesai)->format('H:i');
                
                // Cek apakah ada booking yang overlap dengan 18:00-22:00
                if (($slotMulai >= '18:00' && $slotMulai < '22:00') ||
                    ($slotSelesai > '18:00' && $slotSelesai <= '22:00') ||
                    ($slotMulai <= '18:00' && $slotSelesai >= '22:00')) {
                    $paketMalamTersedia = false;
                    break;
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil jadwal',
                'data' => [
                    'lapangan_id' => $lapangan_id,
                    'tanggal' => $tanggal,
                    'jadwal' => $jamOperasional,
                    'jadwal_kosong' => empty($jamOperasional),
                    'jadwal_tutup_untuk_hari_ini' => ($isToday && empty($jamOperasional)),
                    'debug_info' => [
                        'is_today' => $isToday,
                        'current_time' => $currentTime->format('Y-m-d H:i:s'),
                        'timezone' => date_default_timezone_get(),
                        'total_slots_generated' => count($jamOperasional)
                    ],
                    'paket_siang' => [
                        'jam_mulai' => '14:00',
                        'jam_selesai' => '17:00',
                        'harga' => 50000,
                        'harga_normal' => 60000,
                        'hemat' => 10000,
                        'tersedia' => $paketSiangTersedia
                    ],
                    'paket_malam' => [
                        'jam_mulai' => '18:00',
                        'jam_selesai' => '22:00',
                        'harga' => 100000,
                        'harga_normal' => 120000,
                        'hemat' => 20000,
                        'tersedia' => $paketMalamTersedia
                    ],
                    'info_harga' => [
                        'pagi' => '07:00 - 14:00 = Rp 15.000/jam',
                        'siang' => '14:00 - 17:00 = Rp 20.000/jam',
                        'malam' => '18:00 - 22:00 = Rp 30.000/jam',
                        'break' => '17:00 - 18:00 = Tutup (Break)',
                        'paket_siang' => 'Paket 14:00 - 17:00 = Rp 50.000 (hemat Rp 10.000)',
                        'paket_malam' => 'Paket 18:00 - 22:00 = Rp 100.000 (hemat Rp 20.000)'
                    ],
                    'fasilitas' => [
                        'included' => [
                            'Net voli berkualitas',
                            '2 bola voli standar'
                        ],
                        'note' => 'Setiap penyewaan sudah termasuk net dan 2 bola'
                    ]
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil jadwal',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store booking baru
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            // Set timezone explicitly
            date_default_timezone_set('Asia/Jakarta');
            
            $validator = Validator::make($request->all(), [
                'lapangan_id' => 'required|exists:lapangans,id',
                'tanggal' => 'required|date|date_format:Y-m-d|after_or_equal:today',
                'jam_mulai' => 'required|date_format:H:i',
                'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
                'nama_penyewa' => 'required|string|max:255',
                'no_hp' => 'required|string|max:20',
                'tipe_booking' => 'nullable|in:reguler,paket_malam',
                'keterangan' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Validasi jam operasional (07:00 - 22:00, skip 17:00-18:00)
            $jamMulai = Carbon::parse($request->jam_mulai);
            $jamSelesai = Carbon::parse($request->jam_selesai);
            
            // Validasi jam operasional
            if ($jamMulai->hour < 7 || $jamSelesai->hour > 22) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jam operasional adalah 07:00 - 22:00'
                ], 422);
            }

            // Validasi: Jika booking untuk hari ini, pastikan jam_mulai tidak sudah lewat
            $today = Carbon::now('Asia/Jakarta')->format('Y-m-d');
            if ($request->tanggal === $today) {
                $now = Carbon::now('Asia/Jakarta');
                $bookingTime = Carbon::createFromFormat('Y-m-d H:i', $request->tanggal . ' ' . $request->jam_mulai, new \DateTimeZone('Asia/Jakarta'));
                
                if ($bookingTime->lte($now)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Tidak bisa booking jam yang sudah lewat. Jam sekarang: ' . $now->format('H:i')
                    ], 422);
                }
            }

            // Validasi jam break (17:00 - 18:00)
            if (Booking::isBreakTime($request->jam_mulai, $request->jam_selesai)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Tidak bisa booking pada jam 17:00 - 18:00 (jam break)'
                ], 422);
            }

            // Validasi paket malam
            $tipeBooking = $request->tipe_booking ?? 'reguler';
            if ($tipeBooking === 'paket_malam' && !Booking::isPaketMalam($request->jam_mulai, $request->jam_selesai)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paket malam hanya berlaku untuk jam 18:00 - 22:00'
                ], 422);
            }

            // Validasi paket siang
            if ($tipeBooking === 'paket_siang' && !Booking::isPaketSiang($request->jam_mulai, $request->jam_selesai)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Paket siang hanya berlaku untuk jam 14:00 - 17:00'
                ], 422);
            }

            // Check apakah lapangan tersedia
            $lapangan = Lapangan::find($request->lapangan_id);
            if (!$lapangan || $lapangan->status !== 'tersedia') {
                return response()->json([
                    'success' => false,
                    'message' => 'Lapangan tidak tersedia'
                ], 422);
            }

            // Check apakah time slot tersedia (tidak bentrok)
            $isAvailable = Booking::isTimeSlotAvailable(
                $request->lapangan_id,
                $request->tanggal,
                $request->jam_mulai,
                $request->jam_selesai
            );

            if (!$isAvailable) {
                return response()->json([
                    'success' => false,
                    'message' => 'Jadwal bentrok dengan booking lain. Silakan pilih jam lain.'
                ], 422);
            }

            // Hitung total harga
            $totalHarga = Booking::hitungHarga($request->jam_mulai, $request->jam_selesai, $tipeBooking);

            // Create booking dengan status pending payment
            $booking = Booking::create([
                'lapangan_id' => $request->lapangan_id,
                'tanggal' => $request->tanggal,
                'jam_mulai' => $request->jam_mulai,
                'jam_selesai' => $request->jam_selesai,
                'nama_penyewa' => $request->nama_penyewa,
                'no_hp' => $request->no_hp,
                'status' => 'pending',
                'payment_status' => 'pending',
                'keterangan' => $request->keterangan,
                'tipe_booking' => $tipeBooking,
                'total_harga' => $totalHarga,
            ]);

            // Load relasi lapangan
            $booking->load('lapangan');

            return response()->json([
                'success' => true,
                'message' => 'Booking berhasil dibuat. Silakan lakukan pembayaran.',
                'data' => $booking
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all bookings (untuk admin)
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $bookings = Booking::with('lapangan')
                ->orderBy('tanggal', 'desc')
                ->orderBy('jam_mulai', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data booking',
                'data' => $bookings
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel booking
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function cancel($id)
    {
        try {
            $booking = Booking::find($id);

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking tidak ditemukan'
                ], 404);
            }

            $booking->status = 'cancelled';
            $booking->save();

            return response()->json([
                'success' => true,
                'message' => 'Booking berhasil dibatalkan',
                'data' => $booking
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal membatalkan booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hitung harga booking
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function hitungHarga(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'jam_mulai' => 'required|date_format:H:i',
                'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
                'tipe_booking' => 'nullable|in:reguler,paket_siang,paket_malam',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $tipeBooking = $request->tipe_booking ?? 'reguler';
            $totalHarga = Booking::hitungHarga($request->jam_mulai, $request->jam_selesai, $tipeBooking);
            
            $isPaketSiang = Booking::isPaketSiang($request->jam_mulai, $request->jam_selesai);
            $isPaketMalam = Booking::isPaketMalam($request->jam_mulai, $request->jam_selesai);
            
            $hargaNormal = null;
            $hemat = 0;
            
            if ($isPaketSiang) {
                $hargaNormal = 60000; // 3 jam × 20K
                $hemat = $hargaNormal - $totalHarga;
            } elseif ($isPaketMalam) {
                $hargaNormal = 120000; // 4 jam × 30K
                $hemat = $hargaNormal - $totalHarga;
            }

            return response()->json([
                'success' => true,
                'message' => 'Berhasil menghitung harga',
                'data' => [
                    'jam_mulai' => $request->jam_mulai,
                    'jam_selesai' => $request->jam_selesai,
                    'tipe_booking' => $tipeBooking,
                    'total_harga' => $totalHarga,
                    'is_paket_siang' => $isPaketSiang,
                    'is_paket_malam' => $isPaketMalam,
                    'harga_normal' => $hargaNormal,
                    'hemat' => $hemat
                ]
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghitung harga',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
