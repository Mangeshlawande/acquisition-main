import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Top action bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 max-w-5xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-brand-600/10 blur-3xl pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link to="/" className="inline-block group">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-brand-500/30 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Acquisitions System
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Enterprise Mergers & Acquisitions Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <Card className="border-slate-800 bg-white/95 backdrop-blur shadow-2xl p-2 sm:p-4">
          <CardContent className="pt-4">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900">
                Sign in to your account
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Enter your credentials to access the workspace
              </p>
            </div>
            <LoginForm />
          </CardContent>
        </Card>

        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Protected by Arcjet Shield & Sliding Window Rate Limiting</span>
        </div>
      </div>
    </div>
  );
};
