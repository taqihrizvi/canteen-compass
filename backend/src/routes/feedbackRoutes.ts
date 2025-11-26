import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth';
import {
  createFeedback,
  getFeedbackByOrderId,
  getAllFeedback
} from '../controllers/feedbackController';

const router = express.Router();

// Create or update feedback (students can provide feedback on their own orders)
router.post('/', authenticateToken, createFeedback);

// Get feedback for a specific order (authenticated users)
router.get('/order/:orderId', authenticateToken, getFeedbackByOrderId);

// Get all feedback (admin/manager only)
router.get('/', authenticateToken, authorizeRoles('admin', 'canteen_manager'), getAllFeedback);

export default router;
