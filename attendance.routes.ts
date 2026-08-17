import { Router } from 'express';
import { attendanceController } from './attendance.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';
import { authorize } from '../../middleware/rbac.middleware.js';
import { UserRole } from '../../types/index.js';

const router = Router();
router.use(authMiddleware);

// Mark bulk attendance
router.post('/mark', authorize(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.PRINCIPAL, UserRole.TEACHER), (req, res) => attendanceController.markBulk(req, res));

// Today's school stats
router.get('/today', (req, res) => attendanceController.getTodayStats(req, res));

// Get attendance for class/section on a date
router.get('/class/:classId/:sectionId', (req, res) => attendanceController.getByClassDate(req, res));

// Class stats (monthly)
router.get('/stats/:classId/:sectionId', (req, res) => attendanceController.getClassStats(req, res));

// Student history
router.get('/student/:studentId', (req, res) => attendanceController.getStudentHistory(req, res));

export default router;
