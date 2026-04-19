<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Midtrans Configuration
    |--------------------------------------------------------------------------
    |
    | Konfigurasi untuk Midtrans Payment Gateway
    | Dapatkan credentials dari: https://dashboard.midtrans.com/
    |
    */

    // Server Key untuk backend API calls
    'server_key' => env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-xxxxxxxxxxxxx'),

    // Client Key untuk frontend Snap.js
    'client_key' => env('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-xxxxxxxxxxxxx'),

    // Environment: 'sandbox' atau 'production'
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),

    // Enable sanitization
    'is_sanitized' => true,

    // Enable 3D Secure for credit card
    'is_3ds' => true,
];
