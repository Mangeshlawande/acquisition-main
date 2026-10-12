import React, { useState } from 'react';
import { User } from '@/types/api.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserEditModal } from './UserEditModal';
import { UserDeleteDialog } from './UserDeleteDialog';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';

export interface UsersTableProps {
  users: User[];
  onRefresh: () => void;
}

export const UsersTable: React.FC<UsersTableProps> = ({ users, onRefresh }) => {
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const { user: currentUser } = useAuthStore();

  const filtered = users.filter(
    u =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search users by name, email or role..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-300 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
        </div>
        <div className="text-xs text-slate-500 font-medium self-center">
          Showing {filtered.length} of {users.length} users
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">User</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Created</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map(u => {
                const isSelf = currentUser?.id === u.id;
                return (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={u.name} size="sm" shape="circle" />
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {u.name}
                            {isSelf && (
                              <span className="ml-2 text-[10px] text-brand-600 font-bold uppercase tracking-wider bg-brand-50 px-1.5 py-0.5 rounded border border-brand-200">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-slate-400">ID #{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-600 font-mono text-xs">
                      {u.email}
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={u.role === 'admin' ? 'purple' : 'default'}
                      >
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-xs text-slate-500">
                      {u.created_at ? formatDate(u.created_at) : 'Active'}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingUser(u)}
                          title="Edit user details and role"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isSelf}
                          onClick={() => setDeletingUser(u)}
                          className={
                            isSelf
                              ? 'opacity-30 cursor-not-allowed'
                              : 'text-rose-600 hover:text-rose-700 hover:bg-rose-50'
                          }
                          title={
                            isSelf
                              ? 'Cannot delete your own account'
                              : 'Delete user'
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-slate-400 text-sm"
                  >
                    No users matching the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editingUser && (
        <UserEditModal
          user={editingUser}
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            onRefresh();
          }}
        />
      )}

      {deletingUser && (
        <UserDeleteDialog
          user={deletingUser}
          isOpen={Boolean(deletingUser)}
          onClose={() => setDeletingUser(null)}
          onSuccess={() => {
            setDeletingUser(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};
