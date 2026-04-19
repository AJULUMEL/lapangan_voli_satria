@echo off
REM Quick Test Payment Script for Windows
REM Jalankan script ini untuk test pembayaran cepat

echo ================================
echo 🚀 QUICK PAYMENT TEST
echo ================================
echo.

REM Check backend
echo 📡 Checking backend server...
curl -s http://localhost:8000/api/v1/lapangans >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend running on http://localhost:8000
) else (
    echo ❌ Backend NOT running!
    echo    Run: cd backend ^&^& php artisan serve
    pause
    exit /b 1
)

REM Check frontend
echo 📡 Checking frontend server...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend running on http://localhost:5173
) else (
    echo ❌ Frontend NOT running!
    echo    Run: cd frontend ^&^& npm run dev
    pause
    exit /b 1
)

echo.
echo ================================
echo ✅ All systems ready!
echo ================================
echo.
echo 📝 Next steps:
echo 1. Open: http://localhost:5173
echo 2. Click 'Booking' menu
echo 3. Select lapangan ^& date
echo 4. Pick time slot
echo 5. Fill form ^& submit
echo 6. Choose payment method
echo 7. Complete payment!
echo.
echo 🧪 Test Card: 4811 1111 1111 1114
echo.
echo ================================
echo.
pause
