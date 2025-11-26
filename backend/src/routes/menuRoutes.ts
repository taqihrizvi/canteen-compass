import { Router } from 'express';
import { MenuController } from '../controllers/menuController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const menuController = new MenuController();

// Public route for viewing available menu items (all authenticated users)
router.get('/menu-items', authenticateToken, (req, res) => menuController.getAllMenuItems(req, res));
router.get('/menu-items/:id', authenticateToken, (req, res) => menuController.getMenuItemById(req, res));

// Admin and canteen_manager only routes for menu management
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'canteen_manager'));

// Menu management
router.post('/menu-items', (req, res) => menuController.createMenuItem(req, res));
router.put('/menu-items/:id', (req, res) => menuController.updateMenuItem(req, res));
router.delete('/menu-items/:id', (req, res) => menuController.deleteMenuItem(req, res));

export default router;
