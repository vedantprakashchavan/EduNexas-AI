import { Attendance } from './attendance.model.js';
import { Student } from '../students/student.model.js';
import { ApiError } from '../../utils/ApiError.js';

export class AttendanceService {
  /**
   * Mark attendance for an entire class/section at once (bulk)
   */
  async markBulk(data: {
    classId: string;
    sectionId: string;
    date: string;
    period?: number;
    records: { studentId: string; status: 'present' | 'absent' | 'late' | 'excused'; remarks?: string }[];
    markedBy: string;
    academicYear?: string;
  }) {
    const dateObj = new Date(data.date);
    dateObj.setHours(0, 0, 0, 0);

    const counts = { present: 0, absent: 0, late: 0, excused: 0 };
    for (const r of data.records) {
      counts[r.status]++;
    }

    const attendance = await Attendance.findOneAndUpdate(
      {
        classId: data.classId,
        sectionId: data.sectionId,
        date: dateObj,
        period: data.period || null,
      },
      {
        classId: data.classId,
        sectionId: data.sectionId,
        date: dateObj,
        period: data.period || null,
        records: data.records,
        totalPresent: counts.present,
        totalAbsent: counts.absent,
        totalLate: counts.late,
        totalExcused: counts.excused,
        markedBy: data.markedBy,
        academicYear: data.academicYear || '2025-2026',
      },
      { upsert: true, new: true, runValidators: true }
    );

    return attendance;
  }

  /**
   * Get attendance for a class/section on a specific date
   */
  async getByClassDate(classId: string, sectionId: string, date: string) {
    const dateObj = new Date(date);
    dateObj.setHours(0, 0, 0, 0);

    const attendance = await Attendance.findOne({
      classId,
      sectionId,
      date: dateObj,
      period: null,
    }).populate('records.studentId', 'firstName lastName admissionNumber');

    return attendance;
  }

  /**
   * Get student attendance history
   */
  async getStudentHistory(studentId: string, startDate?: string, endDate?: string) {
    const query: any = { 'records.studentId': studentId };
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const records = await Attendance.find(query)
      .populate('classId', 'name')
      .sort({ date: -1 })
      .limit(90); // last 90 entries

    // Extract this student's status from each attendance record
    const history = records.map(att => {
      const studentRecord = att.records.find(r => String(r.studentId) === studentId || String((r.studentId as any)?._id) === studentId);
      return {
        date: att.date,
        classId: att.classId,
        sectionId: att.sectionId,
        period: att.period,
        status: studentRecord?.status || 'absent',
        remarks: studentRecord?.remarks,
      };
    });

    return history;
  }

  /**
   * Get attendance stats for a class over a date range
   */
  async getClassStats(classId: string, sectionId: string, month?: string) {
    const query: any = { classId, sectionId };

    if (month) {
      // month format: "2025-07"
      const [year, m] = month.split('-').map(Number);
      query.date = {
        $gte: new Date(year, m - 1, 1),
        $lt: new Date(year, m, 1),
      };
    }

    const records = await Attendance.find(query).sort({ date: 1 });

    const totalDays = records.length;
    const totalPresent = records.reduce((s, r) => s + r.totalPresent, 0);
    const totalAbsent = records.reduce((s, r) => s + r.totalAbsent, 0);
    const totalLate = records.reduce((s, r) => s + r.totalLate, 0);
    const totalStudentDays = records.reduce((s, r) => s + r.records.length, 0);

    const attendanceRate = totalStudentDays > 0
      ? Math.round(((totalPresent + totalLate) / totalStudentDays) * 10000) / 100
      : 0;

    // Daily breakdown
    const dailyBreakdown = records.map(r => ({
      date: r.date,
      present: r.totalPresent,
      absent: r.totalAbsent,
      late: r.totalLate,
      total: r.records.length,
      rate: r.records.length > 0
        ? Math.round(((r.totalPresent + r.totalLate) / r.records.length) * 100)
        : 0,
    }));

    return {
      totalDays,
      totalPresent,
      totalAbsent,
      totalLate,
      attendanceRate,
      dailyBreakdown,
    };
  }

  /**
   * Get overall school attendance stats for today
   */
  async getTodayStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const records = await Attendance.find({ date: today });

    const classesMarked = records.length;
    const totalPresent = records.reduce((s, r) => s + r.totalPresent, 0);
    const totalAbsent = records.reduce((s, r) => s + r.totalAbsent, 0);
    const totalLate = records.reduce((s, r) => s + r.totalLate, 0);
    const totalStudents = records.reduce((s, r) => s + r.records.length, 0);

    return {
      classesMarked,
      totalPresent,
      totalAbsent,
      totalLate,
      totalStudents,
      attendanceRate: totalStudents > 0
        ? Math.round(((totalPresent + totalLate) / totalStudents) * 100)
        : 0,
    };
  }
}

export const attendanceService = new AttendanceService();
