
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Clock, DollarSign, BarChart3, Shield, Workflow,
  ArrowRight, CheckCircle, ChevronRight, Star, Zap, Globe,
  Layers, Lock, HeadphonesIcon, MessageCircle, Sparkles,
  TrendingUp, MousePointerClick, Play, ArrowUpRight, Cpu,
  ChevronDown, Activity, Eye, Target, Heart,
  ExternalLink, ChevronUp,
} from "lucide-react";

/* ── Hooks ────────────────────────────────────────── */

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useAnimatedCounter(target: number, inView: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function useParallax() {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return offset;
}

/* ── Sub-components ────────────────────────────────── */

/** Premium button with ripple effect */
function PremiumButton({
  children,
  className = "",
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "primary" | "glass" | "ghost" | "cta-invert";
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.08;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.08;
    setPos({ x, y });
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const newRipple = {
      id: Date.now(),
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => setRipples(prev => prev.filter(r => r.id !== newRipple.id)), 700);
    onClick?.();
  };

  const baseClasses = "relative overflow-hidden inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-400 rounded-xl cursor-pointer select-none active:scale-[0.97]";

  const variantClasses = {
    primary: "bg-primary text-primary-foreground h-13 px-8 text-[15px] gap-2.5 shadow-[0_2px_8px_hsl(var(--primary)/0.25),0_8px_24px_-4px_hsl(var(--primary)/0.2)] hover:shadow-[0_4px_12px_hsl(var(--primary)/0.35),0_16px_40px_-8px_hsl(var(--primary)/0.25)] hover:brightness-110 hover:-translate-y-0.5",
    glass: "border border-border bg-card/80 backdrop-blur-xl text-foreground h-13 px-8 text-[15px] gap-2.5 shadow-sm hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 hover:bg-card",
    ghost: "text-muted-foreground hover:text-primary hover:bg-primary/5 h-10 px-5 text-sm gap-2",
    "cta-invert": "bg-card text-foreground h-13 px-8 text-[15px] gap-2.5 shadow-[0_4px_16px_hsl(var(--foreground)/0.1)] hover:shadow-[0_8px_32px_hsl(var(--foreground)/0.15)] hover:-translate-y-0.5",
  };

  return (
    <button
      ref={btnRef}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease, filter 0.3s ease' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      onClick={handleClick}
    >
      {ripples.map(r => (
        <span
          key={r.id}
          className="ripple"
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
        />
      ))}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </button>
  );
}

function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTransform(`perspective(1000px) rotateX(${(y - 0.5) * 6}deg) rotateY(${(x - 0.5) * -6}deg) scale3d(1.01, 1.01, 1.01)`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.1 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      style={{ transform, transition: 'transform 0.4s cubic-bezier(0.03, 0.98, 0.52, 0.99)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, hsl(var(--primary) / ${glare.opacity}), transparent 60%)`,
        }}
      />
      {children}
    </div>
  );
}

function TypingText({ text, inView }: { text: string; inView: boolean }) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    setDisplayed("");
    const timer = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timer);
    }, 35);
    return () => clearInterval(timer);
  }, [inView, text]);
  return (
    <span>
      {displayed}
      <span className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 animate-pulse align-text-bottom rounded-full" />
    </span>
  );
}

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-2">
      <div className={`flex gap-4 ${reverse ? 'animate-[marquee-reverse_25s_linear_infinite]' : 'animate-[marquee_25s_linear_infinite]'}`}>
        {doubled.map((item, i) => (
          <div key={i} className="flex-shrink-0 px-5 py-2.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium whitespace-nowrap hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all duration-300 hover:-translate-y-0.5 cursor-default">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function StaggeredReveal({ children, inView, delay = 0 }: { children: React.ReactNode; inView: boolean; delay?: number }) {
  return (
    <div
      className="transition-all duration-700 ease-out"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.98)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  return (
    <span className="tabular-nums inline-flex items-baseline">
      <span className="text-3xl md:text-5xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
        {value}
      </span>
      <span className="text-xl md:text-2xl font-bold text-primary ml-0.5">{suffix}</span>
    </span>
  );
}

function NavLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative text-sm text-muted-foreground font-medium px-4 py-2 rounded-xl hover:text-foreground transition-all duration-300 group hidden sm:inline-flex"
    >
      <span className="relative z-10">{label}</span>
      <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary rounded-full transition-all duration-500 group-hover:w-2/3" />
      <span className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 transition-all duration-300" />
    </button>
  );
}

/* ── Main Component ────────────────────────────────── */

const WHATSAPP_LINK = "https://wa.me/+92324965220?text=Hello%20Adil%2C%20I%20want%20to%20know%20more%20about%20AdiCorp%20HR%20Management.";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const scrollY = useParallax();
  const heroRef = useInView(0.1);
  const featuresRef = useInView(0.1);
  const benefitsRef = useInView(0.15);
  const statsRef = useInView(0.15);
  const howItWorksRef = useInView(0.15);
  const faqRef = useInView(0.15);
  const ctaRef = useInView(0.15);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  useEffect(() => {
    if (user && !loading) navigate("/dashboard");
  }, [user, loading, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep(prev => (prev + 1) % 4), 3500);
    return () => clearInterval(timer);
  }, []);

  const stat1 = useAnimatedCounter(98, statsRef.inView);
  const stat2 = useAnimatedCounter(15, statsRef.inView, 1500);
  const stat3 = useAnimatedCounter(80, statsRef.inView);
  const stat4 = useAnimatedCounter(99, statsRef.inView);

  const features = [
    { icon: Users, title: "Employee Management", description: "Centralized employee database with profiles, role management, and organizational hierarchy tracking.", metric: "Full Suite" },
    { icon: Clock, title: "Time & Attendance", description: "Automated attendance tracking with real-time monitoring, shift management, and overtime calculations.", metric: "Real-time" },
    { icon: DollarSign, title: "Payroll Processing", description: "Accurate salary calculations with tax deductions, bonuses, and compliant payroll operations.", metric: "80% faster" },
    { icon: BarChart3, title: "Analytics & Reports", description: "Interactive dashboards with custom reports and data visualization for strategic decisions.", metric: "Insights" },
    { icon: Shield, title: "Security & Compliance", description: "Enterprise-grade security with role-based access control and full data encryption.", metric: "A+ rated" },
    { icon: Workflow, title: "Workflow Automation", description: "Streamlined approval chains, automated notifications, and process optimization tools.", metric: "3x speed" },
  ];

  const benefits = [
    { text: "Reduce payroll processing time by 80%", icon: Zap },
    { text: "Real-time workforce visibility across all locations", icon: Eye },
    { text: "Automated compliance with labor regulations", icon: Shield },
    { text: "Secure, cloud-based infrastructure with 99.9% uptime", icon: Globe },
    { text: "Seamless onboarding and offboarding workflows", icon: Workflow },
    { text: "Multi-currency and multi-location support", icon: Target },
  ];

  const howItWorks = [
    { step: "01", title: "Create Your Account", description: "Sign up in under 2 minutes. No credit card required to start.", icon: MousePointerClick },
    { step: "02", title: "Set Up Your Company", description: "Configure your organization structure, departments, and policies.", icon: Layers },
    { step: "03", title: "Add Your Team", description: "Import employees via spreadsheet or add them manually.", icon: Users },
    { step: "04", title: "Start Managing", description: "Track attendance, process payroll, and generate reports instantly.", icon: TrendingUp },
  ];

  const faqs = [
    { q: "How long does setup take?", a: "Most teams are up and running within 15 minutes. Our guided onboarding walks you through every step." },
    { q: "Is my data secure?", a: "Absolutely. We use 256-bit encryption, comply with GDPR, and maintain SOC 2 Type II certification." },
    { q: "Can I import existing employee data?", a: "Yes. You can bulk import employees via spreadsheet (XLSX/CSV) or add them manually." },
    { q: "How do I get support?", a: "Reach us anytime on WhatsApp for instant support, or email us for detailed inquiries." },
    { q: "Is there a free plan?", a: "Yes! AdiCorp is free to use with all core features. No credit card required to get started." },
  ];

  const trustLogos = [
    { icon: Lock, label: "256-bit Encryption" },
    { icon: Globe, label: "GDPR Compliant" },
    { icon: Layers, label: "SOC 2 Type II" },
    { icon: HeadphonesIcon, label: "24/7 Support" },
  ];

  const marqueeRow1 = ["Employee Onboarding", "Payroll Automation", "Leave Management", "Shift Scheduling", "Performance Reviews", "Compliance Tracking"];
  const marqueeRow2 = ["Tax Calculations", "Time Tracking", "Custom Reports", "Role Management", "Overtime Rules", "Multi-Currency"];

  return (
    <div className="flex min-h-screen flex-col bg-background overflow-x-hidden">
      {/* ── HEADER ── */}
      <header className={`px-4 lg:px-8 h-16 flex items-center bg-background/80 backdrop-blur-2xl sticky top-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'border-b border-border/50 shadow-sm' : 'border-b border-transparent'}`}>
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <div className="relative">
            <img src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" alt="AdiCorp Logo" className="w-9 h-9 rounded-xl object-cover transition-all duration-300 group-hover:scale-105" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">AdiCorp</span>
        </div>
        <nav className="ml-auto flex items-center gap-1">
          <NavLink label="Features" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} />
          <NavLink label="How It Works" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} />
          
          <button 
            className="text-sm text-muted-foreground font-medium px-4 py-2 rounded-xl hover:text-foreground hover:bg-accent transition-all duration-300 ml-1"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </button>

          <PremiumButton variant="primary" className="ml-2 !h-10 !px-6 !text-sm !rounded-xl" onClick={() => navigate("/auth")}>
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </PremiumButton>
        </nav>
      </header>

      <main className="flex-1">
        {/* ── HERO ── */}
        <section ref={heroRef.ref} className="py-24 md:py-32 lg:py-44 relative overflow-hidden">
          {/* Clean subtle background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_60%)]" />
          <div className="absolute inset-0 opacity-[0.008]" style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />

          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center relative">
            <div className={`transition-all duration-1000 ${heroRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-card border border-border text-sm font-medium mb-10 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-muted-foreground">Modern HR Management Platform</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50" />
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-[4.5rem] font-black tracking-[-0.03em] text-foreground mb-7 leading-[1.08]">
                The Modern Way to
                <br />
                <span className="text-gradient-primary relative inline-block">
                  {heroRef.inView ? <TypingText text="Manage Your Workforce" inView={heroRef.inView} /> : "Manage Your Workforce"}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-14 leading-relaxed font-normal">
                From attendance tracking to payroll processing, AdiCorp gives you the tools to manage your entire team efficiently — so you can focus on growing your business.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <PremiumButton variant="primary" onClick={() => navigate("/auth")}>
                  Start Free — No Card Required
                </PremiumButton>

                <PremiumButton variant="glass" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Play className="w-[18px] h-[18px] text-primary" />
                  See How It Works
                </PremiumButton>
              </div>

              {/* Dashboard mockup */}
              <div className={`mt-20 transition-all duration-1000 delay-500 ${heroRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                <TiltCard className="mx-auto max-w-3xl">
                  <div className="relative bg-card border border-border rounded-2xl p-5 shadow-2xl shadow-foreground/5">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                      <div className="flex gap-1.5">
                        {['bg-red-400/60 hover:bg-red-400', 'bg-yellow-400/60 hover:bg-yellow-400', 'bg-green-400/60 hover:bg-green-400'].map((c, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full ${c} transition-all duration-200 cursor-pointer hover:scale-125`} />
                        ))}
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="px-4 py-1 bg-muted rounded-md text-xs text-muted-foreground flex items-center gap-2">
                          <Lock className="w-2.5 h-2.5" /> dashboard.adicorp.app
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "Employees", value: "248", change: "+12", color: "text-teal-600" },
                        { label: "Attendance", value: "96%", change: "+2%", color: "text-blue-600" },
                        { label: "Payroll", value: "Done", change: "✓", color: "text-green-600" },
                        { label: "Reports", value: "1.2K", change: "+89", color: "text-violet-600" },
                      ].map((item, i) => (
                        <div key={item.label} className="p-3 bg-muted/50 rounded-xl border border-border transition-all duration-500 hover:border-primary/30 hover:-translate-y-1 hover:bg-card group/stat cursor-pointer" style={{ transitionDelay: `${i * 80}ms` }}>
                          <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          <p className="text-lg font-bold text-foreground group-hover/stat:text-primary transition-colors duration-300">{item.value}</p>
                          <p className={`text-[10px] ${item.color} font-medium`}>{item.change}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 h-32 bg-muted/30 rounded-xl border border-border flex items-end p-3 gap-1 hover:border-primary/20 transition-all duration-300">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/15 rounded-t-sm hover:bg-primary/50 transition-all duration-500 cursor-pointer" style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }} />
                        ))}
                      </div>
                      <div className="h-32 bg-muted/30 rounded-xl border border-border p-3 flex flex-col justify-between hover:border-primary/20 transition-all duration-300">
                        <p className="text-[10px] text-muted-foreground font-medium">Quick Actions</p>
                        <div className="space-y-1.5">
                          {["Mark Attendance", "Run Payroll", "New Report"].map((a) => (
                            <div key={a} className="text-[9px] px-2 py-1.5 bg-primary/10 text-primary rounded-md font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300">{a}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ── */}
        <section className="py-10 border-y border-border/50 bg-muted/20">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {trustLogos.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-all duration-400 cursor-default group" style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center transition-all duration-400 group-hover:bg-primary/10">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <section className="py-8 bg-background overflow-hidden">
          <MarqueeRow items={marqueeRow1} />
          <MarqueeRow items={marqueeRow2} reverse />
        </section>

        {/* ── STATS ── */}
        <section ref={statsRef.ref} className="py-24 bg-muted/20 border-y border-border/50 relative">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto relative">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: stat1, suffix: "%", label: "Customer Satisfaction", icon: Heart },
                { value: stat2, suffix: "min", label: "Average Setup Time", icon: Clock },
                { value: stat3, suffix: "%", label: "Faster Payroll", icon: Zap },
                { value: stat4, suffix: ".9%", label: "System Uptime", icon: Activity },
              ].map((stat, i) => {
                const Icon = stat.icon;
                const isHovered = hoveredStat === i;
                return (
                  <StaggeredReveal key={stat.label} inView={statsRef.inView} delay={i * 120}>
                    <div
                      className={`text-center group cursor-default p-6 rounded-2xl bg-card border transition-all duration-500 ${
                        isHovered ? 'border-primary/40 shadow-xl shadow-primary/8 -translate-y-1' : 'border-border hover:border-primary/20 hover:shadow-lg'
                      }`}
                      onMouseEnter={() => setHoveredStat(i)}
                      onMouseLeave={() => setHoveredStat(null)}
                    >
                      <div className="relative z-10">
                        <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center transition-all duration-500 ${isHovered ? 'bg-primary scale-105 shadow-md shadow-primary/20' : ''}`}>
                          <Icon className={`w-6 h-6 transition-all duration-500 ${isHovered ? 'text-primary-foreground' : 'text-primary'}`} />
                        </div>
                        <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                        <p className="text-sm text-muted-foreground mt-2 font-medium">{stat.label}</p>
                      </div>
                    </div>
                  </StaggeredReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="features" ref={featuresRef.ref} className="py-28 bg-background relative">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto relative">
            <StaggeredReveal inView={featuresRef.inView}>
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
                  <Cpu className="w-3.5 h-3.5" /> Core Features
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 tracking-tight">Everything You Need</h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg leading-relaxed">
                  Comprehensive tools to manage your entire workforce from a single, intuitive dashboard.
                </p>
              </div>
            </StaggeredReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                const isHovered = hoveredFeature === i;
                return (
                  <StaggeredReveal key={feature.title} inView={featuresRef.inView} delay={150 + i * 100}>
                    <TiltCard className={`bg-card border rounded-2xl cursor-default group transition-all duration-500 ${isHovered ? 'border-primary/40 shadow-xl shadow-primary/8' : 'border-border hover:border-primary/20 hover:shadow-lg'}`}>
                      <div
                        className="relative z-10 p-7"
                        onMouseEnter={() => setHoveredFeature(i)}
                        onMouseLeave={() => setHoveredFeature(null)}
                      >
                        <div className="flex items-start justify-between mb-5">
                          <div className={`w-13 h-13 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-500 ${isHovered ? 'bg-primary shadow-md shadow-primary/20 scale-105' : ''}`}>
                            <Icon className={`w-6 h-6 transition-all duration-500 ${isHovered ? 'text-primary-foreground' : 'text-primary'}`} />
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-all duration-500 ${isHovered ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                            {feature.metric}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2 transition-colors duration-300 group-hover:text-primary">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-5">{feature.description}</p>
                        
                        <div className={`flex items-center gap-2 text-primary text-sm font-semibold transition-all duration-500 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
                          <span>Explore Feature</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </TiltCard>
                  </StaggeredReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="how-it-works" ref={howItWorksRef.ref} className="py-28 bg-muted/30 relative overflow-hidden">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto relative">
            <StaggeredReveal inView={howItWorksRef.inView}>
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
                  <Layers className="w-3.5 h-3.5" /> Simple Steps
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 tracking-tight">Up and Running in Minutes</h2>
                <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                  Get your HR operations streamlined in four simple steps.
                </p>
              </div>
            </StaggeredReveal>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {howItWorks.map((item, i) => {
                const StepIcon = item.icon;
                const isActive = activeStep === i;
                return (
                  <StaggeredReveal key={item.step} inView={howItWorksRef.inView} delay={200 + i * 120}>
                    <div className="relative group cursor-pointer" onClick={() => setActiveStep(i)}>
                      {i < howItWorks.length - 1 && (
                        <div className="hidden lg:block absolute top-10 left-[calc(100%_-_12px)] w-[calc(100%_-_40px)] h-[2px] z-0 overflow-hidden rounded-full">
                          <div className={`h-full rounded-full transition-all duration-1000 ease-out ${i < activeStep ? 'bg-primary w-full' : 'bg-border w-full'}`} />
                        </div>
                      )}
                      <div className={`relative rounded-2xl p-6 transition-all duration-500 border overflow-hidden ${isActive ? 'bg-card border-primary/40 shadow-xl shadow-primary/8 -translate-y-1' : 'bg-card border-border hover:border-primary/20 hover:shadow-lg'}`}>
                        <div className="relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black transition-all duration-500 ${isActive ? 'bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/20' : 'bg-primary/10 text-primary group-hover:bg-primary/15'}`}>
                              {item.step}
                            </div>
                            <StepIcon className={`w-5 h-5 transition-all duration-500 ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`} />
                          </div>
                          <h3 className={`text-base font-bold mb-2 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>{item.title}</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </StaggeredReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── BENEFITS ── */}
        <section ref={benefitsRef.ref} className="py-28 bg-background relative">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <StaggeredReveal inView={benefitsRef.inView}>
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
                    <Zap className="w-3.5 h-3.5" /> Advantages
                  </div>
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 tracking-tight">Built for Modern Teams</h2>
                  <p className="text-muted-foreground mb-10 leading-relaxed text-lg">
                    AdiCorp helps organizations of all sizes automate HR processes, reduce errors, and focus on what matters most — their people.
                  </p>
                  <ul className="space-y-2">
                    {benefits.map((benefit, i) => {
                      const BenefitIcon = benefit.icon;
                      return (
                        <li key={benefit.text} className="flex items-start gap-3.5 group cursor-default p-3 -mx-3 rounded-xl hover:bg-accent transition-all duration-300" style={{ transitionDelay: `${i * 60}ms` }}>
                          <div className="mt-0.5 w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-400 group-hover:bg-primary group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/15">
                            <BenefitIcon className="w-4 h-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                          </div>
                          <span className="text-foreground text-sm font-medium transition-all duration-300 group-hover:text-primary pt-1.5">{benefit.text}</span>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-10">
                    <PremiumButton variant="primary" onClick={() => navigate("/auth")}>
                      Get Started Free <ArrowRight className="w-4 h-4" />
                    </PremiumButton>
                  </div>
                </div>
              </StaggeredReveal>

              <StaggeredReveal inView={benefitsRef.inView} delay={200}>
                <TiltCard className="bg-card border border-border rounded-2xl shadow-xl shadow-foreground/5">
                  <div className="p-6 space-y-3 relative">
                    {[
                      { icon: Users, label: "Active Employees", value: "248", badge: "+12 this month", badgeColor: "bg-primary/10 text-primary" },
                      { icon: Clock, label: "Attendance Today", value: "96%", badge: "On track", badgeColor: "bg-primary/10 text-primary" },
                      { icon: DollarSign, label: "Payroll Status", value: "Processed", badge: "Complete", badgeColor: "bg-primary/10 text-primary" },
                      { icon: BarChart3, label: "Reports Generated", value: "1,240", badge: "+89 today", badgeColor: "bg-primary/10 text-primary" },
                      { icon: Shield, label: "Security Score", value: "A+", badge: "Excellent", badgeColor: "bg-primary/10 text-primary" },
                    ].map((row, i) => {
                      const Icon = row.icon;
                      return (
                        <div key={row.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border transition-all duration-400 hover:border-primary/30 hover:bg-card hover:shadow-md group cursor-default" style={{ transitionDelay: `${i * 60}ms` }}>
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-400 group-hover:bg-primary group-hover:scale-105 group-hover:shadow-md group-hover:shadow-primary/15">
                              <Icon className="w-4 h-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                            </div>
                            <div>
                              <span className="text-sm font-medium text-foreground block">{row.label}</span>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${row.badgeColor} inline-block mt-0.5`}>{row.badge}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-primary">{row.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </TiltCard>
              </StaggeredReveal>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section ref={faqRef.ref} className="py-28 bg-muted/30">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <StaggeredReveal inView={faqRef.inView}>
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
                  <Zap className="w-3.5 h-3.5" /> FAQ
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-5 tracking-tight">Common Questions</h2>
              </div>
            </StaggeredReveal>

            <div className="space-y-3">
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <StaggeredReveal key={item.q} inView={faqRef.inView} delay={100 + i * 80}>
                    <div
                      className={`bg-card border rounded-2xl transition-all duration-500 cursor-pointer group overflow-hidden ${isOpen ? 'border-primary/40 shadow-xl shadow-primary/8' : 'border-border hover:border-primary/20 hover:shadow-lg'}`}
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                    >
                      <div className="p-6 flex items-center justify-between gap-4">
                        <h3 className={`text-sm font-bold flex items-center gap-3 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isOpen ? 'bg-primary text-primary-foreground scale-105 shadow-md shadow-primary/15' : 'bg-primary/10 text-primary'}`}>
                            <Zap className="w-3.5 h-3.5" />
                          </div>
                          {item.q}
                        </h3>
                        <div className={`w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isOpen ? 'bg-primary/10 rotate-180' : ''}`}>
                          <ChevronDown className={`w-3.5 h-3.5 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                      </div>
                      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="text-sm text-muted-foreground leading-relaxed px-6 pb-6 pl-[4.25rem]">{item.a}</p>
                      </div>
                    </div>
                  </StaggeredReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section ref={ctaRef.ref} className="py-32 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(0_0%_100%/0.08),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

          <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center relative">
            <StaggeredReveal inView={ctaRef.inView}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary-foreground mb-6 tracking-tight">
                Ready to Transform Your HR?
              </h2>
              <p className="text-primary-foreground/80 mb-12 max-w-xl mx-auto leading-relaxed text-lg">
                Start managing your workforce smarter. Get in touch via WhatsApp for instant onboarding support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <PremiumButton variant="cta-invert" onClick={() => navigate("/auth")}>
                  Create Your Account <ArrowRight className="w-4 h-4" />
                </PremiumButton>
                <PremiumButton
                  variant="glass"
                  className="!bg-primary-foreground/10 !border-primary-foreground/25 !text-primary-foreground hover:!bg-primary-foreground/20 hover:!border-primary-foreground/40"
                  onClick={() => window.open(WHATSAPP_LINK, '_blank')}
                >
                  <MessageCircle className="w-[18px] h-[18px]" />
                  Chat on WhatsApp
                </PremiumButton>
              </div>
              <p className="text-primary-foreground/50 text-sm mt-8 font-medium">Free to use · No credit card required · Instant setup</p>
            </StaggeredReveal>
          </div>
        </section>
      </main>

      {/* ── FLOATING WHATSAPP ── */}
      <a
        href={WHATSAPP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-2xl flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 active:scale-95 transition-all duration-300 group"
      >
        <MessageCircle className="w-6 h-6 text-primary-foreground transition-transform duration-500 group-hover:rotate-12" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-destructive rounded-full border-2 border-background animate-pulse" />
        <span className="absolute right-full mr-3 px-4 py-2.5 bg-card border border-border rounded-2xl text-xs text-foreground font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl pointer-events-none">
          Chat with us! 💬
        </span>
      </a>

      {/* ── BACK TO TOP ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-50 w-10 h-10 bg-card border border-border rounded-xl flex items-center justify-center shadow-lg transition-all duration-500 hover:border-primary/30 hover:scale-110 active:scale-95 ${scrollY > 400 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <ChevronUp className="w-4 h-4 text-muted-foreground" />
      </button>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border/50 bg-card py-14">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" alt="AdiCorp" className="w-8 h-8 rounded-lg object-cover transition-all duration-300 group-hover:scale-105" />
                <span className="font-bold text-foreground">AdiCorp</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modern HR management for modern teams.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Product</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {["Features", "How It Works", "Integrations"].map(item => (
                  <li key={item} className="cursor-pointer hover:text-primary transition-all duration-300 flex items-center gap-1 group/link" onClick={() => document.getElementById(item.toLowerCase().replace(/ /g, '-'))?.scrollIntoView({ behavior: 'smooth' })}>
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Support</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-all duration-300 flex items-center gap-1 group/link" onClick={() => window.open(WHATSAPP_LINK, '_blank')}>
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-primary" />
                  WhatsApp Support
                </li>
                {["Help Center", "Documentation"].map(item => (
                  <li key={item} className="cursor-pointer hover:text-primary transition-all duration-300 flex items-center gap-1 group/link">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
                  <li key={item} className="cursor-pointer hover:text-primary transition-all duration-300 flex items-center gap-1 group/link">
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border/50 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">© 2026 AdiCorp. All rights reserved.</span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Proudly developed by</span>
              <span className="font-semibold text-primary hover:text-primary/80 transition-colors cursor-default">Adil Munawar</span>
              <Heart className="w-3.5 h-3.5 text-primary fill-primary animate-bounce-subtle" />
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              {["Privacy", "Terms", "Contact"].map(item => (
                <span key={item} className="cursor-pointer hover:text-primary transition-all duration-300 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full" onClick={item === "Contact" ? () => window.open(WHATSAPP_LINK, '_blank') : undefined}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
