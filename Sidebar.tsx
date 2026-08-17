import { NavLink, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useSidebarStore } from '../../store/sidebarStore';
import { useAuthStore } from '../../store/authStore';
import {
  LayoutDashboard, Users, GraduationCap, Building2, BookOpen, Calendar,
  ClipboardCheck, FileText, Award, CreditCard, Receipt, Brain, ScanText,
  BotMessageSquare, BarChart3, UserCog, Library, Package, Bus, FolderOpen,
  Bell, Settings, Shield, ChevronLeft, LogOut, Sparkles,
} from 'lucide-react';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: 'ACADEMIC',
    items: [
      { label: 'Students', path: '/students', icon: <Users className="w-[18px] h-[18px]" /> },
      { label: 'Teachers', path: '/teachers', icon: <GraduationCap className="w-[18px] h-[18px]" /> },
      { label: 'Classes', path: '/classes', icon: <Building2 className="w-[18px] h-[18px]" /> },
      { label: 'Subjects', path: '/subjects', icon: <BookOpen className="w-[18px] h-[18px]" /> },
      { label: 'Timetable', path: '/timetable', icon: <Calendar className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { label: 'Attendance', path: '/attendance', icon: <ClipboardCheck className="w-[18px] h-[18px]" /> },
      { label: 'Exams', path: '/exams', icon: <FileText className="w-[18px] h-[18px]" /> },
      { label: 'Assignments', path: '/assignments', icon: <Award className="w-[18px] h-[18px]" /> },
      { label: 'Fees', path: '/fees', icon: <CreditCard className="w-[18px] h-[18px]" /> },
      { label: 'Library', path: '/library', icon: <Library className="w-[18px] h-[18px]" /> },
      { label: 'Inventory', path: '/inventory', icon: <Package className="w-[18px] h-[18px]" /> },
      { label: 'Transport', path: '/transport', icon: <Bus className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: 'INTELLIGENCE',
    items: [
      { label: 'AI Assistant', path: '/ai-assistant', icon: <BotMessageSquare className="w-[18px] h-[18px]" /> },
      { label: 'Analytics', path: '/analytics', icon: <BarChart3 className="w-[18px] h-[18px]" /> },
      { label: 'Document Reader', path: '/documents/ai-reader', icon: <ScanText className="w-[18px] h-[18px]" /> },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { label: 'Notifications', path: '/notifications', icon: <Bell className="w-[18px] h-[18px]" /> },
      { label: 'Audit Logs', path: '/audit-logs', icon: <Shield className="w-[18px] h-[18px]" /> },
      { label: 'Settings', path: '/settings', icon: <Settings className="w-[18px] h-[18px]" /> },
    ],
  },
];

export default function Sidebar() {
  const { isCollapsed, toggle } = useSidebarStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 bottom-0 z-40 flex flex-col',
        'bg-white border-r border-[#EAEAEA]',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center h-16 px-4 border-b border-[#EAEAEA]',
        isCollapsed ? 'justify-center' : 'gap-3'
      )}>
        <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-black">
          <Brain className="w-[18px] h-[18px] text-white" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0">
            <h1 className="text-[15px] font-semibold text-[#111111] tracking-[-0.02em] truncate">
              EduNexus AI
            </h1>
            <p className="text-[11px] text-[#8A8A8A] truncate">School OS</p>
          </div>
        )}
        <button
          onClick={toggle}
          className={cn(
            'p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F5F5F5] transition-all duration-200',
            isCollapsed && 'rotate-180'
          )}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <p className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-[0.1em] px-3 mb-1.5">
                {section.title}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium',
                    'transition-all duration-150 group relative',
                    isActive
                      ? 'bg-[#111111] text-white'
                      : 'text-[#666666] hover:text-[#111111] hover:bg-[#F5F5F5]',
                    isCollapsed && 'justify-center px-0'
                  )}
                  title={isCollapsed ? item.label : undefined}
                >
                  <span className="flex-shrink-0">
                    {item.icon}
                  </span>
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  {isCollapsed && (
                    <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-[#111111] text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* User Info */}
      <div className={cn(
        'border-t border-[#EAEAEA] p-3',
        isCollapsed ? 'flex justify-center' : ''
      )}>
        <div className={cn(
          'flex items-center gap-3 p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors',
          isCollapsed && 'justify-center p-2'
        )}>
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white text-xs font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-[#111111] truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-[#8A8A8A] truncate">{user?.role?.replace('_', ' ') || 'Super Admin'}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-[#8A8A8A] hover:text-[#111111] hover:bg-[#F5F5F5] transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
