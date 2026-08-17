import { useState } from 'react';
import {
  FileText, Upload, Sparkles, CheckCircle, AlertCircle, Clock, Eye, Trash2,
  FileImage, FileType, ChevronRight, Loader2, Zap, ShieldCheck, X, Brain
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';

// Types
interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  category: 'personal' | 'academic' | 'contact' | 'financial' | 'other';
}

interface DocumentRecord {
  id: string;
  title: string;
  fileName: string;
  documentType: string;
  status: 'uploaded' | 'processing' | 'extracted' | 'verified' | 'failed';
  overallConfidence: number;
  extractedFields: ExtractedField[];
  processingTime?: number;
  uploadedAt: string;
}

// Mock data
const mockDocuments: DocumentRecord[] = [
  {
    id: '1',
    title: 'Aarav Patel — Admission Form',
    fileName: 'aarav_patel_admission.pdf',
    documentType: 'admission_form',
    status: 'verified',
    overallConfidence: 0.94,
    processingTime: 1240,
    uploadedAt: '2025-07-10',
    extractedFields: [
      { key: 'Student Name', value: 'Aarav Patel', confidence: 0.98, category: 'personal' },
      { key: 'Date of Birth', value: '15/03/2012', confidence: 0.96, category: 'personal' },
      { key: 'Gender', value: 'Male', confidence: 0.99, category: 'personal' },
      { key: "Father's Name", value: 'Vikram Patel', confidence: 0.95, category: 'personal' },
      { key: "Mother's Name", value: 'Neha Patel', confidence: 0.93, category: 'personal' },
      { key: 'Contact Number', value: '9876543210', confidence: 0.88, category: 'contact' },
      { key: 'Email Address', value: 'vikram.patel@gmail.com', confidence: 0.91, category: 'contact' },
      { key: 'Address', value: '12 MG Road, Bangalore 560001', confidence: 0.82, category: 'contact' },
      { key: 'Class Applied For', value: 'Class 10', confidence: 0.97, category: 'academic' },
      { key: 'Previous School', value: 'DPS Whitefield', confidence: 0.89, category: 'academic' },
      { key: 'Blood Group', value: 'O+', confidence: 0.95, category: 'personal' },
      { key: 'Aadhar Number', value: '1234 5678 9012', confidence: 0.87, category: 'personal' },
    ],
  },
  {
    id: '2',
    title: 'Ananya Sharma — Report Card',
    fileName: 'ananya_report_card.jpg',
    documentType: 'report_card',
    status: 'extracted',
    overallConfidence: 0.91,
    processingTime: 980,
    uploadedAt: '2025-07-12',
    extractedFields: [
      { key: 'Student Name', value: 'Ananya Sharma', confidence: 0.97, category: 'personal' },
      { key: 'Roll Number', value: '12', confidence: 0.95, category: 'academic' },
      { key: 'Class', value: 'Class 10-B', confidence: 0.96, category: 'academic' },
      { key: 'Mathematics', value: '92/100', confidence: 0.93, category: 'academic' },
      { key: 'Science', value: '88/100', confidence: 0.91, category: 'academic' },
      { key: 'English', value: '94/100', confidence: 0.94, category: 'academic' },
      { key: 'Total Marks', value: '434/500', confidence: 0.90, category: 'academic' },
      { key: 'Percentage', value: '86.8%', confidence: 0.92, category: 'academic' },
    ],
  },
  {
    id: '3',
    title: 'Transfer Certificate — Kavya Reddy',
    fileName: 'tc_kavya_reddy.pdf',
    documentType: 'transfer_certificate',
    status: 'extracted',
    overallConfidence: 0.88,
    processingTime: 1120,
    uploadedAt: '2025-07-14',
    extractedFields: [
      { key: 'Student Name', value: 'Kavya Reddy', confidence: 0.96, category: 'personal' },
      { key: 'TC Number', value: 'TC/2025/001', confidence: 0.94, category: 'academic' },
      { key: 'Class Last Studied', value: 'Class 9', confidence: 0.92, category: 'academic' },
      { key: 'Reason for Transfer', value: 'Parent transfer', confidence: 0.78, category: 'academic' },
      { key: 'Conduct & Character', value: 'Excellent', confidence: 0.85, category: 'academic' },
    ],
  },
  {
    id: '4',
    title: 'Fee Receipt — July 2025',
    fileName: 'fee_receipt_001.pdf',
    documentType: 'fee_receipt',
    status: 'verified',
    overallConfidence: 0.92,
    processingTime: 850,
    uploadedAt: '2025-07-15',
    extractedFields: [
      { key: 'Student Name', value: 'Meera Iyer', confidence: 0.97, category: 'personal' },
      { key: 'Receipt Number', value: 'REC-2025-001', confidence: 0.99, category: 'financial' },
      { key: 'Amount', value: '₹12,500', confidence: 0.96, category: 'financial' },
      { key: 'Payment Mode', value: 'Online (UPI)', confidence: 0.88, category: 'financial' },
    ],
  },
  {
    id: '5',
    title: 'Student ID — Siya Agarwal',
    fileName: 'siya_id_scan.jpg',
    documentType: 'id_card',
    status: 'uploaded',
    overallConfidence: 0,
    uploadedAt: '2025-07-16',
    extractedFields: [],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  uploaded: { label: 'Uploaded', color: 'bg-[#F7F7F7] text-[#666666] border-[#EAEAEA]', icon: Clock },
  processing: { label: 'Processing', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: Loader2 },
  extracted: { label: 'Extracted', color: 'bg-amber-50 text-amber-600 border-amber-100', icon: Sparkles },
  verified: { label: 'Verified', color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: ShieldCheck },
  failed: { label: 'Failed', color: 'bg-red-50 text-red-600 border-red-100', icon: AlertCircle },
};

const docTypeLabels: Record<string, string> = {
  admission_form: 'Admission Form',
  transfer_certificate: 'Transfer Certificate',
  report_card: 'Report Card',
  fee_receipt: 'Fee Receipt',
  id_card: 'ID Card',
  other: 'Other',
};

const categoryColors: Record<string, string> = {
  personal: 'text-[#111111]',
  academic: 'text-[#111111]',
  contact: 'text-[#111111]',
  financial: 'text-emerald-600',
  other: 'text-[#666666]',
};

function ConfidenceBadge({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold',
      pct >= 90 ? 'bg-emerald-50 text-emerald-600' :
      pct >= 80 ? 'bg-amber-50 text-amber-600' :
      'bg-red-50 text-red-600'
    )}>
      {pct}%
    </span>
  );
}

export default function AIDocumentReaderPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocumentRecord | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const verifiedCount = mockDocuments.filter(d => d.status === 'verified').length;
  const extractedCount = mockDocuments.filter(d => d.status === 'extracted').length;
  const avgConfidence = mockDocuments.filter(d => d.overallConfidence > 0).reduce((s, d) => s + d.overallConfidence, 0) / mockDocuments.filter(d => d.overallConfidence > 0).length;

  const handleProcess = (id: string) => {
    setProcessingId(id);
    setTimeout(() => setProcessingId(null), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <Brain className="w-7 h-7 text-[#111111]" />
            AI Document Reader
          </h1>
          <p className="text-sm text-[#666666] mt-1">Scan physical documents and auto-extract data with AI</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300">
          <Upload className="w-4 h-4" /> Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Documents" value={mockDocuments.length.toString()} trend={5} trendLabel="this week" icon={<FileText className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="AI Extracted" value={extractedCount.toString()} trend={3} trendLabel="pending review" icon={<Sparkles className="w-6 h-6" />} color="amber" delay={100} />
        <StatCard title="Verified" value={verifiedCount.toString()} trend={2} trendLabel="approved" icon={<ShieldCheck className="w-6 h-6" />} color="emerald" delay={200} />
        <StatCard title="Avg Confidence" value={`${Math.round(avgConfidence * 100)}%`} trend={4} trendLabel="accuracy" icon={<Zap className="w-6 h-6" />} color="violet" delay={300} />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Document List */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-sm font-semibold text-[#8A8A8A] uppercase tracking-wider px-1">Recent Documents</h3>
          {mockDocuments.map(doc => {
            const statusCfg = statusConfig[doc.status];
            const StatusIcon = statusCfg.icon;
            const isProcessing = processingId === doc.id;

            return (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={cn(
                  'rounded-2xl border p-4 cursor-pointer transition-all duration-200',
                  'hover:border-[#DCDCDC] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]',
                  selectedDoc?.id === doc.id
                    ? 'bg-[#F7F7F7] border-[#111111]'
                    : 'bg-white border-[#EAEAEA]'
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F7F7F7] flex items-center justify-center flex-shrink-0">
                    {doc.fileName.endsWith('.jpg') || doc.fileName.endsWith('.png')
                      ? <FileImage className="w-5 h-5 text-[#111111]" />
                      : <FileType className="w-5 h-5 text-[#111111]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111111] truncate">{doc.title}</p>
                    <p className="text-[11px] text-[#8A8A8A] mt-0.5">{docTypeLabels[doc.documentType]} · {doc.uploadedAt}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border', statusCfg.color)}>
                        <StatusIcon className={cn('w-3 h-3', isProcessing && 'animate-spin')} />
                        {isProcessing ? 'Processing...' : statusCfg.label}
                      </span>
                      {doc.overallConfidence > 0 && <ConfidenceBadge value={doc.overallConfidence} />}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8A8A8A] flex-shrink-0 mt-1" />
                </div>

                {/* Action buttons for unprocessed docs */}
                {doc.status === 'uploaded' && (
                  <div className="mt-3 pt-3 border-t border-[#EAEAEA]">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleProcess(doc.id); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-[#111111] text-white border border-transparent hover:bg-[#1A1A1A] transition-all w-full justify-center"
                    >
                      <Sparkles className="w-3 h-3 text-white" /> Extract with AI
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Extraction Detail Panel */}
        <div className="lg:col-span-3">
          {selectedDoc && selectedDoc.extractedFields.length > 0 ? (
            <div className="rounded-2xl border border-l-4 border-l-[#111111] border-y-[#EAEAEA] border-r-[#EAEAEA] bg-[#F7F7F7] overflow-hidden">
              {/* Detail Header */}
              <div className="p-5 border-b border-[#EAEAEA] bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#111111]">{selectedDoc.title}</h3>
                    <p className="text-xs text-[#8A8A8A] mt-1">
                      {docTypeLabels[selectedDoc.documentType]} · {selectedDoc.extractedFields.length} fields extracted
                      {selectedDoc.processingTime && ` · ${(selectedDoc.processingTime / 1000).toFixed(1)}s`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Confidence gauge */}
                    <div className="text-center">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#EAEAEA]" />
                          <circle
                            cx="28" cy="28" r="24" fill="none" strokeWidth="3"
                            strokeDasharray={`${Math.round(selectedDoc.overallConfidence * 150.8)} 150.8`}
                            strokeLinecap="round"
                            className={selectedDoc.overallConfidence >= 0.9 ? 'text-emerald-500' : selectedDoc.overallConfidence >= 0.8 ? 'text-amber-500' : 'text-red-500'}
                          />
                        </svg>
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#111111]">
                          {Math.round(selectedDoc.overallConfidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Fields */}
              <div className="p-5 space-y-2 bg-white">
                <div className="grid gap-2">
                  {selectedDoc.extractedFields.map((field, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-3 rounded-lg bg-[#F7F7F7] hover:bg-[#FAFAFA] border border-transparent hover:border-[#EAEAEA] transition-colors group"
                    >
                      {/* Category dot */}
                      <div className={cn('w-1.5 h-8 rounded-full flex-shrink-0', {
                        'bg-[#111111]': field.category === 'personal',
                        'bg-[#333333]': field.category === 'academic',
                        'bg-[#666666]': field.category === 'contact',
                        'bg-emerald-500': field.category === 'financial',
                        'bg-[#EAEAEA]': field.category === 'other',
                      })} />
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-[10px] font-medium uppercase tracking-wider', categoryColors[field.category])}>
                          {field.key}
                        </p>
                        <p className="text-sm font-medium text-[#111111] mt-0.5 truncate">{field.value}</p>
                      </div>
                      {/* Confidence bar */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="w-16 h-1.5 rounded-full bg-[#EAEAEA] overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', {
                              'bg-emerald-500': field.confidence >= 0.9,
                              'bg-amber-500': field.confidence >= 0.8 && field.confidence < 0.9,
                              'bg-red-500': field.confidence < 0.8,
                            })}
                            style={{ width: `${field.confidence * 100}%` }}
                          />
                        </div>
                        <ConfidenceBadge value={field.confidence} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 border-t border-[#EAEAEA] bg-white flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-[#8A8A8A]">
                  <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
                  Powered by EduNexus AI Engine
                </div>
                <div className="flex items-center gap-2">
                  {selectedDoc.status === 'extracted' && (
                    <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-all">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verify & Save
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-[#F7F7F7] text-[#111111] border border-[#EAEAEA] hover:bg-[#FAFAFA] transition-all">
                    <FileText className="w-3.5 h-3.5" /> Create Student Record
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-[#EAEAEA] bg-white flex items-center justify-center min-h-[500px]">
              <div className="text-center p-8">
                <div className="w-16 h-16 rounded-2xl bg-[#F7F7F7] flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-[#8A8A8A]" />
                </div>
                <h3 className="text-base font-semibold text-[#111111] mb-2">
                  {selectedDoc ? 'Not Yet Processed' : 'Select a Document'}
                </h3>
                <p className="text-sm text-[#8A8A8A] max-w-xs mx-auto">
                  {selectedDoc
                    ? 'Click "Extract with AI" on the document card to run the AI extraction pipeline.'
                    : 'Click on a document from the list to view its extracted data and confidence scores.'}
                </p>
                {selectedDoc && selectedDoc.status === 'uploaded' && (
                  <button
                    onClick={() => handleProcess(selectedDoc.id)}
                    className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] transition-all mx-auto"
                  >
                    <Sparkles className="w-4 h-4 text-white" /> Extract with AI
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111]">Upload Document</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drag & Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragOver(false); setIsUploading(true); setTimeout(() => { setIsUploading(false); setShowUploadModal(false); }, 1500); }}
              className={cn(
                'border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer',
                isDragOver
                  ? 'border-[#111111] bg-[#F7F7F7] scale-[1.02]'
                  : 'border-[#EAEAEA] bg-white hover:border-[#DCDCDC] hover:bg-[#FAFAFA]',
              )}
            >
              {isUploading ? (
                <div className="space-y-3">
                  <Loader2 className="w-10 h-10 text-[#111111] mx-auto animate-spin" />
                  <p className="text-sm text-[#111111] font-medium">Uploading...</p>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-[#F7F7F7] flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-7 h-7 text-[#111111]" />
                  </div>
                  <p className="text-sm text-[#111111] font-medium mb-1">Drag & drop your document here</p>
                  <p className="text-xs text-[#8A8A8A]">or click to browse — PDF, JPG, PNG up to 10MB</p>
                </>
              )}
            </div>

            {/* Document Type Selector */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-[#333333] mb-2">Document Type</label>
              <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
                <option value="admission_form">Admission Form</option>
                <option value="transfer_certificate">Transfer Certificate</option>
                <option value="report_card">Report Card</option>
                <option value="fee_receipt">Fee Receipt</option>
                <option value="id_card">Student ID Card</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-[#EAEAEA]">
              <button onClick={() => setShowUploadModal(false)} className="px-4 py-2.5 rounded-xl text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">Cancel</button>
              <button
                onClick={() => { setIsUploading(true); setTimeout(() => { setIsUploading(false); setShowUploadModal(false); }, 1500); }}
                className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:bg-[#1A1A1A] transition-all"
              >
                Upload & Process
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
