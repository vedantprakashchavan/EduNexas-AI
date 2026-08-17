import { useState } from 'react';
import {
  IndianRupee, TrendingUp, AlertTriangle, CheckCircle, Clock, CreditCard,
  Receipt, Plus, ChevronDown, Eye, Download, X, Wallet, PiggyBank, ArrowUpRight
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';

interface PaymentRecord {
  id: string;
  studentName: string;
  admissionNo: string;
  className: string;
  section: string;
  amount: number;
  paidAmount: number;
  period: string;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'partial' | 'overdue';
  paymentMode?: string;
  receiptNo?: string;
}

const mockPayments: PaymentRecord[] = [
  { id: '1', studentName: 'Aarav Patel', admissionNo: 'ADM-001', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 12500, period: 'July 2025', dueDate: '2025-07-10', paidDate: '2025-07-08', status: 'paid', paymentMode: 'UPI', receiptNo: 'REC-001' },
  { id: '2', studentName: 'Ananya Sharma', admissionNo: 'ADM-002', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 12500, period: 'July 2025', dueDate: '2025-07-10', paidDate: '2025-07-10', status: 'paid', paymentMode: 'Bank Transfer', receiptNo: 'REC-002' },
  { id: '3', studentName: 'Arjun Singh', admissionNo: 'ADM-003', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 8000, period: 'July 2025', dueDate: '2025-07-10', paidDate: '2025-07-12', status: 'partial', paymentMode: 'Cash' },
  { id: '4', studentName: 'Diya Gupta', admissionNo: 'ADM-004', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 0, period: 'July 2025', dueDate: '2025-07-10', status: 'overdue' },
  { id: '5', studentName: 'Ishaan Kumar', admissionNo: 'ADM-005', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 12500, period: 'July 2025', dueDate: '2025-07-10', paidDate: '2025-07-05', status: 'paid', paymentMode: 'Online', receiptNo: 'REC-005' },
  { id: '6', studentName: 'Kavya Reddy', admissionNo: 'ADM-006', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 0, period: 'July 2025', dueDate: '2025-07-10', status: 'pending' },
  { id: '7', studentName: 'Rohan Verma', admissionNo: 'ADM-007', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 12500, period: 'July 2025', dueDate: '2025-07-10', paidDate: '2025-07-09', status: 'paid', paymentMode: 'Cheque', receiptNo: 'REC-007' },
  { id: '8', studentName: 'Sneha Nair', admissionNo: 'ADM-008', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 5000, period: 'July 2025', dueDate: '2025-07-10', status: 'partial', paymentMode: 'UPI' },
  { id: '9', studentName: 'Vivaan Joshi', admissionNo: 'ADM-009', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 12500, period: 'July 2025', dueDate: '2025-07-10', paidDate: '2025-07-06', status: 'paid', paymentMode: 'UPI', receiptNo: 'REC-009' },
  { id: '10', studentName: 'Aditi Mehta', admissionNo: 'ADM-010', className: 'Class 10', section: 'A', amount: 12500, paidAmount: 0, period: 'July 2025', dueDate: '2025-07-10', status: 'overdue' },
];

const monthlyCollection = [
  { month: 'Apr', amount: 225000 },
  { month: 'May', amount: 210000 },
  { month: 'Jun', amount: 240000 },
  { month: 'Jul', amount: 187500 },
  { month: 'Aug', amount: 195000 },
  { month: 'Sep', amount: 230000 },
];

const feeComponents = [
  { name: 'Tuition Fee', amount: 8000, type: 'tuition', pct: 64 },
  { name: 'Transport Fee', amount: 2000, type: 'transport', pct: 16 },
  { name: 'Lab Fee', amount: 1000, type: 'lab', pct: 8 },
  { name: 'Library Fee', amount: 500, type: 'library', pct: 4 },
  { name: 'Sports Fee', amount: 500, type: 'sports', pct: 4 },
  { name: 'Exam Fee', amount: 500, type: 'exam', pct: 4 },
];

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  paid: { label: 'Paid', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
  partial: { label: 'Partial', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
  overdue: { label: 'Overdue', color: 'text-red-600', bg: 'bg-red-50 border-red-100' },
};

const componentColors: Record<string, string> = {
  tuition: 'bg-[#111111]',
  transport: 'bg-[#333333]',
  lab: 'bg-[#666666]',
  library: 'bg-[#8A8A8A]',
  sports: 'bg-[#999999]',
  exam: 'bg-[#DCDCDC]',
};

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export default function FeesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const totalExpected = mockPayments.reduce((s, p) => s + p.amount, 0);
  const totalCollected = mockPayments.reduce((s, p) => s + p.paidAmount, 0);
  const totalPending = totalExpected - totalCollected;
  const overdueCount = mockPayments.filter(p => p.status === 'overdue').length;
  const collectionRate = Math.round((totalCollected / totalExpected) * 100);

  const filtered = statusFilter === 'all' ? mockPayments : mockPayments.filter(p => p.status === statusFilter);
  const maxMonthly = Math.max(...monthlyCollection.map(m => m.amount));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <IndianRupee className="w-7 h-7 text-[#666666]" />
            Fee Management
          </h1>
          <p className="text-sm text-[#666666] mt-1">Track collections, outstanding fees, and generate receipts</p>
        </div>
        <button onClick={() => setShowPaymentModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300">
          <Plus className="w-4 h-4" /> Record Payment
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Expected" value={formatCurrency(totalExpected)} trend={0} trendLabel="this month" icon={<Wallet className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="Collected" value={formatCurrency(totalCollected)} trend={collectionRate} trendLabel="rate" icon={<PiggyBank className="w-6 h-6" />} color="emerald" delay={100} />
        <StatCard title="Pending" value={formatCurrency(totalPending)} trend={-overdueCount} trendLabel="overdue" icon={<Clock className="w-6 h-6" />} color="amber" delay={200} />
        <StatCard title="Overdue" value={overdueCount.toString()} trend={-overdueCount} trendLabel="students" icon={<AlertTriangle className="w-6 h-6" />} color="rose" delay={300} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 space-y-4">
          <div className="flex items-center gap-2">
            {['all', 'paid', 'pending', 'partial', 'overdue'].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                statusFilter === s ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#F7F7F7] text-[#666666] border-[#EAEAEA] hover:text-[#111111]'
              )}>
                {s === 'all' ? 'All' : statusConfig[s]?.label}
                {s !== 'all' && <span className={cn("ml-1", statusFilter === s ? "text-gray-300" : "text-[#8A8A8A]")}>({mockPayments.filter(p => p.status === s).length})</span>}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#FAFAFA]">
                  <tr className="border-b border-[#EAEAEA]">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Period</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Amount</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Paid</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Status</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Mode</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                  {filtered.map(p => {
                    const stCfg = statusConfig[p.status];
                    return (
                      <tr key={p.id} className="group hover:bg-[#FAFAFA] transition-colors">
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-[#111111]">{p.studentName}</p>
                          <p className="text-[10px] text-[#8A8A8A]">{p.admissionNo} · {p.className}-{p.section}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-xs text-[#333333]">{p.period}</p>
                          <p className="text-[10px] text-[#8A8A8A]">Due: {p.dueDate}</p>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-mono text-[#111111]">{formatCurrency(p.amount)}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={cn('text-sm font-mono', p.paidAmount >= p.amount ? 'text-emerald-600' : p.paidAmount > 0 ? 'text-amber-600' : 'text-[#8A8A8A]')}>
                            {formatCurrency(p.paidAmount)}
                          </span>
                          {p.status === 'partial' && (
                            <p className="text-[10px] text-red-600">Balance: {formatCurrency(p.amount - p.paidAmount)}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border', stCfg.bg)}>
                            {p.status === 'paid' ? <CheckCircle className="w-3 h-3 text-emerald-600" /> :
                             p.status === 'overdue' ? <AlertTriangle className="w-3 h-3 text-red-600" /> :
                             <Clock className="w-3 h-3 text-amber-600" />}
                            <span className={stCfg.color}>{stCfg.label}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {p.paymentMode ? (
                            <span className="text-xs text-[#666666]">{p.paymentMode}</span>
                          ) : (
                            <span className="text-xs text-[#999999]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {p.receiptNo && (
                              <button title="Download Receipt" className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button title="View Details" className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            {(p.status === 'pending' || p.status === 'overdue' || p.status === 'partial') && (
                              <button title="Record Payment" className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-emerald-600 hover:bg-emerald-50 transition-all">
                                <CreditCard className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Monthly Collection
            </h3>
            <div className="flex items-end gap-2 h-32">
              {monthlyCollection.map(m => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-[#666666] font-medium">{formatCurrency(m.amount / 1000)}K</span>
                  <div className="w-full rounded-t-md bg-[#111111] transition-all duration-500" style={{ height: `${(m.amount / maxMonthly) * 100}%` }} />
                  <span className="text-[10px] text-[#8A8A8A]">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <Receipt className="w-4 h-4 text-[#666666]" /> Collection Rate
            </h3>
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto">
                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                  <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="5" className="text-[#EAEAEA]" />
                  <circle cx="48" cy="48" r="40" fill="none" strokeWidth="5" strokeDasharray={`${Math.round(collectionRate * 2.51)} 251.3`} strokeLinecap="round" className={collectionRate >= 80 ? 'text-emerald-500' : collectionRate >= 60 ? 'text-amber-500' : 'text-red-500'} />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-[#111111]">{collectionRate}%</span>
              </div>
              <p className="text-xs text-[#8A8A8A] mt-2">{formatCurrency(totalCollected)} / {formatCurrency(totalExpected)}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <ArrowUpRight className="w-4 h-4 text-[#666666]" /> Fee Structure
            </h3>
            <div className="space-y-2.5">
              {feeComponents.map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full flex-shrink-0', componentColors[c.type])} />
                  <span className="text-xs text-[#666666] flex-1 truncate">{c.name}</span>
                  <span className="text-xs font-medium text-[#111111]">{formatCurrency(c.amount)}</span>
                </div>
              ))}
              <div className="pt-2 mt-2 border-t border-[#EAEAEA] flex justify-between">
                <span className="text-xs font-semibold text-[#333333]">Total</span>
                <span className="text-xs font-bold text-[#111111]">{formatCurrency(feeComponents.reduce((s, c) => s + c.amount, 0))}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPaymentModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-6 mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111]">Record Payment</h2>
              <button onClick={() => setShowPaymentModal(false)} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1.5">Student</label>
                <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
                  {mockPayments.filter(p => p.status !== 'paid').map(p => <option key={p.id}>{p.studentName} ({p.admissionNo})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Amount (₹)</label>
                  <input type="number" placeholder="12500" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Payment Mode</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
                    <option>UPI</option><option>Cash</option><option>Cheque</option><option>Bank Transfer</option><option>Online</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1.5">Transaction ID</label>
                <input type="text" placeholder="Optional" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1.5">Remarks</label>
                <textarea rows={2} placeholder="Optional notes" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] resize-none" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-[#EAEAEA]">
              <button onClick={() => setShowPaymentModal(false)} className="px-4 py-2.5 rounded-xl text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">Cancel</button>
              <button onClick={() => setShowPaymentModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:bg-[#1A1A1A] transition-all flex items-center gap-2">
                <Receipt className="w-4 h-4" /> Record & Generate Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
