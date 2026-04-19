<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lapangan;
use Illuminate\Http\Request;

class LapanganController extends Controller
{
    /**
     * Get all available lapangans
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $lapangans = Lapangan::tersedia()->get();
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil data lapangan',
                'data' => $lapangans
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data lapangan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get single lapangan detail
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $lapangan = Lapangan::find($id);
            
            if (!$lapangan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Lapangan tidak ditemukan'
                ], 404);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Berhasil mengambil detail lapangan',
                'data' => $lapangan
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil detail lapangan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
