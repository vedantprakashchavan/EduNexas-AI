import { Router } from 'express';
import { roomController } from './room.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => roomController.create(req, res));
router.get('/', (req, res) => roomController.findAll(req, res));
router.get('/:id', (req, res) => roomController.findById(req, res));
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => roomController.update(req, res));
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => roomController.delete(req, res));

export default router;
