import { Request, Response } from 'express';
import pool from '../config/database';

export class InventoryController {
  // Get all inventory items
  async getAllItems(req: Request, res: Response) {
    try {
      const result = await pool.query(
        `SELECT id, item_name, current_stock, optimal_stock, unit, status, 
                usage_rate, last_restocked, supplier, cost_per_unit, created_at, updated_at
         FROM inventory 
         ORDER BY 
           CASE status 
             WHEN 'critical' THEN 1 
             WHEN 'low' THEN 2 
             WHEN 'good' THEN 3 
             WHEN 'overstock' THEN 4 
           END, item_name`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      res.status(500).json({ error: 'Failed to fetch inventory items' });
    }
  }

  // Get low stock items
  async getLowStockItems(req: Request, res: Response) {
    try {
      const result = await pool.query(
        `SELECT * FROM inventory 
         WHERE status IN ('critical', 'low') 
         ORDER BY 
           CASE status WHEN 'critical' THEN 1 WHEN 'low' THEN 2 END, 
           item_name`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      res.status(500).json({ error: 'Failed to fetch low stock items' });
    }
  }

  // Get inventory item by ID
  async getItemById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query('SELECT * FROM inventory WHERE id = $1', [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Inventory item not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching inventory item:', error);
      res.status(500).json({ error: 'Failed to fetch inventory item' });
    }
  }

  // Create new inventory item
  async createItem(req: Request, res: Response) {
    try {
      const { item_name, current_stock, optimal_stock, unit, status, usage_rate, supplier, cost_per_unit } = req.body;

      if (!item_name || current_stock === undefined || optimal_stock === undefined || !unit) {
        return res.status(400).json({ error: 'Item name, current stock, optimal stock, and unit are required' });
      }

      const result = await pool.query(
        `INSERT INTO inventory (item_name, current_stock, optimal_stock, unit, status, usage_rate, supplier, cost_per_unit) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING *`,
        [item_name, current_stock, optimal_stock, unit, status || 'good', usage_rate || 'Medium', supplier, cost_per_unit]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating inventory item:', error);
      res.status(500).json({ error: 'Failed to create inventory item' });
    }
  }

  // Update inventory item
  async updateItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { item_name, current_stock, optimal_stock, unit, status, usage_rate, supplier, cost_per_unit } = req.body;

      const checkResult = await pool.query('SELECT id FROM inventory WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Inventory item not found' });
      }

      const result = await pool.query(
        `UPDATE inventory 
         SET item_name = $1, current_stock = $2, optimal_stock = $3, unit = $4, 
             status = $5, usage_rate = $6, supplier = $7, cost_per_unit = $8, 
             last_restocked = CURRENT_TIMESTAMP
         WHERE id = $9 
         RETURNING *`,
        [item_name, current_stock, optimal_stock, unit, status, usage_rate, supplier, cost_per_unit, id]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating inventory item:', error);
      res.status(500).json({ error: 'Failed to update inventory item' });
    }
  }

  // Delete inventory item
  async deleteItem(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const checkResult = await pool.query('SELECT id FROM inventory WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Inventory item not found' });
      }

      await pool.query('DELETE FROM inventory WHERE id = $1', [id]);

      res.json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      res.status(500).json({ error: 'Failed to delete inventory item' });
    }
  }

  // Get reorder suggestions
  async getReorderSuggestions(req: Request, res: Response) {
    try {
      const result = await pool.query(
        `SELECT * FROM reorder_suggestions 
         WHERE status = 'pending'
         ORDER BY 
           CASE urgency 
             WHEN 'Critical' THEN 1 
             WHEN 'High' THEN 2 
             WHEN 'Medium' THEN 3 
             WHEN 'Low' THEN 4 
           END, created_at DESC`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching reorder suggestions:', error);
      res.status(500).json({ error: 'Failed to fetch reorder suggestions' });
    }
  }

  // Get inventory statistics
  async getStatistics(req: Request, res: Response) {
    try {
      const criticalCount = await pool.query(`SELECT COUNT(*) FROM inventory WHERE status = 'critical'`);
      const lowCount = await pool.query(`SELECT COUNT(*) FROM inventory WHERE status = 'low'`);
      const totalValue = await pool.query(`SELECT SUM(current_stock * cost_per_unit) as total FROM inventory`);

      res.json({
        criticalItems: parseInt(criticalCount.rows[0].count),
        lowStockItems: parseInt(lowCount.rows[0].count),
        totalInventoryValue: parseFloat(totalValue.rows[0].total || 0).toFixed(2),
      });
    } catch (error) {
      console.error('Error fetching inventory statistics:', error);
      res.status(500).json({ error: 'Failed to fetch inventory statistics' });
    }
  }
}
