import { useState } from 'react';
import {
  GraduationCap, Plus, Calendar, ChevronDown, Eye, Trophy, BarChart3,
  BookOpen, Clock, CheckCircle, Target, X, FileText, Award
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';

interface ExamRecord {
  id: string;
  name: string;
  type: 'unit_test' | 'midterm' | 'final' | 'practical';
  className: string;
  section: string;
  startDate: string;
  endDate: string;
  subjects: { name: string; date: string; maxMarks: number }[];
  status: 'scheduled' | 'ongoing' | 'completed' | 'results_published';
  avgPercentage?: number;
  topperName?: string;
  topperPercentage?: number;
}

const mockExams: ExamRecord[] = [
  {
    id: '1', name: 'First Unit Test', type: 'unit_test', className: 'Class 10', section: 'A',
    startDate: '2025-07-14', endDate: '2025-07-18',
    subjects: [
      { name: 'Mathematics', date: '2025-07-14', maxMarks: 50 },
      { name: 'Physics', date: '2025-07-15', maxMarks: 50 },
      { name: 'Chemistry', date: '2025-07-16', maxMarks: 50 },
      { name: 'English', date: '2025-07-17', maxMarks: 50 },
      { name: 'Hindi', date: '2025-07-18', maxMarks: 50 },
    ],
    status: 'results_published', avgPercentage: 78, topperName: 'Ananya Sharma', topperPercentage: 96,
  },
  {
    id: '2', name: 'Mid-Term Examination', type: 'midterm', className: 'Class 10', section: 'A',
    startDate: '2025-09-15', endDate: '2025-09-25',
    subjects: [
      { name: 'Mathematics', date: '2025-09-15', maxMarks: 100 },
      { name: 'Physics', date: '2025-09-17', maxMarks: 100 },
      { name: 'Chemistry', date: '2025-09-19', maxMarks: 100 },
      { name: 'English', date: '2025-09-21', maxMarks: 100 },
      { name: 'Hindi', date: '2025-09-23', maxMarks: 100 },
      { name: 'Computer Science', date: '2025-09-25', maxMarks: 100 },
    ],
    status: 'completed', avgPercentage: 82, topperName: 'Aarav Patel', topperPercentage: 94,
  },
  {
    id: '3', name: 'Second Unit Test', type: 'unit_test', className: 'Class 10', section: 'A',
    startDate: '2025-11-10', endDate: '2025-11-14',
    subjects: [
      { name: 'Mathematics', date: '2025-11-10', maxMarks: 50 },
      { name: 'Science', date: '2025-11-11', maxMarks: 50 },
      { name: 'English', date: '2025-11-12', maxMarks: 50 },
    ],
    status: 'scheduled',
  },
  {
    id: '4', name: 'Physics Practical', type: 'practical', className: 'Class 10', section: 'A',
    startDate: '2025-10-05', endDate: '2025-10-05',
    subjects: [{ name: 'Physics', date: '2025-10-05', maxMarks: 30 }],
    status: 'completed', avgPercentage: 85,
  },
  {
    id: '5', name: 'Final Examination', type: 'final', className: 'Class 10', section: 'A',
    startDate: '2026-02-15', endDate: '2026-03-05',
    subjects: [
      { name: 'Mathematics', date: '2026-02-15', maxMarks: 100 },
      { name: 'Physics', date: '2026-02-18', maxMarks: 100 },
      { name: 'Chemistry', date: '2026-02-21', maxMarks: 100 },
      { name: 'English', date: '2026-02-24', maxMarks: 100 },
      { name: 'Hindi', date: '2026-02-27', maxMarks: 100 },
      { name: 'History', date: '2026-03-01', maxMarks: 100 },
      { name: 'Computer Science', date: '2026-03-05', maxMarks: 100 },
    ],
    status: 'scheduled',
  },
];

const gradeDistribution = [
  { grade: 'A+', count: 3, color: 'bg-emerald-500' },
  { grade: 'A', count: 5, color: 'bg-teal-500' },
  { grade: 'B+', count: 4, color: 'bg-[#111111]' },
  { grade: 'B', count: 4, color: 'bg-[#333333]' },
  { grade: 'C', count: 2, color: 'bg-amber-500' },
  { grade: 'D', count: 1, color: 'bg-orange-500' },
  { grade: 'F', count: 1, color: 'bg-red-500' },
];

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  scheduled: { label: 'Scheduled', color: 'bg-[#F7F7F7] text-[#666666] border-[#EAEAEA]', icon: Clock },
  ongoing: { label: 'Ongoing', color: 'bg-blue-50 text-blue-600 border-blue-200', icon: BookOpen },
  completed: { label: 'Completed', color: 'bg-amber-50 text-amber-600 border-amber-200', icon: CheckCircle },
  results_published: { label: 'Published', color: 'bg-emerald-50 text-emerald-600 border-emerald-200', icon: Trophy },
};

const typeLabels: Record<string, { label: string; color: string }> = {
  unit_test: { label: 'Unit Test', color: 'text-[#111111]' },
  midterm: { label: 'Mid-Term', color: 'text-[#111111]' },
  final: { label: 'Final Exam', color: 'text-red-600' },
  practical: { label: 'Practical', color: 'text-emerald-600' },
};

export default function ExamsPage() {
  const [selectedExam, setSelectedExam] = useState<ExamRecord | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const publishedExams = mockExams.filter(e => e.status === 'results_published' || e.status === 'completed');
  const avgPerformance = publishedExams.length > 0
    ? Math.round(publishedExams.reduce((s, e) => s + (e.avgPercentage || 0), 0) / publishedExams.length)
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-[#666666]" />
            Exams & Results
          </h1>
          <p className="text-sm text-[#666666] mt-1">Schedule exams, enter marks, and publish results</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all duration-300">
          <Plus className="w-4 h-4" /> Create Exam
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Exams" value={mockExams.length.toString()} trend={2} trendLabel="this term" icon={<FileText className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="Upcoming" value={mockExams.filter(e => e.status === 'scheduled').length.toString()} trend={0} trendLabel="scheduled" icon={<Calendar className="w-6 h-6" />} color="amber" delay={100} />
        <StatCard title="Results Published" value={mockExams.filter(e => e.status === 'results_published').length.toString()} trend={1} trendLabel="completed" icon={<Trophy className="w-6 h-6" />} color="emerald" delay={200} />
        <StatCard title="Avg Performance" value={`${avgPerformance}%`} trend={avgPerformance > 75 ? 5 : -3} trendLabel="overall" icon={<Target className="w-6 h-6" />} color="violet" delay={300} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-3">
          {mockExams.map(exam => {
            const statusCfg = statusConfig[exam.status];
            const StatusIcon = statusCfg.icon;
            const typeCfg = typeLabels[exam.type];

            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={cn(
                  'rounded-2xl border p-5 cursor-pointer transition-all duration-200',
                  'hover:border-[#DCDCDC] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)]',
                  selectedExam?.id === exam.id ? 'bg-[#F7F7F7] border-[#DCDCDC]' : 'bg-white border-[#EAEAEA]'
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-bold text-[#111111]">{exam.name}</h3>
                      <span className={cn('text-[10px] font-medium uppercase tracking-wider', typeCfg.color)}>{typeCfg.label}</span>
                    </div>
                    <p className="text-xs text-[#8A8A8A]">
                      {exam.className} {exam.section} · {exam.startDate} → {exam.endDate} · {exam.subjects.length} subject{exam.subjects.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {exam.avgPercentage && (
                      <div className="text-center">
                        <p className="text-lg font-bold text-[#111111]">{exam.avgPercentage}%</p>
                        <p className="text-[10px] text-[#8A8A8A]">avg</p>
                      </div>
                    )}
                    <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border', statusCfg.color)}>
                      <StatusIcon className="w-3 h-3" /> {statusCfg.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {exam.subjects.map(s => (
                    <span key={s.name} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F7F7F7] text-[#666666] border border-[#EAEAEA]">
                      {s.name} ({s.maxMarks})
                    </span>
                  ))}
                </div>

                {exam.topperName && (
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#EAEAEA]">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs text-[#666666]">
                      Topper: <span className="text-[#111111] font-medium">{exam.topperName}</span> ({exam.topperPercentage}%)
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <BarChart3 className="w-4 h-4 text-[#666666]" /> Grade Distribution
            </h3>
            <p className="text-[10px] text-[#8A8A8A] mb-3">First Unit Test · Class 10-A</p>
            <div className="space-y-2.5">
              {gradeDistribution.map(g => {
                const totalStudents = gradeDistribution.reduce((s, x) => s + x.count, 0);
                const pct = Math.round((g.count / totalStudents) * 100);
                return (
                  <div key={g.grade} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#111111] w-6">{g.grade}</span>
                    <div className="flex-1 h-2 rounded-full bg-[#EAEAEA] overflow-hidden">
                      <div className={cn('h-full rounded-full transition-all duration-500', g.color)} style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-[#8A8A8A] w-6 text-right">{g.count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-emerald-500" /> Subject Averages
            </h3>
            <div className="space-y-3">
              {[
                { subject: 'Mathematics', avg: 72, max: 50 },
                { subject: 'Physics', avg: 78, max: 50 },
                { subject: 'Chemistry', avg: 80, max: 50 },
                { subject: 'English', avg: 85, max: 50 },
                { subject: 'Hindi', avg: 76, max: 50 },
              ].map(s => (
                <div key={s.subject}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#666666]">{s.subject}</span>
                    <span className={cn('font-semibold', s.avg >= 80 ? 'text-emerald-600' : s.avg >= 60 ? 'text-amber-600' : 'text-red-600')}>{s.avg}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EAEAEA] overflow-hidden">
                    <div className={cn('h-full rounded-full transition-all duration-500', s.avg >= 80 ? 'bg-emerald-500' : s.avg >= 60 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${s.avg}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-amber-500" /> Upcoming
            </h3>
            <div className="space-y-3">
              {mockExams.filter(e => e.status === 'scheduled').map(exam => (
                <div key={exam.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-[#111111]">{exam.name}</p>
                    <p className="text-[10px] text-[#8A8A8A]">{exam.startDate} · {exam.subjects.length} subjects</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-6 mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111]">Create New Exam</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1.5">Exam Name</label>
                <input type="text" placeholder="e.g. Mid-Term Examination" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Type</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
                    <option value="unit_test">Unit Test</option>
                    <option value="midterm">Mid-Term</option>
                    <option value="final">Final Exam</option>
                    <option value="practical">Practical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Class</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]">
                    {['Class 10-A', 'Class 10-B', 'Class 9-A', 'Class 9-B', 'Class 8-A'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">Start Date</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#333333] mb-1.5">End Date</label>
                  <input type="date" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#333333] mb-1.5">Max Marks Per Subject</label>
                <input type="number" placeholder="100" className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-[#EAEAEA]">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 rounded-xl text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">Cancel</button>
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:bg-[#1A1A1A] transition-all">Create Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
