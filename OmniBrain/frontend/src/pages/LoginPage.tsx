import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain, Lock, Mail, Loader2, Eye, EyeOff } from "lucide-react";
import { authApi, getApiErrorMessage } from "../services/api";
import { useAuthStore } from "../store/authStore";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data: tokens } = await authApi.login({ email: email.trim().toLowerCase(), password });
      localStorage.setItem("access_token", tokens.access_token);
      localStorage.setItem("refresh_token", tokens.refresh_token);
      const { data: user } = await authApi.me();
      setUser(user);
      navigate("/dashboard");
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid email or password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background px-4 py-12 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-primary/15 blur-3xl rounded-full" />
        <div className="absolute -bottom-56 right-1/3 w-[700px] h-[700px] bg-secondary/15 blur-3xl rounded-full" />
      </div>
      <div className="relative w-full max-w-md fade-in">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6 shadow-glow">
            <Brain className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-50 to-slate-300 bg-clip-text text-transparent">
            OmniBrain
          </h1>
          <p className="text-slate-400 mt-3 text-lg">
            Enterprise Agentic Multi-Modal RAG Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-error/10 border border-error/30 text-error px-4 py-3 rounded-xl text-sm">
              <Lock className="w-4 h-4" />
              {error}
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12 pr-12"
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-surface transition-all duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In to OmniBrain"
            )}
          </button>
          <div className="pt-4 border-t border-border">
            <p className="text-center text-sm text-slate-400">
              New to OmniBrain?{" "}
              <Link to="/register" className="text-primary font-semibold hover:underline transition-colors">
                Create an Account
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
