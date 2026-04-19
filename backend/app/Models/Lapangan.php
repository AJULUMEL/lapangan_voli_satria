<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lapangan extends Model
{
    use HasFactory;

    protected $table = 'lapangans';

    protected $fillable = [
        'nama',
        'harga_per_jam',
        'status',
        'deskripsi',
    ];

    protected $casts = [
        'harga_per_jam' => 'decimal:2',
    ];

    /**
     * Get bookings for this lapangan
     */
    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    /**
     * Scope untuk lapangan yang tersedia
     */
    public function scopeTersedia($query)
    {
        return $query->where('status', 'tersedia');
    }
}
