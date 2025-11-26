import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const inventoryController = new InventoryController();

// All inventory routes require authentication and admin or canteen_manager role
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'canteen_manager'));

// Inventory management
router.get('/items', (req, res) => inventoryController.getAllItems(req, res));
router.get('/items/low-stock', (req, res) => inventoryController.getLowStockItems(req, res));
router.get('/items/:id', (req, res) => inventoryController.getItemById(req, res));
router.post('/items', (req, res) => inventoryController.createItem(req, res));
router.put('/items/:id', (req, res) => inventoryController.updateItem(req, res));
router.delete('/items/:id', (req, res) => inventoryController.deleteItem(req, res));

// Reorder suggestions
router.get('/reorder-suggestions', (req, res) => inventoryController.getReorderSuggestions(req, res));

// Statistics
router.get('/statistics', (req, res) => inventoryController.getStatistics(req, res));

export default router;
