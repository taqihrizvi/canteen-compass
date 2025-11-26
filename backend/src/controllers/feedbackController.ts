import { Request, Response } from 'express';
import pool from '../config/database';

export const createFeedback = async (req: Request, res: Response): Promise<void> => {
  const { order_id, rating, comment } = req.body;

  if (!order_id || !rating) {
    res.status(400).json({ message: 'Order ID and rating are required' });
    return;
  }

  if (rating < 1 || rating > 5) {
    res.status(400).json({ message: 'Rating must be between 1 and 5' });
    return;
  }

  try {
    // Check if feedback already exists
    const existingFeedback = await pool.query(
      'SELECT * FROM order_feedback WHERE order_id = $1',
      [order_id]
    );

    if (existingFeedback.rows.length > 0) {
      res.status(400).json({ message: 'Feedback already exists for this order and cannot be modified' });
      return;
    }

    const result = await pool.query(
      `INSERT INTO order_feedback (order_id, rating, comment)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [order_id, rating, comment || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ message: 'Failed to create feedback' });
  }
};

export const getFeedbackByOrderId = async (req: Request, res: Response): Promise<void> => {
  const { orderId } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM order_feedback WHERE order_id = $1',
      [orderId]
    );

    if (result.rows.length === 0) {
      // Return 200 with null instead of 404 to avoid console errors
      res.status(200).json(null);
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
};

export const getAllFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await pool.query(
      `SELECT of.*, o.student_id, u.name as student_name, o.total_price
       FROM order_feedback of
       JOIN orders o ON of.order_id = o.id
       JOIN users u ON o.student_id = u.id
       ORDER BY of.created_at DESC`
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all feedback:', error);
    res.status(500).json({ message: 'Failed to fetch feedback' });
  }
};
