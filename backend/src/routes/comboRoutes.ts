import { Router } from 'express';
import { ComboController } from '../controllers/comboController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const comboController = new ComboController();

// Public routes for viewing combos (all authenticated users)
router.get('/', authenticateToken, (req, res) => comboController.getAllCombos(req, res));
router.get('/:id', authenticateToken, (req, res) => comboController.getComboById(req, res));

// Admin and manager only routes for managing combos
router.use(authenticateToken);
router.use(authorizeRoles('admin', 'canteen_manager'));

// POST /api/combos - Create new combo deal
router.post('/', (req, res) => comboController.createCombo(req, res));

// PUT /api/combos/:id - Update combo deal
router.put('/:id', (req, res) => comboController.updateCombo(req, res));

// DELETE /api/combos/:id - Delete combo deal (soft delete)
router.delete('/:id', (req, res) => comboController.deleteCombo(req, res));

export default router;
