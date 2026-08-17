import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { Brain, Eye, EyeOff, ArrowRight, Loader2, UserPlus } from 'lucide-react';
import { cn } from '../../lib/utils';
import { UserRole } from '../../types';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[a-z]/, 'Must contain a lowercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirmPassword: z.string(),
  role: z.nativeEnum(UserRole).default(UserRole.ADMIN),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterForm = z.infer<typeof registerSchema>;

const allowedRoles = [
  { value: UserRole.ADMIN, label: 'Administrator' },
  { value: UserRole.PRINCIPAL, label: 'Principal' },
  { value: UserRole.TEACHER, label: 'Teacher' },
  { value: UserRole.ACCOUNTANT, label: 'Accountant' },
  { value: UserRole.STAFF, label: 'Staff' },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError('');
      await authService.register({ name: data.name, email: data.email, password: data.password, role: data.role });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-[#111111]" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] mb-1 flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Create Account
          </h1>
          <p className="text-sm text-[#666666]">Register your school on EduNexus AI</p>
        </div>

        {success && (
          <div className="mb-6 p-3 rounded-lg bg-emerald-50 border border-emerald-100 text-sm text-emerald-600">
            ✓ Account created successfully! Redirecting to login...
          </div>
        )}
        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">Full Name</label>
            <input
              {...register('name')}
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A]',
                'focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all',
                errors.name && 'border-red-500'
              )}
              placeholder="Your full name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">Email</label>
            <input
              {...register('email')}
              type="email"
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A]',
                'focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all',
                errors.email && 'border-red-500'
              )}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">Role</label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all"
            >
              {allowedRoles.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={cn(
                  'w-full px-4 py-3 pr-11 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A]',
                  'focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all',
                  errors.password && 'border-red-500'
                )}
                placeholder="Min 8 chars, uppercase, number"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#111111]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A]',
                'focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC] transition-all',
                errors.confirmPassword && 'border-red-500'
              )}
              placeholder="Re-enter password"
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold',
              'bg-[#111111] text-white',
              'hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
              'transition-all duration-300 disabled:opacity-50'
            )}
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <><ArrowRight className="w-4 h-4" /> Create Account</>}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-[#666666]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#111111] hover:text-[#333333] font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
