# Canteen Compass - Full Stack Application

A comprehensive canteen management system with role-based access control, built with React + TypeScript frontend and Node.js + Express backend with PostgreSQL database.

## 🚀 Features

### User Types
- **Admin**: Full system control - create/manage users, view system stats
- **Canteen Manager**: Sales insights, order management, menu CRUD operations
- **Student**: View food suggestions, place orders, track order history

### Key Features
- 🔐 JWT-based authentication with refresh tokens
- 👥 Role-based access control (RBAC)
- 📊 Real-time sales analytics and insights
- 🍽️ Menu management with categories
- 📦 Order tracking and management
- 🎯 AI-powered food suggestions for students
- 📈 Sales reports (daily/weekly/monthly)
- 🔔 Order status notifications
- 📱 Fully responsive UI

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher) OR Docker
- npm or yarn package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd canteen-compass
\`\`\`

### 2. Database Setup (Local PostgreSQL)

Make sure PostgreSQL is installed and running on your system.

\`\`\`powershell
# Create database
createdb canteen_compass

# Or using psql
psql -U postgres -c "CREATE DATABASE canteen_compass;"

# Run initialization script
psql -U postgres -d canteen_compass -f backend/database/init.sql
\`\`\`

**Note:** Update `backend/.env` with your PostgreSQL credentials if different from defaults.

### 3. Backend Setup

\`\`\`powershell
cd backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env with your PostgreSQL credentials
# Update DB_USER, DB_PASSWORD, DB_HOST, DB_PORT if needed

# Seed database with initial data
npm run seed

# Start backend server
npm run dev
\`\`\`

Backend will run on `http://localhost:3001`

### 4. Frontend Setup

\`\`\`bash
### 4. Frontend Setup

\`\`\`powershell
cd ..  # Go back to root directory

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Start frontend development server
npm run dev
\`\`\`
## 🔑 Default Credentials

After seeding the database, use these credentials:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@canteen.ai | Admin@123 |
| **Manager** | manager@canteen.ai | Admin@123 |
| **Student** | john.smith@student.edu | Admin@123 |

## 📁 Project Structure

\`\`\`
canteen-compass/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts         # Database connection
│   │   ├── controllers/            # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── adminController.ts
│   │   │   ├── studentController.ts
│   │   │   └── canteenManagerController.ts
│   │   ├── services/              # Business logic
│   │   │   ├── authService.ts
│   │   │   ├── adminService.ts
│   │   │   ├── studentService.ts
│   │   │   └── canteenManagerService.ts
│   │   ├── routes/                # API routes
│   │   │   ├── authRoutes.ts
│   │   │   ├── adminRoutes.ts
│   │   │   ├── studentRoutes.ts
│   │   │   └── canteenManagerRoutes.ts
│   │   ├── middleware/            # Express middleware
│   │   │   ├── auth.ts           # JWT authentication
│   │   │   └── errorHandler.ts
│   │   ├── types/                # TypeScript types
│   │   ├── scripts/              # Database scripts
│   │   └── server.ts             # Entry point
│   ├── database/
│   │   ├── init.sql              # Database schema
│   │   └── seed.sql              # Sample data
│   ├── package.json
│   └── tsconfig.json
├── src/                          # Frontend source
│   ├── components/               # React components
│   ├── pages/                    # Page components
│   ├── contexts/                 # React contexts
│   ├── lib/                      # Utilities
│   │   ├── api.ts               # API functions
│   │   └── apiClient.ts         # Axios instance
│   └── App.tsx
├── docker-compose.yml            # Docker configuration
└── README.md
\`\`\`

## 🔌 API Documentation

### Base URL
\`http://localhost:3001/api\`

### Authentication Endpoints

#### POST /auth/login
Login user and get tokens.

**Request:**
\`\`\`json
{
  "email": "admin@canteen.ai",
  "password": "Admin@123"
}
\`\`\`

**Response:**
\`\`\`json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "System Admin",
    "email": "admin@canteen.ai",
    "role": "admin"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
\`\`\`

#### POST /auth/refresh
Refresh access token.

**Request:**
\`\`\`json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
\`\`\`

#### GET /auth/me
Get current user info (requires auth).

#### POST /auth/logout
Logout user (requires auth).

### Admin Endpoints (requires admin role)

#### POST /admin/users
Create new user.

**Request:**
\`\`\`json
{
  "name": "New Student",
  "email": "student@example.com",
  "password": "SecurePass123",
  "role": "student"
}
\`\`\`

#### GET /admin/users?page=1&limit=50
Get all users with pagination.

#### GET /admin/users/:id
Get user by ID.

#### PUT /admin/users/:id
Update user.

**Request:**
\`\`\`json
{
  "name": "Updated Name",
  "is_active": true
}
\`\`\`

#### DELETE /admin/users/:id
Delete user.

#### GET /admin/stats
Get system statistics.

**Response:**
\`\`\`json
{
  "totalUsers": 15,
  "totalStudents": 10,
  "totalOrders": 45,
  "totalMenuItems": 12,
  "totalRevenue": 523.45,
  "todayOrders": 8,
  "recentOrders": [...]
}
\`\`\`

### Student Endpoints (requires student role)

#### GET /student/suggestions
Get personalized food suggestions.

#### GET /student/menus
Get available menu items.

#### POST /student/orders
Place new order.

**Request:**
\`\`\`json
{
  "menuId": 1,
  "quantity": 2,
  "notes": "Extra spicy please"
}
\`\`\`

#### GET /student/orders?page=1&limit=20
Get order history with pagination.

#### GET /student/orders/:id
Get specific order details.

#### PATCH /student/orders/:id/cancel
Cancel pending order.

### Canteen Manager Endpoints (requires canteen_manager role)

#### GET /manager/sales?period=daily
Get sales insights (daily/weekly/monthly).

**Response:**
\`\`\`json
{
  "overview": {
    "total_orders": 45,
    "total_revenue": 523.45,
    "average_order_value": 11.63,
    "unique_customers": 12
  },
  "topItems": [...],
  "revenueByDay": [...],
  "period": "daily"
}
\`\`\`

#### GET /manager/orders?status=pending
Get incoming orders (filtered by status).

#### PATCH /manager/orders/:id/status
Update order status.

**Request:**
\`\`\`json
{
  "status": "preparing"
}
\`\`\`

#### GET /manager/menus
Get all menu items.

#### POST /manager/menus
Create new menu item.

**Request:**
\`\`\`json
{
  "title": "Chicken Curry",
  "description": "Spicy chicken curry with rice",
  "price": 12.99,
  "category": "Main Course",
  "image_url": "https://example.com/image.jpg"
}
\`\`\`

#### PUT /manager/menus/:id
Update menu item.

#### DELETE /manager/menus/:id
Delete menu item.

## 🔒 Authentication Flow

1. User logs in with email/password
2. Backend validates credentials and returns JWT tokens
3. Frontend stores `accessToken` and `refreshToken` in localStorage
4. All API requests include `Authorization: Bearer <accessToken>` header
5. If token expires, frontend automatically refreshes using refresh token
6. If refresh fails, user is redirected to login

## 🎨 Frontend Features

- **Clean UI**: Modern design with Tailwind CSS and shadcn/ui components
- **Responsive**: Mobile-friendly layouts
- **Loading States**: Skeleton loaders for better UX
- **Error Handling**: User-friendly error messages
- **Protected Routes**: Role-based route guards
- **Notifications**: Toast notifications for actions

## 🐳 Docker Commands

\`\`\`bash
## 🗄️ PostgreSQL Management

\`\`\`powershell
# Check PostgreSQL service status
Get-Service postgresql*

# Start PostgreSQL service
Start-Service postgresql-x64-<version>

# Stop PostgreSQL service
Stop-Service postgresql-x64-<version>

# Connect to database
psql -U postgres -d canteen_compass

# View all tables
psql -U postgres -d canteen_compass -c "\dt"

# Reset database
dropdb canteen_compass
createdb canteen_compass
psql -U postgres -d canteen_compass -f backend/database/init.sql
cd backend
npm run seed
\`\`\`
### Test Backend API

\`\`\`bash
# Health check
curl http://localhost:3001/health

# Login test
curl -X POST http://localhost:3001/api/auth/login \\
  -H "Content-Type: application/json" \\
  -d '{"email":"admin@canteen.ai","password":"Admin@123"}'
\`\`\`

## 🚀 Production Deployment

### Backend

1. Set production environment variables
2. Build TypeScript: `npm run build`
3. Start server: `npm start`
4. Use PostgreSQL managed service (AWS RDS, etc.)

### Frontend

1. Update `VITE_API_BASE_URL` to production API
2. Build: `npm run build`
3. Deploy `dist` folder to hosting (Vercel, Netlify, etc.)

## 🔧 Environment Variables

### Backend (.env)

\`\`\`env
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
\`\`\`

### Frontend (.env)

\`\`\`env
VITE_API_BASE_URL=http://localhost:3001/api
\`\`\`

## 📝 License

MIT

## 👥 Support

For issues or questions, please contact your system administrator.
