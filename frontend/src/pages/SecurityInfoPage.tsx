import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Zap, Bot, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';

export const SecurityInfoPage: React.FC = () => {
  const { user } = useAuthStore();
  const currentRole = user?.role || 'guest';

  const tiers = [
    {
      role: 'guest',
      title: 'Guest / Unauthenticated',
      limit: '5 requests per minute',
      description: 'Public health checks, login, and registration endpoints.',
    },
    {
      role: 'user',
      title: 'Standard User Account',
      limit: '10 requests per minute',
      description:
        'Authenticated portfolio exploration, own profile inspection and updates.',
    },
    {
      role: 'admin',
      title: 'System Administrator',
      limit: '20 requests per minute',
      description:
        'Elevated rate window for user administration, audit querying, and role modifications.',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-1">
          <ShieldCheck className="w-4 h-4" />
          Active Shield Architecture
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Arcjet Security & Rate-Limiting Policy
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          The backend enforces multi-tiered security protection at the HTTP
          layer using Arcjet Shield, Bot Detection, and Sliding Window rate
          limiting.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tiers.map(t => {
          const isCurrent = t.role === currentRole;
          return (
            <Card
              key={t.role}
              className={`relative ${isCurrent ? 'ring-2 ring-brand-500 shadow-md' : ''}`}
            >
              {isCurrent && (
                <div className="absolute top-3 right-3">
                  <Badge variant="success">Your Active Tier</Badge>
                </div>
              )}
              <CardContent className="pt-6">
                <div className="p-2.5 w-fit rounded-xl bg-brand-50 text-brand-600 border border-brand-200 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-semibold text-slate-900 text-sm mb-1">
                  {t.title}
                </h3>
                <div className="text-lg font-bold text-brand-600 mb-2">
                  {t.limit}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-amber-500" />
              <CardTitle>Automated Bot Mitigation</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              Arcjet inspects HTTP signatures, client user-agents, and IP
              heuristics on every request. Automated scraper or scraping bot
              requests are immediately blocked with a <code>403 Forbidden</code>{' '}
              status code.
            </p>
            <p className="text-slate-400">
              Approved bots (search engine crawlers like Google and preview
              spiders like Slack/Discord) are whitelisted automatically.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-500" />
              <CardTitle>Shield Attack Defense</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-xs text-slate-600 space-y-2 leading-relaxed">
            <p>
              Arcjet Shield actively blocks common attack vectors including SQL
              injections, cross-site scripting (XSS), and malicious parameter
              tampering.
            </p>
            <p className="text-slate-400">
              When triggered, requests are intercepted before reaching Express
              controllers, keeping the database and user session state safe.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
