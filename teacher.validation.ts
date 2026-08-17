import { z } from 'zod';

export const createTeacherSchema = z.object({
  employeeId: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.string().or(z.date()).transform(v => new Date(v)).optional(),
  gender: z.enum(['male', 'female', 'other']).optional(),
  phone: z.string().min(1),
  email: z.string().email(),
  address: z.object({ street: z.string().optional(), city: z.string().optional(), state: z.string().optional(), pincode: z.string().optional() }).optional(),
  department: z.string().optional(),
  subjects: z.array(z.string()).default([]),
  qualifications: z.array(z.object({ degree: z.string(), institution: z.string(), year: z.number() })).optional(),
  experience: z.number().optional(),
  joiningDate: z.string().or(z.date()).transform(v => new Date(v)).optional(),
  salary: z.number().optional(),
  status: z.enum(['active', 'on_leave', 'resigned', 'retired']).default('active'),
  photo: z.string().optional(),
  maxPeriodsPerDay: z.number().default(6),
  maxPeriodsPerWeek: z.number().default(30),
});

export const updateTeacherSchema = createTeacherSchema.partial();
