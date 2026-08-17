import { z } from 'zod';

export const createStudentSchema = z.object({
  admissionNumber: z.string().min(1, 'Admission number is required'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().or(z.date()).transform((val) => new Date(val)),
  gender: z.enum(['male', 'female', 'other']),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional()
  }).optional(),
  classId: z.string().optional(),
  sectionId: z.string().optional(),
  parentId: z.string().optional(),
  bloodGroup: z.string().optional(),
  photo: z.string().url().optional(),
  status: z.enum(['active', 'inactive', 'transferred', 'graduated']).optional().default('active'),
  admissionDate: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
  previousSchool: z.string().optional(),
  documents: z.array(z.object({
    name: z.string(),
    url: z.string().url(),
    type: z.string()
  })).optional()
});

export const updateStudentSchema = createStudentSchema.partial();

export const studentQuerySchema = z.object({
  page: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform((val) => (val ? parseInt(val, 10) : 10)),
  search: z.string().optional(),
  classId: z.string().optional(),
  status: z.enum(['active', 'inactive', 'transferred', 'graduated']).optional(),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc')
});
