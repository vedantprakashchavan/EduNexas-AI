import mongoose, { Document, Schema } from 'mongoose';

export interface IFeeStructure extends Document {
  name: string;
  academicYear: string;
  classId: mongoose.Types.ObjectId;
  components: {
    name: string;
    amount: number;
    type: 'tuition' | 'transport' | 'lab' | 'library' | 'sports' | 'exam' | 'admission' | 'other';
    frequency: 'monthly' | 'quarterly' | 'half_yearly' | 'annually' | 'one_time';
  }[];
  totalAmount: number;
  status: 'active' | 'archived';
}

export interface IFeePayment extends Document {
  studentId: mongoose.Types.ObjectId;
  classId: mongoose.Types.ObjectId;
  sectionId: string;
  academicYear: string;
  feeStructureId: mongoose.Types.ObjectId;
  amount: number;
  paidAmount: number;
  discount: number;
  fine: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'partial' | 'paid' | 'overdue' | 'waived';
  paymentMode?: 'cash' | 'cheque' | 'upi' | 'bank_transfer' | 'online';
  transactionId?: string;
  receiptNumber?: string;
  period: string; // e.g. "July 2025", "Q1 2025-26"
  remarks?: string;
  collectedBy?: mongoose.Types.ObjectId;
}

const feeStructureSchema = new Schema<IFeeStructure>(
  {
    name: { type: String, required: true },
    academicYear: { type: String, required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    components: [{
      name: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: ['tuition', 'transport', 'lab', 'library', 'sports', 'exam', 'admission', 'other'], required: true },
      frequency: { type: String, enum: ['monthly', 'quarterly', 'half_yearly', 'annually', 'one_time'], required: true },
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

feeStructureSchema.index({ classId: 1, academicYear: 1 });

const feePaymentSchema = new Schema<IFeePayment>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: String, required: true },
    academicYear: { type: String, required: true },
    feeStructureId: { type: Schema.Types.ObjectId, ref: 'FeeStructure' },
    amount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    fine: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    status: { type: String, enum: ['pending', 'partial', 'paid', 'overdue', 'waived'], default: 'pending' },
    paymentMode: { type: String, enum: ['cash', 'cheque', 'upi', 'bank_transfer', 'online'] },
    transactionId: { type: String },
    receiptNumber: { type: String },
    period: { type: String, required: true },
    remarks: { type: String },
    collectedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

feePaymentSchema.index({ studentId: 1 });
feePaymentSchema.index({ classId: 1, sectionId: 1 });
feePaymentSchema.index({ status: 1 });
feePaymentSchema.index({ dueDate: 1 });

export const FeeStructure = mongoose.model<IFeeStructure>('FeeStructure', feeStructureSchema);
export const FeePayment = mongoose.model<IFeePayment>('FeePayment', feePaymentSchema);
