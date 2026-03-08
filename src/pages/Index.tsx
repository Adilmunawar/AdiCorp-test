
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Users, Clock, DollarSign, BarChart3, Shield, Workflow,
  ArrowRight, CheckCircle, ChevronRight, Star, Zap, Globe,
  Layers, Lock, HeadphonesIcon, MessageCircle, Sparkles,
  TrendingUp, MousePointerClick, Play, ArrowUpRight, Cpu,
  ChevronDown, Activity, Eye, Target,
} from "lucide-react";

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

function FloatingOrb({ className, delay }: { className: string; delay: number }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl animate-pulse pointer-events-none ${className}`}
      style={{ animationDelay: `${delay}s`, animationDuration: '4s' }}
    />
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
    const tiltX = (y - 0.5) * 8;
    const tiltY = (x - 0.5) * -8;
    setTransform(`perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`);
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden transition-[box-shadow] duration-500 ${className}`}
      style={{ transform, transition: 'transform 0.15s ease-out' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="absolute inset-0 pointer-events-none z-10 rounded-2xl"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, hsl(var(--primary) / ${glare.opacity}), transparent 60%)`,
          transition: 'opacity 0.3s',
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
    }, 40);
    return () => clearInterval(timer);
  }, [inView, text]);
  return (
    <span>
      {displayed}
      <span className="inline-block w-0.5 h-[1em] bg-primary ml-0.5 animate-pulse align-text-bottom" />
    </span>
  );
}

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden py-2">
      <div className={`flex gap-4 ${reverse ? 'animate-[marquee-reverse_30s_linear_infinite]' : 'animate-[marquee_30s_linear_infinite]'}`}>
        {doubled.map((item, i) => (
          <div key={i} className="flex-shrink-0 px-5 py-2.5 rounded-full bg-card border border-border text-sm text-muted-foreground font-medium whitespace-nowrap hover:border-primary/40 hover:text-primary transition-all duration-300 hover:shadow-md hover:shadow-primary/5 cursor-default">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const heroRef = useInView(0.1);
  const featuresRef = useInView(0.1);
  const benefitsRef = useInView(0.2);
  const statsRef = useInView(0.2);
  const testimonialsRef = useInView(0.2);
  const howItWorksRef = useInView(0.2);
  const faqRef = useInView(0.2);
  const ctaRef = useInView(0.2);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (user && !loading) navigate("/dashboard");
  }, [user, loading, navigate]);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveStep(prev => (prev + 1) % 4), 3000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const stat1 = useAnimatedCounter(500, statsRef.inView);
  const stat2 = useAnimatedCounter(98, statsRef.inView);
  const stat3 = useAnimatedCounter(15, statsRef.inView, 1500);
  const stat4 = useAnimatedCounter(99, statsRef.inView);

  const features = [
    { icon: Users, title: "Employee Management", description: "Centralized employee database with profiles, role management, and organizational hierarchy tracking.", gradient: "from-teal-500/20 to-emerald-500/20", metric: "248 profiles" },
    { icon: Clock, title: "Time & Attendance", description: "Automated attendance tracking with real-time monitoring, shift management, and overtime calculations.", gradient: "from-blue-500/20 to-cyan-500/20", metric: "96% accuracy" },
    { icon: DollarSign, title: "Payroll Processing", description: "Accurate salary calculations with tax deductions, bonuses, and compliant payroll operations.", gradient: "from-green-500/20 to-lime-500/20", metric: "80% faster" },
    { icon: BarChart3, title: "Analytics & Reports", description: "Interactive dashboards with custom reports and data visualization for strategic decisions.", gradient: "from-violet-500/20 to-purple-500/20", metric: "1.2K reports" },
    { icon: Shield, title: "Security & Compliance", description: "Enterprise-grade security with role-based access control and full data encryption.", gradient: "from-orange-500/20 to-amber-500/20", metric: "A+ rated" },
    { icon: Workflow, title: "Workflow Automation", description: "Streamlined approval chains, automated notifications, and process optimization tools.", gradient: "from-pink-500/20 to-rose-500/20", metric: "3x speed" },
  ];

  const benefits = [
    { text: "Reduce payroll processing time by 80%", icon: Zap },
    { text: "Real-time workforce visibility across all locations", icon: Eye },
    { text: "Automated compliance with labor regulations", icon: Shield },
    { text: "Secure, cloud-based infrastructure with 99.99% uptime", icon: Globe },
    { text: "Seamless onboarding and offboarding workflows", icon: Workflow },
    { text: "Multi-currency and multi-location support", icon: Target },
  ];

  const testimonials = [
    { name: "Sarah Ahmed", role: "HR Director, TechVentures", quote: "AdiCorp transformed how we manage our 200+ employees. Payroll that used to take days now takes minutes.", rating: 5, avatar: "SA" },
    { name: "Omar Farooq", role: "CEO, BuildRight Co.", quote: "The attendance tracking alone saved us thousands in overtime discrepancies. Highly recommended.", rating: 5, avatar: "OF" },
    { name: "Fatima Khan", role: "Operations Manager, GreenLeaf", quote: "Clean interface, powerful features, excellent support. Exactly what a growing company needs.", rating: 5, avatar: "FK" },
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

  const whatsappNumber = "923001234567";

  return (
    <div className="flex min-h-screen flex-col bg-background" onMouseMove={handleMouseMove}>
      {/* Cursor glow */}
      <div
        className="fixed pointer-events-none z-[100] w-[600px] h-[600px] rounded-full opacity-[0.04] bg-primary blur-[120px] transition-all duration-500 ease-out"
        style={{ left: mousePos.x - 300, top: mousePos.y - 300 }}
      />

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <img src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" alt="AdiCorp Logo" className="w-9 h-9 rounded-lg object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20" />
          <span className="text-lg font-semibold text-foreground">AdiCorp</span>
        </div>
        <nav className="ml-auto flex items-center gap-2">
          {[
            { label: "Features", id: "features" },
            { label: "How It Works", id: "how-it-works" },
          ].map(nav => (
            <Button key={nav.id} variant="ghost" className="text-muted-foreground hidden sm:inline-flex hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-300 hover:after:w-3/4 after:rounded-full" onClick={() => document.getElementById(nav.id)?.scrollIntoView({ behavior: 'smooth' })}>
              {nav.label}
            </Button>
          ))}
          <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => navigate("/auth")}>Sign In</Button>
          <Button onClick={() => navigate("/auth")} className="group/btn relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow">
            <span className="relative z-10 flex items-center">
              Get Started <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-teal-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section ref={heroRef.ref} className="py-24 md:py-32 lg:py-44 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.04),transparent_60%)]" />

          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: 'linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            transform: `translateY(${scrollY * 0.1}px)`,
          }} />

          <FloatingOrb className="w-72 h-72 bg-primary/10 -top-20 -left-20" delay={0} />
          <FloatingOrb className="w-96 h-96 bg-teal-400/8 -bottom-32 -right-32" delay={1.5} />
          <FloatingOrb className="w-48 h-48 bg-emerald-400/10 top-1/3 right-1/4" delay={3} />

          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center relative">
            <div className={`transition-all duration-1000 ${heroRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 border border-border hover:border-primary/30 transition-all duration-500 hover:shadow-[0_0_30px_hsl(var(--primary)/0.12)] cursor-default group">
                <Sparkles className="w-3.5 h-3.5 text-primary transition-transform duration-700 group-hover:rotate-[360deg]" />
                <span className="transition-colors duration-300 group-hover:text-primary">Modern HR Management Platform</span>
                <Activity className="w-3 h-3 text-primary animate-pulse" />
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                The Modern Way to
                <br />
                <span className="text-primary relative inline-block">
                  {heroRef.inView ? <TypingText text="Manage Your Workforce" inView={heroRef.inView} /> : "Manage Your Workforce"}
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="opacity-30" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                From attendance tracking to payroll processing, AdiCorp gives you the tools to manage your entire team efficiently — so you can focus on growing your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-base px-8 h-13 group/cta relative overflow-hidden shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-500 hover:scale-[1.03]" onClick={() => navigate("/auth")}>
                  <span className="relative z-10 flex items-center">
                    Start Free — No Card Required
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/cta:translate-x-1.5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-foreground/10 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700" />
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 h-13 hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 group/demo hover:scale-[1.02]" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  <Play className="w-4 h-4 mr-2 text-primary transition-transform duration-300 group-hover/demo:scale-125" />
                  See How It Works
                </Button>
              </div>

              {/* Dashboard mockup with parallax */}
              <div className={`mt-20 transition-all duration-1000 delay-500 ${heroRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
                <TiltCard className="mx-auto max-w-3xl">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-teal-400/5 to-primary/10 rounded-3xl blur-2xl" />
                  <div className="relative bg-card border border-border rounded-2xl p-5 shadow-2xl shadow-primary/10">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/60 hover:bg-red-400 transition-colors cursor-pointer" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/60 hover:bg-yellow-400 transition-colors cursor-pointer" />
                        <div className="w-3 h-3 rounded-full bg-green-400/60 hover:bg-green-400 transition-colors cursor-pointer" />
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
                        <div key={item.label} className="p-3 bg-muted/50 rounded-xl border border-border transition-all duration-500 hover:border-primary/30 hover:shadow-md hover:-translate-y-1 hover:bg-card group/stat cursor-pointer" style={{ transitionDelay: `${i * 80}ms` }}>
                          <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          <p className="text-lg font-bold text-foreground group-hover/stat:text-primary transition-colors">{item.value}</p>
                          <p className={`text-[10px] ${item.color} font-medium`}>{item.change}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 h-32 bg-muted/30 rounded-xl border border-border flex items-end p-3 gap-1 group/chart hover:border-primary/20 transition-colors">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/15 rounded-t-sm hover:bg-primary/50 transition-all duration-300 hover:shadow-[0_-4px_12px_hsl(var(--primary)/0.2)] cursor-pointer" style={{ height: `${h}%`, transitionDelay: `${i * 30}ms` }} />
                        ))}
                      </div>
                      <div className="h-32 bg-muted/30 rounded-xl border border-border p-3 flex flex-col justify-between hover:border-primary/20 transition-colors">
                        <p className="text-[10px] text-muted-foreground font-medium">Quick Actions</p>
                        <div className="space-y-1.5">
                          {["Mark Attendance", "Run Payroll", "New Report"].map((a) => (
                            <div key={a} className="text-[9px] px-2 py-1.5 bg-primary/10 text-primary rounded-md font-medium cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200">{a}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs text-muted-foreground">Scroll</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-10 border-y border-border bg-muted/30">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {trustLogos.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-all duration-300 cursor-default group hover:scale-105">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center transition-all duration-300 group-hover:bg-primary/10 group-hover:shadow-md group-hover:shadow-primary/10">
                      <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Marquee capabilities */}
        <section className="py-8 bg-background overflow-hidden">
          <MarqueeRow items={marqueeRow1} />
          <MarqueeRow items={marqueeRow2} reverse />
        </section>

        {/* Live Stats Counter */}
        <section ref={statsRef.ref} className="py-20 bg-muted/30 border-y border-border">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-700 ${statsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { value: stat1, suffix: "+", label: "Companies Trust Us", icon: Users },
                { value: stat2, suffix: "%", label: "Customer Satisfaction", icon: Star },
                { value: stat3, suffix: "min", label: "Average Setup Time", icon: Clock },
                { value: stat4, suffix: ".9%", label: "System Uptime", icon: Activity },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="text-center group cursor-default p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1" style={{ transitionDelay: `${i * 100}ms` }}>
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-primary/20">
                      <Icon className="w-5 h-5 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                    </div>
                    <p className="text-3xl md:text-4xl font-bold text-foreground mb-1 tabular-nums">
                      {stat.value}{stat.suffix}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" ref={featuresRef.ref} className="py-24 bg-background">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-700 ${featuresRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Cpu className="w-3 h-3" /> Features
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Everything You Need</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Comprehensive tools to manage your entire workforce from a single, intuitive dashboard.
              </p>
            </div>

            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${featuresRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {features.map((feature, i) => {
                const Icon = feature.icon;
                const isHovered = hoveredFeature === i;
                return (
                  <TiltCard key={feature.title} className={`bg-card border rounded-2xl cursor-default group ${isHovered ? 'border-primary/40 shadow-2xl shadow-primary/10' : 'border-border hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5'}`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} transition-opacity duration-500 rounded-2xl ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                    <div
                      className="relative z-10 p-7"
                      onMouseEnter={() => setHoveredFeature(i)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div className="flex items-start justify-between mb-5">
                        <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-500 ${isHovered ? 'bg-primary shadow-lg shadow-primary/30 scale-110 rotate-6' : ''}`}>
                          <Icon className={`w-5 h-5 transition-all duration-500 ${isHovered ? 'text-primary-foreground scale-110' : 'text-primary'}`} />
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all duration-300 ${isHovered ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                          {feature.metric}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                      <div className={`flex items-center gap-1.5 text-primary text-sm font-medium transition-all duration-500 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'}`}>
                        Explore <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works - Interactive */}
        <section id="how-it-works" ref={howItWorksRef.ref} className="py-24 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-700 ${howItWorksRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Layers className="w-3 h-3" /> How It Works
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Up and Running in Minutes</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Get your HR operations streamlined in four simple steps.
              </p>
            </div>

            <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${howItWorksRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {howItWorks.map((item, i) => {
                const StepIcon = item.icon;
                const isActive = activeStep === i;
                return (
                  <div key={item.step} className="relative group cursor-pointer" onClick={() => setActiveStep(i)}>
                    {i < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-[calc(100%_-_12px)] w-[calc(100%_-_40px)] h-px z-0 overflow-hidden">
                        <div className={`h-full transition-all duration-700 ${i < activeStep ? 'bg-primary w-full' : 'bg-border w-full'}`} />
                      </div>
                    )}
                    <div className={`relative rounded-2xl p-6 transition-all duration-500 border ${isActive ? 'bg-card border-primary/40 shadow-xl shadow-primary/10 -translate-y-2' : 'bg-card border-border hover:border-primary/20 hover:shadow-lg hover:-translate-y-1'}`}>
                      {/* Progress ring */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${isActive ? 'bg-primary text-primary-foreground scale-110 shadow-lg shadow-primary/30' : 'bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-105'}`}>
                          {item.step}
                          {isActive && <div className="absolute inset-0 rounded-xl bg-primary animate-ping opacity-20" />}
                        </div>
                        <StepIcon className={`w-4 h-4 transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-muted-foreground group-hover:text-primary'}`} />
                      </div>
                      <h3 className={`text-base font-semibold mb-2 transition-colors duration-300 ${isActive ? 'text-primary' : 'text-foreground'}`}>{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section ref={benefitsRef.ref} className="py-24 bg-background">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-700 ${benefitsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                  <Zap className="w-3 h-3" /> Why AdiCorp
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">Built for Modern Teams</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                  AdiCorp helps organizations of all sizes automate HR processes, reduce errors, and focus on what matters most — their people.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, i) => {
                    const BenefitIcon = benefit.icon;
                    return (
                      <li key={benefit.text} className="flex items-start gap-3.5 group cursor-default p-2.5 -mx-2.5 rounded-xl hover:bg-primary/5 transition-all duration-300" style={{ transitionDelay: `${i * 50}ms` }}>
                        <div className="mt-0.5 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20">
                          <BenefitIcon className="w-4 h-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                        </div>
                        <div>
                          <span className="text-foreground text-sm font-medium transition-colors duration-300 group-hover:text-primary">{benefit.text}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
                <Button className="mt-8 group/btn shadow-xl shadow-primary/20 hover:shadow-primary/30 hover:scale-[1.03] transition-all duration-300" size="lg" onClick={() => navigate("/auth")}>
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                </Button>
              </div>

              {/* Interactive dashboard card */}
              <TiltCard className="bg-card border border-border rounded-2xl shadow-2xl shadow-primary/5">
                <div className="p-6 space-y-3 relative">
                  {[
                    { icon: Users, label: "Active Employees", value: "248", badge: "+12 this month", badgeColor: "bg-teal-500/10 text-teal-600" },
                    { icon: Clock, label: "Attendance Today", value: "96%", badge: "On track", badgeColor: "bg-blue-500/10 text-blue-600" },
                    { icon: DollarSign, label: "Payroll Status", value: "Processed", badge: "Complete", badgeColor: "bg-green-500/10 text-green-600" },
                    { icon: BarChart3, label: "Reports Generated", value: "1,240", badge: "+89 today", badgeColor: "bg-violet-500/10 text-violet-600" },
                    { icon: Shield, label: "Security Score", value: "A+", badge: "Excellent", badgeColor: "bg-orange-500/10 text-orange-600" },
                  ].map((row) => {
                    const Icon = row.icon;
                    return (
                      <div key={row.label} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg hover:-translate-x-1 group cursor-default">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-md group-hover:shadow-primary/20">
                            <Icon className="w-4 h-4 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-foreground">{row.label}</span>
                            <span className={`block text-[10px] font-medium px-2 py-0.5 rounded-full mt-0.5 inline-block ${row.badgeColor}`}>{row.badge}</span>
                          </div>
                        </div>
                        <span className="text-sm font-bold text-primary transition-transform duration-300 group-hover:scale-110">{row.value}</span>
                      </div>
                    );
                  })}
                </div>
              </TiltCard>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section ref={testimonialsRef.ref} className="py-24 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-700 ${testimonialsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Star className="w-3 h-3" /> Testimonials
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Loved by HR Teams</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                See what our customers have to say about their experience with AdiCorp.
              </p>
            </div>

            <div className={`grid md:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${testimonialsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {testimonials.map((t, i) => (
                <TiltCard key={t.name} className="bg-card border border-border rounded-2xl group">
                  <div className="p-7 relative">
                    {/* Quote mark */}
                    <div className="absolute top-4 right-6 text-6xl font-serif text-primary/10 leading-none select-none transition-transform duration-500 group-hover:scale-125 group-hover:text-primary/20">"</div>
                    <div className="flex gap-1 mb-5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-primary text-primary transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" style={{ transitionDelay: `${j * 80}ms` }} />
                      ))}
                    </div>
                    <p className="text-sm text-foreground leading-relaxed mb-6 italic relative z-10">"{t.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm transition-all duration-500 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg group-hover:shadow-primary/20">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ - Accordion style */}
        <section ref={faqRef.ref} className="py-24 bg-background">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-700 ${faqRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
                <Zap className="w-3 h-3" /> FAQ
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Common Questions</h2>
            </div>

            <div className={`space-y-3 transition-all duration-700 delay-200 ${faqRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div
                    key={item.q}
                    className={`bg-card border rounded-2xl transition-all duration-500 cursor-pointer group overflow-hidden ${isOpen ? 'border-primary/40 shadow-xl shadow-primary/5' : 'border-border hover:border-primary/20 hover:shadow-md'}`}
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                  >
                    <div className="p-6 flex items-center justify-between gap-4">
                      <h3 className={`text-sm font-semibold flex items-center gap-2.5 transition-colors duration-300 ${isOpen ? 'text-primary' : 'text-foreground group-hover:text-primary'}`}>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isOpen ? 'bg-primary text-primary-foreground rotate-12 scale-110' : 'bg-primary/10 text-primary group-hover:scale-110'}`}>
                          <Zap className="w-3.5 h-3.5" />
                        </div>
                        {item.q}
                      </h3>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-500 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                    </div>
                    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <p className="text-sm text-muted-foreground leading-relaxed px-6 pb-6 pl-[3.75rem]">{item.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section ref={ctaRef.ref} className="py-28 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(0_0%_100%/0.1),transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
          <FloatingOrb className="w-64 h-64 bg-primary-foreground/10 -top-16 -left-16" delay={0} />
          <FloatingOrb className="w-80 h-80 bg-primary-foreground/5 -bottom-20 -right-20" delay={2} />

          <div className={`container px-4 md:px-6 max-w-3xl mx-auto text-center relative transition-all duration-700 ${ctaRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5">
              Ready to Transform Your HR?
            </h2>
            <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed text-lg">
              Start managing your workforce smarter. Get in touch via WhatsApp for instant onboarding support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-base px-8 h-13 group/cta hover:scale-105 transition-all duration-300 shadow-xl" onClick={() => navigate("/auth")}>
                Create Your Account <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/cta:translate-x-1.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-13 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:scale-105 transition-all duration-300 group/wa shadow-lg"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hi! I'm interested in AdiCorp HR Management.`, '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2 transition-transform duration-500 group-hover/wa:rotate-12 group-hover/wa:scale-110" />
                Chat on WhatsApp
              </Button>
            </div>
            <p className="text-primary-foreground/60 text-sm mt-6">Free to use · No credit card required · Instant setup</p>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=Hi! I'm interested in AdiCorp HR Management.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 group"
      >
        <MessageCircle className="w-6 h-6 text-white transition-transform duration-500 group-hover:rotate-[360deg]" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-card border border-border rounded-lg text-xs text-foreground font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg pointer-events-none">
          Chat with us! 💬
        </span>
      </a>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-50 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center shadow-lg transition-all duration-500 hover:border-primary/40 hover:scale-110 hover:shadow-primary/10 ${scrollY > 400 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <ChevronDown className="w-4 h-4 text-muted-foreground rotate-180" />
      </button>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" alt="AdiCorp" className="w-7 h-7 rounded object-cover transition-all duration-300 group-hover:scale-110 group-hover:rotate-6" />
                <span className="font-semibold text-foreground">AdiCorp</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modern HR management for modern teams.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Features", "How It Works", "Integrations"].map(item => (
                  <li key={item} className="cursor-pointer hover:text-primary transition-all duration-200 hover:translate-x-1" onClick={() => {
                    const id = item.toLowerCase().replace(/ /g, '-');
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                  }}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-all duration-200 hover:translate-x-1" onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}>WhatsApp Support</li>
                <li className="cursor-pointer hover:text-primary transition-all duration-200 hover:translate-x-1">Help Center</li>
                <li className="cursor-pointer hover:text-primary transition-all duration-200 hover:translate-x-1">Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(item => (
                  <li key={item} className="cursor-pointer hover:text-primary transition-all duration-200 hover:translate-x-1">{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">© 2025 AdiCorp. All rights reserved.</span>
            <div className="flex gap-4 text-sm text-muted-foreground">
              {["Privacy", "Terms", "Contact"].map(item => (
                <span key={item} className="cursor-pointer hover:text-primary transition-colors duration-200" onClick={item === "Contact" ? () => window.open(`https://wa.me/${whatsappNumber}`, '_blank') : undefined}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
