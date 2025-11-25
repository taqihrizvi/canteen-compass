import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AdminService } from '../services/adminService';

const adminService = new AdminService();

export class AdminController {
  async createUser(req: AuthRequest, res: Response) {
    try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password || !role) {
        return res.status(400).json({
          error: 'Name, email, password, and role are required',
        });
      }

      if (!['admin', 'student', 'canteen_manager'].includes(role)) {
        return res.status(400).json({
          error: 'Invalid role. Must be admin, student, or canteen_manager',
        });
      }

      const user = await adminService.createUser(name, email, password, role);

      res.status(201).json({
        message: 'User created successfully',
        user,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getAllUsers(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await adminService.getAllUsers(page, limit);

      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getUserById(req: AuthRequest, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const user = await adminService.getUserById(userId);

      res.json(user);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateUser(req: AuthRequest, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const updates = req.body;
      const user = await adminService.updateUser(userId, updates);

      res.json({
        message: 'User updated successfully',
        user,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const result = await adminService.deleteUser(userId);

      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getSystemStats(req: AuthRequest, res: Response) {
    try {
      const stats = await adminService.getSystemStats();

      res.json(stats);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
