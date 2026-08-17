import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import StudentsPage from './pages/students/StudentsPage';
import TeachersPage from './pages/teachers/TeachersPage';
import ClassesPage from './pages/classes/ClassesPage';
import SubjectsPage from './pages/subjects/SubjectsPage';
import TimetablePage from './pages/timetable/TimetablePage';
import AIDocumentReaderPage from './pages/documents/AIDocumentReaderPage';
import AttendancePage from './pages/attendance/AttendancePage';
import ExamsPage from './pages/exams/ExamsPage';
import FeesPage from './pages/fees/FeesPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import AIAssistantPage from './pages/assistant/AIAssistantPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import LibraryPage from './pages/library/LibraryPage';
import TransportPage from './pages/transport/TransportPage';
import InventoryPage from './pages/inventory/InventoryPage';
import SettingsPage from './pages/settings/SettingsPage';
import AuditLogsPage from './pages/audit/AuditLogsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

// Placeholder page for routes not yet built
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="rounded-2xl bg-slate-800/50 p-6 mb-5">
        <svg className="w-12 h-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-slate-400 text-center max-w-md">
        This module is coming in the next build phase. Stay tuned!
      </p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/classes" element={<ClassesPage />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/assignments" element={<ComingSoon title="Assignments" />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/payments" element={<FeesPage />} />
        <Route path="/documents/ai-reader" element={<AIDocumentReaderPage />} />
        <Route path="/ai-assistant" element={<AIAssistantPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/staffing" element={<AnalyticsPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/transport" element={<TransportPage />} />
        <Route path="/documents" element={<AIDocumentReaderPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/audit-logs" element={<AuditLogsPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
