import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useSidebarStore } from '../../store/sidebarStore';
import { useThemeStore } from '../../store/themeStore';
import { Search, Bell, Sun, Moon, ChevronDown, Command } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/students': 'Students',
  '/teachers': 'Teachers',
  '/classes': 'Classes',
  '/subjects': 'Subjects',
  '/timetable': 'Timetable',
  '/attendance': 'Attendance',
  '/exams': 'Exams',
  '/assignments': 'Assignments',
  '/fees': 'Fees',
  '/payments': 'Payments',
  '/documents/ai-reader': 'AI Document Reader',
  '/ai-assistant': 'AI Assistant',
  '/analytics': 'Analytics',
  '/staffing': 'Staffing',
  '/library': 'Library',
  '/inventory': 'Inventory',
  '/transport': 'Transport',
  '/documents': 'Documents',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
  '/audit-logs': 'Audit Logs',
};

export default function Header() {
  const location = useLocation();
  const { isCollapsed } = useSidebarStore();
  const { theme, toggleTheme } = useThemeStore();
  const pageTitle = pageTitles[location.pathname] || 'EduNexus AI';

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 flex items-center justify-between px-6',
        'bg-white/80 backdrop-blur-sm border-b border-[#EAEAEA]',
        'transition-all duration-300',
        isCollapsed ? 'left-[72px]' : 'left-[260px]'
      )}
    >
      {/* Left: Page Title */}
      <div>
        <h2 className="text-[15px] font-semibold text-[#111111] tracking-[-0.01em]">{pageTitle}</h2>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A] group-focus-within:text-[#111111] transition-colors" />
          <input
            type="text"
            placeholder="Search students, teachers, classes..."
            className={cn(
              'w-full pl-10 pr-20 py-2 rounded-xl text-sm',
              'bg-[#F7F7F7] border border-[#EAEAEA]',
              'text-[#111111] placeholder:text-[#8A8A8A]',
              'focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]',
              'transition-all duration-200'
            )}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-[#EAEAEA]">
            <Command className="w-3 h-3 text-[#8A8A8A]" />
            <span className="text-[10px] text-[#8A8A8A] font-medium">K</span>
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5] transition-all duration-200"
        >
          {theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5] transition-all duration-200">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Separator */}
        <div className="w-px h-7 bg-[#EAEAEA] mx-1.5" />

        {/* User */}
        <button className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-lg hover:bg-[#F5F5F5] transition-all duration-200">
          <div className="w-7 h-7 rounded-full bg-[#111111] flex items-center justify-center text-white text-[11px] font-semibold">
            A
          </div>
          <div className="text-left hidden md:block">
            <p className="text-[13px] font-medium text-[#111111] leading-tight">Admin</p>
          </div>
          <ChevronDown className="w-3 h-3 text-[#8A8A8A]" />
        </button>
      </div>
    </header>
  );
}
