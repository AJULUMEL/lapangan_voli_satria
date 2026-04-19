#!/bin/bash

# Quick Test Payment Script
# Jalankan script ini untuk test pembayaran cepat

echo "================================"
echo "🚀 QUICK PAYMENT TEST"
echo "================================"
echo ""

# Check if servers are running
echo "📡 Checking servers..."
echo ""

# Check backend
if curl -s http://localhost:8000/api/v1/lapangans > /dev/null; then
    echo "✅ Backend running on http://localhost:8000"
else
    echo "❌ Backend NOT running!"
    echo "   Run: cd backend && php artisan serve"
    exit 1
fi

# Check frontend
if curl -s http://localhost:5173 > /dev/null; then
    echo "✅ Frontend running on http://localhost:5173"
else
    echo "❌ Frontend NOT running!"
    echo "   Run: cd frontend && npm run dev"
    exit 1
fi

echo ""
echo "================================"
echo "✅ All systems ready!"
echo "================================"
echo ""
echo "📝 Next steps:"
echo "1. Open: http://localhost:5173"
echo "2. Click 'Booking' menu"
echo "3. Select lapangan & date"
echo "4. Pick time slot"
echo "5. Fill form & submit"
echo "6. Choose payment method"
echo "7. Complete payment!"
echo ""
echo "🧪 Test Card: 4811 1111 1111 1114"
echo ""
echo "================================"
