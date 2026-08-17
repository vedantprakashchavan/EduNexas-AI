import mongoose, { Document, Schema } from 'mongoose';

export interface IExtractedField {
  key: string;
  value: string;
  confidence: number; // 0-1
  boundingBox?: { x: number; y: number; width: number; height: number };
  category: 'personal' | 'academic' | 'contact' | 'financial' | 'other';
}

export interface IDocument extends Document {
  title: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  documentType: 'admission_form' | 'transfer_certificate' | 'report_card' | 'fee_receipt' | 'id_card' | 'other';
  status: 'uploaded' | 'processing' | 'extracted' | 'verified' | 'failed';
  extractedFields: IExtractedField[];
  rawText?: string;
  overallConfidence: number;
  processingTime?: number; // ms
  linkedEntity?: {
    type: 'student' | 'teacher' | 'class';
    id: mongoose.Types.ObjectId;
    name: string;
  };
  uploadedBy: mongoose.Types.ObjectId;
  verifiedBy?: mongoose.Types.ObjectId;
  notes?: string;
}

const extractedFieldSchema = new Schema<IExtractedField>({
  key: { type: String, required: true },
  value: { type: String, required: true },
  confidence: { type: Number, required: true, min: 0, max: 1 },
  boundingBox: {
    x: Number,
    y: Number,
    width: Number,
    height: Number,
  },
  category: {
    type: String,
    enum: ['personal', 'academic', 'contact', 'financial', 'other'],
    default: 'other',
  },
}, { _id: false });

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    fileName: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    documentType: {
      type: String,
      enum: ['admission_form', 'transfer_certificate', 'report_card', 'fee_receipt', 'id_card', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['uploaded', 'processing', 'extracted', 'verified', 'failed'],
      default: 'uploaded',
    },
    extractedFields: [extractedFieldSchema],
    rawText: { type: String },
    overallConfidence: { type: Number, default: 0 },
    processingTime: { type: Number },
    linkedEntity: {
      type: { type: String, enum: ['student', 'teacher', 'class'] },
      id: { type: Schema.Types.ObjectId },
      name: { type: String },
    },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    verifiedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

documentSchema.index({ status: 1 });
documentSchema.index({ documentType: 1 });
documentSchema.index({ uploadedBy: 1 });
documentSchema.index({ createdAt: -1 });

export const AIDocument = mongoose.model<IDocument>('AIDocument', documentSchema);
