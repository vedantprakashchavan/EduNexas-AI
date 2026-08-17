import mongoose, { Document, Schema } from 'mongoose';

export interface ISubject extends Document {
  name: string;
  code: string;
  department?: string;
  type: 'theory' | 'practical' | 'elective';
  periodsPerWeek: number;
  description?: string;
  status: 'active' | 'archived';
}

const subjectSchema = new Schema<ISubject>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    department: { type: String },
    type: { type: String, enum: ['theory', 'practical', 'elective'], default: 'theory' },
    periodsPerWeek: { type: Number, required: true },
    description: { type: String },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

export const Subject = mongoose.model<ISubject>('Subject', subjectSchema);
