# Canteen Compass - Full Stack Application
## Complete Setup and Run Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Canteen Compass - Full Stack Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js not found. Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
if (Get-Command psql -ErrorAction SilentlyContinue) {
    Write-Host "✓ PostgreSQL installed" -ForegroundColor Green
} else {
    Write-Host "✗ PostgreSQL not found. Please install PostgreSQL from https://www.postgresql.org/download/windows/" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Setting up Database" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Check if database exists, if not create it
$dbExists = psql -U postgres -lqt | Select-String -Pattern "canteen_compass"

if (-not $dbExists) {
    Write-Host "Creating database..." -ForegroundColor Yellow
    createdb -U postgres canteen_compass
    
    # Run initialization script
    Write-Host "Initializing database schema..." -ForegroundColor Yellow
    psql -U postgres -d canteen_compass -f backend/database/init.sql
    
    Write-Host "✓ Database created and initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Database already exists" -ForegroundColor Green
}

Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Setting up Backend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Setup backend
Set-Location backend

# Create .env if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✓ Created backend/.env file" -ForegroundColor Green
}

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
npm install

# Seed database
Write-Host "Seeding database with sample data..." -ForegroundColor Yellow
npm run seed

Write-Host "✓ Backend setup complete" -ForegroundColor Green
Write-Host ""

# Go back to root
Set-Location ..

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Setting up Frontend" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Create .env if it doesn't exist
if (-not (Test-Path .env)) {
    Copy-Item .env.example .env
    Write-Host "✓ Created .env file" -ForegroundColor Green
}

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
npm install

Write-Host "✓ Frontend setup complete" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Green
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start the backend server:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Yellow
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. In a NEW terminal, start the frontend:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Open your browser at: http://localhost:5173" -ForegroundColor White
Write-Host ""
Write-Host "Default Login Credentials:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "Admin:     admin@canteen.ai / Admin@123" -ForegroundColor White
Write-Host "Manager:   manager@canteen.ai / Admin@123" -ForegroundColor White
Write-Host "Student:   john.smith@student.edu / Admin@123" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host ""
Write-Host "For detailed documentation, see BACKEND_README.md" -ForegroundColor Gray
Write-Host ""
