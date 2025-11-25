import { Router } from 'express';
import { CanteenManagerController } from '../controllers/canteenManagerController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const canteenManagerController = new CanteenManagerController();

// All canteen manager routes require authentication and canteen_manager role
router.use(authenticateToken);
router.use(authorizeRoles('canteen_manager'));

// Sales insights
router.get('/sales', (req, res) => canteenManagerController.getSalesInsights(req, res));

// Order management
router.get('/orders', (req, res) => canteenManagerController.getIncomingOrders(req, res));
router.patch('/orders/:id/status', (req, res) => canteenManagerController.updateOrderStatus(req, res));

// Menu management
router.get('/menus', (req, res) => canteenManagerController.getAllMenus(req, res));
router.post('/menus', (req, res) => canteenManagerController.createMenu(req, res));
router.put('/menus/:id', (req, res) => canteenManagerController.updateMenu(req, res));
router.delete('/menus/:id', (req, res) => canteenManagerController.deleteMenu(req, res));

export default router;
