import { useState } from 'react';
import { ScrollText, Search, Filter, ChevronDown, User, Settings, Shield, Database, LogIn, LogOut, FileText, Trash2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AuditLog {
  id: string;
  action: string;
  module: string;
  user: string;
  role: string;
  details: string;
  ip: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

const mockLogs: AuditLog[] = [
  { id: '1', action: 'LOGIN', module: 'Auth', user: 'Admin User', role: 'Super Admin', details: 'Successful login', ip: '192.168.1.100', timestamp: '2025-08-15 22:10:05', severity: 'info' },
  { id: '2', action: 'CREATE', module: 'Students', user: 'Admin User', role: 'Super Admin', details: 'Added new student: Aarav Patel (ADM-001)', ip: '192.168.1.100', timestamp: '2025-08-15 21:45:30', severity: 'info' },
  { id: '3', action: 'UPDATE', module: 'Fees', user: 'Accountant', role: 'Accountant', details: 'Recorded payment ₹12,500 for Ananya Sharma', ip: '192.168.1.105', timestamp: '2025-08-15 20:30:15', severity: 'info' },
  { id: '4', action: 'DELETE', module: 'Students', user: 'Admin User', role: 'Super Admin', details: 'Deactivated student: Kavya Reddy (ADM-006)', ip: '192.168.1.100', timestamp: '2025-08-15 19:15:45', severity: 'warning' },
  { id: '5', action: 'PUBLISH', module: 'Exams', user: 'Principal', role: 'Principal', details: 'Published Mid-Term results for Class 10-A', ip: '192.168.1.101', timestamp: '2025-08-15 18:00:00', severity: 'info' },
  { id: '6', action: 'UPDATE', module: 'Settings', user: 'Admin User', role: 'Super Admin', details: 'Changed academic year to 2025-2026', ip: '192.168.1.100', timestamp: '2025-08-15 16:20:10', severity: 'warning' },
  { id: '7', action: 'FAILED_LOGIN', module: 'Auth', user: 'Unknown', role: '—', details: 'Failed login attempt (3 attempts)', ip: '203.45.67.89', timestamp: '2025-08-15 14:05:22', severity: 'critical' },
  { id: '8', action: 'CREATE', module: 'Timetable', user: 'Admin User', role: 'Super Admin', details: 'Generated new timetable for Class 10-A', ip: '192.168.1.100', timestamp: '2025-08-15 12:30:00', severity: 'info' },
  { id: '9', action: 'BULK_UPDATE', module: 'Attendance', user: 'Prof. Rajesh Sharma', role: 'Teacher', details: 'Marked attendance for Class 10-A (20 students)', ip: '192.168.1.110', timestamp: '2025-08-15 09:15:00', severity: 'info' },
  { id: '10', action: 'PROCESS', module: 'Documents', user: 'Admin User', role: 'Super Admin', details: 'AI processed admission form — Aarav Patel (94% confidence)', ip: '192.168.1.100', timestamp: '2025-08-14 17:45:30', severity: 'info' },
  { id: '11', action: 'SEND', module: 'Notifications', user: 'Principal', role: 'Principal', details: 'Sent fee reminder to all parents (450 recipients)', ip: '192.168.1.101', timestamp: '2025-08-14 10:00:00', severity: 'info' },
  { id: '12', action: 'EXPORT', module: 'Reports', user: 'Admin User', role: 'Super Admin', details: 'Exported attendance report (PDF) for July 2025', ip: '192.168.1.100', timestamp: '2025-08-13 15:30:00', severity: 'info' },
];

const actionIcons: Record<string, typeof User> = { LOGIN: LogIn, LOGOUT: LogOut, CREATE: FileText, UPDATE: Settings, DELETE: Trash2, PUBLISH: FileText, FAILED_LOGIN: Shield, BULK_UPDATE: Database, PROCESS: Database, SEND: FileText, EXPORT: FileText };
const severityStyle: Record<string, { dot: string; row: string }> = {
  info: { dot: 'bg-emerald-500', row: '' },
  warning: { dot: 'bg-amber-500', row: 'bg-amber-50' },
  critical: { dot: 'bg-red-500', row: 'bg-red-50' },
};

export default function AuditLogsPage() {
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  const modules = [...new Set(mockLogs.map(l => l.module))];
  const filtered = mockLogs.filter(l => {
    if (moduleFilter !== 'all' && l.module !== moduleFilter) return false;
    if (search && !l.details.toLowerCase().includes(search.toLowerCase()) && !l.user.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-[#111111] flex items-center gap-2"><ScrollText className="w-7 h-7 text-[#111111]" /> Audit Logs</h1>
        <p className="text-sm text-[#666666] mt-1">Track all system activity and user actions</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Events', value: mockLogs.length, color: 'text-[#111111]' },
          { label: 'Warnings', value: mockLogs.filter(l => l.severity === 'warning').length, color: 'text-amber-500' },
          { label: 'Critical', value: mockLogs.filter(l => l.severity === 'critical').length, color: 'text-red-500' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-[#EAEAEA] bg-white p-4 text-center">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-[#8A8A8A]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by user or action..." className="w-full pl-11 pr-4 py-2.5 rounded-xl text-sm bg-white border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {['all', ...modules].map(m => (
            <button key={m} onClick={() => setModuleFilter(m)} className={cn('px-3 py-1.5 rounded-lg text-xs font-medium border whitespace-nowrap transition-all', moduleFilter === m ? 'bg-[#111111] text-white border-[#111111]' : 'bg-[#F7F7F7] text-[#666666] border-[#EAEAEA] hover:text-[#111111]')}>
              {m === 'all' ? 'All Modules' : m}
            </button>
          ))}
        </div>
      </div>

      {/* Log Table */}
      <div className="rounded-2xl border border-[#EAEAEA] bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="border-b border-[#EAEAEA] bg-[#FAFAFA]">
              <th className="w-6 px-4 py-3"></th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Timestamp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Action</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Module</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">User</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">Details</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#666666] uppercase">IP</th>
            </tr></thead>
            <tbody className="divide-y divide-[#F0F0F0]">
              {filtered.map(log => {
                const Icon = actionIcons[log.action] || FileText;
                const sev = severityStyle[log.severity];
                return (
                  <tr key={log.id} className={cn('hover:bg-[#FAFAFA] transition-colors', sev.row)}>
                    <td className="px-4 py-3"><div className={cn('w-2 h-2 rounded-full', sev.dot)} /></td>
                    <td className="px-4 py-3 text-xs text-[#666666] font-mono whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3"><span className="flex items-center gap-1.5 text-xs font-medium text-[#111111]"><Icon className="w-3 h-3 text-[#8A8A8A]" />{log.action}</span></td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F7F7F7] text-[#333333] border border-[#EAEAEA]">{log.module}</span></td>
                    <td className="px-4 py-3"><p className="text-xs text-[#111111]">{log.user}</p><p className="text-[10px] text-[#8A8A8A]">{log.role}</p></td>
                    <td className="px-4 py-3 text-xs text-[#666666] max-w-xs truncate">{log.details}</td>
                    <td className="px-4 py-3 text-[10px] text-[#8A8A8A] font-mono">{log.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
