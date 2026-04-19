<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LapanganController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Public API Routes
Route::prefix('v1')->group(function () {
    
    // Lapangan Routes
    Route::get('/lapangans', [LapanganController::class, 'index']);
    Route::get('/lapangans/{id}', [LapanganController::class, 'show']);
    
    // Booking Routes
    Route::get('/jadwal', [BookingController::class, 'jadwal']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
    Route::post('/hitung-harga', [BookingController::class, 'hitungHarga']);

    // Admin Auth Routes (Public)
    Route::post('/admin/login', [AuthController::class, 'login']);
    Route::post('/admin/logout', [AuthController::class, 'logout']);

    // Admin Routes (Protected - bisa ditambah middleware auth later)
    Route::get('/admin/bookings', [AdminController::class, 'getBookings']);
    Route::get('/admin/bookings/{id}', [AdminController::class, 'getBookingDetail']);
    Route::put('/admin/bookings/{id}/approve', [AdminController::class, 'approveBooking']);
    Route::put('/admin/bookings/{id}/reject', [AdminController::class, 'rejectBooking']);
    Route::get('/admin/lapangans', [AdminController::class, 'getLapangans']);
    Route::get('/admin/jadwal/{lapangan_id}/{tanggal}', [AdminController::class, 'getJadwalDetail']);
});
