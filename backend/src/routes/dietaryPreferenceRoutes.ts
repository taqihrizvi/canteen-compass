import { Router } from 'express';
import { DietaryPreferenceController } from '../controllers/dietaryPreferenceController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const dietaryPreferenceController = new DietaryPreferenceController();

// All authenticated users can view dietary preferences
router.get('/', authenticateToken, (req, res) => dietaryPreferenceController.getAllDietaryPreferences(req, res));
router.get('/:id', authenticateToken, (req, res) => dietaryPreferenceController.getDietaryPreferenceById(req, res));

export default router;
