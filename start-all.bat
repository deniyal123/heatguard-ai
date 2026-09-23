@echo off
echo ====================================================
echo  Starting HeatGuard AI Services...
echo ====================================================

start "Python ML Service" cmd /k "cd /d "%~dp0ml-service" && "C:\Users\Admin\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" -m uvicorn main:app --host 127.0.0.1 --port 8000"
timeout /t 3 /nobreak >nul

start "Node.js Express Backend" cmd /k "cd /d "%~dp0node-backend" && node server.js"
timeout /t 2 /nobreak >nul

start "React Vite Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ====================================================
echo  All 3 services are launching in separate windows!
echo  - Python ML API: http://127.0.0.1:8000
echo  - Node.js API:   http://127.0.0.1:5000
echo  - React App:     http://localhost:5173
echo ====================================================
pause
