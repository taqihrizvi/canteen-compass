import express from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = express.Router();
const orderController = new OrderController();

// Student routes - create and view their own orders
router.post('/', authenticateToken, (req, res) => orderController.createOrder(req, res));
router.get('/my-orders', authenticateToken, (req, res) => orderController.getUserOrders(req, res));
router.get('/:id', authenticateToken, (req, res) => orderController.getOrderById(req, res));

// Admin/Manager routes - view all orders and update status
router.get('/', authenticateToken, authorizeRoles('admin', 'canteen_manager'), (req, res) => orderController.getAllOrders(req, res));
router.patch('/:id/status', authenticateToken, authorizeRoles('admin', 'canteen_manager'), (req, res) => orderController.updateOrderStatus(req, res));

export default router;
