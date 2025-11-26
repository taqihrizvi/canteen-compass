import { Router } from 'express';
import { EstablishmentController } from '../controllers/establishmentController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();
const establishmentController = new EstablishmentController();

// All establishment routes require authentication
router.use(authenticateToken);

// Get all establishments - accessible by all authenticated users (read-only for students)
router.get('/', (req, res) => establishmentController.getAllEstablishments(req, res));

// Get establishment by ID - accessible by all authenticated users
router.get('/:id', (req, res) => establishmentController.getEstablishmentById(req, res));

// Create establishment - admin only
router.post('/', authorizeRoles('admin'), (req, res) => establishmentController.createEstablishment(req, res));

// Update establishment - admin only
router.put('/:id', authorizeRoles('admin'), (req, res) => establishmentController.updateEstablishment(req, res));

// Delete establishment - admin only
router.delete('/:id', authorizeRoles('admin'), (req, res) => establishmentController.deleteEstablishment(req, res));

export default router;
