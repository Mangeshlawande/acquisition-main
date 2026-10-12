import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/store/authStore';
import { usersApi } from '@/features/users/api/usersApi';
import { ProfileCard } from '@/features/users/components/ProfileCard';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { UserCheck } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user: authUser } = useAuthStore();

  const {
    data: user,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user', authUser?.id],
    queryFn: () =>
      authUser ? usersApi.getUserById(authUser.id) : Promise.reject('No user'),
    enabled: Boolean(authUser?.id),
    initialData: authUser || undefined,
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-brand-600 mb-1">
          <UserCheck className="w-4 h-4" />
          Self-Service Management
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Account Profile
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal credentials, contact email, and security
          settings.
        </p>
      </div>

      {isLoading && !user ? (
        <LoadingSpinner label="Loading profile data..." />
      ) : user ? (
        <ProfileCard user={user} onUserUpdated={() => refetch()} />
      ) : null}
    </div>
  );
};
