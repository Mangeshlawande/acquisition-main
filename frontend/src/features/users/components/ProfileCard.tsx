import React, { useState } from 'react';
import { User } from '@/types/api.types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UserEditModal } from './UserEditModal';
import {
  UserCheck,
  Mail,
  Calendar,
  Shield,
  Edit3,
  Sparkles,
  Shuffle,
  RotateCcw,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Avatar, AvatarStyle } from '@/components/ui/Avatar';

const AVATAR_STYLES: { id: AvatarStyle; label: string }[] = [
  { id: 'lorelei', label: 'Illustrated' },
  { id: 'avataaars', label: 'Avatars' },
  { id: 'bottts', label: 'Robots' },
  { id: 'thumbs', label: 'Smilies' },
  { id: 'initials', label: 'Initials' },
  { id: 'shapes', label: 'Geometric' },
];

export const ProfileCard: React.FC<{
  user: User;
  onUserUpdated?: (updated: User) => void;
}> = ({ user, onUserUpdated }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const {
    user: currentUser,
    setUser,
    avatarStyle,
    avatarSeed,
    setAvatarStyle,
    setAvatarSeed,
  } = useAuthStore();

  const isSelf = currentUser?.id === user.id;
  const effectiveSeed = isSelf ? avatarSeed || user.name : user.name;
  const effectiveStyle = isSelf ? avatarStyle : 'lorelei';

  const handleRandomize = () => {
    const randomSeed = `${user.name}-${Math.random().toString(36).slice(2, 7)}`;
    setAvatarSeed(randomSeed);
  };

  const handleResetSeed = () => {
    setAvatarSeed('');
  };

  const handleUpdated = (updated: User) => {
    setUser(updated);
    if (onUserUpdated) onUserUpdated(updated);
  };

  return (
    <>
      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar
              name={user.name}
              seed={effectiveSeed}
              style={effectiveStyle}
              size="xl"
              shape="rounded"
              className="shadow-sm border border-slate-200 dark:border-slate-700"
            />
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-xs text-slate-500">ID #{user.id}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit Profile
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Avatar Customizer for Current User */}
          {isSelf && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-50/60 to-slate-50 dark:from-brand-950/20 dark:to-slate-800/40 border border-brand-100 dark:border-brand-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-900 dark:text-brand-300">
                  <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                  <span>Customize Profile Picture</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRandomize}
                    className="h-7 px-2 text-xs flex items-center gap-1 text-brand-700 dark:text-brand-300 hover:bg-brand-100/60"
                    title="Generate new avatar variation"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    Shuffle
                  </Button>
                  {Boolean(avatarSeed) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleResetSeed}
                      className="h-7 px-2 text-xs flex items-center gap-1 text-slate-500 hover:bg-slate-100"
                      title="Reset avatar to default name"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Style selector chips */}
              <div className="flex flex-wrap gap-1.5">
                {AVATAR_STYLES.map(styleOption => {
                  const isSelected = effectiveStyle === styleOption.id;
                  return (
                    <button
                      key={styleOption.id}
                      type="button"
                      onClick={() => setAvatarStyle(styleOption.id)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-2xs'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {styleOption.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Mail className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Email Address
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Shield className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  System Role
                </p>
                <div className="mt-0.5">
                  <Badge variant={user.role === 'admin' ? 'purple' : 'default'}>
                    {user.role.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <Calendar className="w-4 h-4 text-slate-400 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Account Created
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {user.created_at ? formatDate(user.created_at) : 'Active'}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
              <UserCheck className="w-4 h-4 text-emerald-500 mt-0.5" />
              <div>
                <p className="text-xs text-slate-400 font-medium">
                  Security Status
                </p>
                <p className="text-sm font-semibold text-emerald-700">
                  Protected by Arcjet
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <UserEditModal
        user={user}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleUpdated}
      />
    </>
  );
};
