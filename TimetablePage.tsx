import { useState } from 'react';
import { Calendar, Sparkles, AlertTriangle, CheckCircle, ChevronDown, Clock, Loader2, RefreshCw, Send } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TimetableSlot {
  day: string;
  period: number;
  subject?: string;
  subjectCode?: string;
  teacher?: string;
  room?: string;
  type: 'regular' | 'lab' | 'activity' | 'break' | 'assembly';
}

interface Conflict {
  type: string;
  day: string;
  period: number;
  message: string;
  severity: 'error' | 'warning';
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const PERIODS = [
  { num: 1, time: '08:00–08:45', type: 'class' },
  { num: 2, time: '08:45–09:30', type: 'class' },
  { num: 3, time: '09:30–10:15', type: 'class' },
  { num: 4, time: '10:15–10:30', type: 'break', label: 'Short Break' },
  { num: 5, time: '10:30–11:15', type: 'class' },
  { num: 6, time: '11:15–12:00', type: 'class' },
  { num: 7, time: '12:00–12:45', type: 'break', label: 'Lunch Break' },
  { num: 8, time: '12:45–01:30', type: 'class' },
];

const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  'Mathematics': { bg: 'bg-[#111111]', text: 'text-white', border: 'border-[#111111]' },
  'Physics': { bg: 'bg-[#1A1A1A]', text: 'text-white', border: 'border-[#1A1A1A]' },
  'Chemistry': { bg: 'bg-[#333333]', text: 'text-white', border: 'border-[#333333]' },
  'Biology': { bg: 'bg-[#666666]', text: 'text-white', border: 'border-[#666666]' },
  'English': { bg: 'bg-[#111111]', text: 'text-white', border: 'border-[#111111]' },
  'Hindi': { bg: 'bg-[#1A1A1A]', text: 'text-white', border: 'border-[#1A1A1A]' },
  'History': { bg: 'bg-[#333333]', text: 'text-white', border: 'border-[#333333]' },
  'Computer Science': { bg: 'bg-[#666666]', text: 'text-white', border: 'border-[#666666]' },
  'Physical Education': { bg: 'bg-[#111111]', text: 'text-white', border: 'border-[#111111]' },
  'Fine Arts': { bg: 'bg-[#1A1A1A]', text: 'text-white', border: 'border-[#1A1A1A]' },
};

const defaultColor = { bg: 'bg-[#111111]', text: 'text-white', border: 'border-[#111111]' };

const mockSlots: TimetableSlot[] = [
  { day: 'Monday', period: 1, subject: 'Mathematics', subjectCode: 'MATH', teacher: 'Rajesh S.', room: 'Room 101', type: 'regular' },
  { day: 'Monday', period: 2, subject: 'Physics', subjectCode: 'PHY', teacher: 'Priya P.', room: 'Room 101', type: 'regular' },
  { day: 'Monday', period: 3, subject: 'English', subjectCode: 'ENG', teacher: 'Anil K.', room: 'Room 101', type: 'regular' },
  { day: 'Monday', period: 4, type: 'break' },
  { day: 'Monday', period: 5, subject: 'Chemistry', subjectCode: 'CHEM', teacher: 'Suresh N.', room: 'Lab 1', type: 'lab' },
  { day: 'Monday', period: 6, subject: 'Hindi', subjectCode: 'HIN', teacher: 'Sunita S.', room: 'Room 101', type: 'regular' },
  { day: 'Monday', period: 7, type: 'break' },
  { day: 'Monday', period: 8, subject: 'History', subjectCode: 'HIST', teacher: 'Amit V.', room: 'Room 101', type: 'regular' },
  { day: 'Tuesday', period: 1, subject: 'Physics', subjectCode: 'PHY', teacher: 'Priya P.', room: 'Lab 2', type: 'lab' },
  { day: 'Tuesday', period: 2, subject: 'Mathematics', subjectCode: 'MATH', teacher: 'Rajesh S.', room: 'Room 101', type: 'regular' },
  { day: 'Tuesday', period: 3, subject: 'Computer Science', subjectCode: 'CS', teacher: 'Kavita R.', room: 'Lab 1', type: 'lab' },
  { day: 'Tuesday', period: 4, type: 'break' },
  { day: 'Tuesday', period: 5, subject: 'English', subjectCode: 'ENG', teacher: 'Anil K.', room: 'Room 101', type: 'regular' },
  { day: 'Tuesday', period: 6, subject: 'Biology', subjectCode: 'BIO', teacher: 'Meena I.', room: 'Room 101', type: 'regular' },
  { day: 'Tuesday', period: 7, type: 'break' },
  { day: 'Tuesday', period: 8, subject: 'Physical Education', subjectCode: 'PE', teacher: 'Deepak M.', room: 'Ground', type: 'activity' },
  { day: 'Wednesday', period: 1, subject: 'English', subjectCode: 'ENG', teacher: 'Anil K.', room: 'Room 101', type: 'regular' },
  { day: 'Wednesday', period: 2, subject: 'Chemistry', subjectCode: 'CHEM', teacher: 'Suresh N.', room: 'Room 101', type: 'regular' },
  { day: 'Wednesday', period: 3, subject: 'Mathematics', subjectCode: 'MATH', teacher: 'Rajesh S.', room: 'Room 101', type: 'regular' },
  { day: 'Wednesday', period: 4, type: 'break' },
  { day: 'Wednesday', period: 5, subject: 'Hindi', subjectCode: 'HIN', teacher: 'Sunita S.', room: 'Room 101', type: 'regular' },
  { day: 'Wednesday', period: 6, subject: 'History', subjectCode: 'HIST', teacher: 'Amit V.', room: 'Room 101', type: 'regular' },
  { day: 'Wednesday', period: 7, type: 'break' },
  { day: 'Wednesday', period: 8, subject: 'Biology', subjectCode: 'BIO', teacher: 'Meena I.', room: 'Lab 2', type: 'lab' },
  { day: 'Thursday', period: 1, subject: 'Chemistry', subjectCode: 'CHEM', teacher: 'Suresh N.', room: 'Lab 1', type: 'lab' },
  { day: 'Thursday', period: 2, subject: 'Physics', subjectCode: 'PHY', teacher: 'Priya P.', room: 'Room 101', type: 'regular' },
  { day: 'Thursday', period: 3, subject: 'Hindi', subjectCode: 'HIN', teacher: 'Sunita S.', room: 'Room 101', type: 'regular' },
  { day: 'Thursday', period: 4, type: 'break' },
  { day: 'Thursday', period: 5, subject: 'Mathematics', subjectCode: 'MATH', teacher: 'Rajesh S.', room: 'Room 101', type: 'regular' },
  { day: 'Thursday', period: 6, subject: 'English', subjectCode: 'ENG', teacher: 'Anil K.', room: 'Room 101', type: 'regular' },
  { day: 'Thursday', period: 7, type: 'break' },
  { day: 'Thursday', period: 8, subject: 'Fine Arts', subjectCode: 'ART', teacher: 'Lakshmi M.', room: 'Room 103', type: 'activity' },
  { day: 'Friday', period: 1, subject: 'Biology', subjectCode: 'BIO', teacher: 'Meena I.', room: 'Room 101', type: 'regular' },
  { day: 'Friday', period: 2, subject: 'Mathematics', subjectCode: 'MATH', teacher: 'Rajesh S.', room: 'Room 101', type: 'regular' },
  { day: 'Friday', period: 3, subject: 'Physics', subjectCode: 'PHY', teacher: 'Priya P.', room: 'Room 101', type: 'regular' },
  { day: 'Friday', period: 4, type: 'break' },
  { day: 'Friday', period: 5, subject: 'Computer Science', subjectCode: 'CS', teacher: 'Kavita R.', room: 'Lab 1', type: 'lab' },
  { day: 'Friday', period: 6, subject: 'Chemistry', subjectCode: 'CHEM', teacher: 'Suresh N.', room: 'Room 101', type: 'regular' },
  { day: 'Friday', period: 7, type: 'break' },
  { day: 'Friday', period: 8, subject: 'History', subjectCode: 'HIST', teacher: 'Amit V.', room: 'Room 101', type: 'regular' },
  { day: 'Saturday', period: 1, subject: 'Mathematics', subjectCode: 'MATH', teacher: 'Rajesh S.', room: 'Room 101', type: 'regular' },
  { day: 'Saturday', period: 2, subject: 'English', subjectCode: 'ENG', teacher: 'Anil K.', room: 'Room 101', type: 'regular' },
  { day: 'Saturday', period: 3, subject: 'Physical Education', subjectCode: 'PE', teacher: 'Deepak M.', room: 'Ground', type: 'activity' },
  { day: 'Saturday', period: 4, type: 'break' },
  { day: 'Saturday', period: 5, subject: 'Hindi', subjectCode: 'HIN', teacher: 'Sunita S.', room: 'Room 101', type: 'regular' },
  { day: 'Saturday', period: 6, subject: 'Physics', subjectCode: 'PHY', teacher: 'Priya P.', room: 'Room 101', type: 'regular' },
  { day: 'Saturday', period: 7, type: 'break' },
  { day: 'Saturday', period: 8, subject: 'Computer Science', subjectCode: 'CS', teacher: 'Kavita R.', room: 'Lab 1', type: 'lab' },
];

const mockConflicts: Conflict[] = [
  { type: 'teacher_clash', day: 'Wednesday', period: 3, message: 'Prof. Rajesh Sharma is double-booked: Class 10A vs Class 9B', severity: 'error' },
  { type: 'room_clash', day: 'Thursday', period: 1, message: 'Lab 1 is double-booked: Class 10A Chemistry vs Class 8A Computer Science', severity: 'error' },
  { type: 'subject_overload', day: 'All', period: 0, message: 'Fine Arts has 1 unassigned period — not enough available slots', severity: 'warning' },
];

const classOptions = [
  { id: 'c1', name: 'Class 10', sections: ['A', 'B'] },
  { id: 'c2', name: 'Class 9', sections: ['A', 'B'] },
  { id: 'c3', name: 'Class 8', sections: ['A', 'B'] },
  { id: 'c4', name: 'Class 7', sections: ['A', 'B'] },
  { id: 'c5', name: 'Class 6', sections: ['A', 'B'] },
];

function getSlot(day: string, period: number): TimetableSlot | undefined {
  return mockSlots.find(s => s.day === day && s.period === period);
}

function hasConflict(day: string, period: number): Conflict | undefined {
  return mockConflicts.find(c => c.day === day && c.period === period && c.severity === 'error');
}

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('c1');
  const [selectedSection, setSelectedSection] = useState('A');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);
  const [timetableStatus, setTimetableStatus] = useState<'draft' | 'published'>('draft');

  const currentClass = classOptions.find(c => c.id === selectedClass);
  const errorCount = mockConflicts.filter(c => c.severity === 'error').length;
  const warningCount = mockConflicts.filter(c => c.severity === 'warning').length;

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <Calendar className="w-7 h-7 text-[#666666]" />
            Smart Timetable
          </h1>
          <p className="text-sm text-[#666666] mt-1">AI-powered scheduling with automatic conflict resolution</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border',
            timetableStatus === 'published'
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-amber-50 text-amber-600 border-amber-100'
          )}>
            {timetableStatus === 'published' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {timetableStatus === 'published' ? 'Published' : 'Draft'}
          </div>
          {errorCount > 0 && (
            <button
              onClick={() => setShowConflicts(!showConflicts)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 transition-colors"
            >
              <AlertTriangle className="w-3 h-3" />
              {errorCount} conflict{errorCount > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border border-[#EAEAEA] bg-white">
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#666666]">Class</label>
          <div className="relative">
            <select
              value={selectedClass}
              onChange={e => setSelectedClass(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm bg-white border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 cursor-pointer"
            >
              {classOptions.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A] pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-[#666666]">Section</label>
          <div className="flex gap-1">
            {(currentClass?.sections || []).map(s => (
              <button
                key={s}
                onClick={() => setSelectedSection(s)}
                className={cn(
                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                  selectedSection === s
                    ? 'bg-[#111111] text-white border border-[#111111]'
                    : 'bg-[#F7F7F7] text-[#666666] border border-[#EAEAEA] hover:text-[#111111]'
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300 disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {isGenerating ? 'Generating...' : 'Generate'}
        </button>
        <button
          onClick={() => setTimetableStatus('published')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium hover:bg-emerald-100 transition-all"
        >
          <Send className="w-4 h-4" /> Publish
        </button>
      </div>

      {showConflicts && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 space-y-3 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Detected Conflicts ({mockConflicts.length})
            </h3>
            <button onClick={() => setShowConflicts(false)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Hide</button>
          </div>
          <div className="space-y-2">
            {mockConflicts.map((c, i) => (
              <div key={i} className={cn(
                'flex items-start gap-3 p-3 rounded-lg border bg-white',
                c.severity === 'error' ? 'border-red-200' : 'border-amber-200'
              )}>
                <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0', c.severity === 'error' ? 'bg-red-500' : 'bg-amber-500')} />
                <div className="flex-1">
                  <p className="text-xs text-[#111111] font-medium">{c.message}</p>
                  <p className="text-[10px] text-[#8A8A8A] mt-0.5">
                    {c.day !== 'All' ? `${c.day}, Period ${c.period}` : 'Across all days'} · {c.type.replace('_', ' ')}
                  </p>
                </div>
                {c.severity === 'error' && (
                  <button className="px-2 py-1 rounded text-[10px] font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                    Resolve
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#FAFAFA]">
                <th className="sticky left-0 z-10 bg-[#FAFAFA] px-3 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider border-b border-r border-[#EAEAEA] w-[90px]">
                  Period
                </th>
                {DAYS.map(day => (
                  <th key={day} className="px-2 py-3 text-xs font-semibold text-[#666666] uppercase tracking-wider border-b border-[#EAEAEA] text-center">
                    <span className="text-[#111111]">{day.slice(0, 3)}</span>
                    <span className="hidden lg:inline text-[#8A8A8A]">{day.slice(3)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERIODS.map(period => (
                <tr key={period.num} className={cn(period.type === 'break' && 'bg-[#F7F7F7]')}>
                  <td className="sticky left-0 z-10 bg-white px-3 py-1 border-r border-b border-[#EAEAEA]">
                    <div className="text-center">
                      {period.type === 'break' ? (
                        <span className="text-[10px] text-[#8A8A8A] font-medium">{period.label}</span>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-[#111111]">P{period.num}</p>
                          <p className="text-[10px] text-[#8A8A8A]">{period.time}</p>
                        </>
                      )}
                    </div>
                  </td>
                  {DAYS.map(day => {
                    const slot = getSlot(day, period.num);
                    const conflict = hasConflict(day, period.num);

                    if (period.type === 'break') {
                      return (
                        <td key={day} className="px-1 py-1 border-b border-[#EAEAEA] text-center">
                          <div className="py-2 rounded-lg bg-[#EAEAEA]/50 text-[10px] text-[#666666] font-medium">
                            ☕ Break
                          </div>
                        </td>
                      );
                    }

                    if (!slot || !slot.subject) {
                      return (
                        <td key={day} className="px-1 py-1 border-b border-[#EAEAEA]">
                          <div className="h-[72px] rounded-lg border border-dashed border-[#DCDCDC] flex items-center justify-center bg-[#F7F7F7]">
                            <span className="text-[10px] text-[#8A8A8A]">Free</span>
                          </div>
                        </td>
                      );
                    }

                    const colors = subjectColors[slot.subject] || defaultColor;

                    return (
                      <td key={day} className="px-1 py-1 border-b border-[#EAEAEA]">
                        <div className={cn(
                          'relative h-[72px] rounded-lg border p-2 cursor-pointer transition-all duration-200',
                          'hover:scale-[1.02] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] hover:z-10',
                          colors.bg, colors.border,
                          conflict && 'ring-2 ring-red-500 ring-offset-1 ring-offset-white'
                        )}>
                          {conflict && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                          {(slot.type === 'lab' || slot.type === 'activity') && (
                            <div className="absolute top-1 right-1">
                              <span className={cn(
                                'text-[8px] font-bold uppercase px-1 py-0.5 rounded',
                                slot.type === 'lab' ? 'bg-emerald-50 text-emerald-600' : 'bg-[#EAEAEA] text-[#111111]'
                              )}>
                                {slot.type}
                              </span>
                            </div>
                          )}
                          <p className={cn('text-xs font-semibold leading-tight truncate', colors.text)}>
                            {slot.subject}
                          </p>
                          <p className="text-[10px] text-[#EAEAEA] mt-0.5 truncate">
                            {slot.teacher}
                          </p>
                          <p className="text-[10px] text-[#DCDCDC] truncate">
                            {slot.room}
                          </p>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
          <h3 className="text-sm font-semibold text-[#111111] mb-3">Subject Legend</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {Object.entries(subjectColors).map(([subject, colors]) => (
              <div key={subject} className="flex items-center gap-2">
                <div className={cn('w-3 h-3 rounded-sm border', colors.bg, colors.border)} />
                <span className="text-xs text-[#666666] truncate">{subject}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
          <h3 className="text-sm font-semibold text-[#111111] mb-3">Schedule Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#111111]">{mockSlots.filter(s => s.type === 'regular').length}</p>
              <p className="text-[10px] text-[#8A8A8A] uppercase tracking-wider">Theory</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600">{mockSlots.filter(s => s.type === 'lab').length}</p>
              <p className="text-[10px] text-[#8A8A8A] uppercase tracking-wider">Practicals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#333333]">{mockSlots.filter(s => s.type === 'activity').length}</p>
              <p className="text-[10px] text-[#8A8A8A] uppercase tracking-wider">Activities</p>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#EAEAEA]">
            <div className="flex justify-between text-xs">
              <span className="text-[#666666]">Slot utilization</span>
              <span className="text-[#111111] font-medium">
                {mockSlots.filter(s => s.type !== 'break').length}/{DAYS.length * PERIODS.filter(p => p.type === 'class').length} ({Math.round(mockSlots.filter(s => s.type !== 'break').length / (DAYS.length * PERIODS.filter(p => p.type === 'class').length) * 100)}%)
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[#F7F7F7] mt-2 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#111111] transition-all duration-500"
                style={{ width: `${Math.round(mockSlots.filter(s => s.type !== 'break').length / (DAYS.length * PERIODS.filter(p => p.type === 'class').length) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
