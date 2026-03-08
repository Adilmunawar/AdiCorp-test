
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Clock,
  DollarSign,
  BarChart3,
  Shield,
  Workflow,
  ArrowRight,
  CheckCircle,
  ChevronRight,
  Star,
  Zap,
  Globe,
  Layers,
  Lock,
  HeadphonesIcon,
  MessageCircle,
  Sparkles,
  TrendingUp,
  MousePointerClick,
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

function FloatingParticle({ delay, x, y }: { delay: number; x: string; y: string }) {
  return (
    <div
      className="absolute w-1.5 h-1.5 rounded-full bg-primary/20 animate-pulse"
      style={{ left: x, top: y, animationDelay: `${delay}s`, animationDuration: '3s' }}
    />
  );
}

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const heroRef = useInView(0.1);
  const featuresRef = useInView(0.1);
  const benefitsRef = useInView(0.2);
  const testimonialsRef = useInView(0.2);
  const howItWorksRef = useInView(0.2);
  const faqRef = useInView(0.2);
  const ctaRef = useInView(0.2);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (user && !loading) navigate("/dashboard");
  }, [user, loading, navigate]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const features = [
    { icon: Users, title: "Employee Management", description: "Centralized employee database with profiles, role management, and organizational hierarchy tracking.", gradient: "from-teal-500/20 to-emerald-500/20" },
    { icon: Clock, title: "Time & Attendance", description: "Automated attendance tracking with real-time monitoring, shift management, and overtime calculations.", gradient: "from-blue-500/20 to-cyan-500/20" },
    { icon: DollarSign, title: "Payroll Processing", description: "Accurate salary calculations with tax deductions, bonuses, and compliant payroll operations.", gradient: "from-green-500/20 to-lime-500/20" },
    { icon: BarChart3, title: "Analytics & Reports", description: "Interactive dashboards with custom reports and data visualization for strategic decisions.", gradient: "from-violet-500/20 to-purple-500/20" },
    { icon: Shield, title: "Security & Compliance", description: "Enterprise-grade security with role-based access control and full data encryption.", gradient: "from-orange-500/20 to-amber-500/20" },
    { icon: Workflow, title: "Workflow Automation", description: "Streamlined approval chains, automated notifications, and process optimization tools.", gradient: "from-pink-500/20 to-rose-500/20" },
  ];

  const benefits = [
    "Reduce payroll processing time by 80%",
    "Real-time workforce visibility across all locations",
    "Automated compliance with labor regulations",
    "Secure, cloud-based infrastructure with 99.99% uptime",
    "Seamless onboarding and offboarding workflows",
    "Multi-currency and multi-location support",
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

  const trustLogos = [
    { icon: Lock, label: "256-bit Encryption" },
    { icon: Globe, label: "GDPR Compliant" },
    { icon: Layers, label: "SOC 2 Type II" },
    { icon: HeadphonesIcon, label: "24/7 Support" },
  ];

  const whatsappNumber = "923001234567"; // Replace with actual number

  return (
    <div className="flex min-h-screen flex-col bg-background" onMouseMove={handleMouseMove}>
      {/* Cursor glow effect */}
      <div
        className="fixed pointer-events-none z-[100] w-[500px] h-[500px] rounded-full opacity-[0.03] bg-primary blur-[100px] transition-all duration-300 ease-out"
        style={{ left: mousePos.x - 250, top: mousePos.y - 250 }}
      />

      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate("/")}>
          <img src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" alt="AdiCorp Logo" className="w-9 h-9 rounded-lg object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
          <span className="text-lg font-semibold text-foreground">AdiCorp</span>
        </div>
        <nav className="ml-auto flex items-center gap-2">
          <Button variant="ghost" className="text-muted-foreground hidden sm:inline-flex hover:text-primary transition-colors" onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }}>Features</Button>
          <Button variant="ghost" className="text-muted-foreground hidden sm:inline-flex hover:text-primary transition-colors" onClick={() => {
            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
          }}>How It Works</Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors" onClick={() => navigate("/auth")}>Sign In</Button>
          <Button onClick={() => navigate("/auth")} className="group/btn relative overflow-hidden">
            <span className="relative z-10 flex items-center">
              Get Started <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </span>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section ref={heroRef.ref} className="py-24 md:py-32 lg:py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.08),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(var(--primary)/0.04),transparent_60%)]" />

          {/* Floating particles */}
          <FloatingParticle delay={0} x="10%" y="20%" />
          <FloatingParticle delay={0.5} x="80%" y="15%" />
          <FloatingParticle delay={1} x="70%" y="70%" />
          <FloatingParticle delay={1.5} x="20%" y="75%" />
          <FloatingParticle delay={2} x="50%" y="10%" />
          <FloatingParticle delay={0.8} x="90%" y="50%" />

          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center relative">
            <div className={`transition-all duration-1000 ${heroRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_20px_hsl(var(--primary)/0.1)] cursor-default group">
                <Sparkles className="w-3.5 h-3.5 text-primary transition-transform duration-500 group-hover:rotate-180" />
                Modern HR Management Platform
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.05]">
                The Modern Way to
                <br />
                <span className="text-primary relative">
                  Manage Your Workforce
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                    <path d="M2 8C50 2 100 2 150 6C200 10 250 4 298 8" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round" className="opacity-30" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                From attendance tracking to payroll processing, AdiCorp gives you the tools to manage your entire team efficiently — so you can focus on growing your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="text-base px-8 h-13 group/cta relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow duration-300" onClick={() => navigate("/auth")}>
                  <span className="relative z-10 flex items-center">
                    Start Free — No Card Required
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/cta:translate-x-1" />
                  </span>
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 h-13 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300" onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  See How It Works
                </Button>
              </div>

              {/* Animated dashboard preview mockup */}
              <div className={`mt-16 transition-all duration-1000 delay-500 ${heroRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                <div className="relative mx-auto max-w-3xl">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl blur-xl" />
                  <div className="relative bg-card border border-border rounded-2xl p-4 shadow-2xl shadow-primary/5">
                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400/60" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                        <div className="w-3 h-3 rounded-full bg-green-400/60" />
                      </div>
                      <div className="flex-1 flex justify-center">
                        <div className="px-4 py-1 bg-muted rounded-md text-xs text-muted-foreground">dashboard.adicorp.app</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      {[
                        { label: "Employees", value: "248", change: "+12" },
                        { label: "Attendance", value: "96%", change: "+2%" },
                        { label: "Payroll", value: "Done", change: "✓" },
                        { label: "Reports", value: "1.2K", change: "+89" },
                      ].map((item, i) => (
                        <div key={item.label} className={`p-3 bg-muted/50 rounded-lg border border-border transition-all duration-500 hover:border-primary/30 hover:shadow-sm hover:-translate-y-0.5`} style={{ transitionDelay: `${i * 100}ms` }}>
                          <p className="text-[10px] text-muted-foreground">{item.label}</p>
                          <p className="text-lg font-bold text-foreground">{item.value}</p>
                          <p className="text-[10px] text-primary font-medium">{item.change}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2 h-28 bg-muted/30 rounded-lg border border-border flex items-end p-3 gap-1">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-primary/20 rounded-t-sm hover:bg-primary/40 transition-colors duration-200" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      <div className="h-28 bg-muted/30 rounded-lg border border-border p-3 flex flex-col justify-between">
                        <p className="text-[10px] text-muted-foreground">Quick Actions</p>
                        <div className="space-y-1.5">
                          {["Mark Attendance", "Run Payroll", "New Report"].map((a) => (
                            <div key={a} className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded font-medium">{a}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-10 border-y border-border bg-muted/30">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {trustLogos.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors duration-300 cursor-default group">
                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-sm font-medium">{item.label}</span>
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
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Features</p>
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
                  <div
                    key={feature.title}
                    className={`relative bg-card border border-border rounded-2xl p-7 cursor-default transition-all duration-500 group overflow-hidden ${isHovered ? 'border-primary/40 shadow-xl shadow-primary/5 -translate-y-2' : 'hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'}`}
                    style={{ transitionDelay: `${i * 80}ms` }}
                    onMouseEnter={() => setHoveredFeature(i)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                    <div className="relative z-10">
                      <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 transition-all duration-500 ${isHovered ? 'bg-primary/20 scale-110 rotate-3' : ''}`}>
                        <Icon className={`w-5 h-5 text-primary transition-transform duration-500 ${isHovered ? 'scale-110' : ''}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>

                      {/* Hover reveal arrow */}
                      <div className={`flex items-center gap-1 mt-4 text-primary text-sm font-medium transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                        Learn more <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" ref={howItWorksRef.ref} className="py-24 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-700 ${howItWorksRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">How It Works</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Up and Running in Minutes</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Get your HR operations streamlined in four simple steps.
              </p>
            </div>

            <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 delay-200 ${howItWorksRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {howItWorks.map((item, i) => {
                const StepIcon = item.icon;
                return (
                  <div key={item.step} className="relative group cursor-default" style={{ transitionDelay: `${i * 100}ms` }}>
                    {/* Connector line */}
                    {i < howItWorks.length - 1 && (
                      <div className="hidden lg:block absolute top-10 left-[calc(100%_-_12px)] w-[calc(100%_-_40px)] h-px bg-border z-0" />
                    )}
                    <div className="relative bg-card border border-border rounded-2xl p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                          {item.step}
                        </div>
                        <StepIcon className="w-4 h-4 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                      </div>
                      <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
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
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Why AdiCorp</p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5">Built for Modern Teams</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                  AdiCorp helps organizations of all sizes automate HR processes, reduce errors, and focus on what matters most — their people.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit, i) => (
                    <li key={benefit} className="flex items-start gap-3 group cursor-default" style={{ transitionDelay: `${i * 50}ms` }}>
                      <div className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                        <CheckCircle className="w-3 h-3 text-primary transition-colors duration-300 group-hover:text-primary-foreground" />
                      </div>
                      <span className="text-foreground text-sm transition-colors duration-300 group-hover:text-primary">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8 group/btn shadow-lg shadow-primary/20" size="lg" onClick={() => navigate("/auth")}>
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </Button>
              </div>

              {/* Interactive dashboard card */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-3 shadow-xl shadow-primary/5">
                {[
                  { icon: Users, label: "Active Employees", value: "248", badge: "+12 this month" },
                  { icon: Clock, label: "Attendance Today", value: "96%", badge: "On track" },
                  { icon: DollarSign, label: "Payroll Status", value: "Processed", badge: "Complete" },
                  { icon: BarChart3, label: "Reports Generated", value: "1,240", badge: "+89 today" },
                  { icon: Shield, label: "Security Score", value: "A+", badge: "Excellent" },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center justify-between p-3.5 rounded-xl bg-muted/50 border border-border transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm group cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-105">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <span className="text-sm font-medium text-foreground">{row.label}</span>
                          <span className="block text-[10px] text-muted-foreground">{row.badge}</span>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-primary">{row.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section ref={testimonialsRef.ref} className="py-24 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-700 ${testimonialsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Testimonials</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Loved by HR Teams</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                See what our customers have to say about their experience with AdiCorp.
              </p>
            </div>

            <div className={`grid md:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${testimonialsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {testimonials.map((t, i) => (
                <div key={t.name} className="bg-card border border-border rounded-2xl p-7 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 group" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-primary text-primary transition-transform duration-300 group-hover:scale-110" style={{ transitionDelay: `${j * 50}ms` }} />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-6 italic">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef.ref} className="py-24 bg-background">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className={`text-center mb-16 transition-all duration-700 ${faqRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">FAQ</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">Common Questions</h2>
            </div>

            <div className={`space-y-4 transition-all duration-700 delay-200 ${faqRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { q: "How long does setup take?", a: "Most teams are up and running within 15 minutes. Our guided onboarding walks you through every step." },
                { q: "Is my data secure?", a: "Absolutely. We use 256-bit encryption, comply with GDPR, and maintain SOC 2 Type II certification." },
                { q: "Can I import existing employee data?", a: "Yes. You can bulk import employees via spreadsheet (XLSX/CSV) or add them manually." },
                { q: "How do I get support?", a: "Reach us anytime on WhatsApp for instant support, or email us for detailed inquiries." },
              ].map((item, i) => (
                <div key={item.q} className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-md group cursor-default" style={{ transitionDelay: `${i * 80}ms` }}>
                  <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2 transition-colors duration-300 group-hover:text-primary">
                    <Zap className="w-3.5 h-3.5 text-primary transition-transform duration-300 group-hover:scale-125" />
                    {item.q}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-5">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section ref={ctaRef.ref} className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(0_0%_100%/0.1),transparent_70%)]" />
          <div className={`container px-4 md:px-6 max-w-3xl mx-auto text-center relative transition-all duration-700 ${ctaRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5">
              Ready to Transform Your HR?
            </h2>
            <p className="text-primary-foreground/80 mb-10 max-w-xl mx-auto leading-relaxed text-lg">
              Start managing your workforce smarter. Get in touch via WhatsApp for instant onboarding support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-base px-8 h-13 group/cta hover:scale-105 transition-transform duration-300" onClick={() => navigate("/auth")}>
                Create Your Account <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-13 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 hover:scale-105 transition-all duration-300 group/wa"
                onClick={() => window.open(`https://wa.me/${whatsappNumber}?text=Hi! I'm interested in AdiCorp HR Management.`, '_blank')}
              >
                <MessageCircle className="w-4 h-4 mr-2 transition-transform duration-300 group-hover/wa:scale-110" />
                Chat on WhatsApp
              </Button>
            </div>
            <p className="text-primary-foreground/60 text-sm mt-5">Free to use · No credit card required · Instant setup</p>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp button */}
      <a
        href={`https://wa.me/${whatsappNumber}?text=Hi! I'm interested in AdiCorp HR Management.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all duration-300 group"
      >
        <MessageCircle className="w-6 h-6 text-white transition-transform duration-300 group-hover:rotate-12" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-background animate-pulse" />
      </a>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <img src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" alt="AdiCorp" className="w-7 h-7 rounded object-cover transition-transform duration-300 group-hover:scale-110" />
                <span className="font-semibold text-foreground">AdiCorp</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modern HR management for modern teams.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-colors duration-200" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</li>
                <li className="cursor-pointer hover:text-primary transition-colors duration-200" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How It Works</li>
                <li className="cursor-pointer hover:text-primary transition-colors duration-200">Integrations</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-colors duration-200" onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}>
                  WhatsApp Support
                </li>
                <li className="cursor-pointer hover:text-primary transition-colors duration-200">Help Center</li>
                <li className="cursor-pointer hover:text-primary transition-colors duration-200">Documentation</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer hover:text-primary transition-colors duration-200">Privacy Policy</li>
                <li className="cursor-pointer hover:text-primary transition-colors duration-200">Terms of Service</li>
                <li className="cursor-pointer hover:text-primary transition-colors duration-200">Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">© 2025 AdiCorp. All rights reserved.</span>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span className="cursor-pointer hover:text-primary transition-colors duration-200">Privacy</span>
              <span className="cursor-pointer hover:text-primary transition-colors duration-200">Terms</span>
              <span className="cursor-pointer hover:text-primary transition-colors duration-200" onClick={() => window.open(`https://wa.me/${whatsappNumber}`, '_blank')}>Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
