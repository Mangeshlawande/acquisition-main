import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  ShieldCheck,
  ShieldAlert,
  Users,
  TrendingUp,
  BarChart3,
  Zap,
  Lock,
  Database,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Layers,
  Menu,
  X,
  Activity,
  Filter,
  Check,
  DollarSign,
  Cpu,
  Key,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useAuthStore } from '@/features/auth/store/authStore';
import { cn } from '@/lib/utils';

// Sample deals for the interactive demo widget
interface DemoDeal {
  id: string;
  name: string;
  industry: string;
  valuation: number;
  stage: 'sourcing' | 'due_diligence' | 'negotiation' | 'closing';
  probability: number;
  lead: string;
  notes: string;
}

const DEMO_DEALS: DemoDeal[] = [
  {
    id: '1',
    name: 'CloudScale Analytics',
    industry: 'Enterprise SaaS',
    valuation: 28000000,
    stage: 'due_diligence',
    probability: 65,
    lead: 'Sarah Jenkins',
    notes: '85% ARR retention, data warehouse intelligence suite.',
  },
  {
    id: '2',
    name: 'PayMesh Networks',
    industry: 'FinTech Rails',
    valuation: 42000000,
    stage: 'negotiation',
    probability: 80,
    lead: 'Marcus Vance',
    notes: 'Cross-border payment rails processing $2.1B annual volume.',
  },
  {
    id: '3',
    name: 'NeuroVision AI',
    industry: 'DeepTech',
    valuation: 18500000,
    stage: 'sourcing',
    probability: 40,
    lead: 'Alex Chen',
    notes: 'Edge inference computer vision chips for robotics.',
  },
  {
    id: '4',
    name: 'Fortress Vaults',
    industry: 'Cybersecurity',
    valuation: 35000000,
    stage: 'closing',
    probability: 92,
    lead: 'Marcus Vance',
    notes: 'Zero-trust cryptographic key infrastructure.',
  },
  {
    id: '5',
    name: 'BioStream Systems',
    industry: 'HealthTech',
    valuation: 14000000,
    stage: 'sourcing',
    probability: 35,
    lead: 'Sarah Jenkins',
    notes: 'Clinical trial patient telemetry platform.',
  },
];

const STAGE_LABELS: Record<
  DemoDeal['stage'],
  { label: string; color: string; darkColor: string }
> = {
  sourcing: {
    label: 'Sourcing & Discovery',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    darkColor: 'dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800',
  },
  due_diligence: {
    label: 'Due Diligence',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    darkColor: 'dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800',
  },
  negotiation: {
    label: 'LOI & Negotiation',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    darkColor:
      'dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800',
  },
  closing: {
    label: 'Closing & Signoff',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    darkColor:
      'dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800',
  },
};

export const LandingPage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Interactive Sandbox state
  const [activeTab, setActiveTab] = useState<'pipeline' | 'security' | 'rbac'>(
    'pipeline'
  );
  const [filterStage, setFilterStage] = useState<string>('all');
  const [simulatedRole, setSimulatedRole] = useState<
    'guest' | 'user' | 'admin'
  >('admin');
  const [simulatedRequests, setSimulatedRequests] = useState<number>(3);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(0);

  const filteredDeals =
    filterStage === 'all'
      ? DEMO_DEALS
      : DEMO_DEALS.filter(d => d.stage === filterStage);

  const totalFilteredValuation = filteredDeals.reduce(
    (sum, d) => sum + d.valuation,
    0
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const roleLimits = {
    guest: { max: 5, label: 'Guest Session', badge: 'Unauthenticated' },
    user: { max: 10, label: 'Standard Member', badge: 'Associate Access' },
    admin: { max: 20, label: 'Administrator', badge: 'Full Platform Control' },
  };

  const handleSimulateRequest = () => {
    const currentMax = roleLimits[simulatedRole].max;
    if (simulatedRequests < currentMax) {
      setSimulatedRequests(prev => prev + 1);
    } else {
      setSimulatedRequests(1); // reset cycle
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: 'M&A Pipeline & Milestone Tracking',
      tag: 'Deal Flow',
      description:
        'Track strategic acquisitions across 5 standardized stages from preliminary discovery to final legal signoff. Inspect enterprise valuations, ARR multiples, and probability ratings.',
      color: 'text-brand-600 dark:text-brand-400',
      bg: 'bg-brand-50 dark:bg-brand-950/60',
      borderColor: 'border-brand-100 dark:border-brand-900/40',
    },
    {
      icon: ShieldCheck,
      title: 'Arcjet Bot & DDoS Protection',
      tag: 'Zero-Trust Shield',
      description:
        'Embedded sliding-window rate limiting and proactive bot protection shield your proprietary valuation models and due diligence data against scraping and automated abuse.',
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'border-emerald-100 dark:border-emerald-900/40',
    },
    {
      icon: Users,
      title: 'Role-Based Access Control (RBAC)',
      tag: 'Enterprise Governance',
      description:
        'Strict privilege isolation between unauthenticated guests, deal team associates, and managing partners. Admins can manage the member roster and revoke accounts with instant enforcement.',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/60',
      borderColor: 'border-indigo-100 dark:border-indigo-900/40',
    },
    {
      icon: Lock,
      title: 'Cryptographic Cookie Sessions',
      tag: 'Data Integrity',
      description:
        'No sensitive JWT tokens are exposed in browser localStorage. Authentication relies on secure, HttpOnly, SameSite cookies paired with bcrypt 10-round password hashing.',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-950/60',
      borderColor: 'border-amber-100 dark:border-amber-900/40',
    },
    {
      icon: BarChart3,
      title: 'Portfolio Valuation Analytics',
      tag: 'Intelligence Suite',
      description:
        'Gain real-time visibility into aggregate deal volume, weighted probability pipelines, deal aging, and portfolio concentration across sectors like Enterprise SaaS, FinTech, and AI.',
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/60',
      borderColor: 'border-cyan-100 dark:border-cyan-900/40',
    },
    {
      icon: Database,
      title: 'Drizzle ORM & PostgreSQL Core',
      tag: 'Ultra-Fast Performance',
      description:
        'Engineered with Drizzle ORM and PostgreSQL connection pooling for sub-50ms query response times, full schema validation with Zod, and production Docker containerization.',
      color: 'text-violet-600 dark:text-violet-400',
      bg: 'bg-violet-50 dark:bg-violet-950/60',
      borderColor: 'border-violet-100 dark:border-violet-900/40',
    },
  ];

  const faqs = [
    {
      q: 'What is Acquisitions and who is it designed for?',
      a: 'Acquisitions is an enterprise deal execution and corporate M&A platform designed for private equity sponsors, corporate development teams, and venture syndicates. It centralizes target evaluation, deal pipeline stages, due diligence notes, and sensitive valuation metrics inside a unified, bank-grade protected environment.',
    },
    {
      q: 'How does the built-in dark and light mode work?',
      a: 'The platform features first-class dark and light mode support with seamless persistence. Your preference is automatically remembered across browser sessions, and the system defaults to your operating system preference (prefers-color-scheme) for an effortless visual experience in any lighting condition.',
    },
    {
      q: 'What security protections are implemented under the hood?',
      a: 'Acquisitions combines Arcjet bot detection, sliding-window rate limiting per identity tier (Guest: 5 req/min, User: 10 req/min, Admin: 20 req/min), HttpOnly JWT authentication cookies (preventing client-side token extraction), bcrypt password hashing, and strict runtime Zod validation on every API endpoint.',
    },
    {
      q: 'Can administrators manage team access and user roles?',
      a: 'Yes. Administrators have a dedicated User Management control plane where they can view the entire team roster, inspect registration timestamps, modify role authorizations (User vs Admin), and terminate accounts safely without affecting audit history.',
    },
    {
      q: 'How does the platform handle deal valuation and pipeline stages?',
      a: 'Deals move through structured stages: Sourcing, Due Diligence, LOI & Negotiation, and Closing. Each target record captures enterprise valuation, probability of close, sector classification, and designated lead partners with aggregate pipeline analytics computed dynamically.',
    },
    {
      q: 'Is there an API available for custom integrations?',
      a: 'Yes! The backend is a clean, layered Express.js REST API with typed Drizzle ORM models. All endpoints support standardized JSON contracts, health telemetry probes, and rate-limited access tokens for easy integration with your internal data pipelines.',
    },
  ];

  const pricingTiers = [
    {
      name: 'Deal Scout',
      price: '$0',
      period: 'Forever free',
      description:
        'Ideal for independent deal scouts and angel syndicates exploring initial acquisition targets.',
      features: [
        'Up to 10 active pipeline deals',
        'Guest & User role permissions',
        'Arcjet rate shield (10 req/min)',
        'Basic valuation metrics & notes',
        'Standard light & dark mode UI',
      ],
      buttonText: 'Sign Up Free',
      popular: false,
    },
    {
      name: 'Deal Team Pro',
      price: '$89',
      period: 'per seat / month',
      description:
        'Built for active corporate development and boutique advisory teams managing concurrent deals.',
      features: [
        'Unlimited acquisition targets',
        'Full 5-stage pipeline management',
        'Weighted probability calculations',
        'Standard & Admin role governance',
        'High-capacity rate window (20 req/min)',
        'Exportable due diligence digests',
      ],
      buttonText: 'Start Pro Trial',
      popular: true,
    },
    {
      name: 'Fund Enterprise',
      price: '$249',
      period: 'per seat / month',
      description:
        'Designed for private equity firms, family offices, and institutions demanding strict governance.',
      features: [
        'Everything in Pro included',
        'Multi-tenant fund segregation',
        'Dedicated Arcjet bot defense tier',
        'Audit logs & member roster control',
        'Sub-50ms dedicated DB pooling',
        '24/7 Priority SLA & Onboarding',
      ],
      buttonText: 'Deploy Enterprise',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 text-white text-xs font-medium py-2 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
          <span>
            <strong>Acquisitions v1.0 Live:</strong> Enterprise M&A Deal Flow
            with Arcjet Shield & Multi-Tier RBAC.
          </span>
          <Link
            to="/signup"
            className="underline font-semibold hover:text-brand-100 ml-1 hidden sm:inline-flex items-center gap-1"
          >
            Claim your workspace <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white flex items-center justify-center shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                Acquisitions
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-700">
                  OS
                </span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-1">
                Enterprise Deal Flow Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#features"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Features
            </a>
            <a
              href="#demo"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Live Preview
            </a>
            <a
              href="#security"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Arcjet Security
            </a>
            <a
              href="#pricing"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#faq"
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
            >
              FAQ
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {/* Dark / Light Mode Switch */}
            <ThemeToggle />

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 text-white shadow-sm shadow-brand-600/30 transition-all"
              >
                <span>Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white shadow-md shadow-brand-600/30 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-3 shadow-lg">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Features
            </a>
            <a
              href="#demo"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Live Preview
            </a>
            <a
              href="#security"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Arcjet Security
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              FAQ
            </a>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-lg shadow-sm"
                  >
                    Sign Up Free
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2.5 text-sm font-semibold bg-brand-600 text-white rounded-lg shadow-sm"
                >
                  Go to Dashboard ({user?.name})
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 dark:bg-brand-500/15 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-indigo-500/10 dark:bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/80 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 shadow-xs mb-6">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Bank-Grade Mergers & Acquisitions Platform</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <span className="text-slate-500 dark:text-slate-400 font-normal">
              v1.0 Architecture
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            The Modern Operating System for{' '}
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-600 bg-clip-text text-transparent">
              High-Stakes M&A Deal Flow
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Empower deal teams, private equity sponsors, and corporate
            development executives to source targets, model valuations, and
            close acquisitions with military-grade Arcjet security.
          </p>

          {/* Hero CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 text-base font-semibold rounded-xl bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-lg shadow-brand-600/30 hover:shadow-brand-600/40 hover:-translate-y-0.5 transition-all"
            >
              <span>Get Started Free — Sign Up</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 shadow-sm transition-all"
            >
              <Activity className="w-4 h-4 text-brand-500" />
              <span>Explore Interactive Demo</span>
            </a>
          </div>

          {/* Trust reassurance pills */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
              <span>Instant role onboarding</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-500 font-bold" />
              <span>Arcjet sliding-window rate defense</span>
            </div>
          </div>

          {/* Key Metrics Strip */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                $137.5M+
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Active Deal Pipeline
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                100%
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                HttpOnly Cookie Isolation
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">
                &lt; 45ms
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Drizzle Query Latency
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                3-Tier
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                RBAC Security Policy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Sandbox / Live Preview Section */}
      <section
        id="demo"
        className="py-16 bg-slate-100/70 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 mb-3">
              <Activity className="w-3.5 h-3.5" />
              <span>Interactive Live Preview</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Experience the Acquisitions Workspace in Action
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Test drive the deal pipeline filter, explore role permissions, and
              visualize the real-time Arcjet rate shield right from this
              preview.
            </p>
          </div>

          {/* Sandbox Frame */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
            {/* Top Bar of Sandbox */}
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                <span className="ml-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Acquisitions OS Console Preview
                </span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('pipeline')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg transition-all',
                    activeTab === 'pipeline'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  1. Deals Pipeline
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg transition-all',
                    activeTab === 'security'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  2. Arcjet Rate Shield
                </button>
                <button
                  onClick={() => setActiveTab('rbac')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg transition-all',
                    activeTab === 'rbac'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  )}
                >
                  3. RBAC Governance
                </button>
              </div>
            </div>

            {/* Sandbox Content Body */}
            <div className="p-6">
              {/* TAB 1: PIPELINE EXPLORER */}
              {activeTab === 'pipeline' && (
                <div className="space-y-6">
                  {/* Filter & Summary Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="text-xs uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                        Filtered Valuation
                      </div>
                      <div className="text-2xl font-extrabold text-brand-600 dark:text-brand-400">
                        {formatCurrency(totalFilteredValuation)}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {filteredDeals.length} Target{' '}
                        {filteredDeals.length === 1 ? 'Company' : 'Companies'}{' '}
                        in view
                      </div>
                    </div>

                    {/* Filter stage buttons */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mr-1">
                        <Filter className="w-3.5 h-3.5" /> Stage:
                      </span>
                      {[
                        { key: 'all', label: 'All Stages' },
                        { key: 'sourcing', label: 'Sourcing' },
                        { key: 'due_diligence', label: 'Due Diligence' },
                        { key: 'negotiation', label: 'LOI Negotiation' },
                        { key: 'closing', label: 'Closing' },
                      ].map(stageBtn => (
                        <button
                          key={stageBtn.key}
                          onClick={() => setFilterStage(stageBtn.key)}
                          className={cn(
                            'text-xs px-2.5 py-1 rounded-lg font-medium transition-colors',
                            filterStage === stageBtn.key
                              ? 'bg-brand-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                          )}
                        >
                          {stageBtn.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Deal Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDeals.map(deal => {
                      const stageConfig = STAGE_LABELS[deal.stage];
                      return (
                        <div
                          key={deal.id}
                          className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 hover:border-brand-400 dark:hover:border-brand-600 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                                {deal.name}
                              </h4>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {deal.industry}
                              </span>
                            </div>
                            <span
                              className={cn(
                                'text-[10px] font-semibold px-2 py-0.5 rounded-full border',
                                stageConfig.color,
                                stageConfig.darkColor
                              )}
                            >
                              {stageConfig.label}
                            </span>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                Valuation
                              </span>
                              <span className="text-sm font-bold text-slate-900 dark:text-white">
                                {formatCurrency(deal.valuation)}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                                Probability
                              </span>
                              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                                {deal.probability}%
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 text-[11px] text-slate-500 dark:text-slate-400 italic line-clamp-1">
                            "{deal.notes}"
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: ARCJET SECURITY SHIELD SIMULATOR */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" />
                        Arcjet Sliding-Window Rate Limiter
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        Select a Role Tier & Fire Test Requests
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        See how Arcjet enforces sliding windows differently for
                        Guests, Authenticated Users, and Admins.
                      </p>
                    </div>

                    {/* Role selector */}
                    <div className="flex items-center gap-2">
                      {(['guest', 'user', 'admin'] as const).map(role => (
                        <button
                          key={role}
                          onClick={() => {
                            setSimulatedRole(role);
                            setSimulatedRequests(1);
                          }}
                          className={cn(
                            'text-xs px-3 py-1.5 rounded-lg font-semibold uppercase tracking-wider transition-colors',
                            simulatedRole === role
                              ? 'bg-brand-600 text-white'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                          )}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Quota Gauge & Simulator Button */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Active Role Policy
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white capitalize mt-1">
                        {roleLimits[simulatedRole].label}
                      </div>
                      <div className="text-xs text-brand-600 dark:text-brand-400 font-semibold mt-1">
                        Max: {roleLimits[simulatedRole].max} req / 60 seconds
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        Window Consumption
                      </div>
                      <div className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                        {simulatedRequests} / {roleLimits[simulatedRole].max}{' '}
                        Requests
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full mt-2 overflow-hidden">
                        <div
                          className="h-full bg-brand-500 transition-all duration-300"
                          style={{
                            width: `${(simulatedRequests / roleLimits[simulatedRole].max) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-center">
                      <button
                        onClick={handleSimulateRequest}
                        className="w-full py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        Fire Simulated API Request
                      </button>
                      <span className="text-[10px] text-center text-slate-400 dark:text-slate-500 mt-1.5">
                        HttpOnly cookie verified
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: RBAC MATRIX */}
              {activeTab === 'rbac' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Acquisitions enforces zero-trust role boundaries across the
                    entire REST API & UI.
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase font-semibold">
                        <tr>
                          <th className="p-3 rounded-l-lg">
                            Capability / Resource
                          </th>
                          <th className="p-3">Guest (Unauthenticated)</th>
                          <th className="p-3">User (Deal Associate)</th>
                          <th className="p-3 rounded-r-lg">
                            Admin (Partner / Lead)
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                        <tr>
                          <td className="p-3 font-semibold">
                            Public Health & API Status
                          </td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Allowed (5 req/min)
                          </td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Allowed (10 req/min)
                          </td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Allowed (20 req/min)
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold">
                            View Active Deal Pipeline
                          </td>
                          <td className="p-3 text-red-500">
                            ✗ Blocked (401 Redirect)
                          </td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Read-Only & Own Updates
                          </td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Full CRUD Controls
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold">
                            Update Own Profile & Password
                          </td>
                          <td className="p-3 text-red-500">✗ Login Required</td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Permitted
                          </td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Permitted
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold">
                            User Management & Roster Access
                          </td>
                          <td className="p-3 text-red-500">✗ Forbidden</td>
                          <td className="p-3 text-red-500">
                            ✗ Forbidden (RoleGuard)
                          </td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Full Admin Console
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold">
                            Promote User Roles or Delete Members
                          </td>
                          <td className="p-3 text-red-500">✗ Forbidden</td>
                          <td className="p-3 text-red-500">✗ Forbidden</td>
                          <td className="p-3 text-emerald-600 dark:text-emerald-400 font-bold">
                            ✓ Admin Exclusive
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom prompt in demo */}
            <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">
                Ready to launch your own private deal room?
              </span>
              <Link
                to="/signup"
                className="font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Sign up for free now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Features Section */}
      <section
        id="features"
        className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Complete Feature Suite</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Everything Required to Power M&A Transactions
          </h2>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            A purpose-built suite that bridges finance workflows with modern
            engineering rigor and impenetrable perimeter security.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className={cn(
                  'rounded-2xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
                  'bg-white dark:bg-slate-900/90 border-slate-200/90 dark:border-slate-800'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      feat.bg,
                      feat.borderColor,
                      'border'
                    )}
                  >
                    <Icon className={cn('w-6 h-6', feat.color)} />
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {feat.tag}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Security Architecture Deep Dive */}
      <section
        id="security"
        className="py-20 bg-slate-900 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Trust Security Perimeter</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                Designed to Protect Non-Public Material Information
              </h2>

              <p className="text-slate-300 text-base leading-relaxed">
                M&A transactions involve sensitive EBITDA figures, deal terms,
                and customer data. Acquisitions enforces strict defense-in-depth
                across the entire application stack:
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      HttpOnly Cookie Tokens
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      JWT credentials are never exposed in JavaScript or
                      localStorage, immunizing your session against cross-site
                      scripting (XSS) exfiltration.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Arcjet Sliding-Window Rate Defense
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Prevents scraping or brute-force enumeration with
                      role-aware quota caps: 5 req/min for Guests, 10 for Users,
                      and 20 for Admins.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Full Zod Schema Validation
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Every payload undergoes strict runtime validation at API
                      boundary layers before touching ORM queries or database
                      transactions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Architecture Card */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl bg-slate-800/90 border border-slate-700 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                  <span className="text-xs font-mono text-brand-400">
                    arcjet.security.telemetry
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700">
                    Active & Enforced
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-400 text-[11px] mb-1">
                      // Session Token Dispatch
                    </div>
                    <div className="text-emerald-400 font-semibold">
                      Set-Cookie: token=eyJhbGciOi...
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5">
                      HttpOnly; Secure; SameSite=Strict; Max-Age=86400
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-400 text-[11px] mb-1">
                      // Arcjet Shield Protection
                    </div>
                    <div className="text-brand-300">
                      shield({`{ mode: 'LIVE' }`})
                    </div>
                    <div className="text-brand-300">
                      detectBot({`{ mode: 'LIVE', allow: [] }`})
                    </div>
                    <div className="text-brand-300">
                      slidingWindow({`{ interval: '1m', max: roleLimit }`})
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                    <div className="text-slate-400 text-[11px] mb-1">
                      // Password Hashing
                    </div>
                    <div className="text-amber-300">
                      bcrypt.hash(password, 10)
                    </div>
                    <div className="text-slate-500 text-[10px] mt-0.5">
                      Zero plaintext password persistence
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to="/signup"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-brand-400 hover:text-brand-300"
                  >
                    Create a protected account today{' '}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison: Spreadsheets vs Acquisitions */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            <span>Why Upgrade Your Deal Desk</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Traditional Spreadsheets vs. Acquisitions OS
          </h2>
          <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
            Stop relying on fragile offline files and fragmented email
            attachments for multi-million-dollar transactions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Legacy Spreadsheets */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-950/60 shadow-xs space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
                ✕
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Spreadsheets & Generic CRMs
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>
                  Confidential valuation models accidentally leaked via email
                  links
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>
                  Zero rate-limiting or protection against malicious bots &
                  scraping
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>
                  No granular role enforcement; anyone with the file can edit
                  all data
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">✕</span>
                <span>
                  Desynchronized versions between deal leads, analysts, and
                  partners
                </span>
              </li>
            </ul>
          </div>

          {/* Acquisitions Platform */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-900/60 shadow-md ring-1 ring-emerald-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                ✓
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Acquisitions Platform v1.0
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓
                </span>
                <span>
                  Strict HttpOnly cookie authorization with zero client
                  credential exposure
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓
                </span>
                <span>
                  Active Arcjet Shield & sliding window rate defense on every
                  API call
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓
                </span>
                <span>
                  Granular RBAC: Guests, Associates, and Admins have explicit
                  privilege boundaries
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  ✓
                </span>
                <span>
                  Single source of truth with real-time pipeline valuation and
                  velocity metrics
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Pricing / Tiers */}
      <section
        id="pricing"
        className="py-20 bg-slate-100/70 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800 mb-3">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Transparent Plans</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Invest in Speed, Governance & Security
            </h2>
            <p className="mt-2 text-base text-slate-600 dark:text-slate-400">
              Whether you are an individual deal hunter or a multi-fund private
              equity sponsor, we have you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={cn(
                  'rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-200 bg-white dark:bg-slate-900 border',
                  tier.popular
                    ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-xl relative'
                    : 'border-slate-200 dark:border-slate-800 shadow-sm'
                )}
              >
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-sm">
                    Most Popular
                  </div>
                )}

                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {tier.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 min-h-[32px]">
                    {tier.description}
                  </p>

                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                      {tier.price}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                      {tier.period}
                    </span>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                    {tier.features.map((feat, fidx) => (
                      <div
                        key={fidx}
                        className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Link
                    to="/signup"
                    className={cn(
                      'w-full py-3 px-4 rounded-xl text-center text-sm font-semibold block transition-all shadow-sm',
                      tier.popular
                        ? 'bg-brand-600 hover:bg-brand-500 active:bg-brand-700 text-white shadow-brand-600/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                    )}
                  >
                    {tier.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive FAQ Section */}
      <section
        id="faq"
        className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mb-3">
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Learn more about our architecture, security policies, and onboarding
            process.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpenIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      'w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0',
                      isOpen && 'rotate-180 text-brand-600 dark:text-brand-400'
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* High-Impact Bottom Sign Up CTA Banner */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-800 p-8 sm:p-14 text-white text-center shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 blur-3xl rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xs text-white border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Get Started in Under 60 Seconds</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Ready to Accelerate Your Deal Flow with Bank-Grade Security?
            </h2>

            <p className="text-sm sm:text-base text-brand-100 leading-relaxed max-w-2xl mx-auto">
              Create your account today, explore the deals pipeline, and
              experience peace of mind with Arcjet zero-trust protections.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold rounded-xl bg-white text-brand-700 hover:bg-brand-50 active:bg-brand-100 shadow-lg shadow-black/20 hover:-translate-y-0.5 transition-all"
              >
                <span>Create Free Account — Sign Up</span>
                <ArrowRight className="w-4 h-4 text-brand-700" />
              </Link>

              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 text-sm font-semibold rounded-xl bg-brand-800/50 hover:bg-brand-800/80 border border-white/20 text-white transition-colors"
              >
                Sign In to Existing Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand Col */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
                  Acquisitions OS
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Enterprise Mergers & Acquisitions deal flow system with Arcjet
                Bot Shield, JWT httpOnly cookies, and role-governed user
                administration.
              </p>
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>All Systems Operational (99.99%)</span>
              </div>
            </div>

            {/* Product Col */}
            <div className="text-xs space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Platform
              </h4>
              <a
                href="#features"
                className="block text-slate-500 dark:text-slate-400 hover:text-brand-600"
              >
                Pipeline Management
              </a>
              <a
                href="#security"
                className="block text-slate-500 dark:text-slate-400 hover:text-brand-600"
              >
                Arcjet Rate Defense
              </a>
              <a
                href="#demo"
                className="block text-slate-500 dark:text-slate-400 hover:text-brand-600"
              >
                Interactive Sandbox
              </a>
              <Link
                to="/deals"
                className="block text-slate-500 dark:text-slate-400 hover:text-brand-600"
              >
                Deal Workspace
              </Link>
            </div>

            {/* Architecture Col */}
            <div className="text-xs space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Architecture
              </h4>
              <span className="block text-slate-500 dark:text-slate-400">
                Express.js (ESM)
              </span>
              <span className="block text-slate-500 dark:text-slate-400">
                Drizzle ORM & Postgres
              </span>
              <span className="block text-slate-500 dark:text-slate-400">
                Zod Contract Validation
              </span>
              <span className="block text-slate-500 dark:text-slate-400">
                Docker Dev & Prod Containers
              </span>
            </div>

            {/* Auth Col */}
            <div className="text-xs space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                Get Started
              </h4>
              <Link
                to="/signup"
                className="block text-brand-600 dark:text-brand-400 font-semibold hover:underline"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="block text-slate-500 dark:text-slate-400 hover:text-brand-600"
              >
                Sign In
              </Link>
              <div className="pt-2">
                <ThemeToggle showLabel />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div>
              &copy; {new Date().getFullYear()} Acquisitions Inc. All rights
              reserved. Built with bank-grade security.
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="hover:text-slate-700 dark:hover:text-slate-300"
              >
                Privacy Policy
              </Link>
              <Link
                to="/login"
                className="hover:text-slate-700 dark:hover:text-slate-300"
              >
                Terms of Service
              </Link>
              <Link
                to="/security-info"
                className="hover:text-slate-700 dark:hover:text-slate-300"
              >
                Security Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
