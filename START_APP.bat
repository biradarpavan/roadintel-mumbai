@echo off
title RoadSafe Mumbai - Starting...
color 0B
echo.
echo  ============================================================
echo    RoadSafe Mumbai — Unified Road Accident Intelligence
echo    Starting Full Stack Application...
echo  ============================================================
echo.

:: Check Python
echo [1/4] Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Python not found. Install Python 3.8+ from https://python.org
    pause
    exit /b 1
)
echo  OK: Python found.

:: Check Java
echo [2/4] Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Java not found. Install Java 17+ from https://adoptium.net
    pause
    exit /b 1
)
echo  OK: Java found.

:: Check Maven
echo [3/4] Checking Maven...
call mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Maven not found. Install Maven 3.8+ and add to PATH.
    pause
    exit /b 1
)
echo  OK: Maven found.

:: Check Node
echo [4/4] Checking Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Node.js not found. Install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)
echo  OK: Node.js found.

echo.
echo  ============================================================
echo  STEP 1: Running Python Data Pipeline...
echo  ============================================================
cd data-pipeline
pip install pandas numpy scikit-learn scipy requests -q
python run_pipeline.py
if %errorlevel% neq 0 (
    echo  Pipeline failed! Check logs above.
    pause
    exit /b 1
)
cd ..

echo.
echo  ============================================================
echo  STEP 2: Starting Spring Boot Backend (port 8080)...
echo  ============================================================
cd backend
start "RoadSafe Backend" cmd /k "mvn spring-boot:run && pause"
cd ..

echo.
echo  Waiting 25 seconds for backend to start...
timeout /t 25 /nobreak >nul

echo.
echo  ============================================================
echo  STEP 3: Starting React Frontend (port 5173)...
echo  ============================================================
cd frontend
if not exist node_modules (
    echo  Installing npm packages...
    call npm install
)
start "RoadSafe Frontend" cmd /k "npm run dev && pause"
cd ..

echo.
echo  Waiting 5 seconds for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo  ============================================================
echo   Application is RUNNING!
echo.  
echo   FRONTEND:  http://localhost:5173
echo   BACKEND:   http://localhost:8080
echo   API DOCS:  http://localhost:8080/api/dashboard/summary
echo   H2 DB:     http://localhost:8080/h2-console
echo  ============================================================
echo.
echo  Opening browser...
start http://localhost:5173

echo  Press any key to exit this launcher (services keep running)
pause >nul
