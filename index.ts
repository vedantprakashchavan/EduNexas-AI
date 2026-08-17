export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  TEACHER = 'TEACHER',
  ACCOUNTANT = 'ACCOUNTANT',
  LIBRARIAN = 'LIBRARIAN',
  STAFF = 'STAFF',
  PARENT = 'PARENT',
  STUDENT = 'STUDENT'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  attendanceRate: number;
  feeCollection: number;
  pendingActions: number;
  recentAlerts: number;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  priority: 'low' | 'medium' | 'high';
  actionRequired: boolean;
  createdAt: string;
}

export interface StatCardType {
  title: string;
  value: string | number;
  trend: number;
  icon: React.ReactNode;
  trendLabel?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'violet' | 'rose';
}

// Phase 2: School Core Types
export interface Student {
  _id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: { street?: string; city?: string; state?: string; pincode?: string };
  classId?: { _id: string; name: string } | string;
  sectionId?: string;
  parentId?: string;
  bloodGroup?: string;
  photo?: string;
  status: 'active' | 'inactive' | 'transferred' | 'graduated';
  admissionDate?: string;
  createdAt: string;
}

export interface Teacher {
  _id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone: string;
  department?: string;
  subjects: string[];
  experience?: number;
  status: 'active' | 'on_leave' | 'resigned' | 'retired';
  joiningDate?: string;
  photo?: string;
  maxPeriodsPerDay?: number;
  maxPeriodsPerWeek?: number;
  createdAt: string;
}

export interface SchoolClass {
  _id: string;
  name: string;
  sections: { name: string; capacity: number }[];
  academicYear: string;
  classTeacherId?: { _id: string; firstName: string; lastName: string } | string;
  subjects?: { _id: string; name: string; code: string }[] | string[];
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Subject {
  _id: string;
  name: string;
  code: string;
  department?: string;
  type: 'theory' | 'practical' | 'elective';
  periodsPerWeek: number;
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Room {
  _id: string;
  name: string;
  number: string;
  building?: string;
  floor?: number;
  capacity: number;
  type: 'classroom' | 'laboratory' | 'library' | 'auditorium' | 'staff_room' | 'office' | 'sports';
  facilities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  createdAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}
