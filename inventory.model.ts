import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryItem extends Document {
  name: string;
  category: 'furniture' | 'electronics' | 'stationery' | 'sports' | 'lab_equipment' | 'cleaning' | 'other';
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  condition: 'new' | 'good' | 'fair' | 'poor' | 'damaged';
  purchaseDate?: Date;
  purchasePrice?: number;
  supplier?: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const inventorySchema = new Schema<IInventoryItem>({
  name: { type: String, required: true },
  category: { type: String, enum: ['furniture', 'electronics', 'stationery', 'sports', 'lab_equipment', 'cleaning', 'other'], required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  minStock: { type: Number, default: 5 },
  location: { type: String, required: true },
  condition: { type: String, enum: ['new', 'good', 'fair', 'poor', 'damaged'], default: 'good' },
  purchaseDate: Date,
  purchasePrice: Number,
  supplier: String,
  status: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock' },
}, { timestamps: true });

inventorySchema.index({ category: 1 });
inventorySchema.index({ status: 1 });
inventorySchema.index({ name: 'text' });

export const InventoryItem = mongoose.model<IInventoryItem>('InventoryItem', inventorySchema);
