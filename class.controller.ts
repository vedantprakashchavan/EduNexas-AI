import { Request, Response } from 'express';
import { Class } from './class.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export class ClassController {
  async create(req: Request, res: Response) {
    const cls = await Class.create(req.body);
    return ApiResponse.success(res, cls, 'Class created', 201);
  }

  async findAll(req: Request, res: Response) {
    const classes = await Class.find({ status: 'active' })
      .populate('classTeacherId', 'firstName lastName')
      .populate('subjects', 'name code')
      .sort({ name: 1 });
    return ApiResponse.success(res, classes);
  }

  async findById(req: Request, res: Response) {
    const cls = await Class.findById(req.params.id)
      .populate('classTeacherId', 'firstName lastName')
      .populate('subjects', 'name code');
    if (!cls) throw ApiError.notFound('Class not found');
    return ApiResponse.success(res, cls);
  }

  async update(req: Request, res: Response) {
    const cls = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!cls) throw ApiError.notFound('Class not found');
    return ApiResponse.success(res, cls, 'Class updated');
  }

  async delete(req: Request, res: Response) {
    const cls = await Class.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true });
    if (!cls) throw ApiError.notFound('Class not found');
    return ApiResponse.success(res, cls, 'Class archived');
  }
}

export const classController = new ClassController();
