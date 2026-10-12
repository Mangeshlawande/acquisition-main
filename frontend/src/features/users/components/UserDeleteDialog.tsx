import React, { useState } from 'react';
import { User } from '@/types/api.types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { usersApi } from '../api/usersApi';
import { useToast } from '@/components/ui/toast';
import { AlertTriangle } from 'lucide-react';
import { AxiosError } from 'axios';

export interface UserDeleteDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (deletedId: number) => void;
}

export const UserDeleteDialog: React.FC<UserDeleteDialogProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: toastError } = useToast();

  if (!user) return null;

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await usersApi.deleteUser(user.id);
      success(`User ${user.email} was permanently deleted.`, 'User Deleted');
      onSuccess(user.id);
      onClose();
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ error?: string; message?: string }>;
      const errorMsg =
        axiosErr.response?.data?.error ||
        axiosErr.response?.data?.message ||
        'Failed to delete user.';
      toastError(errorMsg, 'Deletion Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete User Account">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-900">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <p className="font-semibold mb-1">Warning: Irreversible Action</p>
            <p>
              Are you sure you want to permanently delete user{' '}
              <strong className="font-bold">{user.name}</strong> ({user.email})?
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isLoading}>
            Permanently Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
