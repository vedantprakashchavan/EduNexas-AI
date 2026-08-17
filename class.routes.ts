import { Router } from 'express';
import { classController } from './class.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => classController.create(req, res));
router.get('/', (req, res) => classController.findAll(req, res));
router.get('/:id', (req, res) => classController.findById(req, res));
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => classController.update(req, res));
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => classController.delete(req, res));

export default router;
