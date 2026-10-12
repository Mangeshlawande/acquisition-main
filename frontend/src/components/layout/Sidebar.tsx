import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Kanban,
  Users,
  UserCheck,
  ShieldAlert,
  LogOut,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/store/authStore';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const navItems = [
    {
      to: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      to: '/deals',
      label: 'Acquisition Pipeline',
      icon: Kanban,
    },
    {
      to: '/profile',
      label: 'My Account',
      icon: UserCheck,
    },
    ...(isAdmin
      ? [
          {
            to: '/admin/users',
            label: 'User Management',
            icon: Users,
            badge: 'Admin',
          },
        ]
      : []),
    {
      to: '/security-info',
      label: 'Arcjet Protection',
      icon: ShieldAlert,
    },
  ];

  return (
    <aside
      className={cn(
        'w-64 bg-slate-900 text-slate-300 flex flex-col h-full',
        className
      )}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-white text-base tracking-tight block leading-tight">
            Acquisitions
          </span>
          <span className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider block">
            Enterprise API
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Workspace
        </div>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                )
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-brand-500/20 text-brand-300 rounded border border-brand-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* User Info & Logout footer */}
      {user && (
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-white truncate">
                {user.name}
              </p>
              <p className="text-[11px] text-slate-400 truncate">
                {user.email}
              </p>
            </div>
            <span
              className={cn(
                'text-[10px] uppercase font-bold px-2 py-0.5 rounded border tracking-wider',
                isAdmin
                  ? 'bg-purple-950/50 text-purple-300 border-purple-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              )}
            >
              {user.role}
            </span>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors border border-rose-900/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign Out
          </button>
        </div>
      )}
    </aside>
  );
};
