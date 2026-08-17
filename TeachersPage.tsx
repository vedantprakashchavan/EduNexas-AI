import { useState } from 'react';
import { GraduationCap, UserPlus, Search, Eye, Pencil, Trash2, X, ChevronLeft, ChevronRight, Users, BookOpen } from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';
import type { Teacher } from '../../types';

const mockTeachers: Teacher[] = [
  { _id: '1', employeeId: 'EMP-001', firstName: 'Rajesh', lastName: 'Sharma', email: 'rajesh@edunexus.com', phone: '9876500001', department: 'Mathematics', subjects: ['Mathematics', 'Statistics'], experience: 15, status: 'active', joiningDate: '2015-06-01', createdAt: '2024-01-01' },
  { _id: '2', employeeId: 'EMP-002', firstName: 'Priya', lastName: 'Patel', email: 'priya@edunexus.com', phone: '9876500002', department: 'Science', subjects: ['Physics', 'Applied Physics'], experience: 12, status: 'active', joiningDate: '2016-07-15', createdAt: '2024-01-01' },
  { _id: '3', employeeId: 'EMP-003', firstName: 'Suresh', lastName: 'Nair', email: 'suresh@edunexus.com', phone: '9876500003', department: 'Science', subjects: ['Chemistry'], experience: 10, status: 'active', joiningDate: '2018-04-01', createdAt: '2024-01-01' },
  { _id: '4', employeeId: 'EMP-004', firstName: 'Meena', lastName: 'Iyer', email: 'meena@edunexus.com', phone: '9876500004', department: 'Science', subjects: ['Biology', 'Environmental Science'], experience: 8, status: 'on_leave', joiningDate: '2019-01-10', createdAt: '2024-01-01' },
  { _id: '5', employeeId: 'EMP-005', firstName: 'Anil', lastName: 'Kumar', email: 'anil@edunexus.com', phone: '9876500005', department: 'Languages', subjects: ['English', 'English Literature'], experience: 20, status: 'active', joiningDate: '2010-06-01', createdAt: '2024-01-01' },
  { _id: '6', employeeId: 'EMP-006', firstName: 'Sunita', lastName: 'Singh', email: 'sunita@edunexus.com', phone: '9876500006', department: 'Languages', subjects: ['Hindi', 'Sanskrit'], experience: 14, status: 'active', joiningDate: '2017-08-01', createdAt: '2024-01-01' },
  { _id: '7', employeeId: 'EMP-007', firstName: 'Amit', lastName: 'Verma', email: 'amit@edunexus.com', phone: '9876500007', department: 'Social Studies', subjects: ['History', 'Civics'], experience: 11, status: 'active', joiningDate: '2018-03-15', createdAt: '2024-01-01' },
  { _id: '8', employeeId: 'EMP-008', firstName: 'Kavita', lastName: 'Reddy', email: 'kavita@edunexus.com', phone: '9876500008', department: 'Computer Science', subjects: ['Computer Science', 'Python'], experience: 6, status: 'active', joiningDate: '2021-06-01', createdAt: '2024-01-01' },
  { _id: '9', employeeId: 'EMP-009', firstName: 'Deepak', lastName: 'Mishra', email: 'deepak@edunexus.com', phone: '9876500009', department: 'Physical Education', subjects: ['Physical Education'], experience: 9, status: 'active', joiningDate: '2019-07-01', createdAt: '2024-01-01' },
  { _id: '10', employeeId: 'EMP-010', firstName: 'Lakshmi', lastName: 'Menon', email: 'lakshmi@edunexus.com', phone: '9876500010', department: 'Arts', subjects: ['Fine Arts', 'Music'], experience: 7, status: 'resigned', joiningDate: '2020-01-15', createdAt: '2024-01-01' },
];

const statusColors: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  on_leave: 'bg-amber-50 text-amber-600 border-amber-100',
  resigned: 'bg-red-50 text-red-600 border-red-100',
  retired: 'bg-[#F7F7F7] text-[#666666] border-[#EAEAEA]',
};

export default function TeachersPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = mockTeachers.filter(t => {
    const matchSearch = !search || `${t.firstName} ${t.lastName} ${t.employeeId}`.toLowerCase().includes(search.toLowerCase());
    const matchDept = !deptFilter || t.department === deptFilter;
    return matchSearch && matchDept;
  });

  const activeCount = mockTeachers.filter(t => t.status === 'active').length;
  const onLeaveCount = mockTeachers.filter(t => t.status === 'on_leave').length;
  const departments = [...new Set(mockTeachers.map(t => t.department).filter(Boolean))];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Teacher Management</h1>
          <p className="text-sm text-[#666666] mt-1">{mockTeachers.length} teachers on staff</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300">
          <UserPlus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Teachers" value={mockTeachers.length.toString()} trend={2} trendLabel="new this year" icon={<GraduationCap className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="Active" value={activeCount.toString()} trend={1} trendLabel="currently teaching" icon={<BookOpen className="w-6 h-6" />} color="emerald" delay={100} />
        <StatCard title="On Leave" value={onLeaveCount.toString()} trend={0} trendLabel="this month" icon={<Users className="w-6 h-6" />} color="amber" delay={200} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or ID..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#EAEAEA] bg-[#FAFAFA]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Teacher</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Employee ID</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Subjects</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Exp.</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {filtered.map((teacher) => (
                <tr key={teacher._id} className="group hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F7F7F7] flex items-center justify-center text-[#111111] text-sm font-bold border border-[#EAEAEA]">
                        {teacher.firstName[0]}{teacher.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#111111]">{teacher.firstName} {teacher.lastName}</p>
                        <p className="text-xs text-[#8A8A8A]">{teacher.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#333333] font-mono">{teacher.employeeId}</td>
                  <td className="px-5 py-3.5 text-sm text-[#333333]">{teacher.department || '—'}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {teacher.subjects.slice(0, 2).map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F7F7F7] text-[#111111] border border-[#EAEAEA]">{s}</span>
                      ))}
                      {teacher.subjects.length > 2 && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#F7F7F7] text-[#8A8A8A] border border-[#EAEAEA]">+{teacher.subjects.length - 2}</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#333333]">{teacher.experience || 0} yrs</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border', statusColors[teacher.status])}>
                      {teacher.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all"><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-16 text-center"><p className="text-sm text-[#666666]">No teachers found.</p></div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111]">Add New Teacher</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'First Name', required: true },
                  { label: 'Last Name', required: true },
                  { label: 'Employee ID', required: true },
                  { label: 'Email', type: 'email', required: true },
                  { label: 'Phone', required: true },
                  { label: 'Department' },
                  { label: 'Experience (years)', type: 'number' },
                  { label: 'Joining Date', type: 'date' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-sm font-medium text-[#333333] mb-1.5">{f.label}{f.required && <span className="text-red-500"> *</span>}</label>
                    <input type={f.type || 'text'} required={f.required} className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:bg-[#1A1A1A] transition-all">Add Teacher</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
