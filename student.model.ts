import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  classId?: mongoose.Types.ObjectId;
  sectionId?: string;
  parentId?: mongoose.Types.ObjectId;
  bloodGroup?: string;
  photo?: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  admissionDate?: Date;
  previousSchool?: string;
  documents?: {
    name: string;
    url: string;
    type: string;
    uploadedAt: Date;
  }[];
  fullName: string;
}

const studentSchema = new Schema<IStudent>(
  {
    admissionNumber: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    email: { type: String },
    phone: { type: String },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String
    },
    classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    sectionId: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: 'User' },
    bloodGroup: { type: String },
    photo: { type: String },
    status: {
      type: String,
      enum: ['active', 'inactive', 'transferred', 'graduated'],
      default: 'active'
    },
    admissionDate: { type: Date },
    previousSchool: { type: String },
    documents: [
      {
        name: String,
        url: String,
        type: { type: String },
        uploadedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

studentSchema.virtual('fullName').get(function (this: IStudent) {
  return `${this.firstName} ${this.lastName}`;
});

studentSchema.index({ admissionNumber: 1 }, { unique: true });
studentSchema.index({ classId: 1 });
studentSchema.index({ parentId: 1 });
studentSchema.index({ status: 1 });

export const Student = mongoose.model<IStudent>('Student', studentSchema);
