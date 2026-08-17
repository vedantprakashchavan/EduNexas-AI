import { Users, GraduationCap, ClipboardCheck, CreditCard, Sparkles, ArrowRight, Clock, TrendingUp, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import StatCard from '../../components/common/StatCard';
import AlertCard from '../../components/common/AlertCard';

// Mock data
const attendanceData = [
  { day: 'Mon', rate: 94 },
  { day: 'Tue', rate: 92 },
  { day: 'Wed', rate: 89 },
  { day: 'Thu', rate: 93 },
  { day: 'Fri', rate: 91 },
  { day: 'Sat', rate: 88 },
  { day: 'Today', rate: 92 },
];

const feeData = [
  { month: 'Mar', collected: 18, pending: 4 },
  { month: 'Apr', collected: 22, pending: 3 },
  { month: 'May', collected: 19, pending: 5 },
  { month: 'Jun', collected: 24, pending: 2 },
  { month: 'Jul', collected: 21, pending: 3 },
  { month: 'Aug', collected: 18.4, pending: 3.6 },
];

const recentActivity = [
  { time: '2 min ago', event: 'Class 10A attendance marked', type: 'attendance' },
  { time: '15 min ago', event: 'New student admission form uploaded', type: 'document' },
  { time: '32 min ago', event: 'Fee payment received — ₹12,500', type: 'payment' },
  { time: '1 hr ago', event: 'Physics exam results published', type: 'exam' },
  { time: '2 hrs ago', event: 'Teacher leave approved — Prof. Sharma', type: 'leave' },
];

const insights = [
  { text: 'Class 8B has unusually low attendance this week — down 13% from average.', priority: 'high' },
  { text: 'Science department may require one additional teacher next month based on enrollment trends.', priority: 'medium' },
  { text: 'Mathematics performance in Class 10A has improved by 15% since last assessment.', priority: 'low' },
  { text: 'Fee collection rate is 4.2% higher this quarter compared to last year.', priority: 'low' },
];

const todaySchedule = [
  { time: '08:00 AM', event: 'Morning Assembly', location: 'Main Hall' },
  { time: '10:30 AM', event: 'PTM — Class 9A', location: 'Room 201' },
  { time: '01:00 PM', event: 'Staff Meeting', location: 'Conference Room' },
  { time: '03:00 PM', event: 'Sports Practice', location: 'Ground' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export default function DashboardPage() {
  const greeting = getGreeting();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Greeting Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] mb-1">
            {greeting}, Admin 👋
          </h1>
          <p className="text-sm text-[#666666]">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-600">School Health: 94%</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F7F7F7] border border-[#EAEAEA]">
            <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
            <span className="text-xs font-semibold text-[#111111]">AI Active</span>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value="1284"
          trend={12}
          trendLabel="vs last month"
          icon={<Users className="w-6 h-6" />}
          color="indigo"
          delay={0}
        />
        <StatCard
          title="Total Teachers"
          value="86"
          trend={3}
          trendLabel="new this quarter"
          icon={<GraduationCap className="w-6 h-6" />}
          color="emerald"
          delay={100}
        />
        <StatCard
          title="Attendance Rate"
          value="92.4%"
          trend={-1.2}
          trendLabel="vs last week"
          icon={<ClipboardCheck className="w-6 h-6" />}
          color="amber"
          delay={200}
        />
        <StatCard
          title="Fee Collection"
          value="₹18.4L"
          trend={8.5}
          trendLabel="85.6% collected"
          icon={<CreditCard className="w-6 h-6" />}
          color="violet"
          delay={300}
        />
      </div>

      {/* Action Required + AI Insights */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Action Required */}
        <div className="xl:col-span-2 rounded-2xl border border-[#EAEAEA] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              Action Required
            </h3>
            <span className="text-xs text-[#8A8A8A]">4 pending</span>
          </div>
          <div className="space-y-3">
            <AlertCard
              type="critical"
              title="3 timetable conflicts detected"
              message="Teachers double-booked on Monday and Wednesday. Review and resolve before next week."
              actionLabel="Resolve"
              timestamp="Just now"
            />
            <AlertCard
              type="warning"
              title="12 students have attendance below 75%"
              message="Students at risk of academic standing. Consider sending parent notifications."
              actionLabel="View List"
              timestamp="30 min ago"
            />
            <AlertCard
              type="warning"
              title="8 documents awaiting verification"
              message="Uploaded admission forms and certificates need admin approval."
              actionLabel="Review"
              timestamp="1 hr ago"
            />
            <AlertCard
              type="info"
              title="14 fee payments due tomorrow"
              message="₹2,45,000 in pending payments. Auto-reminders scheduled for 9 AM."
              actionLabel="View"
              timestamp="2 hrs ago"
            />
          </div>
        </div>

        {/* AI Insights */}
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#111111]" />
              AI Insights
            </h3>
            <button className="text-xs text-[#111111] hover:text-[#333333] flex items-center gap-1 transition-colors">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {insights.map((insight, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-[#F7F7F7] border border-[#EAEAEA] hover:bg-[#FAFAFA] transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    insight.priority === 'high' ? 'bg-red-500' :
                    insight.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  <p className="text-xs text-[#333333] leading-relaxed">{insight.text}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 rounded-lg bg-[#F7F7F7] border border-[#EAEAEA] text-xs font-medium text-[#111111] hover:bg-[#FAFAFA] transition-colors">
            Ask AI Assistant →
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Attendance Trend */}
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#111111]" />
              Attendance Trend
            </h3>
            <span className="text-xs text-[#8A8A8A]">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={attendanceData}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#111111" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#111111" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" />
              <XAxis dataKey="day" tick={{ fill: '#8A8A8A', fontSize: 12 }} axisLine={{ stroke: '#EAEAEA' }} />
              <YAxis domain={[80, 100]} tick={{ fill: '#8A8A8A', fontSize: 12 }} axisLine={{ stroke: '#EAEAEA' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #EAEAEA', borderRadius: '8px', color: '#111111', fontSize: '12px' }}
                formatter={(value: number) => [`${value}%`, 'Attendance']}
              />
              <Area type="monotone" dataKey="rate" stroke="#111111" strokeWidth={2} fill="url(#attendanceGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Collection */}
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#111111]" />
              Fee Collection
            </h3>
            <span className="text-xs text-[#8A8A8A]">Last 6 months (₹ Lakhs)</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={feeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" />
              <XAxis dataKey="month" tick={{ fill: '#8A8A8A', fontSize: 12 }} axisLine={{ stroke: '#EAEAEA' }} />
              <YAxis tick={{ fill: '#8A8A8A', fontSize: 12 }} axisLine={{ stroke: '#EAEAEA' }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #EAEAEA', borderRadius: '8px', color: '#111111', fontSize: '12px' }}
                formatter={(value: number) => [`₹${value}L`]}
              />
              <Bar dataKey="collected" fill="#111111" radius={[4, 4, 0, 0]} name="Collected" />
              <Bar dataKey="pending" fill="#EAEAEA" radius={[4, 4, 0, 0]} name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Schedule + Recent Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Today's Schedule */}
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              Today's Schedule
            </h3>
          </div>
          <div className="space-y-3">
            {todaySchedule.map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#FAFAFA] transition-colors">
                <div className="text-xs font-mono text-[#111111] w-20 flex-shrink-0">{item.time}</div>
                <div className="w-px h-8 bg-[#EAEAEA]" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#111111]">{item.event}</p>
                  <p className="text-xs text-[#8A8A8A]">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-[#EAEAEA] bg-white p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#111111] flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              Recent Activity
            </h3>
            <button className="text-xs text-[#111111] hover:text-[#333333] transition-colors">View All</button>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#FAFAFA] transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                  item.type === 'attendance' ? 'bg-emerald-500' :
                  item.type === 'document' ? 'bg-[#111111]' :
                  item.type === 'payment' ? 'bg-[#111111]' :
                  item.type === 'exam' ? 'bg-amber-500' : 'bg-[#8A8A8A]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#111111]">{item.event}</p>
                  <p className="text-xs text-[#8A8A8A] mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
