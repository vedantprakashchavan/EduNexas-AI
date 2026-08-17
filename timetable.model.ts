import mongoose, { Document, Schema } from 'mongoose';

export interface ITimetableSlot {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  period: number; // 1-8
  subjectId: mongoose.Types.ObjectId;
  teacherId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  sectionId: string;
  type: 'regular' | 'lab' | 'activity' | 'break' | 'assembly';
}

export interface ITimetable extends Document {
  classId: mongoose.Types.ObjectId;
  sectionId: string;
  academicYear: string;
  slots: ITimetableSlot[];
  status: 'draft' | 'published' | 'archived';
  generatedAt?: Date;
  publishedAt?: Date;
  conflicts: IConflict[];
  createdBy?: mongoose.Types.ObjectId;
}

export interface IConflict {
  type: 'teacher_clash' | 'room_clash' | 'subject_overload' | 'teacher_overload';
  day: string;
  period: number;
  message: string;
  severity: 'error' | 'warning';
  relatedEntities: { type: string; id: string; name: string }[];
}

export interface IPeriodConfig extends Document {
  academicYear: string;
  periods: {
    number: number;
    startTime: string;
    endTime: string;
    type: 'class' | 'break' | 'lunch' | 'assembly';
    label: string;
  }[];
  workingDays: string[];
}

const timetableSlotSchema = new Schema<ITimetableSlot>({
  day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
  period: { type: Number, required: true, min: 1, max: 8 },
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject' },
  teacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  sectionId: { type: String, required: true },
  type: { type: String, enum: ['regular', 'lab', 'activity', 'break', 'assembly'], default: 'regular' },
}, { _id: false });

const conflictSchema = new Schema<IConflict>({
  type: { type: String, enum: ['teacher_clash', 'room_clash', 'subject_overload', 'teacher_overload'], required: true },
  day: { type: String, required: true },
  period: { type: Number, required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ['error', 'warning'], default: 'error' },
  relatedEntities: [{ type: { type: String }, id: String, name: String }],
}, { _id: false });

const timetableSchema = new Schema<ITimetable>(
  {
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: String, required: true },
    academicYear: { type: String, required: true },
    slots: [timetableSlotSchema],
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    generatedAt: { type: Date },
    publishedAt: { type: Date },
    conflicts: [conflictSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

timetableSchema.index({ classId: 1, sectionId: 1, academicYear: 1 }, { unique: true });
timetableSchema.index({ status: 1 });

const periodConfigSchema = new Schema<IPeriodConfig>(
  {
    academicYear: { type: String, required: true, unique: true },
    periods: [{
      number: { type: Number, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      type: { type: String, enum: ['class', 'break', 'lunch', 'assembly'], default: 'class' },
      label: { type: String, required: true },
    }],
    workingDays: [{ type: String }],
  },
  { timestamps: true }
);

export const Timetable = mongoose.model<ITimetable>('Timetable', timetableSchema);
export const PeriodConfig = mongoose.model<IPeriodConfig>('PeriodConfig', periodConfigSchema);
