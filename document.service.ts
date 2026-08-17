import { AIDocument } from './document.model.js';
import type { IExtractedField } from './document.model.js';
import { ApiError } from '../../utils/ApiError.js';

/**
 * AI Document Processing Service
 *
 * In production, this would integrate with:
 * - Google Cloud Vision API for OCR
 * - Google Gemini for intelligent field extraction
 * - Custom NLP models for Indian school document formats
 *
 * Currently uses a sophisticated simulation engine that demonstrates
 * the full extraction pipeline with realistic confidence scoring.
 */

// Field extraction templates for different document types
const EXTRACTION_TEMPLATES: Record<string, { key: string; category: IExtractedField['category']; sampleValues: string[] }[]> = {
  admission_form: [
    { key: 'Student Name', category: 'personal', sampleValues: ['Aarav Patel', 'Ananya Sharma', 'Arjun Singh', 'Diya Gupta', 'Ishaan Kumar'] },
    { key: 'Date of Birth', category: 'personal', sampleValues: ['15/03/2012', '22/07/2013', '10/01/2014', '18/05/2013', '05/11/2012'] },
    { key: 'Gender', category: 'personal', sampleValues: ['Male', 'Female', 'Male', 'Female', 'Male'] },
    { key: 'Father\'s Name', category: 'personal', sampleValues: ['Vikram Patel', 'Rahul Sharma', 'Harpreet Singh', 'Arun Gupta', 'Sanjay Kumar'] },
    { key: 'Mother\'s Name', category: 'personal', sampleValues: ['Neha Patel', 'Pooja Sharma', 'Gurpreet Kaur', 'Sunita Gupta', 'Priya Kumar'] },
    { key: 'Contact Number', category: 'contact', sampleValues: ['9876543210', '9876543211', '9876543212', '9876543213', '9876543214'] },
    { key: 'Email Address', category: 'contact', sampleValues: ['parent@email.com', 'rahul.s@gmail.com', 'harpreet@yahoo.com', 'arun.g@outlook.com', 'sanjay.k@gmail.com'] },
    { key: 'Address', category: 'contact', sampleValues: ['12 MG Road, Bangalore', '45 Park Street, Mumbai', '78 Civil Lines, Delhi', '23 Rajaji Nagar, Chennai', '56 Jubilee Hills, Hyderabad'] },
    { key: 'Class Applied For', category: 'academic', sampleValues: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'] },
    { key: 'Previous School', category: 'academic', sampleValues: ['DPS Whitefield', 'Ryan International', 'Kendriya Vidyalaya', 'DAV Public School', 'St. Xavier\'s'] },
    { key: 'Blood Group', category: 'personal', sampleValues: ['O+', 'A+', 'B+', 'AB+', 'O-'] },
    { key: 'Aadhar Number', category: 'personal', sampleValues: ['1234 5678 9012', '2345 6789 0123', '3456 7890 1234', '4567 8901 2345', '5678 9012 3456'] },
  ],
  transfer_certificate: [
    { key: 'Student Name', category: 'personal', sampleValues: ['Kavya Reddy', 'Rohan Verma', 'Sneha Nair'] },
    { key: 'TC Number', category: 'academic', sampleValues: ['TC/2025/001', 'TC/2025/002', 'TC/2025/003'] },
    { key: 'Date of Issue', category: 'academic', sampleValues: ['15/03/2025', '20/04/2025', '10/05/2025'] },
    { key: 'Class Last Studied', category: 'academic', sampleValues: ['Class 9', 'Class 8', 'Class 10'] },
    { key: 'Reason for Transfer', category: 'academic', sampleValues: ['Parent transfer', 'Family relocation', 'Change of city'] },
    { key: 'Conduct & Character', category: 'academic', sampleValues: ['Good', 'Excellent', 'Very Good'] },
    { key: 'Date of Birth', category: 'personal', sampleValues: ['28/08/2013', '14/02/2014', '03/12/2012'] },
    { key: 'Previous School', category: 'academic', sampleValues: ['St. Mary\'s Convent', 'Modern School', 'Delhi Public School'] },
  ],
  report_card: [
    { key: 'Student Name', category: 'personal', sampleValues: ['Vivaan Joshi', 'Aditi Mehta', 'Arnav Chopra'] },
    { key: 'Roll Number', category: 'academic', sampleValues: ['25', '12', '08'] },
    { key: 'Class', category: 'academic', sampleValues: ['Class 10-A', 'Class 9-B', 'Class 8-A'] },
    { key: 'Mathematics', category: 'academic', sampleValues: ['92/100', '88/100', '95/100'] },
    { key: 'Science', category: 'academic', sampleValues: ['88/100', '91/100', '87/100'] },
    { key: 'English', category: 'academic', sampleValues: ['85/100', '94/100', '82/100'] },
    { key: 'Hindi', category: 'academic', sampleValues: ['78/100', '82/100', '90/100'] },
    { key: 'Social Studies', category: 'academic', sampleValues: ['82/100', '79/100', '88/100'] },
    { key: 'Total Marks', category: 'academic', sampleValues: ['425/500', '434/500', '442/500'] },
    { key: 'Percentage', category: 'academic', sampleValues: ['85%', '86.8%', '88.4%'] },
    { key: 'Grade', category: 'academic', sampleValues: ['A', 'A', 'A+'] },
    { key: 'Attendance', category: 'academic', sampleValues: ['92%', '88%', '95%'] },
  ],
  fee_receipt: [
    { key: 'Student Name', category: 'personal', sampleValues: ['Meera Iyer', 'Reyansh Malhotra'] },
    { key: 'Receipt Number', category: 'financial', sampleValues: ['REC-2025-001', 'REC-2025-002'] },
    { key: 'Class', category: 'academic', sampleValues: ['Class 10-A', 'Class 7-B'] },
    { key: 'Fee Type', category: 'financial', sampleValues: ['Tuition Fee', 'Annual Fee'] },
    { key: 'Amount', category: 'financial', sampleValues: ['₹12,500', '₹25,000'] },
    { key: 'Payment Date', category: 'financial', sampleValues: ['10/07/2025', '15/04/2025'] },
    { key: 'Payment Mode', category: 'financial', sampleValues: ['Online (UPI)', 'Cheque'] },
    { key: 'Period', category: 'financial', sampleValues: ['July 2025', 'April-June 2025'] },
  ],
  id_card: [
    { key: 'Student Name', category: 'personal', sampleValues: ['Siya Agarwal', 'Vihaan Kapoor'] },
    { key: 'Admission Number', category: 'academic', sampleValues: ['ADM-2025-014', 'ADM-2025-015'] },
    { key: 'Class & Section', category: 'academic', sampleValues: ['Class 8-A', 'Class 10-B'] },
    { key: 'Date of Birth', category: 'personal', sampleValues: ['19/03/2013', '08/12/2012'] },
    { key: 'Blood Group', category: 'personal', sampleValues: ['AB-', 'O+'] },
    { key: 'Emergency Contact', category: 'contact', sampleValues: ['9876543223', '9876543224'] },
    { key: 'Address', category: 'contact', sampleValues: ['34 Koramangala, Bangalore', '89 Banjara Hills, Hyderabad'] },
  ],
  other: [
    { key: 'Document Title', category: 'other', sampleValues: ['Certificate', 'Letter', 'Notice'] },
    { key: 'Date', category: 'other', sampleValues: ['10/07/2025', '15/08/2025'] },
    { key: 'Content Summary', category: 'other', sampleValues: ['General document content extracted via OCR'] },
  ],
};

export class DocumentService {
  /**
   * Create a document record after upload
   */
  async create(data: {
    title: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    documentType: string;
    uploadedBy: string;
  }) {
    const doc = await AIDocument.create({
      ...data,
      status: 'uploaded',
    });
    return doc;
  }

  /**
   * Simulate AI extraction pipeline
   * In production: Cloud Vision OCR → Gemini structured extraction → confidence scoring
   */
  async processDocument(documentId: string) {
    const doc = await AIDocument.findById(documentId);
    if (!doc) throw ApiError.notFound('Document not found');
    if (doc.status === 'processing') throw ApiError.badRequest('Document is already being processed');

    // Mark as processing
    doc.status = 'processing';
    await doc.save();

    const startTime = Date.now();

    try {
      // Simulate processing delay (in production: actual OCR + AI call)
      await new Promise(resolve => setTimeout(resolve, 800));

      // Get extraction template
      const template = EXTRACTION_TEMPLATES[doc.documentType] || EXTRACTION_TEMPLATES.other;
      const variant = Math.floor(Math.random() * (template[0]?.sampleValues.length || 1));

      // Generate extracted fields with realistic confidence scores
      const extractedFields: IExtractedField[] = template.map((field, idx) => {
        const confidence = this.generateConfidence(field.category);
        return {
          key: field.key,
          value: field.sampleValues[variant % field.sampleValues.length] || field.sampleValues[0],
          confidence,
          category: field.category,
          boundingBox: {
            x: 50 + Math.random() * 200,
            y: 80 + idx * 45,
            width: 180 + Math.random() * 120,
            height: 28 + Math.random() * 10,
          },
        };
      });

      // Calculate overall confidence
      const overallConfidence = extractedFields.reduce((sum, f) => sum + f.confidence, 0) / extractedFields.length;

      // Generate simulated raw text
      const rawText = this.generateRawText(doc.documentType, extractedFields);

      // Update document
      doc.extractedFields = extractedFields;
      doc.rawText = rawText;
      doc.overallConfidence = Math.round(overallConfidence * 100) / 100;
      doc.processingTime = Date.now() - startTime;
      doc.status = 'extracted';
      await doc.save();

      return doc;
    } catch (error) {
      doc.status = 'failed';
      await doc.save();
      throw error;
    }
  }

  /**
   * Generate realistic confidence scores based on field category
   * Personal info (names, DOB) → high confidence
   * Handwritten fields → lower confidence
   */
  private generateConfidence(category: string): number {
    const baseConfidence: Record<string, number> = {
      personal: 0.92,
      academic: 0.88,
      contact: 0.85,
      financial: 0.90,
      other: 0.75,
    };
    const base = baseConfidence[category] || 0.80;
    // Add random variance ±5%
    return Math.round((base + (Math.random() - 0.5) * 0.10) * 100) / 100;
  }

  /**
   * Generate simulated raw OCR text
   */
  private generateRawText(docType: string, fields: IExtractedField[]): string {
    const header: Record<string, string> = {
      admission_form: '═══ ADMISSION APPLICATION FORM ═══\nEduNexus Academy — Academic Year 2025-2026\n',
      transfer_certificate: '═══ TRANSFER CERTIFICATE ═══\nIssued by: EduNexus Academy\n',
      report_card: '═══ PROGRESS REPORT CARD ═══\nEduNexus Academy — Term Examination\n',
      fee_receipt: '═══ FEE RECEIPT ═══\nEduNexus Academy — Accounts Department\n',
      id_card: '═══ STUDENT IDENTITY CARD ═══\nEduNexus Academy\n',
      other: '═══ DOCUMENT ═══\n',
    };
    let text = header[docType] || header.other;
    text += '─'.repeat(40) + '\n';
    for (const field of fields) {
      text += `${field.key}: ${field.value}\n`;
    }
    text += '─'.repeat(40) + '\n';
    text += 'Extracted via EduNexus AI Document Reader\n';
    return text;
  }

  async verify(documentId: string, verifiedBy: string) {
    const doc = await AIDocument.findByIdAndUpdate(
      documentId,
      { status: 'verified', verifiedBy },
      { new: true }
    );
    if (!doc) throw ApiError.notFound('Document not found');
    return doc;
  }

  async findAll(query: { status?: string; documentType?: string; page?: number; limit?: number }) {
    const filter: any = {};
    if (query.status) filter.status = query.status;
    if (query.documentType) filter.documentType = query.documentType;

    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      AIDocument.find(filter)
        .populate('uploadedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      AIDocument.countDocuments(filter),
    ]);

    return { docs, total, page, limit };
  }

  async findById(id: string) {
    const doc = await AIDocument.findById(id).populate('uploadedBy', 'name email');
    if (!doc) throw ApiError.notFound('Document not found');
    return doc;
  }

  async delete(id: string) {
    const doc = await AIDocument.findByIdAndDelete(id);
    if (!doc) throw ApiError.notFound('Document not found');
    return doc;
  }

  async getStats() {
    const [total, processing, extracted, verified, failed] = await Promise.all([
      AIDocument.countDocuments(),
      AIDocument.countDocuments({ status: 'processing' }),
      AIDocument.countDocuments({ status: 'extracted' }),
      AIDocument.countDocuments({ status: 'verified' }),
      AIDocument.countDocuments({ status: 'failed' }),
    ]);

    const avgConfidence = await AIDocument.aggregate([
      { $match: { status: { $in: ['extracted', 'verified'] }, overallConfidence: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: '$overallConfidence' } } },
    ]);

    return {
      total,
      processing,
      extracted,
      verified,
      failed,
      avgConfidence: avgConfidence[0]?.avg || 0,
    };
  }
}

export const documentService = new DocumentService();
