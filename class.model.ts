import mongoose, { Document, Schema } from 'mongoose';

export interface IClass extends Document {
  name: string;
  sections: { name: string; capacity: number }[];
  academicYear: string;
  classTeacherId?: mongoose.Types.ObjectId;
  subjects?: mongoose.Types.ObjectId[];
  roomId?: mongoose.Types.ObjectId;
  status: 'active' | 'archived';
}

const classSchema = new Schema<IClass>(
  {
    name: { type: String, required: true },
    sections: [{ name: { type: String, required: true }, capacity: { type: Number, default: 40 } }],
    academicYear: { type: String, required: true },
    classTeacherId: { type: Schema.Types.ObjectId, ref: 'Teacher' },
    subjects: [{ type: Schema.Types.ObjectId, ref: 'Subject' }],
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    status: { type: String, enum: ['active', 'archived'], default: 'active' },
  },
  { timestamps: true }
);

export const Class = mongoose.model<IClass>('Class', classSchema);
