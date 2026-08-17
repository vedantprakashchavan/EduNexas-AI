import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'reminder' | 'event' | 'result' | 'fee' | 'attendance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sender: mongoose.Types.ObjectId;
  recipients: {
    userId?: mongoose.Types.ObjectId;
    role?: string;
    classId?: mongoose.Types.ObjectId;
  }[];
  targetAudience: 'all' | 'teachers' | 'students' | 'parents' | 'staff' | 'class' | 'individual';
  readBy: mongoose.Types.ObjectId[];
  channels: ('in_app' | 'email' | 'sms')[];
  scheduledAt?: Date;
  sentAt?: Date;
  status: 'draft' | 'scheduled' | 'sent' | 'failed';
  attachments?: { name: string; url: string }[];
}

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['announcement', 'alert', 'reminder', 'event', 'result', 'fee', 'attendance'], required: true },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    recipients: [{
      userId: { type: Schema.Types.ObjectId, ref: 'User' },
      role: { type: String },
      classId: { type: Schema.Types.ObjectId, ref: 'Class' },
    }],
    targetAudience: { type: String, enum: ['all', 'teachers', 'students', 'parents', 'staff', 'class', 'individual'], required: true },
    readBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    channels: [{ type: String, enum: ['in_app', 'email', 'sms'] }],
    scheduledAt: { type: Date },
    sentAt: { type: Date },
    status: { type: String, enum: ['draft', 'scheduled', 'sent', 'failed'], default: 'draft' },
    attachments: [{ name: String, url: String }],
  },
  { timestamps: true }
);

notificationSchema.index({ status: 1, sentAt: -1 });
notificationSchema.index({ 'recipients.userId': 1 });
notificationSchema.index({ type: 1 });

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
