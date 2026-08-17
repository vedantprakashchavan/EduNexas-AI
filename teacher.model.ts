import mongoose, { Document, Schema } from 'mongoose';

export interface ITeacher extends Document {
  employeeId: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address?: { street?: string; city?: string; state?: string; pincode?: string };
  department?: string;
  subjects: string[];
  qualifications?: { degree: string; institution: string; year: number }[];
  experience?: number;
  joiningDate?: Date;
  salary?: number;
  status: 'active' | 'on_leave' | 'resigned' | 'retired';
  photo?: string;
  maxPeriodsPerDay: number;
  maxPeriodsPerWeek: number;
  userId?: mongoose.Types.ObjectId;
  fullName: string;
}

const teacherSchema = new Schema<ITeacher>(
  {
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { street: String, city: String, state: String, pincode: String },
    department: { type: String },
    subjects: [{ type: String }],
    qualifications: [{ degree: String, institution: String, year: Number }],
    experience: { type: Number },
    joiningDate: { type: Date },
    salary: { type: Number },
    status: { type: String, enum: ['active', 'on_leave', 'resigned', 'retired'], default: 'active' },
    photo: { type: String },
    maxPeriodsPerDay: { type: Number, default: 6 },
    maxPeriodsPerWeek: { type: Number, default: 30 },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

teacherSchema.virtual('fullName').get(function (this: ITeacher) {
  return `${this.firstName} ${this.lastName}`;
});

teacherSchema.index({ employeeId: 1 }, { unique: true });
teacherSchema.index({ department: 1 });
teacherSchema.index({ status: 1 });

export const Teacher = mongoose.model<ITeacher>('Teacher', teacherSchema);
