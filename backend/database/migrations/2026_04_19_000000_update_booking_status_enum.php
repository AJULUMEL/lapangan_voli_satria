<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations - Update booking status enum to match controller logic
     */
    public function up(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Drop and recreate the status enum with correct values
            // Using change() with raw SQL for MySQL
            DB::statement("ALTER TABLE bookings MODIFY status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            // Revert to original enum values
            DB::statement("ALTER TABLE bookings MODIFY status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending'");
        });
    }
};
