import pool from '../config/database';
import { AppError } from '../middleware/errorHandler';

export class CanteenManagerService {
  async getSalesInsights(period: 'daily' | 'weekly' | 'monthly' = 'daily') {
    let dateFilter = '';
    
    switch (period) {
      case 'daily':
        dateFilter = "AND DATE(o.created_at) = CURRENT_DATE";
        break;
      case 'weekly':
        dateFilter = "AND o.created_at >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'monthly':
        dateFilter = "AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'";
        break;
    }

    const [overview, topItems, revenueByDay] = await Promise.all([
      pool.query(
        `SELECT 
          COUNT(*) as total_orders,
          SUM(total_price) as total_revenue,
          AVG(total_price) as average_order_value,
          COUNT(DISTINCT student_id) as unique_customers
         FROM orders
         WHERE status != 'cancelled' ${dateFilter}`
      ),
      pool.query(
        `SELECT 
          m.title, m.category, m.price,
          COUNT(o.id) as order_count,
          SUM(o.quantity) as total_quantity,
          SUM(o.total_price) as revenue
         FROM orders o
         JOIN menus m ON o.menu_id = m.id
         WHERE o.status != 'cancelled' ${dateFilter}
         GROUP BY m.id, m.title, m.category, m.price
         ORDER BY order_count DESC
         LIMIT 10`
      ),
      pool.query(
        `SELECT 
          DATE(created_at) as date,
          COUNT(*) as orders,
          SUM(total_price) as revenue
         FROM orders
         WHERE status != 'cancelled' ${dateFilter}
         GROUP BY DATE(created_at)
         ORDER BY date DESC
         LIMIT 30`
      ),
    ]);

    return {
      overview: overview.rows[0],
      topItems: topItems.rows,
      revenueByDay: revenueByDay.rows,
      period,
    };
  }

  async getIncomingOrders(status?: string) {
    let query = `
      SELECT o.id, o.quantity, o.total_price, o.status, o.notes, o.created_at,
             u.name as student_name, u.email as student_email,
             m.title as menu_title, m.category
      FROM orders o
      LEFT JOIN users u ON o.student_id = u.id
      LEFT JOIN menus m ON o.menu_id = m.id
    `;

    const values: any[] = [];

    if (status && ['pending', 'preparing', 'ready'].includes(status)) {
      query += ' WHERE o.status = $1';
      values.push(status);
    } else {
      query += " WHERE o.status IN ('pending', 'preparing', 'ready')";
    }

    query += ' ORDER BY o.created_at ASC';

    const result = await pool.query(query, values);

    return result.rows;
  }

  async updateOrderStatus(orderId: number, status: string) {
    const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      throw new AppError('Invalid order status', 400);
    }

    const result = await pool.query(
      `UPDATE orders 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING id, status, updated_at`,
      [status, orderId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Order not found', 404);
    }

    return result.rows[0];
  }

  async getAllMenus() {
    const result = await pool.query(
      `SELECT id, title, description, price, category, image_url, is_available, created_at, updated_at
       FROM menus
       ORDER BY category, title`
    );

    return result.rows;
  }

  async createMenu(data: {
    title: string;
    description: string;
    price: number;
    category: string;
    image_url?: string;
  }) {
    const { title, description, price, category, image_url } = data;

    const result = await pool.query(
      `INSERT INTO menus (title, description, price, category, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, price, category, image_url, is_available, created_at`,
      [title, description, price, category, image_url]
    );

    return result.rows[0];
  }

  async updateMenu(menuId: number, updates: any) {
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.title) {
      setClauses.push(`title = $${paramIndex++}`);
      values.push(updates.title);
    }
    if (updates.description) {
      setClauses.push(`description = $${paramIndex++}`);
      values.push(updates.description);
    }
    if (updates.price !== undefined) {
      setClauses.push(`price = $${paramIndex++}`);
      values.push(updates.price);
    }
    if (updates.category) {
      setClauses.push(`category = $${paramIndex++}`);
      values.push(updates.category);
    }
    if (updates.image_url) {
      setClauses.push(`image_url = $${paramIndex++}`);
      values.push(updates.image_url);
    }
    if (updates.is_available !== undefined) {
      setClauses.push(`is_available = $${paramIndex++}`);
      values.push(updates.is_available);
    }

    if (setClauses.length === 0) {
      throw new AppError('No valid fields to update', 400);
    }

    values.push(menuId);

    const result = await pool.query(
      `UPDATE menus 
       SET ${setClauses.join(', ')}, updated_at = CURRENT_TIMESTAMP
       WHERE id = $${paramIndex}
       RETURNING id, title, description, price, category, image_url, is_available, updated_at`,
      values
    );

    if (result.rows.length === 0) {
      throw new AppError('Menu item not found', 404);
    }

    return result.rows[0];
  }

  async deleteMenu(menuId: number) {
    const result = await pool.query(
      'DELETE FROM menus WHERE id = $1 RETURNING id',
      [menuId]
    );

    if (result.rows.length === 0) {
      throw new AppError('Menu item not found', 404);
    }

    return { message: 'Menu item deleted successfully' };
  }
}
