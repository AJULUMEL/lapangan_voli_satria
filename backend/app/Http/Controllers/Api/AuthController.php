<?php

namespace App\Http\Controllers\Api;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Controllers\Controller;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // Set timezone explicitly for consistency
        date_default_timezone_set('Asia/Jakarta');
        
        $validated = $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        // Cari admin berdasarkan username
        $admin = Admin::where('username', $validated['username'])->first();

        // Validasi password
        if (!$admin || !Hash::check($validated['password'], $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Username atau password salah'
            ], 401);
        }

        // Generate simple token (bisa diganti dengan JWT di kemudian hari)
        $token = hash('sha256', $admin->id . $admin->username . time());
        
        // Store token di session atau bisa disimpan ke database
        // Untuk sekarang kita gunakan token yang di-generate
        
        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'admin_id' => $admin->id,
                'username' => $admin->username,
                'nama' => $admin->nama,
                'token' => $token
            ]
        ]);
    }

    public function logout(Request $request)
    {
        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);
    }
}
