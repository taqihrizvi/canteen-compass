import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import RoleProtectedRoute from "@/components/RoleProtectedRoute";
import { CustomerLayout } from "@/components/Layout/CustomerLayout";

// Public Pages
import Home from "./pages/Home";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotAuthorized from "./pages/NotAuthorized";
import NotFound from "./pages/NotFound";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import AdminForecast from "./pages/AdminForecast";
import Recommendations from "./pages/Recommendations";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";
import Establishments from "./pages/Establishments";
import MenuManagement from "./pages/MenuManagement";
import Orders from "./pages/Orders";

// Customer Pages
import Menu from "./pages/Menu";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";
import Checkout from "./pages/Checkout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/not-authorized" element={<NotAuthorized />} />

            {/* Admin Routes */}
            <Route
              path="/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <Dashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/users"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <UserManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/establishments"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <Establishments />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/forecast"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <Forecast />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/admin-forecast"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <AdminForecast />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/menu-management"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <MenuManagement />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/orders-management"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <Orders />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/recommendations"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <Recommendations />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/inventory"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <Inventory />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <Customers />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <RoleProtectedRoute allowedRoles={['admin', 'canteen_manager']}>
                  <Settings />
                </RoleProtectedRoute>
              }
            />

            {/* Canteen Manager Routes */}
            <Route
              path="/manager/sales"
              element={
                <RoleProtectedRoute allowedRoles={['canteen_manager']}>
                  <Dashboard />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/manager/orders"
              element={
                <RoleProtectedRoute allowedRoles={['canteen_manager']}>
                  <Inventory />
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/manager/menus"
              element={
                <RoleProtectedRoute allowedRoles={['canteen_manager']}>
                  <Recommendations />
                </RoleProtectedRoute>
              }
            />

            {/* Student Routes */}
            <Route
              path="/menu"
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <CustomerLayout>
                    <Menu />
                  </CustomerLayout>
                </RoleProtectedRoute>
              }
            />
            {/* Student Routes */}
            <Route
              path="/menu"
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <CustomerLayout>
                    <Menu />
                  </CustomerLayout>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <CustomerLayout>
                    <OrderHistory />
                  </CustomerLayout>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <CustomerLayout>
                    <Profile />
                  </CustomerLayout>
                </RoleProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <CustomerLayout>
                    <Checkout />
                  </CustomerLayout>
                </RoleProtectedRoute>
              }
            />

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
