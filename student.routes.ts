import { Router } from 'express';
import { studentController } from './student.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createStudentSchema, updateStudentSchema } from './student.validation.js';
import { UserRole } from '../../types/index.js';

const router = Router();

router.use(authMiddleware);

router.post('/', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), validate(createStudentSchema), (req, res) => studentController.create(req, res));
router.get('/', (req, res) => studentController.findAll(req, res));
router.get('/stats', (req, res) => studentController.getStats(req, res));
router.get('/:id', (req, res) => studentController.findById(req, res));
router.put('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), validate(updateStudentSchema), (req, res) => studentController.update(req, res));
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => studentController.delete(req, res));

export default router;
