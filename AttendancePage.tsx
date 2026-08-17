import { useState, useMemo } from 'react';
import {
  ClipboardCheck, ChevronDown, Check, X as XIcon, Clock, AlertCircle,
  Calendar, Users, TrendingUp, UserCheck, UserX, Save, BarChart3
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';

type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | null;

interface StudentRow {
  id: string;
  name: string;
  admissionNumber: string;
  rollNo: number;
  photo?: string;
  status: AttendanceStatus;
}

const initialStudents: StudentRow[] = [
  { id: '1', name: 'Aarav Patel', admissionNumber: 'ADM-001', rollNo: 1, status: null },
  { id: '2', name: 'Ananya Sharma', admissionNumber: 'ADM-002', rollNo: 2, status: null },
  { id: '3', name: 'Arjun Singh', admissionNumber: 'ADM-003', rollNo: 3, status: null },
  { id: '4', name: 'Diya Gupta', admissionNumber: 'ADM-004', rollNo: 4, status: null },
  { id: '5', name: 'Ishaan Kumar', admissionNumber: 'ADM-005', rollNo: 5, status: null },
  { id: '6', name: 'Kavya Reddy', admissionNumber: 'ADM-006', rollNo: 6, status: null },
  { id: '7', name: 'Rohan Verma', admissionNumber: 'ADM-007', rollNo: 7, status: null },
  { id: '8', name: 'Sneha Nair', admissionNumber: 'ADM-008', rollNo: 8, status: null },
  { id: '9', name: 'Vivaan Joshi', admissionNumber: 'ADM-009', rollNo: 9, status: null },
  { id: '10', name: 'Aditi Mehta', admissionNumber: 'ADM-010', rollNo: 10, status: null },
  { id: '11', name: 'Arnav Chopra', admissionNumber: 'ADM-011', rollNo: 11, status: null },
  { id: '12', name: 'Meera Iyer', admissionNumber: 'ADM-012', rollNo: 12, status: null },
  { id: '13', name: 'Reyansh Malhotra', admissionNumber: 'ADM-013', rollNo: 13, status: null },
  { id: '14', name: 'Siya Agarwal', admissionNumber: 'ADM-014', rollNo: 14, status: null },
  { id: '15', name: 'Vihaan Kapoor', admissionNumber: 'ADM-015', rollNo: 15, status: null },
  { id: '16', name: 'Priya Deshmukh', admissionNumber: 'ADM-016', rollNo: 16, status: null },
  { id: '17', name: 'Karan Thakur', admissionNumber: 'ADM-017', rollNo: 17, status: null },
  { id: '18', name: 'Nisha Pillai', admissionNumber: 'ADM-018', rollNo: 18, status: null },
  { id: '19', name: 'Dev Rajput', admissionNumber: 'ADM-019', rollNo: 19, status: null },
  { id: '20', name: 'Tara Bose', admissionNumber: 'ADM-020', rollNo: 20, status: null },
];

const weeklyData = [
  { day: 'Mon', present: 18, absent: 1, late: 1 },
  { day: 'Tue', present: 17, absent: 2, late: 1 },
  { day: 'Wed', present: 19, absent: 1, late: 0 },
  { day: 'Thu', present: 16, absent: 3, late: 1 },
  { day: 'Fri', present: 18, absent: 0, late: 2 },
];

const statusButtons: { value: AttendanceStatus; label: string; icon: typeof Check; color: string; activeColor: string }[] = [
  { value: 'present', label: 'P', icon: Check, color: 'text-[#8A8A8A] hover:text-emerald-600 hover:bg-emerald-50', activeColor: 'bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm' },
  { value: 'absent', label: 'A', icon: XIcon, color: 'text-[#8A8A8A] hover:text-red-600 hover:bg-red-50', activeColor: 'bg-red-50 text-red-600 border-red-200 shadow-sm' },
  { value: 'late', label: 'L', icon: Clock, color: 'text-[#8A8A8A] hover:text-amber-600 hover:bg-amber-50', activeColor: 'bg-amber-50 text-amber-600 border-amber-200 shadow-sm' },
  { value: 'excused', label: 'E', icon: AlertCircle, color: 'text-[#8A8A8A] hover:text-cyan-600 hover:bg-cyan-50', activeColor: 'bg-cyan-50 text-cyan-600 border-cyan-200 shadow-sm' },
];

const avatarColors = ['bg-[#111111]', 'bg-[#1A1A1A]', 'bg-[#333333]', 'bg-[#666666]', 'bg-[#8A8A8A]'];

const classOptions = [
  { id: 'c1', name: 'Class 10', sections: ['A', 'B'] },
  { id: 'c2', name: 'Class 9', sections: ['A', 'B'] },
  { id: 'c3', name: 'Class 8', sections: ['A', 'B'] },
  { id: 'c4', name: 'Class 7', sections: ['A', 'B'] },
  { id: 'c5', name: 'Class 6', sections: ['A', 'B'] },
];

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSection, setSelectedSection] = useState('A');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<StudentRow[]>(initialStudents);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const currentClass = classOptions.find(c => c.id === selectedClass);

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, excused: 0, unmarked: 0 };
    students.forEach(s => { if (s.status) c[s.status]++; else c.unmarked++; });
    return c;
  }, [students]);

  const markedCount = students.length - counts.unmarked;
  const attendanceRate = markedCount > 0 ? Math.round(((counts.present + counts.late) / markedCount) * 100) : 0;

  const setStatus = (id: string, status: AttendanceStatus) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status } : s));
    setSaved(false);
  };

  const markAllPresent = () => {
    setStudents(prev => prev.map(s => ({ ...s, status: 'present' })));
    setSaved(false);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => { setIsSaving(false); setSaved(true); }, 1000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-[#666666]" />
            Attendance
          </h1>
          <p className="text-sm text-[#666666] mt-1">Mark and track student attendance</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={markAllPresent}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium bg-[#F7F7F7] text-[#111111] border border-[#EAEAEA] hover:bg-[#EAEAEA] transition-all"
          >
            <UserCheck className="w-4 h-4" /> Mark All Present
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || counts.unmarked === students.length}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 disabled:opacity-50"
          >
            {isSaving ? <Clock className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save Attendance'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Present" value={counts.present.toString()} trend={attendanceRate} trendLabel="rate" icon={<UserCheck className="w-6 h-6" />} color="emerald" delay={0} />
        <StatCard title="Absent" value={counts.absent.toString()} trend={-counts.absent} trendLabel="students" icon={<UserX className="w-6 h-6" />} color="rose" delay={100} />
        <StatCard title="Late" value={counts.late.toString()} trend={0} trendLabel="today" icon={<Clock className="w-6 h-6" />} color="amber" delay={200} />
        <StatCard title="Marked" value={`${markedCount}/${students.length}`} trend={Math.round((markedCount / students.length) * 100)} trendLabel="complete" icon={<ClipboardCheck className="w-6 h-6" />} color="indigo" delay={300} />
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border border-[#EAEAEA] bg-white">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#666666]">Class</label>
          <div className="relative">
            <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 cursor-pointer">
              {classOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A] pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#666666]">Section</label>
          <div className="flex gap-1">
            {(currentClass?.sections || []).map(s => (
              <button key={s} onClick={() => setSelectedSection(s)} className={cn('px-3 py-2 rounded-lg text-sm font-medium transition-all', selectedSection === s ? 'bg-[#111111] text-white border border-[#111111]' : 'bg-[#F7F7F7] text-[#666666] border border-[#EAEAEA] hover:text-[#111111]')}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#666666]">Date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 cursor-pointer" />
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 rounded-full bg-[#EAEAEA] overflow-hidden">
            <div className="h-full rounded-full bg-[#111111] transition-all duration-500" style={{ width: `${(markedCount / students.length) * 100}%` }} />
          </div>
          <span className="text-xs text-[#8A8A8A]">{Math.round((markedCount / students.length) * 100)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#FAFAFA]">
                <tr className="border-b border-[#EAEAEA]">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider w-10">#</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Student</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Adm. No</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0F0F0]">
                {students.map((student, i) => (
                  <tr key={student.id} className={cn('group transition-colors', student.status === 'absent' && 'bg-red-50', student.status === 'present' && 'bg-emerald-50', !student.status && 'hover:bg-[#FAFAFA]')}>
                    <td className="px-4 py-2.5 text-xs text-[#8A8A8A] font-mono">{student.rollNo}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold', avatarColors[i % avatarColors.length])}>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-sm font-medium text-[#111111]">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-[#8A8A8A] font-mono">{student.admissionNumber}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {statusButtons.map(btn => {
                          const isActive = student.status === btn.value;
                          return (
                            <button
                              key={btn.value}
                              onClick={() => setStatus(student.id, isActive ? null : btn.value)}
                              title={btn.value || ''}
                              className={cn(
                                'w-9 h-9 rounded-lg border text-xs font-bold flex items-center justify-center transition-all duration-200',
                                isActive ? btn.activeColor : `border-[#EAEAEA] bg-white ${btn.color}`
                              )}
                            >
                              {btn.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#666666]" /> This Week
            </h3>
            <div className="space-y-3">
              {weeklyData.map(day => {
                const total = day.present + day.absent + day.late;
                const rate = Math.round((day.present / total) * 100);
                return (
                  <div key={day.day}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#666666] font-medium w-8">{day.day}</span>
                      <span className="text-[#111111] font-semibold">{rate}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#EAEAEA] overflow-hidden flex">
                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${(day.present / total) * 100}%` }} />
                      <div className="h-full bg-amber-500 transition-all" style={{ width: `${(day.late / total) * 100}%` }} />
                      <div className="h-full bg-red-500 transition-all" style={{ width: `${(day.absent / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#EAEAEA]">
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /><span className="text-[10px] text-[#8A8A8A]">Present</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-[10px] text-[#8A8A8A]">Late</span></div>
              <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-[10px] text-[#8A8A8A]">Absent</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Monthly Average
            </h3>
            <div className="text-center mb-3">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor" strokeWidth="4" className="text-[#EAEAEA]" />
                  <circle cx="40" cy="40" r="34" fill="none" strokeWidth="4" strokeDasharray={`${Math.round(0.92 * 213.6)} 213.6`} strokeLinecap="round" className="text-emerald-500" />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-[#111111]">92%</span>
              </div>
              <p className="text-xs text-[#8A8A8A] mt-2">Overall attendance rate</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#EAEAEA]">
              <div className="text-center">
                <p className="text-lg font-bold text-[#111111]">22</p>
                <p className="text-[10px] text-[#8A8A8A]">Working Days</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-[#111111]">3</p>
                <p className="text-[10px] text-[#8A8A8A]">Holidays</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] mb-3">Status Key</h3>
            <div className="space-y-2">
              {[
                { label: 'Present (P)', color: 'bg-emerald-500', desc: 'Student attended class' },
                { label: 'Absent (A)', color: 'bg-red-500', desc: 'Student did not attend' },
                { label: 'Late (L)', color: 'bg-amber-500', desc: 'Arrived after start time' },
                { label: 'Excused (E)', color: 'bg-cyan-500', desc: 'Approved leave/absence' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn('w-2.5 h-2.5 rounded-sm', item.color)} />
                  <div>
                    <p className="text-xs font-medium text-[#111111]">{item.label}</p>
                    <p className="text-[10px] text-[#8A8A8A]">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
