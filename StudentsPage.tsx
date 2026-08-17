import { useState } from 'react';
import { Users, UserPlus, Search, Filter, ChevronLeft, ChevronRight, Eye, Pencil, Trash2, X, GraduationCap } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';
import type { Student } from '../../types';

// Mock student data
const mockStudents: Student[] = [
  { _id: '1', admissionNumber: 'ADM-2025-001', firstName: 'Aarav', lastName: 'Patel', dateOfBirth: '2012-03-15', gender: 'male', email: 'aarav@parent.com', phone: '9876543210', classId: { _id: 'c1', name: 'Class 10' }, sectionId: 'A', bloodGroup: 'O+', status: 'active', createdAt: '2024-06-01' },
  { _id: '2', admissionNumber: 'ADM-2025-002', firstName: 'Ananya', lastName: 'Sharma', dateOfBirth: '2012-07-22', gender: 'female', email: 'ananya@parent.com', phone: '9876543211', classId: { _id: 'c1', name: 'Class 10' }, sectionId: 'B', bloodGroup: 'A+', status: 'active', createdAt: '2024-06-01' },
  { _id: '3', admissionNumber: 'ADM-2025-003', firstName: 'Arjun', lastName: 'Singh', dateOfBirth: '2013-01-10', gender: 'male', phone: '9876543212', classId: { _id: 'c2', name: 'Class 9' }, sectionId: 'A', bloodGroup: 'B+', status: 'active', createdAt: '2024-06-15' },
  { _id: '4', admissionNumber: 'ADM-2025-004', firstName: 'Diya', lastName: 'Gupta', dateOfBirth: '2013-05-18', gender: 'female', phone: '9876543213', classId: { _id: 'c2', name: 'Class 9' }, sectionId: 'A', bloodGroup: 'AB+', status: 'active', createdAt: '2024-06-15' },
  { _id: '5', admissionNumber: 'ADM-2025-005', firstName: 'Ishaan', lastName: 'Kumar', dateOfBirth: '2012-11-05', gender: 'male', phone: '9876543214', classId: { _id: 'c1', name: 'Class 10' }, sectionId: 'A', status: 'inactive', createdAt: '2024-06-15' },
  { _id: '6', admissionNumber: 'ADM-2025-006', firstName: 'Kavya', lastName: 'Reddy', dateOfBirth: '2013-08-28', gender: 'female', phone: '9876543215', classId: { _id: 'c3', name: 'Class 8' }, sectionId: 'B', bloodGroup: 'O-', status: 'active', createdAt: '2024-07-01' },
  { _id: '7', admissionNumber: 'ADM-2025-007', firstName: 'Rohan', lastName: 'Verma', dateOfBirth: '2014-02-14', gender: 'male', phone: '9876543216', classId: { _id: 'c4', name: 'Class 7' }, sectionId: 'A', bloodGroup: 'A-', status: 'active', createdAt: '2024-07-01' },
  { _id: '8', admissionNumber: 'ADM-2025-008', firstName: 'Sneha', lastName: 'Nair', dateOfBirth: '2013-12-03', gender: 'female', phone: '9876543217', classId: { _id: 'c3', name: 'Class 8' }, sectionId: 'A', bloodGroup: 'B-', status: 'active', createdAt: '2024-07-15' },
  { _id: '9', admissionNumber: 'ADM-2025-009', firstName: 'Vivaan', lastName: 'Joshi', dateOfBirth: '2012-09-20', gender: 'male', phone: '9876543218', classId: { _id: 'c1', name: 'Class 10' }, sectionId: 'B', status: 'transferred', createdAt: '2024-07-15' },
  { _id: '10', admissionNumber: 'ADM-2025-010', firstName: 'Aditi', lastName: 'Mehta', dateOfBirth: '2014-04-11', gender: 'female', phone: '9876543219', classId: { _id: 'c5', name: 'Class 6' }, sectionId: 'A', bloodGroup: 'O+', status: 'active', createdAt: '2024-08-01' },
  { _id: '11', admissionNumber: 'ADM-2025-011', firstName: 'Arnav', lastName: 'Chopra', dateOfBirth: '2013-06-07', gender: 'male', phone: '9876543220', classId: { _id: 'c2', name: 'Class 9' }, sectionId: 'B', bloodGroup: 'A+', status: 'active', createdAt: '2024-08-01' },
  { _id: '12', admissionNumber: 'ADM-2025-012', firstName: 'Meera', lastName: 'Iyer', dateOfBirth: '2012-10-30', gender: 'female', phone: '9876543221', classId: { _id: 'c1', name: 'Class 10' }, sectionId: 'A', bloodGroup: 'B+', status: 'active', createdAt: '2024-08-15' },
  { _id: '13', admissionNumber: 'ADM-2025-013', firstName: 'Reyansh', lastName: 'Malhotra', dateOfBirth: '2014-01-25', gender: 'male', phone: '9876543222', classId: { _id: 'c4', name: 'Class 7' }, sectionId: 'B', status: 'active', createdAt: '2024-08-15' },
  { _id: '14', admissionNumber: 'ADM-2025-014', firstName: 'Siya', lastName: 'Agarwal', dateOfBirth: '2013-03-19', gender: 'female', phone: '9876543223', classId: { _id: 'c3', name: 'Class 8' }, sectionId: 'A', bloodGroup: 'AB-', status: 'active', createdAt: '2024-09-01' },
  { _id: '15', admissionNumber: 'ADM-2025-015', firstName: 'Vihaan', lastName: 'Kapoor', dateOfBirth: '2012-12-08', gender: 'male', phone: '9876543224', classId: { _id: 'c1', name: 'Class 10' }, sectionId: 'B', bloodGroup: 'O+', status: 'active', createdAt: '2024-09-01' },
];

const statusColors: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  inactive: 'bg-red-50 text-red-600 border-red-100',
  transferred: 'bg-amber-50 text-amber-600 border-amber-100',
  graduated: 'bg-blue-50 text-blue-600 border-blue-100',
};

function getClassName(classId: Student['classId']): string {
  if (!classId) return '—';
  if (typeof classId === 'string') return classId;
  return classId.name;
}

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filtered = mockStudents.filter((s) => {
    const matchSearch = !search || `${s.firstName} ${s.lastName} ${s.admissionNumber}`.toLowerCase().includes(search.toLowerCase());
    const matchClass = !classFilter || getClassName(s.classId) === classFilter;
    const matchStatus = !statusFilter || s.status === statusFilter;
    return matchSearch && matchClass && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const activeCount = mockStudents.filter(s => s.status === 'active').length;
  const inactiveCount = mockStudents.length - activeCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Student Management</h1>
          <p className="text-sm text-[#666666] mt-1">{mockStudents.length} students enrolled</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300">
          <UserPlus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Students" value={mockStudents.length.toString()} trend={12} trendLabel="vs last month" icon={<Users className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="Active" value={activeCount.toString()} trend={3} trendLabel="new this week" icon={<GraduationCap className="w-6 h-6" />} color="emerald" delay={100} />
        <StatCard title="Inactive / Transferred" value={inactiveCount.toString()} trend={-1} trendLabel="vs last month" icon={<Users className="w-6 h-6" />} color="rose" delay={200} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or admission number..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
        </div>
        <select value={classFilter} onChange={e => { setClassFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
          <option value="">All Classes</option>
          {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="transferred">Transferred</option>
        </select>
        {(search || classFilter || statusFilter) && (
          <button onClick={() => { setSearch(''); setClassFilter(''); setStatusFilter(''); setPage(1); }} className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EAEAEA] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Student</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Admission #</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Class</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Section</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Gender</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {paginated.map((student, i) => (
                <tr key={student._id} className="group hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#111111] text-sm font-bold flex-shrink-0">
                        {student.firstName[0]}{student.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111111]">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-[#8A8A8A]">{student.email || student.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#333333] font-mono">{student.admissionNumber}</td>
                  <td className="px-5 py-3.5 text-sm text-[#333333]">{getClassName(student.classId)}</td>
                  <td className="px-5 py-3.5 text-sm text-[#333333]">{student.sectionId || '—'}</td>
                  <td className="px-5 py-3.5 text-sm text-[#333333] capitalize">{student.gender}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize', statusColors[student.status])}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all" title="View"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all" title="Edit"><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-red-600 hover:bg-red-50 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {paginated.length === 0 && (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-[#999999] mx-auto mb-3" />
            <p className="text-sm text-[#666666]">No students found matching your filters.</p>
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#EAEAEA]">
            <p className="text-xs text-[#8A8A8A]">Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button key={i} onClick={() => setPage(i + 1)} className={cn('w-8 h-8 rounded-lg text-xs font-medium transition-all', page === i + 1 ? 'bg-[#111111] text-white' : 'text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7]')}>
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111]">Add New Student</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', name: 'firstName', required: true },
                  { label: 'Last Name', name: 'lastName', required: true },
                  { label: 'Admission Number', name: 'admissionNumber', required: true },
                  { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', required: true },
                  { label: 'Email', name: 'email', type: 'email' },
                  { label: 'Phone', name: 'phone' },
                  { label: 'Blood Group', name: 'bloodGroup' },
                  { label: 'Section', name: 'sectionId' },
                ].map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-[#333333] mb-1.5">{field.label}{field.required && <span className="text-red-500"> *</span>}</label>
                    <input type={field.type || 'text'} required={field.required} className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Gender <span className="text-red-500">*</span></label>
                  <select required className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
                    <option value="">Select...</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Class</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
                    <option value="">Select...</option>
                    {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:bg-[#1A1A1A] transition-all">Add Student</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
