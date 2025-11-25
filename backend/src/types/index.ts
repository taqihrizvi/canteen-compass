export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'student' | 'canteen_manager';
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
}

export interface Menu {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Order {
  id: number;
  student_id: number;
  menu_id: number;
  quantity: number;
  total_price: number;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface FoodSuggestion {
  id: number;
  student_id: number;
  menu_id: number;
  suggestion_date: Date;
  reason: string;
  created_at: Date;
}

export interface SalesReport {
  report_date: Date;
  total_orders: number;
  total_revenue: number;
  unique_customers: number;
  popular_item: string;
  item_count: number;
}
