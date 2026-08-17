import { FeeStructure, FeePayment } from './fee.model.js';
import { ApiError } from '../../utils/ApiError.js';

export class FeeService {
  // Fee Structure CRUD
  async createStructure(data: any) {
    // Auto-calculate total
    const total = data.components.reduce((s: number, c: any) => s + c.amount, 0);
    return FeeStructure.create({ ...data, totalAmount: total });
  }

  async getStructures(classId?: string, academicYear?: string) {
    const filter: any = {};
    if (classId) filter.classId = classId;
    if (academicYear) filter.academicYear = academicYear;
    return FeeStructure.find(filter).populate('classId', 'name').sort({ createdAt: -1 });
  }

  // Payment CRUD
  async recordPayment(data: any) {
    const receiptNumber = `REC-${Date.now().toString(36).toUpperCase()}`;
    const payment = await FeePayment.create({
      ...data,
      receiptNumber,
      paidDate: data.status === 'paid' ? new Date() : undefined,
    });
    return payment.populate([
      { path: 'studentId', select: 'firstName lastName admissionNumber' },
      { path: 'classId', select: 'name' },
    ]);
  }

  async getPayments(query: { classId?: string; sectionId?: string; status?: string; studentId?: string; page?: number; limit?: number }) {
    const filter: any = {};
    if (query.classId) filter.classId = query.classId;
    if (query.sectionId) filter.sectionId = query.sectionId;
    if (query.status) filter.status = query.status;
    if (query.studentId) filter.studentId = query.studentId;

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      FeePayment.find(filter)
        .populate('studentId', 'firstName lastName admissionNumber')
        .populate('classId', 'name')
        .sort({ createdAt: -1 })
        .skip(skip).limit(limit),
      FeePayment.countDocuments(filter),
    ]);
    return { payments, total, page, limit };
  }

  async getStudentFees(studentId: string) {
    return FeePayment.find({ studentId })
      .populate('classId', 'name')
      .sort({ dueDate: -1 });
  }

  // Dashboard stats
  async getStats(academicYear?: string) {
    const filter: any = {};
    if (academicYear) filter.academicYear = academicYear;

    const payments = await FeePayment.find(filter);
    const totalExpected = payments.reduce((s, p) => s + p.amount, 0);
    const totalCollected = payments.reduce((s, p) => s + p.paidAmount, 0);
    const totalPending = totalExpected - totalCollected;
    const totalDiscount = payments.reduce((s, p) => s + p.discount, 0);
    const totalFine = payments.reduce((s, p) => s + p.fine, 0);

    const statusCounts = {
      paid: payments.filter(p => p.status === 'paid').length,
      pending: payments.filter(p => p.status === 'pending').length,
      partial: payments.filter(p => p.status === 'partial').length,
      overdue: payments.filter(p => p.status === 'overdue').length,
    };

    // Collection by month
    const monthlyCollection = new Map<string, number>();
    for (const p of payments) {
      if (p.paidDate) {
        const key = `${p.paidDate.getFullYear()}-${String(p.paidDate.getMonth() + 1).padStart(2, '0')}`;
        monthlyCollection.set(key, (monthlyCollection.get(key) || 0) + p.paidAmount);
      }
    }

    // Payment mode breakdown
    const modeBreakdown = new Map<string, number>();
    for (const p of payments) {
      if (p.paymentMode && p.paidAmount > 0) {
        modeBreakdown.set(p.paymentMode, (modeBreakdown.get(p.paymentMode) || 0) + p.paidAmount);
      }
    }

    return {
      totalExpected,
      totalCollected,
      totalPending,
      totalDiscount,
      totalFine,
      collectionRate: totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0,
      statusCounts,
      monthlyCollection: Object.fromEntries(monthlyCollection),
      modeBreakdown: Object.fromEntries(modeBreakdown),
    };
  }
}

export const feeService = new FeeService();
