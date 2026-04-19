<?php

namespace App\Http\Controllers\Api;

use App\Models\Booking;
use App\Models\Lapangan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class AdminController extends Controller
{
    /**
     * Get all bookings with filter
     */
    public function getBookings(Request $request)
    {
        $query = Booking::with('lapangan')
            ->orderBy('tanggal', 'asc')
            ->orderBy('jam_mulai', 'asc');

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by date
        if ($request->has('tanggal')) {
            $query->where('tanggal', $request->tanggal);
        }

        // Filter by lapangan
        if ($request->has('lapangan_id')) {
            $query->where('lapangan_id', $request->lapangan_id);
        }

        $bookings = $query->get();

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Get booking detail
     */
    public function getBookingDetail($id)
    {
        $booking = Booking::with('lapangan')->find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $booking
        ]);
    }

    /**
     * Approve booking - set status to approved dan jadwal tidak bisa digunakan
     */
    public function approveBooking($id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        // Update booking status to approved
        $booking->status = 'approved';
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil di-approve',
            'data' => $booking
        ]);
    }

    /**
     * Reject booking
     */
    public function rejectBooking($id, Request $request)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'success' => false,
                'message' => 'Booking tidak ditemukan'
            ], 404);
        }

        // Update booking status to rejected
        $booking->status = 'rejected';
        $booking->alasan_reject = $request->alasan ?? null;
        $booking->save();

        return response()->json([
            'success' => true,
            'message' => 'Booking berhasil di-reject',
            'data' => $booking
        ]);
    }

    /**
     * Get all lapangan
     */
    public function getLapangans()
    {
        $lapangans = Lapangan::all();

        return response()->json([
            'success' => true,
            'data' => $lapangans
        ]);
    }

    /**
     * Get jadwal for specific date and lapangan
     */
    public function getJadwalDetail($lapanganId, $tanggal)
    {
        // Get all bookings for this lapangan and date
        $bookings = Booking::where('lapangan_id', $lapanganId)
            ->where('tanggal', $tanggal)
            ->where('status', 'approved')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'lapangan_id' => $lapanganId,
                'tanggal' => $tanggal,
                'bookings' => $bookings
            ]
        ]);
    }
}
