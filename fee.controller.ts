import { Request, Response } from 'express';
import { feeService } from './fee.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class FeeController {
  async createStructure(req: Request, res: Response) {
    const structure = await feeService.createStructure(req.body);
    return ApiResponse.success(res, structure, 'Fee structure created', 201);
  }

  async getStructures(req: Request, res: Response) {
    const structures = await feeService.getStructures(
      req.query.classId as string | undefined,
      req.query.academicYear as string | undefined,
    );
    return ApiResponse.success(res, structures);
  }

  async recordPayment(req: Request, res: Response) {
    const payment = await feeService.recordPayment({ ...req.body, collectedBy: req.user!.userId });
    return ApiResponse.success(res, payment, 'Payment recorded', 201);
  }

  async getPayments(req: Request, res: Response) {
    const result = await feeService.getPayments({
      classId: req.query.classId as string | undefined,
      sectionId: req.query.sectionId as string | undefined,
      status: req.query.status as string | undefined,
      studentId: req.query.studentId as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    return ApiResponse.paginated(res, result.payments, result.page, result.limit, result.total);
  }

  async getStudentFees(req: Request, res: Response) {
    const fees = await feeService.getStudentFees(req.params.studentId as string);
    return ApiResponse.success(res, fees);
  }

  async getStats(req: Request, res: Response) {
    const stats = await feeService.getStats(req.query.academicYear as string | undefined);
    return ApiResponse.success(res, stats);
  }
}

export const feeController = new FeeController();
