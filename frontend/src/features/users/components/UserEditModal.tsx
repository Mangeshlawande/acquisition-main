import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/types/api.types';
import {
  updateUserSchema,
  UpdateUserFormValues,
} from '../schemas/usersSchemas';
import { usersApi } from '../api/usersApi';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import { useAuthStore } from '@/features/auth/store/authStore';
import { AxiosError } from 'axios';

export interface UserEditModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: User) => void;
}

export const UserEditModal: React.FC<UserEditModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user: currentUser } = useAuthStore();
  const { success, error: toastError } = useToast();
  const isAdmin = currentUser?.role === 'admin';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserFormValues>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });

  const onSubmit = async (values: UpdateUserFormValues) => {
    setIsLoading(true);
    try {
      // If not admin, don't pass role
      const payload = { ...values };
      if (!isAdmin) {
        delete payload.role;
      }
      const updated = await usersApi.updateUser(user.id, payload);
      success('User details have been successfully saved.', 'Profile Updated');
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errorMsg =
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        'Failed to update user profile.';
      toastError(errorMsg, 'Update Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User Information"
      description={`Update account details for ${user.name}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email Address"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />

        {isAdmin && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Assigned Role
            </label>
            <select
              {...register('role')}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="user">User (Standard Access)</option>
              <option value="admin">Administrator (Full Access)</option>
            </select>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
