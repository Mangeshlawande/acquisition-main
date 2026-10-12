import React from 'react';
import { Menu, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Avatar } from '@/components/ui/Avatar';

export const Navbar: React.FC<{ onOpenMobileMenu: () => void }> = ({
  onOpenMobileMenu,
}) => {
  const { user, avatarStyle, avatarSeed } = useAuthStore();

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Arcjet Protection Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
            <Avatar
              name={user.name}
              seed={avatarSeed || user.name}
              style={avatarStyle}
              size="sm"
              shape="circle"
            />
            <div className="hidden md:block text-left leading-tight">
              <span className="text-xs font-semibold text-slate-900 dark:text-white block">
                {user.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 capitalize block">
                {user.role} Account
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <UserIcon className="w-4 h-4" />
            <span>Guest Session</span>
          </div>
        )}
      </div>
    </header>
  );
};
