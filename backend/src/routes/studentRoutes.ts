import { Router } from 'express';
import { StudentController } from '../controllers/studentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const studentController = new StudentController();

// All student routes require authentication and student role
router.use(authenticateToken);
router.use(authorizeRoles('student'));

// Food suggestions
router.get('/suggestions', (req, res) => studentController.getFoodSuggestions(req, res));

// Menus
router.get('/menus', (req, res) => studentController.getAvailableMenus(req, res));

// Orders
router.post('/orders', (req, res) => studentController.placeOrder(req, res));
router.get('/orders', (req, res) => studentController.getOrderHistory(req, res));
router.get('/orders/:id', (req, res) => studentController.getOrderById(req, res));
router.patch('/orders/:id/cancel', (req, res) => studentController.cancelOrder(req, res));

export default router;
