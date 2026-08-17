import mongoose, { Document, Schema } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  category: 'textbook' | 'reference' | 'fiction' | 'non_fiction' | 'journal' | 'magazine';
  publisher?: string;
  publishYear?: number;
  totalCopies: number;
  availableCopies: number;
  location: string; // shelf/rack location
  status: 'available' | 'all_issued' | 'lost';
}

export interface IBookIssue extends Document {
  bookId: mongoose.Types.ObjectId;
  issuedTo: mongoose.Types.ObjectId;
  issuedBy: mongoose.Types.ObjectId;
  issueDate: Date;
  dueDate: Date;
  returnDate?: Date;
  fine?: number;
  status: 'issued' | 'returned' | 'overdue' | 'lost';
}

const bookSchema = new Schema<IBook>({ title: { type: String, required: true }, author: { type: String, required: true }, isbn: { type: String, unique: true, required: true }, category: { type: String, enum: ['textbook', 'reference', 'fiction', 'non_fiction', 'journal', 'magazine'], required: true }, publisher: String, publishYear: Number, totalCopies: { type: Number, required: true }, availableCopies: { type: Number, required: true }, location: { type: String, required: true }, status: { type: String, enum: ['available', 'all_issued', 'lost'], default: 'available' } }, { timestamps: true });
bookSchema.index({ isbn: 1 }, { unique: true });
bookSchema.index({ title: 'text', author: 'text' });

const bookIssueSchema = new Schema<IBookIssue>({ bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true }, issuedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true }, issuedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, issueDate: { type: Date, default: Date.now }, dueDate: { type: Date, required: true }, returnDate: Date, fine: { type: Number, default: 0 }, status: { type: String, enum: ['issued', 'returned', 'overdue', 'lost'], default: 'issued' } }, { timestamps: true });
bookIssueSchema.index({ bookId: 1 });
bookIssueSchema.index({ issuedTo: 1 });
bookIssueSchema.index({ status: 1 });

export const Book = mongoose.model<IBook>('Book', bookSchema);
export const BookIssue = mongoose.model<IBookIssue>('BookIssue', bookIssueSchema);
