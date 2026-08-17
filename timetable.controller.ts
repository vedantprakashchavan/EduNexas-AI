import { Request, Response } from 'express';
import { timetableService } from './timetable.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class TimetableController {
  async generate(req: Request, res: Response) {
    const { classId, sectionId, academicYear } = req.body;
    const timetable = await timetableService.generate(classId, sectionId, academicYear || '2025-2026');
    return ApiResponse.success(res, timetable, 'Timetable generated successfully', 201);
  }

  async findAll(req: Request, res: Response) {
    const academicYear = req.query.academicYear as string | undefined;
    const timetables = await timetableService.findAll(academicYear);
    return ApiResponse.success(res, timetables);
  }

  async findByClassSection(req: Request, res: Response) {
    const classId = req.params.classId as string;
    const sectionId = req.params.sectionId as string;
    const academicYear = (req.query.academicYear as string) || '2025-2026';
    const timetable = await timetableService.findByClassSection(classId, sectionId, academicYear);
    if (!timetable) {
      return ApiResponse.success(res, null, 'No timetable found for this class/section');
    }
    return ApiResponse.success(res, timetable);
  }

  async detectConflicts(req: Request, res: Response) {
    const academicYear = (req.query.academicYear as string) || '2025-2026';
    const conflicts = await timetableService.detectConflicts(academicYear);
    return ApiResponse.success(res, {
      total: conflicts.length,
      errors: conflicts.filter(c => c.severity === 'error').length,
      warnings: conflicts.filter(c => c.severity === 'warning').length,
      conflicts,
    });
  }

  async publish(req: Request, res: Response) {
    const timetable = await timetableService.publish(req.params.id as string);
    return ApiResponse.success(res, timetable, 'Timetable published');
  }

  async delete(req: Request, res: Response) {
    await timetableService.delete(req.params.id as string);
    return ApiResponse.success(res, null, 'Timetable deleted');
  }
}

export const timetableController = new TimetableController();
