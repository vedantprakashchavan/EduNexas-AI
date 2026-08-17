import { useState } from 'react';
import {
  Brain, TrendingUp, TrendingDown, Users, GraduationCap, IndianRupee,
  BarChart3, Target, AlertTriangle, Lightbulb, ChevronDown, ArrowUpRight,
  ArrowDownRight, Activity, BookOpen, Clock
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock analytics data
const kpiCards = [
  { title: 'Overall Attendance', value: '92.4%', change: 2.1, trend: 'up' as const, icon: Users, color: 'emerald', detail: 'vs 90.3% last month' },
  { title: 'Academic Performance', value: '78.6%', change: -1.4, trend: 'down' as const, icon: GraduationCap, color: 'indigo', detail: 'avg across all exams' },
  { title: 'Fee Collection', value: '87%', change: 5.2, trend: 'up' as const, icon: IndianRupee, color: 'violet', detail: '₹18.7L collected' },
  { title: 'Teacher Utilization', value: '84%', change: 3.0, trend: 'up' as const, icon: BookOpen, color: 'amber', detail: 'avg periods/day' },
];

const attendanceTrend = [
  { month: 'Apr', rate: 94 }, { month: 'May', rate: 91 }, { month: 'Jun', rate: 88 },
  { month: 'Jul', rate: 92 }, { month: 'Aug', rate: 90 }, { month: 'Sep', rate: 93 },
  { month: 'Oct', rate: 95 }, { month: 'Nov', rate: 91 }, { month: 'Dec', rate: 89 },
];

const classPerformance = [
  { name: 'Class 10-A', avg: 82, attendance: 94, students: 40, trend: 'up' },
  { name: 'Class 10-B', avg: 78, attendance: 91, students: 38, trend: 'down' },
  { name: 'Class 9-A', avg: 85, attendance: 93, students: 42, trend: 'up' },
  { name: 'Class 9-B', avg: 74, attendance: 88, students: 40, trend: 'down' },
  { name: 'Class 8-A', avg: 80, attendance: 95, students: 41, trend: 'up' },
  { name: 'Class 8-B', avg: 76, attendance: 90, students: 39, trend: 'stable' },
];

const subjectAnalysis = [
  { subject: 'Mathematics', avgScore: 72, passRate: 88, topScore: 98, trend: -2 },
  { subject: 'Physics', avgScore: 78, passRate: 92, topScore: 96, trend: 3 },
  { subject: 'Chemistry', avgScore: 80, passRate: 94, topScore: 97, trend: 1 },
  { subject: 'English', avgScore: 85, passRate: 98, topScore: 99, trend: 4 },
  { subject: 'Hindi', avgScore: 76, passRate: 91, topScore: 95, trend: -1 },
  { subject: 'Computer Science', avgScore: 88, passRate: 96, topScore: 100, trend: 5 },
];

const aiInsights = [
  { type: 'warning', icon: AlertTriangle, color: 'rose', title: 'Attendance Drop Alert', message: 'Class 9-B attendance dropped 5% in the last 2 weeks. 4 students have been absent 3+ consecutive days.', action: 'View Students' },
  { type: 'insight', icon: Lightbulb, color: 'amber', title: 'Performance Pattern', message: 'Mathematics scores correlate with attendance — students above 90% attendance score 15% higher on average.', action: 'View Report' },
  { type: 'prediction', icon: Target, color: 'indigo', title: 'Fee Collection Forecast', message: 'Based on current trends, August collection is projected at ₹2.1L — 8% above target. 12 students have overdue payments.', action: 'View Forecast' },
  { type: 'insight', icon: TrendingUp, color: 'emerald', title: 'Top Performing Class', message: 'Class 9-A has shown consistent improvement across all subjects (+4.2% avg) with the highest attendance rate of 93%.', action: 'View Details' },
  { type: 'warning', icon: Clock, color: 'amber', title: 'Teacher Workload Imbalance', message: 'Prof. Rajesh Sharma has 38 periods/week — exceeding the recommended max of 30. Consider redistributing.', action: 'View Workload' },
];

const riskStudents = [
  { name: 'Diya Gupta', class: '10-A', attendance: 68, academic: 42, risk: 'high' },
  { name: 'Karan Thakur', class: '10-A', attendance: 72, academic: 55, risk: 'medium' },
  { name: 'Dev Rajput', class: '10-A', attendance: 75, academic: 48, risk: 'high' },
  { name: 'Nisha Pillai', class: '10-A', attendance: 80, academic: 52, risk: 'medium' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('this_month');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <Brain className="w-7 h-7 text-[#111111]" />
            AI Analytics
          </h1>
          <p className="text-sm text-[#666666] mt-1">AI-powered insights and predictions for your school</p>
        </div>
        <div className="relative">
          <select value={timeRange} onChange={e => setTimeRange(e.target.value)} className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] cursor-pointer">
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#666666] pointer-events-none" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="rounded-2xl border border-[#EAEAEA] bg-white p-5 hover:border-[#DCDCDC] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all duration-300">
              <div className="flex items-center justify-between mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center bg-[#F7F7F7]')}>
                  <Icon className={cn('w-5 h-5', kpi.color === 'emerald' ? 'text-emerald-500' : kpi.color === 'indigo' || kpi.color === 'violet' ? 'text-[#111111]' : 'text-amber-500')} />
                </div>
                <div className={cn('flex items-center gap-0.5 text-xs font-medium', kpi.trend === 'up' ? 'text-emerald-500' : 'text-red-500')}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {Math.abs(kpi.change)}%
                </div>
              </div>
              <p className="text-2xl font-bold text-[#111111]">{kpi.value}</p>
              <p className="text-xs text-[#8A8A8A] mt-1">{kpi.title}</p>
              <p className="text-[10px] text-[#999999] mt-0.5">{kpi.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column — Charts */}
        <div className="xl:col-span-2 space-y-6">
          {/* Attendance Trend */}
          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-5">
              <Activity className="w-4 h-4 text-emerald-500" /> Attendance Trend
            </h3>
            <div className="flex items-end gap-3 h-40">
              {attendanceTrend.map((m, i) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-[#666666] font-semibold">{m.rate}%</span>
                  <div className="w-full rounded-t-md transition-all duration-500" style={{ height: `${((m.rate - 80) / 20) * 100}%`, background: m.rate >= 92 ? 'linear-gradient(to top, rgb(16 185 129), rgb(52 211 153))' : m.rate >= 88 ? 'linear-gradient(to top, rgb(245 158 11), rgb(251 191 36))' : 'linear-gradient(to top, rgb(239 68 68), rgb(248 113 113))' }} />
                  <span className="text-[10px] text-[#8A8A8A]">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Class Performance Table */}
          <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
            <div className="p-5 border-b border-[#EAEAEA]">
              <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#111111]" /> Class Performance Comparison
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#EAEAEA] bg-[#FAFAFA]">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-[#666666] uppercase">Class</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-[#666666] uppercase">Students</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-[#666666] uppercase">Avg Score</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-[#666666] uppercase">Attendance</th>
                    <th className="text-center px-3 py-3 text-xs font-semibold text-[#666666] uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                  {classPerformance.map(cls => (
                    <tr key={cls.name} className="hover:bg-[#FAFAFA] transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#111111]">{cls.name}</span>
                          {cls.trend === 'up' && <ArrowUpRight className="w-3 h-3 text-emerald-500" />}
                          {cls.trend === 'down' && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-sm text-[#666666]">{cls.students}</td>
                      <td className="px-3 py-3 text-center">
                        <span className={cn('text-sm font-semibold', cls.avg >= 80 ? 'text-emerald-500' : cls.avg >= 70 ? 'text-amber-500' : 'text-red-500')}>{cls.avg}%</span>
                      </td>
                      <td className="px-3 py-3 text-center text-sm text-[#333333]">{cls.attendance}%</td>
                      <td className="px-3 py-3">
                        <div className="w-full h-2 rounded-full bg-[#F7F7F7] overflow-hidden">
                          <div className={cn('h-full rounded-full transition-all', cls.avg >= 80 ? 'bg-emerald-500' : cls.avg >= 70 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${cls.avg}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subject Analysis */}
          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-[#111111]" /> Subject-wise Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {subjectAnalysis.map(s => (
                <div key={s.subject} className="rounded-lg bg-[#F7F7F7] p-4 hover:bg-[#FAFAFA] transition-colors border border-transparent hover:border-[#EAEAEA]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-[#111111]">{s.subject}</span>
                    <span className={cn('text-[10px] font-semibold flex items-center gap-0.5', s.trend >= 0 ? 'text-emerald-500' : 'text-red-500')}>
                      {s.trend >= 0 ? '+' : ''}{s.trend}%
                    </span>
                  </div>
                  <p className="text-xl font-bold text-[#111111]">{s.avgScore}%</p>
                  <div className="flex justify-between text-[10px] text-[#8A8A8A] mt-1">
                    <span>Pass: {s.passRate}%</span>
                    <span>Top: {s.topScore}</span>
                  </div>
                  <div className="h-1 rounded-full bg-[#EAEAEA] mt-2 overflow-hidden">
                    <div className={cn('h-full rounded-full', s.avgScore >= 80 ? 'bg-emerald-500' : s.avgScore >= 70 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${s.avgScore}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — AI Insights & Risk */}
        <div className="space-y-5">
          {/* AI Insights */}
          <div className="rounded-2xl border border-l-4 border-l-[#111111] border-y-[#EAEAEA] border-r-[#EAEAEA] bg-[#F7F7F7] p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <Brain className="w-4 h-4 text-[#111111]" /> AI Insights
            </h3>
            <div className="space-y-3">
              {aiInsights.map((insight, i) => {
                const Icon = insight.icon;
                return (
                  <div key={i} className="rounded-lg bg-white border border-[#EAEAEA] p-3 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className={cn('w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 bg-[#F7F7F7]')}>
                        <Icon className={cn('w-3.5 h-3.5', insight.color === 'emerald' ? 'text-emerald-500' : insight.color === 'rose' ? 'text-red-500' : insight.color === 'amber' ? 'text-amber-500' : 'text-[#111111]')} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#111111]">{insight.title}</p>
                        <p className="text-[11px] text-[#666666] mt-0.5 leading-relaxed">{insight.message}</p>
                        <button className="text-[10px] font-medium text-[#111111] hover:text-[#333333] mt-1.5 transition-colors">{insight.action} →</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* At-Risk Students */}
          <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-500" /> At-Risk Students
            </h3>
            <div className="space-y-2.5">
              {riskStudents.map(s => (
                <div key={s.name} className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F7F7F7] border border-[#EAEAEA]">
                  <div className={cn('w-2 h-8 rounded-full flex-shrink-0', s.risk === 'high' ? 'bg-red-500' : 'bg-amber-500')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-[#111111]">{s.name}</p>
                    <p className="text-[10px] text-[#8A8A8A]">Class {s.class}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[10px] text-[#666666]">Att: <span className={s.attendance < 75 ? 'text-red-500 font-semibold' : 'text-[#333333]'}>{s.attendance}%</span></p>
                    <p className="text-[10px] text-[#666666]">Acad: <span className={s.academic < 50 ? 'text-red-500 font-semibold' : 'text-[#333333]'}>{s.academic}%</span></p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-[#8A8A8A] mt-3 flex items-center gap-1">
              <Brain className="w-3 h-3 text-[#111111]" /> AI-identified based on attendance + academic patterns
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
