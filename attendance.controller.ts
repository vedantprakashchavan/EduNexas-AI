import { Request, Response } from 'express';
import { attendanceService } from './attendance.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class AttendanceController {
  async markBulk(req: Request, res: Response) {
    const attendance = await attendanceService.markBulk({
      ...req.body,
      markedBy: req.user!.userId,
    });
    return ApiResponse.success(res, attendance, 'Attendance marked', 201);
  }

  async getByClassDate(req: Request, res: Response) {
    const classId = req.params.classId as string;
    const sectionId = req.params.sectionId as string;
    const date = req.query.date as string || new Date().toISOString().split('T')[0];
    const attendance = await attendanceService.getByClassDate(classId, sectionId, date);
    return ApiResponse.success(res, attendance);
  }

  async getStudentHistory(req: Request, res: Response) {
    const studentId = req.params.studentId as string;
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    const history = await attendanceService.getStudentHistory(studentId, startDate, endDate);
    return ApiResponse.success(res, history);
  }

  async getClassStats(req: Request, res: Response) {
    const classId = req.params.classId as string;
    const sectionId = req.params.sectionId as string;
    const month = req.query.month as string | undefined;
    const stats = await attendanceService.getClassStats(classId, sectionId, month);
    return ApiResponse.success(res, stats);
  }

  async getTodayStats(req: Request, res: Response) {
    const stats = await attendanceService.getTodayStats();
    return ApiResponse.success(res, stats);
  }
}

export const attendanceController = new AttendanceController();
