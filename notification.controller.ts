import { Request, Response } from 'express';
import { notificationService } from './notification.service.js';
import { ApiResponse } from '../../utils/ApiResponse.js';

export class NotificationController {
  async create(req: Request, res: Response) {
    const n = await notificationService.create({ ...req.body, sender: req.user!.userId });
    return ApiResponse.success(res, n, 'Notification sent', 201);
  }
  async findAll(req: Request, res: Response) {
    const result = await notificationService.findAll({
      type: req.query.type as string | undefined,
      status: req.query.status as string | undefined,
      page: req.query.page ? Number(req.query.page) : undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    });
    return ApiResponse.paginated(res, result.docs, result.page, result.limit, result.total);
  }
  async markRead(req: Request, res: Response) {
    await notificationService.markRead(req.params.id as string, req.user!.userId);
    return ApiResponse.success(res, null, 'Marked as read');
  }
  async delete(req: Request, res: Response) {
    await notificationService.delete(req.params.id as string);
    return ApiResponse.success(res, null, 'Notification deleted');
  }
  async getStats(req: Request, res: Response) {
    const stats = await notificationService.getStats();
    return ApiResponse.success(res, stats);
  }
}
export const notificationController = new NotificationController();
