import { Request, Response } from 'express';
import { Teacher } from './teacher.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export class TeacherController {
  async create(req: Request, res: Response) {
    const teacher = await Teacher.create(req.body);
    return ApiResponse.success(res, teacher, 'Teacher created', 201);
  }

  async findAll(req: Request, res: Response) {
    const { page = 1, limit = 10, search, department, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query: any = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }
    if (department) query.department = department;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [teachers, total] = await Promise.all([
      Teacher.find(query).sort({ [sortBy as string]: sortOrder === 'asc' ? 1 : -1 }).skip(skip).limit(Number(limit)),
      Teacher.countDocuments(query),
    ]);
    return ApiResponse.paginated(res, teachers, Number(page), Number(limit), total);
  }

  async findById(req: Request, res: Response) {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) throw ApiError.notFound('Teacher not found');
    return ApiResponse.success(res, teacher);
  }

  async update(req: Request, res: Response) {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!teacher) throw ApiError.notFound('Teacher not found');
    return ApiResponse.success(res, teacher, 'Teacher updated');
  }

  async delete(req: Request, res: Response) {
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { status: 'resigned' }, { new: true });
    if (!teacher) throw ApiError.notFound('Teacher not found');
    return ApiResponse.success(res, teacher, 'Teacher deactivated');
  }

  async getStats(req: Request, res: Response) {
    const [total, active, onLeave] = await Promise.all([
      Teacher.countDocuments(),
      Teacher.countDocuments({ status: 'active' }),
      Teacher.countDocuments({ status: 'on_leave' }),
    ]);
    return ApiResponse.success(res, { total, active, onLeave });
  }
}

export const teacherController = new TeacherController();
