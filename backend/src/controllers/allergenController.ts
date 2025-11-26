import { Request, Response } from 'express';
import pool from '../config/database';

export class AllergenController {
  // Get all allergens
  async getAllAllergens(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT id, name, description, created_at, updated_at FROM allergens ORDER BY name'
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching allergens:', error);
      res.status(500).json({ error: 'Failed to fetch allergens' });
    }
  }

  // Get allergen by ID
  async getAllergenById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT id, name, description, created_at, updated_at FROM allergens WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Allergen not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching allergen:', error);
      res.status(500).json({ error: 'Failed to fetch allergen' });
    }
  }
}
