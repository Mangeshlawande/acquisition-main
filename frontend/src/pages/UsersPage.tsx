import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/features/users/api/usersApi';
import { UsersTable } from '@/features/users/components/UsersTable';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users as UsersIcon } from 'lucide-react';

export const UsersPage: React.FC = () => {
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAllUsers(),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-600 mb-1">
            <UsersIcon className="w-4 h-4" />
            Admin Operations
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            System User Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review registered identities, audit account levels, elevate
            permissions, or delete users.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`}
          />
          Refresh List
        </Button>
      </div>

      {isLoading ? (
        <LoadingSpinner label="Querying user records from backend..." />
      ) : isError ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900">
          <h3 className="font-semibold text-sm">Failed to retrieve users</h3>
          <p className="text-xs mt-1">
            {(error as Error)?.message ||
              'Make sure you are logged in with an administrator role.'}
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => refetch()}
            className="mt-4"
          >
            Retry Connection
          </Button>
        </div>
      ) : (
        <UsersTable users={users} onRefresh={() => refetch()} />
      )}
    </div>
  );
};
