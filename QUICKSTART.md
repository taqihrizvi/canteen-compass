# 🚀 Quick Start Guide - Canteen Compass

## Getting Started in 3 Steps

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Start the Development Server
```bash
npm run dev
```

### 3️⃣ Open Your Browser
Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 🔐 Demo Accounts

### Admin Account
- **Email**: `admin@canteen.ai`
- **Password**: Any password (e.g., `admin123`)
- **Redirects to**: Admin Dashboard

### Customer Account  
- **Email**: Any email except `admin@canteen.ai` (e.g., `customer@example.com`)
- **Password**: Any password
- **Redirects to**: Customer Menu

---

## 📱 Features by Role

### 👤 Customer Portal Features
1. **Menu** (`/menu`)
   - Browse menu items with personalized AI recommendations
   - Add items to cart
   - View nutritional information
   - Search and filter by category
   - **Test Notifications** button to see customer alerts

2. **Orders** (`/orders`)
   - View order history
   - Reorder favorite items
   - Track order status

3. **Profile** (`/profile`)
   - Manage personal information
   - Set dietary preferences (vegetarian, vegan, etc.)
   - View loyalty tier and points
   - Track spending statistics

### 👨‍💼 Admin Portal Features
1. **Dashboard** (`/`)
   - Real-time metrics (revenue, sales, stock, customers)
   - Top performing items
   - Smart alerts
   - **Test Notifications** button to see admin alerts

2. **Sales Forecast** (`/forecast`)
   - 7-day sales predictions
   - Hourly breakdown
   - Category forecasts
   - Staffing recommendations
   - External factors (weather, events)

3. **Recommendations** (`/recommendations`)
   - **For You** tab: Personalized meal suggestions for customers
   - **Combo Deals** tab: Bundle offers with savings
   - **Trending** tab: Popular items right now
   - **Business Insights** tab: Menu optimization for admins

4. **Inventory** (`/inventory`)
   - Stock level tracking
   - Low-stock alerts
   - Reorder suggestions

5. **Customers** (`/customers`)
   - Customer analytics
   - Segmentation
   - High-value customers

6. **Settings** (`/settings`)
   - System configuration
   - User management

---

## 🔔 Testing Notifications

Both portals include a "Test Notifications" button:

### Customer Notifications
- Order confirmation
- Loyalty points earned
- Recommended combos
- Special offers

### Admin Notifications
- Low stock alerts
- Top performer updates
- Peak hour warnings

Click the **bell icon** button to see demo notifications in action!

---

## 🎨 Key UI Components

### Navigation
- **Customer**: Top navigation bar with Menu, Orders, Profile
- **Admin**: Left sidebar with Dashboard, Forecast, Recommendations, etc.

### Interactive Elements
- **Cart**: Real-time updates with add/remove functionality
- **Charts**: Interactive visualizations using Recharts
- **Forms**: Validated inputs with instant feedback
- **Search**: Live filtering across menu items

---

## 🛠️ Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

---

## 📂 Important Files

### Core Application
- `src/App.tsx` - Main app with routing
- `src/contexts/AuthContext.tsx` - Authentication logic
- `src/services/notificationService.ts` - Notification helpers

### Customer Pages
- `src/pages/Menu.tsx` - Menu browser with cart
- `src/pages/OrderHistory.tsx` - Order tracking
- `src/pages/Profile.tsx` - User profile & preferences

### Admin Pages
- `src/pages/Dashboard.tsx` - Metrics dashboard
- `src/pages/Forecast.tsx` - Sales predictions
- `src/pages/Recommendations.tsx` - AI recommendations

### Layouts
- `src/components/Layout/CustomerLayout.tsx` - Customer portal layout
- `src/components/Layout/DashboardLayout.tsx` - Admin portal layout

---

## 💡 Tips & Tricks

### Testing Different User Roles
1. Logout from the current account
2. Go to `/login`
3. Use `admin@canteen.ai` for admin or any other email for customer

### Exploring Recommendations
- Admin sees business insights about menu optimization
- Customers see personalized meal suggestions
- Both views use the same underlying data structure

### Cart Functionality
- Cart persists during session
- Quantity can be adjusted with +/- buttons
- Remove items with X button
- Cart sidebar shows running total

### Loyalty System
- Customers earn points with each order
- Progress bar shows path to next tier
- Each tier unlocks different benefits

---

## 🔧 Troubleshooting

### Port Already in Use
If port 5173 is busy, Vite will automatically use the next available port (5174, 5175, etc.)

### Hot Module Replacement Issues
If changes aren't reflecting, try:
```bash
# Stop the server (Ctrl+C)
# Clear node_modules/.vite cache
npm run dev
```

### Authentication Not Persisting
Check browser console for localStorage errors. Clear localStorage if needed:
```javascript
// In browser console
localStorage.clear();
```

---

## 🎯 Next Steps

1. **Backend Integration**: Replace mock data with real API calls
2. **Database**: Connect to PostgreSQL/MongoDB for persistence
3. **OpenAI**: Add API key for AI-generated insights
4. **Weather API**: Integrate real weather data
5. **Payment**: Add Stripe/PayPal for checkout
6. **Deployment**: Deploy to Vercel/Netlify

---

## 📞 Support

For issues or questions:
- Check the main [README.md](README.md) for detailed documentation
- Review error messages in browser console
- Ensure all dependencies are installed correctly

---

Happy coding! 🎉
