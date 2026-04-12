import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity, Calendar, MessageCircle, Stethoscope, Menu, X,
  LogIn, LayoutDashboard, LogOut, FileText, MapPin, Brain, Sun, Moon, LifeBuoy
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";

const patientNavItems = [
  { to: "/", label: "Home", icon: Activity },
  { to: "/symptom-checker", label: "Symptom Checker", icon: Brain },
  { to: "/doctors", label: "Doctors", icon: Stethoscope },
  { to: "/chatbot", label: "AI Assistant", icon: MessageCircle },
  { to: "/report-analyzer", label: "Report Analyzer", icon: FileText },
  { to: "/nearby-doctors", label: "Nearby Hospitals", icon: MapPin },
  { to: "/support", label: "Support", icon: LifeBuoy },
];

export default function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user, logout, isDoctor, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Track scroll for glass effect transition (must be before any conditional returns)
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show navbar on dashboard or emergency mode 
  if (location.pathname.startsWith('/dashboard') || location.pathname === '/emergency-mode') return null;

  const dashboardPath = user?.role === 'admin' ? '/dashboard/admin'
    : user?.role === 'doctor' ? '/dashboard/doctor'
    : '/dashboard/patient';

  // Admin and Doctor should only see Dashboard — hide patient-only pages
  const showPatientNav = !isAuthenticated || (!isDoctor && !isAdmin);
  const navItems = showPatientNav ? patientNavItems : [];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 transition-all duration-500 glass-navbar ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        {/* Gradient bottom line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(195, 90%, 38%, 0.2), hsl(262, 70%, 55%, 0.15), transparent)",
          }}
        />

        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <Link
            to={isDoctor || isAdmin ? dashboardPath : "/"}
            className="group flex items-center gap-2.5"
          >
            <div className="relative">
              <div className="gradient-primary rounded-xl p-2 transition-all duration-300 group-hover:shadow-lg group-hover:scale-105">
                <Activity className="h-5 w-5 text-primary-foreground" />
              </div>
              {/* Subtle glow ring on hover */}
              <div className="absolute inset-0 rounded-xl gradient-primary opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
            </div>
            <span className="font-heading text-xl font-bold text-foreground tracking-tight">
              Medi<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop nav items */}
          <div className="hidden items-center gap-0.5 md:flex">
            {navItems.map(({ to, label, icon: Icon }) => {
              const active = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-300 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{label}</span>
                  {active && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 rounded-xl bg-primary/8 border border-primary/15"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  {/* Hover glow */}
                  {!active && (
                    <div className="absolute inset-0 rounded-xl bg-foreground/0 hover:bg-foreground/[0.03] transition-colors duration-300" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Theme toggle + Auth buttons */}
          <div className="hidden items-center gap-2 md:flex">
            {/* Dark/Light mode toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-xl glass border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-2 text-muted-foreground hover:text-destructive rounded-xl transition-all duration-300"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 rounded-xl text-muted-foreground hover:text-foreground transition-all duration-300"
                  >
                    <LogIn className="h-4 w-4" /> Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    size="sm"
                    className="gradient-primary border-0 text-primary-foreground rounded-xl btn-premium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-xl p-2.5 text-muted-foreground hover:text-foreground hover:bg-foreground/5 md:hidden transition-all duration-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu — full screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative mx-4 mt-20 rounded-2xl glass-card p-4 shadow-elevated"
            >
              <div className="space-y-1">
                {navItems.map(({ to, label, icon: Icon }, i) => (
                  <motion.div
                    key={to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                        location.pathname === to
                          ? "text-primary bg-primary/10 border border-primary/15"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      <Icon className="h-4.5 w-4.5" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="border-t border-border/50 mt-3 pt-3 space-y-1">
                {/* Theme toggle in mobile */}
                <button
                  onClick={toggleTheme}
                  className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </button>
                {isAuthenticated ? (
                  <>
                    <Link
                      to={dashboardPath}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <LogIn className="h-4 w-4" /> Login
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3.5 rounded-xl px-4 py-3.5 text-sm font-medium gradient-primary text-primary-foreground"
                    >
                      <LogIn className="h-4 w-4" /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
