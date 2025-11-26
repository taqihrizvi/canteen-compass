import { Request, Response } from 'express';
import pool from '../config/database';

export class MenuController {
  // Get all menu items
  async getAllMenuItems(req: Request, res: Response) {
    try {
      const result = await pool.query(
        `SELECT id, title as name, description, price, category, 
                COALESCE(allergens, '[]'::jsonb) as allergens,
                COALESCE(stock, 0) as stock,
                CASE WHEN is_available THEN 'Active' ELSE 'Inactive' END as status,
                calories,
                COALESCE(tags, '[]'::jsonb) as tags,
                created_at, updated_at
         FROM menus 
         ORDER BY category, title`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      res.status(500).json({ error: 'Failed to fetch menu items' });
    }
  }

  // Get menu item by ID
  async getMenuItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT id, title as name, description, price, category, 
                COALESCE(allergens, '[]'::jsonb) as allergens,
                COALESCE(stock, 0) as stock,
                CASE WHEN is_available THEN 'Active' ELSE 'Inactive' END as status,
                calories,
                COALESCE(tags, '[]'::jsonb) as tags,
                created_at, updated_at
         FROM menus 
         WHERE id = $1`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching menu item:', error);
      res.status(500).json({ error: 'Failed to fetch menu item' });
    }
  }

  // Create new menu item
  async createMenuItem(req: Request, res: Response) {
    try {
      const { name, description, price, category, allergens, stock, calories, tags } = req.body;

      // Validation
      if (!name || !price || !category) {
        return res.status(400).json({ error: 'Name, price, and category are required' });
      }

      const result = await pool.query(
        `INSERT INTO menus (title, description, price, category, allergens, stock, is_available, calories, tags) 
         VALUES ($1, $2, $3, $4, $5::jsonb, $6, true, $7, $8::jsonb) 
         RETURNING id, title as name, description, price, category, 
                   COALESCE(allergens, '[]'::jsonb) as allergens,
                   COALESCE(stock, 0) as stock,
                   'Active' as status,
                   calories,
                   COALESCE(tags, '[]'::jsonb) as tags`,
        [name, description || null, price, category, JSON.stringify(allergens || []), stock || 0, calories || null, JSON.stringify(tags || [])]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating menu item:', error);
      res.status(500).json({ error: 'Failed to create menu item' });
    }
  }

  // Update menu item
  async updateMenuItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, price, category, allergens, stock, status, calories, tags } = req.body;

      // Check if menu item exists
      const checkResult = await pool.query('SELECT id FROM menus WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }

      const isAvailable = status === 'Active';

      const result = await pool.query(
        `UPDATE menus 
         SET title = $1, description = $2, price = $3, category = $4, 
             allergens = $5::jsonb, stock = $6, is_available = $7, calories = $8, tags = $9::jsonb, updated_at = CURRENT_TIMESTAMP
         WHERE id = $10 
         RETURNING id, title as name, description, price, category, 
                   COALESCE(allergens, '[]'::jsonb) as allergens,
                   COALESCE(stock, 0) as stock,
                   CASE WHEN is_available THEN 'Active' ELSE 'Inactive' END as status,
                   calories,
                   COALESCE(tags, '[]'::jsonb) as tags`,
        [name, description, price, category, JSON.stringify(allergens || []), stock || 0, isAvailable, calories || null, JSON.stringify(tags || []), id]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating menu item:', error);
      res.status(500).json({ error: 'Failed to update menu item' });
    }
  }

  // Delete menu item
  async deleteMenuItem(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if menu item exists
      const checkResult = await pool.query('SELECT id FROM menus WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Menu item not found' });
      }

      await pool.query('DELETE FROM menus WHERE id = $1', [id]);

      res.json({ message: 'Menu item deleted successfully' });
    } catch (error) {
      console.error('Error deleting menu item:', error);
      res.status(500).json({ error: 'Failed to delete menu item' });
    }
  }
}
