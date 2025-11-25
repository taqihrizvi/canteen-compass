import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { StudentService } from '../services/studentService';

const studentService = new StudentService();

export class StudentController {
  async getFoodSuggestions(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const suggestions = await studentService.getFoodSuggestions(req.user.id);

      res.json(suggestions);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getAvailableMenus(req: AuthRequest, res: Response) {
    try {
      const menus = await studentService.getAvailableMenus();

      res.json(menus);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async placeOrder(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const { menuId, quantity, notes } = req.body;

      if (!menuId || !quantity) {
        return res.status(400).json({
          error: 'Menu ID and quantity are required',
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          error: 'Quantity must be at least 1',
        });
      }

      const order = await studentService.placeOrder(
        req.user.id,
        menuId,
        quantity,
        notes
      );

      res.status(201).json({
        message: 'Order placed successfully',
        order,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getOrderHistory(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;

      const result = await studentService.getOrderHistory(req.user.id, page, limit);

      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getOrderById(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const orderId = parseInt(req.params.id);

      if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const order = await studentService.getOrderById(req.user.id, orderId);

      res.json(order);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async cancelOrder(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const orderId = parseInt(req.params.id);

      if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      const result = await studentService.cancelOrder(req.user.id, orderId);

      res.json({
        message: 'Order cancelled successfully',
        order: result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
