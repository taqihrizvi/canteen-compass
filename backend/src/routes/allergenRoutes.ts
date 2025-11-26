import { Router } from 'express';
import { AllergenController } from '../controllers/allergenController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const allergenController = new AllergenController();

// All authenticated users can view allergens
router.get('/', authenticateToken, (req, res) => allergenController.getAllAllergens(req, res));
router.get('/:id', authenticateToken, (req, res) => allergenController.getAllergenById(req, res));

export default router;
