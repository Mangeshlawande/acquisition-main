import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { signInSchema, SignInFormValues } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Lock, Mail } from 'lucide-react';
import { AxiosError } from 'axios';

export const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (values: SignInFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.signin(values);
      setUser(response.user, response.token);
      success(`Welcome back, ${response.user.name}!`, 'Signed In');
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errorMsg =
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        'Failed to sign in. Please check your credentials.';
      toastError(errorMsg, 'Authentication Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@company.com"
            error={errors.email?.message}
            {...register('email')}
          />
          <Mail className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="relative">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
        </div>
      </div>

      <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
        Sign In to Platform
      </Button>

      <div className="text-center pt-3 text-xs text-slate-500">
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="text-brand-600 font-semibold hover:underline"
        >
          Create an account
        </Link>
      </div>
    </form>
  );
};
