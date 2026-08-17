import { Request, Response } from 'express';
import { Subject } from './subject.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export class SubjectController {
  async create(req: Request, res: Response) {
    const subject = await Subject.create(req.body);
    return ApiResponse.success(res, subject, 'Subject created', 201);
  }

  async findAll(req: Request, res: Response) {
    const { type, status, search } = req.query;
    const query: any = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }
    const subjects = await Subject.find(query).sort({ name: 1 });
    return ApiResponse.success(res, subjects);
  }

  async findById(req: Request, res: Response) {
    const subject = await Subject.findById(req.params.id);
    if (!subject) throw ApiError.notFound('Subject not found');
    return ApiResponse.success(res, subject);
  }

  async update(req: Request, res: Response) {
    const subject = await Subject.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subject) throw ApiError.notFound('Subject not found');
    return ApiResponse.success(res, subject, 'Subject updated');
  }

  async delete(req: Request, res: Response) {
    const subject = await Subject.findByIdAndUpdate(req.params.id, { status: 'archived' }, { new: true });
    if (!subject) throw ApiError.notFound('Subject not found');
    return ApiResponse.success(res, subject, 'Subject archived');
  }
}

export const subjectController = new SubjectController();
