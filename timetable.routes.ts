import { Router } from 'express';
import { timetableController } from './timetable.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

// Generate a timetable for a class/section
router.post('/generate', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => timetableController.generate(req, res));

// List all timetables
router.get('/', (req, res) => timetableController.findAll(req, res));

// Detect conflicts across all timetables
router.get('/conflicts', (req, res) => timetableController.detectConflicts(req, res));

// Get timetable for a specific class/section
router.get('/:classId/:sectionId', (req, res) => timetableController.findByClassSection(req, res));

// Publish a timetable
router.patch('/:id/publish', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL), (req, res) => timetableController.publish(req, res));

// Delete a timetable
router.delete('/:id', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN), (req, res) => timetableController.delete(req, res));

export default router;
