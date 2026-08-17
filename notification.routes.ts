import { Router } from 'express';
import { notificationController } from './notification.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER), (req, res) => notificationController.create(req, res));
router.get('/', (req, res) => notificationController.findAll(req, res));
router.get('/stats', (req, res) => notificationController.getStats(req, res));
router.patch('/:id/read', (req, res) => notificationController.markRead(req, res));
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => notificationController.delete(req, res));

export default router;
