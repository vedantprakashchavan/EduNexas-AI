import { useState } from 'react';
import { BookOpen, Plus, Search, Eye, Pencil, Trash2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { Subject } from '../../types';

const mockSubjects: Subject[] = [
  { _id: '1', name: 'Mathematics', code: 'MATH-101', department: 'Mathematics', type: 'theory', periodsPerWeek: 6, status: 'active', createdAt: '2024-01-01' },
  { _id: '2', name: 'Physics', code: 'PHY-101', department: 'Science', type: 'theory', periodsPerWeek: 5, status: 'active', createdAt: '2024-01-01' },
  { _id: '3', name: 'Chemistry', code: 'CHEM-101', department: 'Science', type: 'theory', periodsPerWeek: 5, status: 'active', createdAt: '2024-01-01' },
  { _id: '4', name: 'Biology', code: 'BIO-101', department: 'Science', type: 'theory', periodsPerWeek: 4, status: 'active', createdAt: '2024-01-01' },
  { _id: '5', name: 'English', code: 'ENG-101', department: 'Languages', type: 'theory', periodsPerWeek: 5, status: 'active', createdAt: '2024-01-01' },
  { _id: '6', name: 'Hindi', code: 'HIN-101', department: 'Languages', type: 'theory', periodsPerWeek: 4, status: 'active', createdAt: '2024-01-01' },
  { _id: '7', name: 'History', code: 'HIST-101', department: 'Social Studies', type: 'theory', periodsPerWeek: 3, status: 'active', createdAt: '2024-01-01' },
  { _id: '8', name: 'Computer Science', code: 'CS-101', department: 'Computer Science', type: 'practical', periodsPerWeek: 4, status: 'active', createdAt: '2024-01-01' },
  { _id: '9', name: 'Physical Education', code: 'PE-101', department: 'Physical Education', type: 'practical', periodsPerWeek: 3, status: 'active', createdAt: '2024-01-01' },
  { _id: '10', name: 'Fine Arts', code: 'ART-101', department: 'Arts', type: 'elective', periodsPerWeek: 2, status: 'active', createdAt: '2024-01-01' },
  { _id: '11', name: 'Music', code: 'MUS-101', department: 'Arts', type: 'elective', periodsPerWeek: 2, status: 'active', createdAt: '2024-01-01' },
  { _id: '12', name: 'Sanskrit', code: 'SKT-101', department: 'Languages', type: 'elective', periodsPerWeek: 2, status: 'archived', createdAt: '2024-01-01' },
];

const typeColors: Record<string, string> = {
  theory: 'bg-[#F7F7F7] text-[#111111] border-[#EAEAEA]',
  practical: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  elective: 'bg-[#F7F7F7] text-[#111111] border-[#EAEAEA]',
};

export default function SubjectsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = mockSubjects.filter(s => {
    const matchSearch = !search || `${s.name} ${s.code}`.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || s.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Subject Management</h1>
          <p className="text-sm text-[#666666] mt-1">{mockSubjects.filter(s => s.status === 'active').length} active subjects</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subjects..." className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
          <option value="">All Types</option>
          <option value="theory">Theory</option>
          <option value="practical">Practical</option>
          <option value="elective">Elective</option>
        </select>
      </div>

      <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAFAFA]">
              <tr className="border-b border-[#EAEAEA]">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Subject</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Code</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Department</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Type</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Periods/Week</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-[#666666] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {filtered.map(subject => (
                <tr key={subject._id} className="group hover:bg-[#FAFAFA] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#F7F7F7] flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-[#111111]" />
                      </div>
                      <span className="text-sm font-medium text-[#111111]">{subject.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-[#333333] font-mono">{subject.code}</td>
                  <td className="px-5 py-3.5 text-sm text-[#333333]">{subject.department || '—'}</td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize', typeColors[subject.type])}>
                      {subject.type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(subject.periodsPerWeek, 6) }).map((_, j) => (
                          <div key={j} className="w-2 h-5 rounded-sm bg-[#111111]" />
                        ))}
                      </div>
                      <span className="text-sm text-[#333333]">{subject.periodsPerWeek}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium border capitalize', subject.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-[#F7F7F7] text-[#666666] border-[#EAEAEA]')}>
                      {subject.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all"><Eye className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-amber-600 hover:bg-amber-50 transition-all"><Pencil className="w-4 h-4" /></button>
                      <button className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111]">Add New Subject</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Name <span className="text-red-500">*</span></label>
                  <input required className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Code <span className="text-red-500">*</span></label>
                  <input required placeholder="e.g. MATH-101" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
                    <option value="theory">Theory</option>
                    <option value="practical">Practical</option>
                    <option value="elective">Elective</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Periods/Week <span className="text-red-500">*</span></label>
                  <input type="number" required min={1} max={10} className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:bg-[#1A1A1A] transition-all">Add Subject</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
