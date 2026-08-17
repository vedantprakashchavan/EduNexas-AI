import { Router } from 'express';
import { feeController } from './fee.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

// Fee structures
router.post('/structures', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT), (req, res) => feeController.createStructure(req, res));
router.get('/structures', (req, res) => feeController.getStructures(req, res));

// Payments
router.post('/payments', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.ACCOUNTANT), (req, res) => feeController.recordPayment(req, res));
router.get('/payments', (req, res) => feeController.getPayments(req, res));

// Student fees
router.get('/student/:studentId', (req, res) => feeController.getStudentFees(req, res));

// Stats
router.get('/stats', (req, res) => feeController.getStats(req, res));

export default router;
