import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, Activity, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Autoclean credentials on arriving at login page
  useEffect(() => {
    logout();
  }, [logout]);


  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toast({ title: '✅ ' + result.message });
      const user = JSON.parse(localStorage.getItem('mediai_user') || '{}');
      const dashboardPaths: Record<string, string> = {
        patient: '/dashboard/patient',
        doctor: '/dashboard/doctor',
        admin: '/dashboard/admin',
      };
      navigate(dashboardPaths[user.role] || from, { replace: true });
    } else {
      toast({ title: result.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="gradient-primary rounded-xl p-2.5">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">
              Medi<span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to continue to MediAI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 glass-card rounded-2xl p-7">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Email</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="email"
                className="h-12 pl-11 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 focus:ring-primary/20 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type={showPassword ? 'text' : 'password'}
                className="h-12 pl-11 pr-11 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 focus:ring-primary/20 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 gradient-primary border-0 text-primary-foreground text-base btn-premium rounded-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Create Account
            </Link>
          </div>
        </form>

        {/* Demo credentials */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 glass-card rounded-2xl p-5"
        >
          <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Demo Credentials
          </p>
          <div className="space-y-2">
            {[
              { role: 'Patient', email: 'rahul@example.com', pass: 'Patient@123', color: 'text-emerald-500 bg-emerald-500/10' },
              { role: 'Doctor', email: 'rajesh.sharma@mediai.com', pass: 'Doctor@123', color: 'text-blue-500 bg-blue-500/10' },
              { role: 'Admin', email: 'admin@mediai.com', pass: 'Admin@123', color: 'text-amber-500 bg-amber-500/10' },
            ].map((cred) => (
              <button
                key={cred.role}
                type="button"
                onClick={() => { setEmail(cred.email); setPassword(cred.pass); }}
                className="group flex w-full items-center justify-between rounded-xl bg-muted/30 hover:bg-muted/50 px-4 py-3 text-left transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${cred.color}`}>
                    {cred.role.charAt(0)}
                  </span>
                  <span className="text-sm font-medium text-foreground">{cred.role}</span>
                </div>
                <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{cred.email}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
