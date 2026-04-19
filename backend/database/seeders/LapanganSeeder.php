<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LapanganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('lapangans')->insert([
            [
                'nama' => 'Lapangan Utama Satria',
                'harga_per_jam' => 50000,
                'status' => 'tersedia',
                'deskripsi' => 'Lapangan voli outdoor premium dengan lantai interlock berkualitas tinggi, net standar nasional, lampu LED spektrum penuh untuk malam hari, area penonton tersedia, fasilitas lengkap untuk turnamen dan latihan profesional.',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
