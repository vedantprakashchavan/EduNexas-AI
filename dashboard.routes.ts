import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/stats', dashboardController.getStats);
router.get('/alerts', dashboardController.getAlerts);
router.get('/insights', dashboardController.getInsights);

export default router;
