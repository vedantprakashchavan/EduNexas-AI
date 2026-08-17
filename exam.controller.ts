import { Request, Response } from 'express';
import { examService } from './exam.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class ExamController {
  async create(req: Request, res: Response) {
    const exam = await examService.create({ ...req.body, createdBy: req.user!.userId });
    return ApiResponse.success(res, exam, 'Exam created', 201);
  }

  async findAll(req: Request, res: Response) {
    const exams = await examService.findAll({
      classId: req.query.classId as string | undefined,
      academicYear: req.query.academicYear as string | undefined,
      status: req.query.status as string | undefined,
      type: req.query.type as string | undefined,
    });
    return ApiResponse.success(res, exams);
  }

  async findById(req: Request, res: Response) {
    const exam = await examService.findById(req.params.id as string);
    return ApiResponse.success(res, exam);
  }

  async update(req: Request, res: Response) {
    const exam = await examService.update(req.params.id as string, req.body);
    return ApiResponse.success(res, exam, 'Exam updated');
  }

  async delete(req: Request, res: Response) {
    await examService.delete(req.params.id as string);
    return ApiResponse.success(res, null, 'Exam deleted');
  }

  async submitResults(req: Request, res: Response) {
    const exam = await examService.submitResults(req.params.id as string, req.body.results);
    return ApiResponse.success(res, exam, 'Results submitted');
  }

  async publishResults(req: Request, res: Response) {
    const exam = await examService.publishResults(req.params.id as string);
    return ApiResponse.success(res, exam, 'Results published');
  }

  async getStats(req: Request, res: Response) {
    const stats = await examService.getStats(
      req.query.classId as string | undefined,
      req.query.academicYear as string | undefined,
    );
    return ApiResponse.success(res, stats);
  }
}

export const examController = new ExamController();
