import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendanceRecord {
  studentId: mongoose.Types.ObjectId;
  status: 'present' | 'absent' | 'late' | 'excused';
  remarks?: string;
}

export interface IAttendance extends Document {
  classId: mongoose.Types.ObjectId;
  sectionId: string;
  date: Date;
  period?: number; // if period-wise; null = full-day
  records: IAttendanceRecord[];
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
  markedBy: mongoose.Types.ObjectId;
  academicYear: string;
}

const attendanceRecordSchema = new Schema<IAttendanceRecord>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['present', 'absent', 'late', 'excused'], required: true },
  remarks: { type: String },
}, { _id: false });

const attendanceSchema = new Schema<IAttendance>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: String, required: true },
    date: { type: Date, required: true },
    period: { type: Number },
    records: [attendanceRecordSchema],
    totalPresent: { type: Number, default: 0 },
    totalAbsent: { type: Number, default: 0 },
    totalLate: { type: Number, default: 0 },
    totalExcused: { type: Number, default: 0 },
    markedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    academicYear: { type: String, required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ classId: 1, sectionId: 1, date: 1, period: 1 }, { unique: true });
attendanceSchema.index({ date: 1 });
attendanceSchema.index({ 'records.studentId': 1 });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
