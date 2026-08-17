import { Request, Response } from 'express';
import { Room } from './room.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export class RoomController {
  async create(req: Request, res: Response) {
    const room = await Room.create(req.body);
    return ApiResponse.success(res, room, 'Room created', 201);
  }

  async findAll(req: Request, res: Response) {
    const { type, status } = req.query;
    const query: any = {};
    if (type) query.type = type;
    if (status) query.status = status;
    const rooms = await Room.find(query).sort({ number: 1 });
    return ApiResponse.success(res, rooms);
  }

  async findById(req: Request, res: Response) {
    const room = await Room.findById(req.params.id);
    if (!room) throw ApiError.notFound('Room not found');
    return ApiResponse.success(res, room);
  }

  async update(req: Request, res: Response) {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!room) throw ApiError.notFound('Room not found');
    return ApiResponse.success(res, room, 'Room updated');
  }

  async delete(req: Request, res: Response) {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) throw ApiError.notFound('Room not found');
    return ApiResponse.success(res, null, 'Room deleted');
  }
}

export const roomController = new RoomController();
