import { Router } from 'express';
import { teacherController } from './teacher.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createTeacherSchema, updateTeacherSchema } from './teacher.validation.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), validate(createTeacherSchema), (req, res) => teacherController.create(req, res));
router.get('/', (req, res) => teacherController.findAll(req, res));
router.get('/stats', (req, res) => teacherController.getStats(req, res));
router.get('/:id', (req, res) => teacherController.findById(req, res));
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), validate(updateTeacherSchema), (req, res) => teacherController.update(req, res));
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => teacherController.delete(req, res));

export default router;
