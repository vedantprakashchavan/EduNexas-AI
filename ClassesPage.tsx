import { useState } from 'react';
import { Building2, Plus, Users, GraduationCap, BookOpen, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import type { SchoolClass } from '../../types';

const mockClasses: SchoolClass[] = [
  { _id: '1', name: 'Class 6', sections: [{ name: 'A', capacity: 40 }, { name: 'B', capacity: 40 }], academicYear: '2025-2026', classTeacherId: { _id: 't1', firstName: 'Sunita', lastName: 'Singh' }, status: 'active', createdAt: '2024-01-01' },
  { _id: '2', name: 'Class 7', sections: [{ name: 'A', capacity: 40 }, { name: 'B', capacity: 38 }], academicYear: '2025-2026', classTeacherId: { _id: 't2', firstName: 'Amit', lastName: 'Verma' }, status: 'active', createdAt: '2024-01-01' },
  { _id: '3', name: 'Class 8', sections: [{ name: 'A', capacity: 42 }, { name: 'B', capacity: 40 }], academicYear: '2025-2026', classTeacherId: { _id: 't3', firstName: 'Kavita', lastName: 'Reddy' }, status: 'active', createdAt: '2024-01-01' },
  { _id: '4', name: 'Class 9', sections: [{ name: 'A', capacity: 40 }, { name: 'B', capacity: 40 }], academicYear: '2025-2026', classTeacherId: { _id: 't4', firstName: 'Suresh', lastName: 'Nair' }, status: 'active', createdAt: '2024-01-01' },
  { _id: '5', name: 'Class 10', sections: [{ name: 'A', capacity: 40 }, { name: 'B', capacity: 40 }], academicYear: '2025-2026', classTeacherId: { _id: 't5', firstName: 'Rajesh', lastName: 'Sharma' }, status: 'active', createdAt: '2024-01-01' },
];

const studentCounts: Record<string, number> = { '1': 72, '2': 68, '3': 75, '4': 70, '5': 78 };

export default function ClassesPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111]">Class Management</h1>
          <p className="text-sm text-[#666666] mt-1">{mockClasses.length} classes for 2025-2026</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300">
          <Plus className="w-4 h-4" /> Add Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {mockClasses.map((cls) => {
          const teacher = typeof cls.classTeacherId === 'object' && cls.classTeacherId ? cls.classTeacherId : null;
          const totalCapacity = cls.sections.reduce((sum, s) => sum + s.capacity, 0);
          const enrolled = studentCounts[cls._id] || 0;

          return (
            <div key={cls._id} className={cn(
              'group rounded-2xl border border-[#EAEAEA] bg-white p-5',
              'hover:border-[#DCDCDC] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer'
            )}>
              <div className="h-1 rounded-full bg-[#111111] mb-4 -mt-1" />

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#F7F7F7] border border-[#EAEAEA] flex items-center justify-center text-[#111111]">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#111111]">{cls.name}</h3>
                    <p className="text-xs text-[#8A8A8A]">{cls.academicYear}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-100 capitalize">{cls.status}</span>
              </div>

              {/* Sections */}
              <div className="flex gap-2 mb-4">
                {cls.sections.map(s => (
                  <div key={s.name} className="flex-1 rounded-lg bg-[#F7F7F7] border border-[#EAEAEA] p-2.5 text-center">
                    <p className="text-lg font-bold text-[#111111]">Section {s.name}</p>
                    <p className="text-[10px] text-[#8A8A8A]">{s.capacity} seats</p>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#8A8A8A]" />
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{enrolled}</p>
                    <p className="text-[10px] text-[#8A8A8A]">Enrolled</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#8A8A8A]" />
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{totalCapacity}</p>
                    <p className="text-[10px] text-[#8A8A8A]">Capacity</p>
                  </div>
                </div>
              </div>

              {/* Class Teacher */}
              {teacher && (
                <div className="flex items-center gap-2 pt-3 border-t border-[#EAEAEA]">
                  <GraduationCap className="w-4 h-4 text-[#111111]" />
                  <p className="text-xs text-[#8A8A8A]">Class Teacher: <span className="text-[#333333] font-medium">{teacher.firstName} {teacher.lastName}</span></p>
                </div>
              )}

              {/* Fill indicator */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] text-[#8A8A8A] mb-1">
                  <span>Occupancy</span>
                  <span>{Math.round((enrolled / totalCapacity) * 100)}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#EAEAEA] overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-500', enrolled / totalCapacity > 0.9 ? 'bg-red-500' : enrolled / totalCapacity > 0.7 ? 'bg-amber-500' : 'bg-[#111111]')}
                    style={{ width: `${Math.min(100, (enrolled / totalCapacity) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-6 mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111]">Add New Class</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7]"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); setShowModal(false); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1.5">Class Name <span className="text-red-500">*</span></label>
                <input required placeholder="e.g. Class 11" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1.5">Academic Year <span className="text-red-500">*</span></label>
                <input required placeholder="2025-2026" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#EAEAEA]">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 rounded-xl text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:bg-[#1A1A1A] transition-all">Add Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
