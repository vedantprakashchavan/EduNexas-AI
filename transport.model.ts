import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  vehicleNumber: string;
  type: 'bus' | 'van' | 'auto';
  capacity: number;
  driverName: string;
  driverPhone: string;
  route: string;
  stops: { name: string; time: string; order: number }[];
  status: 'active' | 'maintenance' | 'inactive';
}

const vehicleSchema = new Schema<IVehicle>({
  vehicleNumber: { type: String, unique: true, required: true },
  type: { type: String, enum: ['bus', 'van', 'auto'], required: true },
  capacity: { type: Number, required: true },
  driverName: { type: String, required: true },
  driverPhone: { type: String, required: true },
  route: { type: String, required: true },
  stops: [{ name: { type: String, required: true }, time: String, order: Number }],
  status: { type: String, enum: ['active', 'maintenance', 'inactive'], default: 'active' },
}, { timestamps: true });

vehicleSchema.index({ vehicleNumber: 1 }, { unique: true });
vehicleSchema.index({ route: 1 });

export const Vehicle = mongoose.model<IVehicle>('Vehicle', vehicleSchema);
