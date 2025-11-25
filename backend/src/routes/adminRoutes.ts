import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRoles('admin'));

// User management
router.post('/users', (req, res) => adminController.createUser(req, res));
router.get('/users', (req, res) => adminController.getAllUsers(req, res));
router.get('/users/:id', (req, res) => adminController.getUserById(req, res));
router.put('/users/:id', (req, res) => adminController.updateUser(req, res));
router.delete('/users/:id', (req, res) => adminController.deleteUser(req, res));

// System stats
router.get('/stats', (req, res) => adminController.getSystemStats(req, res));

export default router;
