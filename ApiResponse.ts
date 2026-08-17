import { Response } from 'express';

export class ApiResponse {
  static success(res: Response, data: any = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res: Response, message = 'Error', statusCode = 500) {
    return res.status(statusCode).json({
      success: false,
      message,
      error: message
    });
  }

  static paginated(res: Response, data: any[], page: number, limit: number, total: number, message = 'Success') {
    return res.status(200).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  }
}
