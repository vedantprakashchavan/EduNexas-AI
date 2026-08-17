import { Router } from 'express';
import { examController } from './exam.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => examController.create(req, res));
router.get('/', (req, res) => examController.findAll(req, res));
router.get('/stats', (req, res) => examController.getStats(req, res));
router.get('/:id', (req, res) => examController.findById(req, res));
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => examController.update(req, res));
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => examController.delete(req, res));
router.post('/:id/results', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER), (req, res) => examController.submitResults(req, res));
router.patch('/:id/publish', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => examController.publishResults(req, res));

export default router;
