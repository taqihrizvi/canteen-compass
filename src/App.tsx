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
import Recommendations from "./pages/Recommendations";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Settings from "./pages/Settings";
import UserManagement from "./pages/UserManagement";

// Customer Pages
import Menu from "./pages/Menu";
import OrderHistory from "./pages/OrderHistory";
import Profile from "./pages/Profile";

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
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Dashboard />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/users" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/forecast" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Forecast />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/recommendations" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Recommendations />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/inventory" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Inventory />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/customers" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <Customers />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
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

            {/* Catch-all Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
