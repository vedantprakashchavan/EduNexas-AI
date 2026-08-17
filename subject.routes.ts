import { Router } from 'express';
import { subjectController } from './subject.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => subjectController.create(req, res));
router.get('/', (req, res) => subjectController.findAll(req, res));
router.get('/:id', (req, res) => subjectController.findById(req, res));
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => subjectController.update(req, res));
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => subjectController.delete(req, res));

export default router;
