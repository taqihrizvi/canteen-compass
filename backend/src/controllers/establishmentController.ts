import { Request, Response } from 'express';
import pool from '../config/database';

export class EstablishmentController {
  // Get all establishments
  async getAllEstablishments(req: Request, res: Response) {
    try {
      const result = await pool.query(
        'SELECT * FROM establishments ORDER BY name ASC'
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching establishments:', error);
      res.status(500).json({ error: 'Failed to fetch establishments' });
    }
  }

  // Get establishment by ID
  async getEstablishmentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM establishments WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Establishment not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching establishment:', error);
      res.status(500).json({ error: 'Failed to fetch establishment' });
    }
  }

  // Create new establishment
  async createEstablishment(req: Request, res: Response) {
    try {
      const { name, location, status, capacity, manager, rating } = req.body;

      if (!name) {
        return res.status(400).json({ error: 'Establishment name is required' });
      }

      const result = await pool.query(
        `INSERT INTO establishments (name, location, status, capacity, daily_orders, revenue, manager, rating)
         VALUES ($1, $2, $3, $4, 0, 0.00, $5, $6)
         RETURNING *`,
        [name, location || null, status || 'Active', capacity || null, manager || null, rating || null]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating establishment:', error);
      res.status(500).json({ error: 'Failed to create establishment' });
    }
  }

  // Update establishment
  async updateEstablishment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, location, status, capacity, daily_orders, revenue, manager, rating } = req.body;

      const result = await pool.query(
        `UPDATE establishments 
         SET name = COALESCE($1, name),
             location = COALESCE($2, location),
             status = COALESCE($3, status),
             capacity = COALESCE($4, capacity),
             daily_orders = COALESCE($5, daily_orders),
             revenue = COALESCE($6, revenue),
             manager = COALESCE($7, manager),
             rating = COALESCE($8, rating)
         WHERE id = $9
         RETURNING *`,
        [name, location, status, capacity, daily_orders, revenue, manager, rating, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Establishment not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating establishment:', error);
      res.status(500).json({ error: 'Failed to update establishment' });
    }
  }

  // Delete establishment
  async deleteEstablishment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'DELETE FROM establishments WHERE id = $1 RETURNING *',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Establishment not found' });
      }

      res.json({ message: 'Establishment deleted successfully' });
    } catch (error) {
      console.error('Error deleting establishment:', error);
      res.status(500).json({ error: 'Failed to delete establishment' });
    }
  }
}
