import { Notification } from './notification.model.js';
import { ApiError } from '../../utils/ApiError.js';

export class NotificationService {
  async create(data: any) {
    const notification = await Notification.create({ ...data, status: 'sent', sentAt: new Date() });
    return notification.populate('sender', 'firstName lastName');
  }

  async findAll(query: { type?: string; status?: string; page?: number; limit?: number }) {
    const filter: any = {};
    if (query.type) filter.type = query.type;
    if (query.status) filter.status = query.status;
    const page = query.page || 1;
    const limit = query.limit || 20;
    const [docs, total] = await Promise.all([
      Notification.find(filter).populate('sender', 'firstName lastName').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
      Notification.countDocuments(filter),
    ]);
    return { docs, total, page, limit };
  }

  async markRead(id: string, userId: string) {
    return Notification.findByIdAndUpdate(id, { $addToSet: { readBy: userId } }, { new: true });
  }

  async delete(id: string) {
    const doc = await Notification.findByIdAndDelete(id);
    if (!doc) throw ApiError.notFound('Notification not found');
    return doc;
  }

  async getStats() {
    const total = await Notification.countDocuments();
    const sent = await Notification.countDocuments({ status: 'sent' });
    const byType = await Notification.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]);
    return { total, sent, byType: Object.fromEntries(byType.map(b => [b._id, b.count])) };
  }
}

export const notificationService = new NotificationService();
