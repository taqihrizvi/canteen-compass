import bcrypt from 'bcryptjs';
import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class AdminService {
  async createUser(
    name: string,
    email: string,
    password: string,
    role: 'admin' | 'student' | 'canteen_manager'
  ) {
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, name, email, role, created_at`,
      [name, email, passwordHash, role]
    );

    return result.rows[0];
  }

  async getAllUsers(page: number = 1, limit: number = 50) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT id, name, email, role, created_at, is_active 
       FROM users 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM users');
    const total = parseInt(countResult.rows[0].count);

    return {
      users: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getUserById(userId: number) {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at, updated_at, is_active FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  }

  async updateUser(
    userId: number,
    updates: { name?: string; email?: string; role?: string; is_active?: boolean }
  ) {
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.name) {
      setClauses.push(`name = $${paramIndex++}`);
      values.push(updates.name);
    }
    if (updates.email) {
      setClauses.push(`email = $${paramIndex++}`);
      values.push(updates.email);
    }
    if (updates.role) {
      setClauses.push(`role = $${paramIndex++}`);
      values.push(updates.role);
    }
    if (updates.is_active !== undefined) {
      setClauses.push(`is_active = $${paramIndex++}`);
      values.push(updates.is_active);
    }

    if (setClauses.length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    values.push(userId);

    const result = await pool.query(
      `UPDATE users 
       SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $${paramIndex} 
       RETURNING id, name, email, role, is_active, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return result.rows[0];
  }

  async deleteUser(userId: number) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [userId]
    );

    if (result.rows.length === 0) {
      throw new AppError('User not found', 404);
    }

    return { message: 'User deleted successfully' };
  }

  async getSystemStats() {
    const [usersCount, studentsCount, ordersCount, menusCount, revenueResult] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM users WHERE is_active = true'),
      pool.query("SELECT COUNT(*) FROM users WHERE role = 'student' AND is_active = true"),
      pool.query('SELECT COUNT(*) FROM orders'),
      pool.query('SELECT COUNT(*) FROM menus WHERE is_available = true'),
      pool.query("SELECT SUM(total_price) as total_revenue FROM orders WHERE status = 'completed'"),
    ]);

    const todayOrders = await pool.query(
      "SELECT COUNT(*) FROM orders WHERE DATE(created_at) = CURRENT_DATE"
    );

    const recentOrders = await pool.query(
      `SELECT o.id, o.total_price, o.status, o.created_at, 
              u.name as student_name, m.title as menu_title
       FROM orders o
       LEFT JOIN users u ON o.student_id = u.id
       LEFT JOIN menus m ON o.menu_id = m.id
       ORDER BY o.created_at DESC
       LIMIT 10`
    );

    return {
      totalUsers: parseInt(usersCount.rows[0].count),
      totalStudents: parseInt(studentsCount.rows[0].count),
      totalOrders: parseInt(ordersCount.rows[0].count),
      totalMenuItems: parseInt(menusCount.rows[0].count),
      totalRevenue: parseFloat(revenueResult.rows[0].total_revenue || 0),
      todayOrders: parseInt(todayOrders.rows[0].count),
      recentOrders: recentOrders.rows,
    };
  }
}
