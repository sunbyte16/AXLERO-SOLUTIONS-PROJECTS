import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  Eye,
  EyeOff,
  Github,
  Lock,
  Mail,
} from 'lucide-react';
import { useAuth } from '../../lib/AuthContext';

function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: React.ReactNode;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden text-[#f5f7fb]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(1000px 560px at 10% 0%, rgba(63,111,255,0.25), transparent 60%), radial-gradient(900px 500px at 90% 10%, rgba(197,160,89,0.2), transparent 55%), linear-gradient(180deg, #07111f 0%, #050913 60%, #03060c 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage:
            'radial-gradient(ellipse at top, rgba(0,0,0,0.9), transparent 70%)',
        }}
      />

      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#c5a059] via-[#f0d8a1] to-[#3f6fff] shadow-[0_0_24px_rgba(197,160,89,0.35)]">
            <Activity className="h-5 w-5 text-[#07111f]" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold tracking-wide">SwarmRL</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#8da2c0]">
              Multi-Agent DRL
            </span>
          </div>
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#b8c6df] transition hover:border-white/20 hover:text-[#f5f7fb]"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Home
        </Link>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-88px)] max-w-7xl items-center px-6 py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-gradient-to-br from-[#3f6fff]/20 via-[#c5a059]/15 to-transparent blur-3xl" />
              <div className="relative rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-7 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                <p className="text-xs uppercase tracking-[0.25em] text-[#c5a059]">
                  Access
                </p>
                <h2 className="mt-3 text-4xl font-semibold tracking-tight">
                  Command the swarm from any browser.
                </h2>
                <p className="mt-4 text-[#b8c6df]">
                  Secure JWT sessions, SQLite-backed user accounts, and a
                  dedicated control plane tuned for researchers and operators.
                </p>
                <ul className="mt-8 space-y-4 text-sm text-[#e6edf9]">
                  {[
                    'End-to-end encrypted httpOnly sessions',
                    'Role-aware API gateways for training & simulation',
                    'Per-account checkpoints & snapshots',
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c5a059]/15 text-[#c5a059]">
                        <Lock className="h-3.5 w-3.5" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/25 p-4 text-xs text-[#8da2c0]">
                  <Github className="h-4 w-4 text-[#c5a059]" />
                  SwarmRL is built for research. Export, inspect, and modify
                  every layer of the stack.
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-7 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-9">
              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {title}
                </h1>
                <p className="mt-2 text-[#b8c6df]">{subtitle}</p>
              </div>
              {children}
              <div className="mt-8 text-center text-sm text-[#8da2c0]">
                {footer}
              </div>
            </div>
            <p className="mt-6 text-center text-xs text-[#6f839f]">
              Created By{' '}
              <span className="font-semibold tracking-wide text-[#c5a059]">
                𝕊𝕦𝕟𝕚𝕝 𝕊𝕙𝕒𝕣𝕞𝕒
              </span>{' '}
              with <span className="text-[#f87171]">❤</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function Input({
  id,
  label,
  type,
  icon,
  trailing,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}) {
  return (
    <label htmlFor={id} className="block">
      <span className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#8da2c0]">
        {label}
      </span>
      <div className="group relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#8da2c0] transition group-focus-within:text-[#c5a059]">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          {...rest}
          className="block w-full rounded-2xl border border-white/10 bg-black/30 py-3.5 pl-11 pr-12 text-sm text-[#f5f7fb] placeholder:text-[#6f839f] outline-none transition focus:border-[#c5a059]/40 focus:bg-black/40 focus:ring-2 focus:ring-[#c5a059]/20"
        />
        {trailing ? (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#8da2c0]">
            {trailing}
          </span>
        ) : null}
      </div>
    </label>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation() as any;
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Sign in failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle={
        <>
          Sign in to your SwarmRL workspace to continue training and
          commanding your drones.
        </>
      }
      footer={
        <>
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-[#c5a059] underline-offset-4 hover:underline"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          required
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password"
          label="Password"
          type={showPw ? 'text' : 'password'}
          autoComplete="current-password"
          required
          icon={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          trailing={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="rounded-lg p-1.5 text-[#8da2c0] transition hover:bg-white/5 hover:text-[#f5f7fb]"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
        />

        <div className="flex items-center justify-between text-xs text-[#8da2c0]">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-black/30 accent-[#c5a059]"
              defaultChecked
            />
            Remember me (7 days)
          </label>
          <a className="text-[#c5a059] hover:underline" href="#">
            Forgot password?
          </a>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#f87171]/30 bg-[#f87171]/10 px-4 py-3 text-sm text-[#fecaca]">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#c5a059] to-[#a47e3b] px-5 py-3.5 text-sm font-semibold text-[#0b0f17] shadow-[0_20px_60px_rgba(197,160,89,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Signing in…' : 'Sign In to Dashboard'}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle={
        <>
          Start training your first swarm in minutes. No credit card required.
        </>
      }
      footer={
        <>
          Already registered?{' '}
          <Link
            to="/login"
            className="font-medium text-[#c5a059] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        <Input
          id="name"
          label="Full Name"
          type="text"
          autoComplete="name"
          required
          icon={<Github className="h-4 w-4" />}
          placeholder="Alex Researcher"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          id="email-reg"
          label="Email"
          type="email"
          autoComplete="email"
          required
          icon={<Mail className="h-4 w-4" />}
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          id="password-reg"
          label="Password"
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          required
          icon={<Lock className="h-4 w-4" />}
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          trailing={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              className="rounded-lg p-1.5 text-[#8da2c0] transition hover:bg-white/5 hover:text-[#f5f7fb]"
              aria-label={showPw ? 'Hide password' : 'Show password'}
            >
              {showPw ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
        />
        <Input
          id="confirm"
          label="Confirm Password"
          type={showPw ? 'text' : 'password'}
          autoComplete="new-password"
          required
          icon={<Lock className="h-4 w-4" />}
          placeholder="Re-enter password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <label className="flex items-start gap-2 text-xs text-[#8da2c0]">
          <input
            type="checkbox"
            required
            className="mt-0.5 h-4 w-4 rounded border-white/20 bg-black/30 accent-[#c5a059]"
          />
          <span>
            I agree to the{' '}
            <a className="text-[#c5a059] hover:underline" href="#">
              Terms
            </a>{' '}
            and{' '}
            <a className="text-[#c5a059] hover:underline" href="#">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        {error ? (
          <div className="rounded-2xl border border-[#f87171]/30 bg-[#f87171]/10 px-4 py-3 text-sm text-[#fecaca]">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-[#c5a059] to-[#a47e3b] px-5 py-3.5 text-sm font-semibold text-[#0b0f17] shadow-[0_20px_60px_rgba(197,160,89,0.35)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Creating account…' : 'Create Account & Launch'}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </button>
      </form>
    </AuthShell>
  );
}
