import mongoose, { Document, Schema } from 'mongoose';

export interface IRoom extends Document {
  name: string;
  number: string;
  building?: string;
  floor?: number;
  capacity: number;
  type: 'classroom' | 'laboratory' | 'library' | 'auditorium' | 'staff_room' | 'office' | 'sports';
  facilities: string[];
  status: 'available' | 'occupied' | 'maintenance';
}

const roomSchema = new Schema<IRoom>(
  {
    name: { type: String, required: true },
    number: { type: String, required: true, unique: true },
    building: { type: String },
    floor: { type: Number },
    capacity: { type: Number, required: true },
    type: { type: String, enum: ['classroom', 'laboratory', 'library', 'auditorium', 'staff_room', 'office', 'sports'], default: 'classroom' },
    facilities: [{ type: String }],
    status: { type: String, enum: ['available', 'occupied', 'maintenance'], default: 'available' },
  },
  { timestamps: true }
);

export const Room = mongoose.model<IRoom>('Room', roomSchema);
