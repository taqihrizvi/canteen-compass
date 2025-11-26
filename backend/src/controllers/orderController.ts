import { Request, Response } from 'express';
import pool from '../config/database';

interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

export class OrderController {
  // Create a new order
  async createOrder(req: AuthRequest, res: Response) {
    const client = await pool.connect();
    
    try {
      const userId = req.user?.id;
      const { items, subtotal, serviceFee, total, paymentMethod, notes } = req.body;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      console.log('Creating order with items:', JSON.stringify(items, null, 2));

      await client.query('BEGIN');

      // Create the order
      const orderResult = await client.query(
        `INSERT INTO orders (student_id, total_price, subtotal, service_fee, payment_method, notes, status) 
         VALUES ($1, $2, $3, $4, $5, $6, 'pending') 
         RETURNING id, student_id, total_price, subtotal, service_fee, payment_method, notes, status, created_at`,
        [userId, total, subtotal, serviceFee, paymentMethod, notes || null]
      );

      const order = orderResult.rows[0];

      // Create order items
      const orderItems = [];
      for (const item of items) {
        // Ensure menu_name is never null or empty
        const menuName = item.title || item.name || 'Unknown Item';
        const menuId = item.id > 10000 ? null : item.id;
        
        const itemResult = await client.query(
          `INSERT INTO order_items (order_id, menu_id, menu_name, price, quantity) 
           VALUES ($1, $2, $3, $4, $5) 
           RETURNING id, order_id, menu_id, menu_name, price, quantity`,
          [order.id, menuId, menuName, item.price, item.quantity]
        );
        orderItems.push(itemResult.rows[0]);
      }

      await client.query('COMMIT');

      res.status(201).json({
        ...order,
        items: orderItems
      });
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error creating order:', error);
      res.status(500).json({ error: 'Failed to create order' });
    } finally {
      client.release();
    }
  }

  // Get all orders for a user
  async getUserOrders(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        `SELECT o.id, o.student_id, o.total_price, o.subtotal, o.service_fee, 
                o.payment_method, o.notes, o.status, o.created_at, o.updated_at,
                COALESCE(
                  json_agg(
                    json_build_object(
                      'id', oi.id,
                      'menu_id', oi.menu_id,
                      'menu_name', COALESCE(oi.menu_name, 'Unknown Item'),
                      'price', oi.price,
                      'quantity', oi.quantity
                    )
                  ) FILTER (WHERE oi.id IS NOT NULL),
                  '[]'::json
                ) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.student_id = $1
         GROUP BY o.id
         ORDER BY o.created_at DESC`,
        [userId]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  // Get a single order by ID
  async getOrderById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const result = await pool.query(
        `SELECT o.id, o.student_id, o.total_price, o.subtotal, o.service_fee, 
                o.payment_method, o.notes, o.status, o.created_at, o.updated_at,
                json_agg(
                  json_build_object(
                    'id', oi.id,
                    'menu_id', oi.menu_id,
                    'menu_name', oi.menu_name,
                    'price', oi.price,
                    'quantity', oi.quantity
                  )
                ) as items
         FROM orders o
         LEFT JOIN order_items oi ON o.id = oi.order_id
         WHERE o.id = $1 AND o.student_id = $2
         GROUP BY o.id`,
        [id, userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  }

  // Get all orders (admin/manager only)
  async getAllOrders(req: Request, res: Response) {
    try {
      const result = await pool.query(
        `SELECT o.id, o.student_id, o.total_price, o.subtotal, o.service_fee, 
                o.payment_method, o.notes, o.status, o.created_at, o.updated_at,
                u.name as student_name, u.email as student_email,
                json_agg(
                  json_build_object(
                    'id', oi.id,
                    'menu_id', oi.menu_id,
                    'menu_name', oi.menu_name,
                    'price', oi.price,
                    'quantity', oi.quantity
                  )
                ) as items
         FROM orders o
         LEFT JOIN users u ON o.student_id = u.id
         LEFT JOIN order_items oi ON o.id = oi.order_id
         GROUP BY o.id, u.name, u.email
         ORDER BY o.created_at DESC`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching all orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  }

  // Update order status
  async updateOrderStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['pending', 'preparing', 'ready', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
      }

      const result = await pool.query(
        `UPDATE orders 
         SET status = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING id, status, updated_at`,
        [status, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({ error: 'Failed to update order status' });
    }
  }
}
