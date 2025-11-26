import { Request, Response } from 'express';
import pool from '../config/database';

export class DietaryPreferenceController {
  // Get all dietary preferences
  async getAllDietaryPreferences(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT id, name, description, icon, created_at, updated_at FROM dietary_preferences ORDER BY name'
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching dietary preferences:', error);
      res.status(500).json({ error: 'Failed to fetch dietary preferences' });
    }
  }

  // Get dietary preference by ID
  async getDietaryPreferenceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT id, name, description, icon, created_at, updated_at FROM dietary_preferences WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Dietary preference not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching dietary preference:', error);
      res.status(500).json({ error: 'Failed to fetch dietary preference' });
    }
  }
}
