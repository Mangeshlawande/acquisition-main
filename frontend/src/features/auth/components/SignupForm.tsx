import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { signupSchema, SignUpFormValues } from '../schemas/authSchemas';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { Lock, Mail, User as UserIcon } from 'lucide-react';
import { AxiosError } from 'axios';

export const SignupForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (values: SignUpFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.signup(values);
      setUser(response.user, response.token);
      success(
        'Account registered successfully! Welcome aboard.',
        'Registration Complete'
      );
      navigate('/dashboard');
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errorMsg =
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        'Failed to register account. Please try again.';
      toastError(errorMsg, 'Registration Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <div className="relative">
          <Input
            label="Full Name"
            type="text"
            placeholder="Jane Doe"
            error={errors.name?.message}
            {...register('name')}
          />
          <UserIcon className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="relative">
          <Input
            label="Email Address"
            type="email"
            placeholder="jane@company.com"
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
            placeholder="At least 6 characters"
            error={errors.password?.message}
            helperText="Minimum 6 characters"
            {...register('password')}
          />
          <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-8 pointer-events-none" />
        </div>
      </div>

      <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
        Create Free Account
      </Button>

      <div className="text-center pt-3 text-xs text-slate-500">
        Already have an account?{' '}
        <Link
          to="/login"
          className="text-brand-600 font-semibold hover:underline"
        >
          Sign In
        </Link>
      </div>
    </form>
  );
};
