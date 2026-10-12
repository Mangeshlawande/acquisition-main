import React, { useEffect, useState } from 'react';
import {
  subscribeToSecurityEvents,
  SecurityEventDetail,
} from '@/lib/api-client';
import { AlertTriangle, ShieldX, X } from 'lucide-react';
import { useAuthStore } from '@/features/auth/store/authStore';

export const RateLimitBanner: React.FC = () => {
  const [event, setEvent] = useState<SecurityEventDetail | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const { user } = useAuthStore();

  const role = user?.role || 'guest';
  const roleLimits = {
    admin: '20 req/min',
    user: '10 req/min',
    guest: '5 req/min',
  };

  useEffect(() => {
    const unsubscribe = subscribeToSecurityEvents(detail => {
      setEvent(detail);
      if (detail.type === 'rate_limit') {
        setSecondsRemaining(60); // 1-minute window
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          setEvent(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  if (!event) return null;

  const isRateLimit = event.type === 'rate_limit';

  return (
    <div
      className={`px-4 py-2.5 flex items-center justify-between text-xs transition-all ${
        isRateLimit
          ? 'bg-amber-500 text-amber-950 font-medium border-b border-amber-600/30'
          : 'bg-rose-600 text-white font-medium border-b border-rose-700'
      }`}
    >
      <div className="flex items-center gap-2.5 max-w-4xl mx-auto flex-1">
        {isRateLimit ? (
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-950" />
        ) : (
          <ShieldX className="w-4 h-4 shrink-0 text-white" />
        )}
        <div className="flex flex-wrap items-center gap-2">
          <span>{event.message}</span>
          {isRateLimit && (
            <span className="bg-amber-600/30 px-2 py-0.5 rounded-full text-[11px] font-semibold">
              Tier Limit: {roleLimits[role as keyof typeof roleLimits]} | Reset
              in: {secondsRemaining}s
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => setEvent(null)}
        className="p-1 rounded hover:bg-black/10 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
