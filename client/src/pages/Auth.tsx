import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { 
  Link2, 
  ArrowRight, 
  Lock, 
  Mail, 
  User, 
  School, 
  GraduationCap, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle2, 
  Loader2, 
  ArrowLeft,
  ShieldCheck,
  Zap
} from "lucide-react";

interface AuthProps {
  initialMode?: "signin" | "signup";
}

export default function Auth({ initialMode = "signin" }: AuthProps) {
  const [location, setLocation] = useLocation();
  const [mode, setMode] = useState<"signin" | "signup">(
    location === "/signup" ? "signup" : initialMode
  );

  useEffect(() => {
    if (location === "/signup") {
      setMode("signup");
    } else if (location === "/login" || location === "/auth") {
      setMode("signin");
    }
  }, [location]);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [institution, setInstitution] = useState("Northbridge University");
  const [department, setDepartment] = useState("Computer Science");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const utils = trpc.useUtils();

  // Mutations
  const signupMutation = trpc.auth.signup.useMutation({
    onSuccess: (data) => {
      toast.success(`Welcome to SkillLink, ${data.user.name || "Student"}!`, {
        description: "Your account and campus profile are ready.",
      });
      utils.auth.me.setData(undefined, data.user as any);
      utils.auth.me.invalidate();
      setLocation("/");
    },
    onError: (err) => {
      setErrorMessage(err.message || "Failed to create account. Please try again.");
      toast.error(err.message || "Sign up failed");
    },
  });

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      toast.success(`Welcome back, ${data.user.name || "Student"}!`, {
        description: "Successfully signed in to SkillLink.",
      });
      utils.auth.me.setData(undefined, data.user as any);
      utils.auth.me.invalidate();
      setLocation("/");
    },
    onError: (err) => {
      setErrorMessage(err.message || "Invalid email or password.");
      toast.error(err.message || "Sign in failed");
    },
  });

  const isSubmitting = signupMutation.isPending || loginMutation.isPending;

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email || !password) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setErrorMessage("Please enter your full name.");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters long.");
        return;
      }
      signupMutation.mutate({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        institution: institution.trim(),
        department: department.trim(),
      });
    } else {
      loginMutation.mutate({
        email: email.trim().toLowerCase(),
        password,
      });
    }
  };

  // Quick Demo account prefill
  const handleQuickDemo = (demoType: "ananya" | "alex") => {
    setErrorMessage(null);
    if (demoType === "ananya") {
      setName("Ananya Kapoor");
      setEmail("ananya.k@northbridge.edu");
      setPassword("skilllink2026");
      setInstitution("Northbridge University");
      setDepartment("Computer Science");
    } else {
      setName("Alex Rivera");
      setEmail("alex.r@northbridge.edu");
      setPassword("skilllink2026");
      setInstitution("Northbridge University");
      setDepartment("UI/UX & Product Design");
    }
    toast.info("Demo credentials loaded", {
      description: "Click below to submit and authenticate.",
    });
  };

  // Password strength helper
  const getPasswordStrength = () => {
    if (!password) return { label: "Empty", score: 0, color: "bg-neutral-200" };
    if (password.length < 6) return { label: "Too short", score: 1, color: "bg-red-400" };
    if (password.length < 8) return { label: "Fair", score: 2, color: "bg-amber-400" };
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNum = /\d/.test(password);
    if (hasSpecial && hasNum) return { label: "Strong", score: 4, color: "bg-[#779643]" };
    return { label: "Good", score: 3, color: "bg-[#a5c36d]" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-[#f6f3ec] text-[#17221e] flex flex-col justify-between selection:bg-[#c6f36b] selection:text-[#17221e]">
      {/* Top Navbar */}
      <header className="border-b border-[#e2dec9] bg-[#fbf9f4]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#c6f36b] text-[#17221e] shadow-[0_0_0_4px_rgba(198,243,107,.18)] transition-transform group-hover:scale-105">
              <Link2 size={19} strokeWidth={3} />
            </div>
            <div className="flex flex-col">
              <span className="display-font text-lg font-bold tracking-tight text-[#17221e]">SkillLink</span>
              <span className="text-[10px] font-medium text-[#718078] tracking-widest uppercase">Campus Commons</span>
            </div>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#536159] hover:text-[#17221e] bg-[#eae7dc] hover:bg-[#dedbd0] px-3.5 py-1.5 rounded-full transition-all"
          >
            <ArrowLeft size={13} />
            <span>Back to explore</span>
          </Link>
        </div>
      </header>

      {/* Main Auth Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full grid lg:grid-cols-[1.05fr_1fr] rounded-3xl border border-[#d9ddd1] bg-[#fffdf8] shadow-[0_20px_60px_rgba(23,34,30,0.06)] overflow-hidden">
          
          {/* Left Hero Story Panel */}
          <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#17221e] via-[#1f2d28] to-[#17221e] text-[#f6f3ec] relative overflow-hidden">
            {/* Soft decorative ambient glow */}
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#c6f36b]/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#bfd7ee]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#f6f3ec]/10 border border-[#f6f3ec]/15 px-3 py-1 text-xs font-medium text-[#c6f36b]">
                <Sparkles size={13} />
                <span>Peer-to-Peer College Exchange</span>
              </div>

              <h1 className="display-font mt-6 text-3xl xl:text-4xl font-semibold tracking-[-0.04em] leading-[1.15]">
                Trade what you know for what you want to learn.
              </h1>
              <p className="mt-4 text-sm leading-6 text-[#b6c4b8]">
                Say goodbye to cold emails and unorganized group chats. SkillLink pairs college peers based on mutual synergy, verified follow-through, and structured collaboration.
              </p>

              {/* Reciprocity Showcase Strip */}
              <div className="mt-8 rounded-2xl bg-white/[0.06] border border-white/10 p-5 backdrop-blur-sm">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#c6f36b]">Live Mutual Exchange Fit</p>
                <div className="mt-3 flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#c6f36b]" />
                    <span>Python & FastAPI</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#c6f36b] px-2 py-0.5 rounded-full bg-[#c6f36b]/15 text-[11px]">
                    <span>94% synergy</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#bfd7ee]">
                    <span>UI/UX & Design</span>
                    <span className="h-2 w-2 rounded-full bg-[#bfd7ee]" />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-[#8ea492]">
                  <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-[#c6f36b]" /> Verified campus trust</span>
                  <span>Northbridge University</span>
                </div>
              </div>
            </div>

            {/* Bottom Testimonial Quote */}
            <div className="mt-8 relative z-10 pt-6 border-t border-white/10">
              <p className="text-xs italic text-[#cad6cb] leading-relaxed">
                “I helped Maya prepare her pitch slides, and in exchange she taught me Git branching. It’s the easiest way to find serious teammates on campus.”
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-[#c6f36b] text-[#17221e] flex items-center justify-center font-bold text-xs">
                  AR
                </div>
                <div>
                  <p className="text-xs font-bold text-[#f6f3ec]">Arjun Rao</p>
                  <p className="text-[10px] text-[#8ea492]">Computer Engineering · 3rd Year</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Interactive Auth Form Panel */}
          <div className="p-6 sm:p-10 flex flex-col justify-center">
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-[#eeece5] rounded-2xl mb-8">
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === "signin"
                    ? "bg-[#fffdf8] text-[#17221e] shadow-sm"
                    : "text-[#65746b] hover:text-[#17221e]"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setErrorMessage(null);
                }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  mode === "signup"
                    ? "bg-[#fffdf8] text-[#17221e] shadow-sm"
                    : "text-[#65746b] hover:text-[#17221e]"
                }`}
              >
                Create Account
              </button>
            </div>

            <div>
              <h2 className="display-font text-2xl font-bold tracking-tight text-[#17221e]">
                {mode === "signin" ? "Welcome back to SkillLink" : "Join your campus exchange"}
              </h2>
              <p className="mt-1.5 text-xs text-[#718078]">
                {mode === "signin"
                  ? "Enter your credentials to access your requests, matches, and exchanges."
                  : "Create an account to start sharing your skills and learning from peers."}
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <span className="font-bold">Error:</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#536159] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-3 text-[#718078]" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ananya Kapoor"
                      className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-[#d1d8cc] bg-white focus:outline-none focus:ring-2 focus:ring-[#779643] transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#536159] mb-1.5">
                  Campus Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-3 text-[#718078]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@northbridge.edu"
                    className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-[#d1d8cc] bg-white focus:outline-none focus:ring-2 focus:ring-[#779643] transition-all"
                  />
                </div>
              </div>

              {mode === "signup" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#536159] mb-1.5">
                      Institution
                    </label>
                    <div className="relative">
                      <School size={15} className="absolute left-3.5 top-3 text-[#718078]" />
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="College name"
                        className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-[#d1d8cc] bg-white focus:outline-none focus:ring-2 focus:ring-[#779643] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#536159] mb-1.5">
                      Major / Department
                    </label>
                    <div className="relative">
                      <GraduationCap size={15} className="absolute left-3.5 top-3 text-[#718078]" />
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Computer Science"
                        className="w-full h-10 pl-10 pr-4 text-xs rounded-xl border border-[#d1d8cc] bg-white focus:outline-none focus:ring-2 focus:ring-[#779643] transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#536159]">
                    Password
                  </label>
                  {mode === "signup" && password && (
                    <span className="text-[10px] font-medium text-[#718078]">
                      Strength: <strong className="text-[#17221e]">{strength.label}</strong>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-3 text-[#718078]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "signup" ? "Create a secure password (min 6 chars)" : "Enter your password"}
                    className="w-full h-10 pl-10 pr-10 text-xs rounded-xl border border-[#d1d8cc] bg-white focus:outline-none focus:ring-2 focus:ring-[#779643] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#718078] hover:text-[#17221e] focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>

                {mode === "signup" && password && (
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          step <= strength.score ? strength.color : "bg-neutral-200"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 mt-2 rounded-xl bg-[#17221e] text-[#f6f3ec] hover:bg-[#283830] font-semibold text-xs transition-all shadow-[0_8px_20px_rgba(23,34,30,0.12)] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>{mode === "signup" ? "Creating profile & connecting..." : "Signing in..."}</span>
                  </>
                ) : (
                  <>
                    <span>{mode === "signup" ? "Create Student Account" : "Sign In to Dashboard"}</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Pre-fills for hassle-free testing */}
            <div className="mt-6 pt-5 border-t border-[#e8ebe0]">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#718078] flex items-center gap-1">
                  <Zap size={11} className="text-[#779643]" /> Quick 1-Click Demo Fill:
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo("ananya")}
                  className="flex-1 py-1.5 px-2.5 rounded-lg border border-[#d5dcce] bg-[#f7f5ee] hover:bg-[#ece9df] text-[11px] font-medium text-[#415147] transition-all text-left flex items-center justify-between"
                >
                  <span>Ananya (CS Senior)</span>
                  <span className="text-[10px] text-[#779643] font-bold">Auto-fill</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo("alex")}
                  className="flex-1 py-1.5 px-2.5 rounded-lg border border-[#d5dcce] bg-[#f7f5ee] hover:bg-[#ece9df] text-[11px] font-medium text-[#415147] transition-all text-left flex items-center justify-between"
                >
                  <span>Alex (UI Designer)</span>
                  <span className="text-[10px] text-[#779643] font-bold">Auto-fill</span>
                </button>
              </div>
            </div>

            <p className="mt-6 text-center text-xs text-[#718078]">
              {mode === "signin" ? (
                <>
                  Don't have a campus profile yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#536f32] hover:underline"
                  >
                    Sign up for free
                  </button>
                </>
              ) : (
                <>
                  Already registered?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setErrorMessage(null);
                    }}
                    className="font-bold text-[#536f32] hover:underline"
                  >
                    Sign in here
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e2dec9] py-4 px-6 text-center text-xs text-[#718078]">
        SkillLink · Decentralized Student Skill & Knowledge Exchange · Built for College Communities
      </footer>
    </div>
  );
}
