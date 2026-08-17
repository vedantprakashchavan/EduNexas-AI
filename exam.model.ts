import mongoose, { Document, Schema } from 'mongoose';

export interface IExamSubjectScore {
  subjectId: mongoose.Types.ObjectId;
  maxMarks: number;
  passingMarks: number;
  marksObtained?: number;
  grade?: string;
  remarks?: string;
}

export interface IExamResult {
  studentId: mongoose.Types.ObjectId;
  scores: IExamSubjectScore[];
  totalMarks: number;
  totalMaxMarks: number;
  percentage: number;
  grade: string;
  rank?: number;
  remarks?: string;
}

export interface IExam extends Document {
  name: string;
  type: 'unit_test' | 'midterm' | 'final' | 'practical' | 'assignment';
  classId: mongoose.Types.ObjectId;
  sectionId: string;
  academicYear: string;
  startDate: Date;
  endDate: Date;
  subjects: {
    subjectId: mongoose.Types.ObjectId;
    examDate: Date;
    maxMarks: number;
    passingMarks: number;
    startTime?: string;
    endTime?: string;
    roomId?: mongoose.Types.ObjectId;
  }[];
  results: IExamResult[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'results_published';
  createdBy: mongoose.Types.ObjectId;
}

const examSubjectScoreSchema = new Schema<IExamSubjectScore>({
  subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
  maxMarks: { type: Number, required: true },
  passingMarks: { type: Number, required: true },
  marksObtained: { type: Number },
  grade: { type: String },
  remarks: { type: String },
}, { _id: false });

const examResultSchema = new Schema<IExamResult>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  scores: [examSubjectScoreSchema],
  totalMarks: { type: Number, default: 0 },
  totalMaxMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  grade: { type: String, default: '' },
  rank: { type: Number },
  remarks: { type: String },
}, { _id: false });

const examSchema = new Schema<IExam>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ['unit_test', 'midterm', 'final', 'practical', 'assignment'], required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: String, required: true },
    academicYear: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    subjects: [{
      subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', required: true },
      examDate: { type: Date, required: true },
      maxMarks: { type: Number, required: true },
      passingMarks: { type: Number, required: true },
      startTime: { type: String },
      endTime: { type: String },
      roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    }],
    results: [examResultSchema],
    status: { type: String, enum: ['scheduled', 'ongoing', 'completed', 'results_published'], default: 'scheduled' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

examSchema.index({ classId: 1, sectionId: 1, academicYear: 1 });
examSchema.index({ status: 1 });
examSchema.index({ startDate: 1 });

export const Exam = mongoose.model<IExam>('Exam', examSchema);
