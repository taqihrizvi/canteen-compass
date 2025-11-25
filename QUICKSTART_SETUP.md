# 🚀 Quick Start Guide - Canteen Compass

Get up and running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- PostgreSQL 12+ installed locally

## Step-by-Step Setup

### 1. Setup Database (1 minute)

\`\`\`powershell
# Create database
createdb canteen_compass

# Or using psql
psql -U postgres -c "CREATE DATABASE canteen_compass;"

# Run initialization script
psql -U postgres -d canteen_compass -f backend/database/init.sql
\`\`\`

### 2. Setup Backend (2 minutes)

\`\`\`powershell
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
Copy-Item .env.example .env

# Seed database with sample data
npm run seed

# Start backend server
npm run dev
\`\`\`

Backend runs on: http://localhost:3001

### 3. Setup Frontend (2 minutes)

Open a **new terminal** window:

\`\`\`powershell
# Go to project root
cd canteen-compass

# Install dependencies
npm install

# Create environment file
Copy-Item .env.example .env

# Start frontend
npm run dev
\`\`\`

Frontend runs on: http://localhost:5173

## 🎉 You're Ready!

Open http://localhost:5173 in your browser.

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@canteen.ai | Admin@123 |
| **Manager** | manager@canteen.ai | Admin@123 |
| **Student** | john.smith@student.edu | Admin@123 |

## What to Try

### As Admin
1. Login with admin credentials
2. Go to Dashboard - see system stats
3. Create new users (Students/Managers)
4. View all users and orders

### As Canteen Manager
1. Login with manager credentials
2. View sales insights
3. Manage incoming orders
4. Add/edit menu items

### As Student
1. Login with student credentials
2. Browse available menus
3. Place an order
4. View order history

## Troubleshooting

### Database Connection Error
\`\`\`powershell
# Check if PostgreSQL service is running
Get-Service postgresql*

# Start PostgreSQL service if stopped
Start-Service postgresql-x64-<version>

# Or check with psql
psql -U postgres -c "SELECT version();"
\`\`\`

### Database Already Exists
If database exists, drop and recreate:
\`\`\`powershell
dropdb canteen_compass
createdb canteen_compass
psql -U postgres -d canteen_compass -f backend/database/init.sql
\`\`\`

## Stop Services

\`\`\`powershell
# Stop backend (Ctrl+C in backend terminal)

# Stop frontend (Ctrl+C in frontend terminal)

# PostgreSQL continues running in background (no need to stop)
\`\`\`

## Stop Services

\`\`\`powershell
# Stop backend (Ctrl+C in backend terminal)

# Stop frontend (Ctrl+C in frontend terminal)

# Stop database
docker-compose down
\`\`\`

## Need Help?

See BACKEND_README.md for:
- Complete API documentation
- Detailed feature descriptions
- Production deployment guide
- Environment variable reference

## Next Steps

1. ✅ Explore the admin dashboard
2. ✅ Create test users
3. ✅ Place some orders as a student
4. ✅ Manage orders as canteen manager
5. ✅ Check sales analytics

Enjoy using Canteen Compass! 🎉
