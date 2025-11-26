import { Request, Response } from 'express';
import pool from '../config/database';

export class ComboController {
  // Get all combo deals
  async getAllCombos(req: Request, res: Response) {
    try {
      const result = await pool.query(
        `SELECT cd.id, cd.name, cd.description, cd.item_ids, cd.price, cd.savings, cd.is_active, 
                cd.created_at, cd.updated_at,
                array_agg(m.title) as item_names
         FROM combo_deals cd
         LEFT JOIN menus m ON m.id = ANY(cd.item_ids)
         WHERE cd.is_active = true
         GROUP BY cd.id
         ORDER BY cd.created_at DESC`
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching combo deals:', error);
      res.status(500).json({ error: 'Failed to fetch combo deals' });
    }
  }

  // Get combo deal by ID
  async getComboById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT cd.id, cd.name, cd.description, cd.item_ids, cd.price, cd.savings, cd.is_active, 
                cd.created_at, cd.updated_at,
                array_agg(json_build_object('id', m.id, 'name', m.title, 'price', m.price)) as items
         FROM combo_deals cd
         LEFT JOIN menus m ON m.id = ANY(cd.item_ids)
         WHERE cd.id = $1
         GROUP BY cd.id`,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Combo deal not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching combo deal:', error);
      res.status(500).json({ error: 'Failed to fetch combo deal' });
    }
  }

  // Create new combo deal
  async createCombo(req: Request, res: Response) {
    try {
      const { name, description, item_ids, price, savings } = req.body;

      if (!name || !item_ids || !Array.isArray(item_ids) || item_ids.length === 0 || !price) {
        return res.status(400).json({
          error: 'Name, item_ids (array), and price are required'
        });
      }

      const result = await pool.query(
        `INSERT INTO combo_deals (name, description, item_ids, price, savings) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [name, description || '', item_ids, price, savings || 0]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating combo deal:', error);
      res.status(500).json({ error: 'Failed to create combo deal' });
    }
  }

  // Update combo deal
  async updateCombo(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, description, item_ids, price, savings, is_active } = req.body;

      const checkResult = await pool.query('SELECT id FROM combo_deals WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Combo deal not found' });
      }

      const result = await pool.query(
        `UPDATE combo_deals 
         SET name = $1, description = $2, item_ids = $3, price = $4, 
             savings = $5, is_active = $6
         WHERE id = $7 
         RETURNING *`,
        [name, description, item_ids, price, savings, is_active !== undefined ? is_active : true, id]
      );

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating combo deal:', error);
      res.status(500).json({ error: 'Failed to update combo deal' });
    }
  }

  // Delete combo deal (soft delete by setting is_active to false)
  async deleteCombo(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const checkResult = await pool.query('SELECT id FROM combo_deals WHERE id = $1', [id]);
      if (checkResult.rows.length === 0) {
        return res.status(404).json({ error: 'Combo deal not found' });
      }

      await pool.query('UPDATE combo_deals SET is_active = false WHERE id = $1', [id]);

      res.json({ message: 'Combo deal deleted successfully' });
    } catch (error) {
      console.error('Error deleting combo deal:', error);
      res.status(500).json({ error: 'Failed to delete combo deal' });
    }
  }
}
