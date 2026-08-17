import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../../utils/ApiResponse.js';

export const getStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = {
      totalStudents: 1200,
      totalTeachers: 85,
      activeCourses: 45,
      attendanceRate: 94.5
    };
    ApiResponse.success(res, stats, 'Stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAlerts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const alerts = [
      { id: 1, type: 'WARNING', message: 'Library books due tomorrow: 15' },
      { id: 2, type: 'INFO', message: 'Staff meeting at 3 PM' }
    ];
    ApiResponse.success(res, alerts, 'Alerts retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getInsights = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insights = [
      { id: 1, title: 'Performance Trend', description: 'Grade 10 average score increased by 5% this month.' },
      { id: 2, title: 'Attendance Risk', description: '3 students in Grade 8 have consecutive absences.' }
    ];
    ApiResponse.success(res, insights, 'Insights retrieved successfully');
  } catch (error) {
    next(error);
  }
};
