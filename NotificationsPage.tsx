import { useState } from 'react';
import {
  Bell, Send, Plus, Filter, Megaphone, AlertCircle, Calendar, Receipt,
  ClipboardCheck, GraduationCap, X, Users, CheckCheck, Clock, Mail
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import { cn } from '../../lib/utils';

interface NotificationRecord {
  id: string;
  title: string;
  message: string;
  type: 'announcement' | 'alert' | 'reminder' | 'event' | 'result' | 'fee' | 'attendance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  audience: string;
  channels: string[];
  sentAt: string;
  readRate: number;
}

const mockNotifications: NotificationRecord[] = [
  { id: '1', title: 'Mid-Term Results Published', message: 'Class 10 mid-term exam results have been published. Parents can view results on the portal.', type: 'result', priority: 'high', audience: 'Class 10 Parents', channels: ['in_app', 'sms'], sentAt: '2025-09-28 10:30', readRate: 85 },
  { id: '2', title: 'Fee Payment Reminder', message: 'This is a reminder that August 2025 fee payment is due by September 10th.', type: 'fee', priority: 'medium', audience: 'All Parents', channels: ['in_app', 'email', 'sms'], sentAt: '2025-09-05 09:00', readRate: 72 },
  { id: '3', title: 'Independence Day Celebration', message: 'School will host Independence Day celebrations on August 15th. All students must attend in white uniform.', type: 'event', priority: 'medium', audience: 'All Students', channels: ['in_app'], sentAt: '2025-08-10 11:00', readRate: 94 },
  { id: '4', title: 'Attendance Alert — Diya Gupta', message: 'Student Diya Gupta (Class 10-A) has been absent for 5 consecutive days. Parent notified.', type: 'attendance', priority: 'urgent', audience: 'Individual', channels: ['sms', 'email'], sentAt: '2025-09-20 08:00', readRate: 100 },
  { id: '5', title: 'Parent-Teacher Meeting', message: 'PTM scheduled for October 5th (Saturday), 10 AM - 1 PM. Attendance mandatory for all class teachers.', type: 'reminder', priority: 'high', audience: 'All Teachers', channels: ['in_app', 'email'], sentAt: '2025-09-25 14:00', readRate: 88 },
  { id: '6', title: 'Annual Day Rehearsal Schedule', message: 'Annual Day rehearsals begin from October 10th. Participating students report to auditorium during free periods.', type: 'announcement', priority: 'low', audience: 'All Students', channels: ['in_app'], sentAt: '2025-10-01 09:30', readRate: 67 },
  { id: '7', title: 'Science Lab Safety Notice', message: 'All students must wear lab coats and safety goggles during practical sessions. Non-compliance will result in exclusion.', type: 'alert', priority: 'high', audience: 'Class 9 & 10', channels: ['in_app'], sentAt: '2025-09-15 13:00', readRate: 79 },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string; bg: string }> = {
  announcement: { icon: Megaphone, color: 'text-[#111111]', bg: 'bg-[#F7F7F7]' },
  alert: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  reminder: { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  event: { icon: Calendar, color: 'text-[#111111]', bg: 'bg-[#F7F7F7]' },
  result: { icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  fee: { icon: Receipt, color: 'text-blue-600', bg: 'bg-blue-50' },
  attendance: { icon: ClipboardCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
};

const priorityConfig: Record<string, string> = {
  low: 'text-[#666666] bg-[#F7F7F7] border-[#EAEAEA]',
  medium: 'text-blue-600 bg-blue-50 border-blue-100',
  high: 'text-amber-600 bg-amber-50 border-amber-100',
  urgent: 'text-red-600 bg-red-50 border-red-100',
};

export default function NotificationsPage() {
  const [showCompose, setShowCompose] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const filtered = filterType === 'all' ? mockNotifications : mockNotifications.filter(n => n.type === filterType);
  const avgReadRate = Math.round(mockNotifications.reduce((s, n) => s + n.readRate, 0) / mockNotifications.length);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2">
            <Bell className="w-7 h-7 text-[#111111]" /> Communication
          </h1>
          <p className="text-sm text-[#666666] mt-1">Send notifications to students, parents, and staff</p>
        </div>
        <button onClick={() => setShowCompose(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#111111] text-white text-sm font-semibold hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] transition-all">
          <Send className="w-4 h-4 text-white" /> Compose
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Sent" value={mockNotifications.length.toString()} trend={3} trendLabel="this week" icon={<Send className="w-6 h-6" />} color="indigo" delay={0} />
        <StatCard title="Avg Read Rate" value={`${avgReadRate}%`} trend={5} trendLabel="engagement" icon={<CheckCheck className="w-6 h-6" />} color="emerald" delay={100} />
        <StatCard title="Urgent" value={mockNotifications.filter(n => n.priority === 'urgent').length.toString()} trend={0} trendLabel="active" icon={<AlertCircle className="w-6 h-6" />} color="rose" delay={200} />
        <StatCard title="Recipients" value="450+" trend={12} trendLabel="total" icon={<Users className="w-6 h-6" />} color="violet" delay={300} />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {['all', 'announcement', 'alert', 'reminder', 'event', 'result', 'fee', 'attendance'].map(t => (
          <button key={t} onClick={() => setFilterType(t)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-all', filterType === t ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#F7F7F7] text-[#666666] border-[#EAEAEA] hover:text-[#111111]')}>
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map(n => {
          const typeCfg = typeConfig[n.type];
          const TypeIcon = typeCfg.icon;
          return (
            <div key={n.id} className="rounded-2xl border border-[#EAEAEA] bg-white p-5 hover:border-[#DCDCDC] hover:shadow-[0_4px_20px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', typeCfg.bg)}>
                  <TypeIcon className={cn('w-5 h-5', typeCfg.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-[#111111]">{n.title}</h3>
                    <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', priorityConfig[n.priority])}>{n.priority}</span>
                  </div>
                  <p className="text-xs text-[#666666] mt-1 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-[#8A8A8A]">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {n.audience}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {n.sentAt}</span>
                    <span className="flex items-center gap-1">{n.channels.map(c => c === 'email' ? <Mail key={c} className="w-3 h-3" /> : c === 'sms' ? '📱' : <Bell key={c} className="w-3 h-3" />)}</span>
                  </div>
                </div>
                <div className="text-center flex-shrink-0">
                  <div className="relative w-12 h-12">
                    <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                      <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="3" className="text-[#EAEAEA]" />
                      <circle cx="24" cy="24" r="20" fill="none" strokeWidth="3" strokeDasharray={`${Math.round(n.readRate * 1.257)} 125.7`} strokeLinecap="round" className={n.readRate >= 80 ? 'text-emerald-500' : n.readRate >= 60 ? 'text-amber-500' : 'text-red-500'} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#111111]">{n.readRate}%</span>
                  </div>
                  <p className="text-[9px] text-[#999999] mt-0.5">read</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowCompose(false)} />
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#EAEAEA] shadow-2xl p-6 mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#111111]">Compose Notification</h2>
              <button onClick={() => setShowCompose(false)} className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Title</label><input type="text" placeholder="Notification title" className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" /></div>
              <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Message</label><textarea rows={3} placeholder="Write your message..." className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] resize-none" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Type</label><select className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]"><option>Announcement</option><option>Alert</option><option>Reminder</option><option>Event</option></select></div>
                <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Priority</label><select className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]"><option>Medium</option><option>Low</option><option>High</option><option>Urgent</option></select></div>
              </div>
              <div><label className="block text-sm font-medium text-[#333333] mb-1.5">Audience</label><select className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]"><option>All</option><option>All Students</option><option>All Teachers</option><option>All Parents</option><option>Class 10</option><option>Class 9</option></select></div>
            </div>
            <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-[#EAEAEA]">
              <button onClick={() => setShowCompose(false)} className="px-4 py-2.5 rounded-xl text-sm text-[#666666] hover:text-[#111111] hover:bg-[#F7F7F7] transition-all">Cancel</button>
              <button onClick={() => setShowCompose(false)} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#111111] text-white hover:bg-[#1A1A1A] transition-all flex items-center gap-2"><Send className="w-4 h-4 text-white" /> Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
