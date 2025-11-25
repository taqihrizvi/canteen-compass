import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CanteenManagerService } from '../services/canteenManagerService';

const canteenManagerService = new CanteenManagerService();

export class CanteenManagerController {
  async getSalesInsights(req: AuthRequest, res: Response) {
    try {
      const period = (req.query.period as 'daily' | 'weekly' | 'monthly') || 'daily';

      if (!['daily', 'weekly', 'monthly'].includes(period)) {
        return res.status(400).json({
          error: 'Invalid period. Must be daily, weekly, or monthly',
        });
      }

      const insights = await canteenManagerService.getSalesInsights(period);

      res.json(insights);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getIncomingOrders(req: AuthRequest, res: Response) {
    try {
      const status = req.query.status as string;

      const orders = await canteenManagerService.getIncomingOrders(status);

      res.json(orders);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateOrderStatus(req: AuthRequest, res: Response) {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;

      if (isNaN(orderId)) {
        return res.status(400).json({ error: 'Invalid order ID' });
      }

      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      const result = await canteenManagerService.updateOrderStatus(orderId, status);

      res.json({
        message: 'Order status updated successfully',
        order: result,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async getAllMenus(req: AuthRequest, res: Response) {
    try {
      const menus = await canteenManagerService.getAllMenus();

      res.json(menus);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async createMenu(req: AuthRequest, res: Response) {
    try {
      const { title, description, price, category, image_url } = req.body;

      if (!title || !description || price === undefined || !category) {
        return res.status(400).json({
          error: 'Title, description, price, and category are required',
        });
      }

      if (price < 0) {
        return res.status(400).json({
          error: 'Price must be a positive number',
        });
      }

      const menu = await canteenManagerService.createMenu({
        title,
        description,
        price,
        category,
        image_url,
      });

      res.status(201).json({
        message: 'Menu item created successfully',
        menu,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async updateMenu(req: AuthRequest, res: Response) {
    try {
      const menuId = parseInt(req.params.id);

      if (isNaN(menuId)) {
        return res.status(400).json({ error: 'Invalid menu ID' });
      }

      const updates = req.body;

      if (updates.price !== undefined && updates.price < 0) {
        return res.status(400).json({
          error: 'Price must be a positive number',
        });
      }

      const menu = await canteenManagerService.updateMenu(menuId, updates);

      res.json({
        message: 'Menu item updated successfully',
        menu,
      });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }

  async deleteMenu(req: AuthRequest, res: Response) {
    try {
      const menuId = parseInt(req.params.id);

      if (isNaN(menuId)) {
        return res.status(400).json({ error: 'Invalid menu ID' });
      }

      const result = await canteenManagerService.deleteMenu(menuId);

      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
