import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const adminController = new AdminController();

// All admin routes require authentication
router.use(authenticateToken);

// User management - accessible by both admin and canteen_manager
router.post('/users', authorizeRoles('admin', 'canteen_manager'), (req, res) => adminController.createUser(req, res));
router.get('/users', authorizeRoles('admin', 'canteen_manager'), (req, res) => adminController.getAllUsers(req, res));
router.get('/users/:id', authorizeRoles('admin', 'canteen_manager'), (req, res) => adminController.getUserById(req, res));
router.put('/users/:id', authorizeRoles('admin', 'canteen_manager'), (req, res) => adminController.updateUser(req, res));
router.delete('/users/:id', authorizeRoles('admin', 'canteen_manager'), (req, res) => adminController.deleteUser(req, res));

// System stats - admin only
router.get('/stats', authorizeRoles('admin'), (req, res) => adminController.getSystemStats(req, res));

export default router;
