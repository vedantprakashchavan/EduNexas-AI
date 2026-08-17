import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import { Brain, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@edunexus.com', password: 'Admin@123' },
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setError('');
      const response = await authService.login(data.email, data.password);
      setAuth(response.user, response.accessToken);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] p-6 animate-in fade-in duration-300">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#EAEAEA] shadow-[0_4px_20px_rgba(0,0,0,0.04)] p-8">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[#F7F7F7] flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-[#111111]" />
          </div>
          <h1 className="text-2xl font-bold text-[#111111] mb-1">Welcome back</h1>
          <p className="text-sm text-[#666666]">Sign in to your school dashboard</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-100 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              className={cn(
                'w-full px-4 py-3 rounded-xl text-sm',
                'bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A]',
                'focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]',
                'transition-all duration-200',
                errors.email && 'border-red-500 focus:ring-red-500/20'
              )}
              placeholder="admin@edunexus.com"
            />
            {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-2">Password</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={cn(
                  'w-full px-4 py-3 pr-11 rounded-xl text-sm',
                  'bg-[#F7F7F7] border border-[#EAEAEA] text-[#111111] placeholder:text-[#8A8A8A]',
                  'focus:outline-none focus:ring-2 focus:ring-[#111111]/10 focus:border-[#DCDCDC]',
                  'transition-all duration-200',
                  errors.password && 'border-red-500 focus:ring-red-500/20'
                )}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#111111] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold',
              'bg-[#111111] text-white',
              'hover:bg-[#1A1A1A] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)]',
              'focus:outline-none focus:ring-2 focus:ring-[#111111]/20',
              'transition-all duration-300',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-[#666666]">
            Don't have an account?{' '}
            <Link to="/register" className="text-[#111111] hover:text-[#333333] font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>

        <div className="mt-8 p-4 rounded-xl bg-[#F7F7F7] border border-[#EAEAEA]">
          <p className="text-xs font-medium text-[#333333] mb-2">Demo Credentials</p>
          <div className="space-y-1">
            <p className="text-xs text-[#666666]">Admin: admin@edunexus.com / Admin@123</p>
            <p className="text-xs text-[#666666]">Teacher: teacher@edunexus.com / Teacher@123</p>
          </div>
        </div>
      </div>
    </div>
  );
}
