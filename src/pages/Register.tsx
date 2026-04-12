import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone, Activity, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Register() {
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [fee, setFee] = useState('');
  const [qualification, setQualification] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const specializations = [
    'General Physician', 'Dermatologist', 'Cardiologist', 'Neurologist',
    'Orthopedic', 'Gastroenterologist', 'Endocrinologist', 'Pulmonologist',
    'Hepatologist', 'Allergist', 'Urologist', 'Proctologist',
    'Infectious Disease Specialist', 'Pediatrician', 'Gynecologist',
    'Psychiatrist', 'Ophthalmologist', 'ENT Specialist', 'Dentist',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast({ title: 'Please fill all required fields', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    if (role === 'doctor' && !specialization) {
      toast({ title: 'Please select a specialization', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const formData: any = { name, email, password, role, phone, gender };
    if (role === 'doctor') {
      formData.specialization = specialization;
      formData.experience = parseInt(experience) || 0;
      formData.fee = parseInt(fee) || 500;
      formData.qualification = qualification;
    }

    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      toast({ title: '✅ ' + result.message });
      if (role === 'doctor') {
        navigate('/login');
      } else {
        navigate('/dashboard/patient');
      }
    } else {
      toast({ title: result.message, variant: 'destructive' });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8 relative">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
            <div className="gradient-primary rounded-xl p-2.5">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">
              Medi<span className="gradient-text">AI</span>
            </span>
          </Link>
          <h1 className="font-heading text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-2 text-muted-foreground">Join MediAI today — it's free</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 glass-card rounded-2xl p-7">
          {/* Role selector */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Register as</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('patient')}
                className={`group flex items-center justify-center gap-2.5 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                  role === 'patient'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border/60 bg-background/50 text-muted-foreground hover:border-muted-foreground/30'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Patient</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('doctor')}
                className={`group flex items-center justify-center gap-2.5 rounded-xl border-2 px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                  role === 'doctor'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-border/60 bg-background/50 text-muted-foreground hover:border-muted-foreground/30'
                }`}
              >
                <Stethoscope className="h-4 w-4" />
                <span>Doctor</span>
              </button>
            </div>
          </div>

          {/* Common fields */}
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Full Name *</label>
            <div className="relative group">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input className="h-12 pl-11 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 transition-all" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Email *</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input type="email" className="h-12 pl-11 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 transition-all" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">Password *</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input type="password" className="h-12 pl-11 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 transition-all" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Phone</label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input className="h-12 pl-11 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 transition-all" placeholder="9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Gender</label>
              <select
                className="flex h-12 w-full items-center rounded-xl border border-border/60 bg-background/50 px-3.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Doctor-specific fields */}
          {role === 'doctor' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.4 }}
              className="space-y-4 border-t border-border/40 pt-4"
            >
              <p className="text-sm font-semibold gradient-text inline-block">Doctor Details</p>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Specialization *</label>
                <select
                  className="flex h-12 w-full items-center rounded-xl border border-border/60 bg-background/50 px-3.5 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                >
                  <option value="">Select specialization</option>
                  {specializations.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Experience (years)</label>
                  <Input type="number" className="h-12 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 transition-all" placeholder="5" value={experience} onChange={(e) => setExperience(e.target.value)} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Fee (₹)</label>
                  <Input type="number" className="h-12 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 transition-all" placeholder="500" value={fee} onChange={(e) => setFee(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Qualification</label>
                <Input className="h-12 rounded-xl border-border/60 bg-background/50 focus:border-primary/40 transition-all" placeholder="MBBS, MD" value={qualification} onChange={(e) => setQualification(e.target.value)} />
              </div>
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 gradient-primary border-0 text-primary-foreground text-base btn-premium rounded-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating Account...
              </span>
            ) : (
              <>
                <UserPlus className="mr-2 h-4 w-4" /> Create Account
              </>
            )}
          </Button>

          {role === 'doctor' && (
            <p className="text-xs text-center text-muted-foreground">
              Doctor accounts require admin approval before you can login.
            </p>
          )}

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
