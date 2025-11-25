import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class StudentService {
  async getFoodSuggestions(studentId: number) {
    const result = await pool.query(
      `SELECT fs.id, fs.reason, fs.suggestion_date,
              m.id as menu_id, m.title, m.description, m.price, m.category, m.image_url
       FROM food_suggestions fs
       JOIN menus m ON fs.menu_id = m.id
       WHERE fs.student_id = $1 AND fs.suggestion_date >= CURRENT_DATE - INTERVAL '7 days'
       ORDER BY fs.suggestion_date DESC`,
      [studentId]
    );

    return result.rows;
  }

  async getAvailableMenus() {
    const result = await pool.query(
      `SELECT id, title, description, price, category, image_url
       FROM menus
       WHERE is_available = true
       ORDER BY category, title`
    );

    return result.rows;
  }

  async placeOrder(studentId: number, menuId: number, quantity: number, notes?: string) {
    // Get menu price
    const menuResult = await pool.query(
      'SELECT price, is_available FROM menus WHERE id = $1',
      [menuId]
    );

    if (menuResult.rows.length === 0) {
      throw new AppError('Menu item not found', 404);
    }

    if (!menuResult.rows[0].is_available) {
      throw new AppError('This menu item is not available', 400);
    }

    const totalPrice = menuResult.rows[0].price * quantity;

    // Create order
    const result = await pool.query(
      `INSERT INTO orders (student_id, menu_id, quantity, total_price, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, student_id, menu_id, quantity, total_price, status, notes, created_at`,
      [studentId, menuId, quantity, totalPrice, notes]
    );

    return result.rows[0];
  }

  async getOrderHistory(studentId: number, page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT o.id, o.quantity, o.total_price, o.status, o.notes, o.created_at,
              m.title as menu_title, m.category, m.image_url
       FROM orders o
       LEFT JOIN menus m ON o.menu_id = m.id
       WHERE o.student_id = $1
       ORDER BY o.created_at DESC
       LIMIT $2 OFFSET $3`,
      [studentId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE student_id = $1',
      [studentId]
    );

    const total = parseInt(countResult.rows[0].count);

    return {
      orders: result.rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getOrderById(studentId: number, orderId: number) {
    const result = await pool.query(
      `SELECT o.id, o.quantity, o.total_price, o.status, o.notes, o.created_at, o.updated_at,
              m.title as menu_title, m.description, m.price, m.category, m.image_url
       FROM orders o
       LEFT JOIN menus m ON o.menu_id = m.id
       WHERE o.id = $1 AND o.student_id = $2`,
      [orderId, studentId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    return result.rows[0];
  }

  async cancelOrder(studentId: number, orderId: number) {
    const result = await pool.query(
      `UPDATE orders 
       SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND student_id = $2 AND status = 'pending'
       RETURNING id, status`,
      [orderId, studentId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Order not found or cannot be cancelled', 400);
    }

    return result.rows[0];
  }
}
