import { Request, Response } from 'express';
import { Student } from './student.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export class StudentController {
  async create(req: Request, res: Response) {
    const student = await Student.create(req.body);
    return ApiResponse.success(res, student, 'Student created successfully', 201);
  }

  async findAll(req: Request, res: Response) {
    const { page = 1, limit = 10, search, classId, status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { admissionNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (classId) query.classId = classId;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const sort: any = { [sortBy as string]: sortOrder === 'asc' ? 1 : -1 };

    const [students, total] = await Promise.all([
      Student.find(query).populate('classId', 'name').sort(sort).skip(skip).limit(Number(limit)),
      Student.countDocuments(query),
    ]);

    return ApiResponse.paginated(res, students, Number(page), Number(limit), total);
  }

  async findById(req: Request, res: Response) {
    const student = await Student.findById(req.params.id).populate('classId', 'name');
    if (!student) throw ApiError.notFound('Student not found');
    return ApiResponse.success(res, student);
  }

  async update(req: Request, res: Response) {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!student) throw ApiError.notFound('Student not found');
    return ApiResponse.success(res, student, 'Student updated successfully');
  }

  async delete(req: Request, res: Response) {
    const student = await Student.findByIdAndUpdate(req.params.id, { status: 'inactive' }, { new: true });
    if (!student) throw ApiError.notFound('Student not found');
    return ApiResponse.success(res, student, 'Student deactivated');
  }

  async getStats(req: Request, res: Response) {
    const [total, active, inactive] = await Promise.all([
      Student.countDocuments(),
      Student.countDocuments({ status: 'active' }),
      Student.countDocuments({ status: { $ne: 'active' } }),
    ]);
    return ApiResponse.success(res, { total, active, inactive });
  }
}

export const studentController = new StudentController();
