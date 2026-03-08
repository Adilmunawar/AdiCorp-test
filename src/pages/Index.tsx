
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
} from "lucide-react";

function useCountUp(target: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setValue(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

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

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const heroRef = useInView(0.1);
  const statsRef = useInView(0.3);
  const featuresRef = useInView(0.1);
  const benefitsRef = useInView(0.2);
  const testimonialsRef = useInView(0.2);
  const pricingRef = useInView(0.2);
  const faqRef = useInView(0.2);

  const companiesCount = useCountUp(1000, 2000, statsRef.inView);
  const usersCount = useCountUp(25000, 2500, statsRef.inView);
  const uptimeVal = useCountUp(9999, 2000, statsRef.inView);

  useEffect(() => {
    if (user && !loading) navigate("/dashboard");
  }, [user, loading, navigate]);

  const features = [
    { icon: Users, title: "Employee Management", description: "Centralized employee database with profiles, role management, and organizational hierarchy tracking." },
    { icon: Clock, title: "Time & Attendance", description: "Automated attendance tracking with real-time monitoring, shift management, and overtime calculations." },
    { icon: DollarSign, title: "Payroll Processing", description: "Accurate salary calculations with tax deductions, bonuses, and compliant payroll operations." },
    { icon: BarChart3, title: "Analytics & Reports", description: "Interactive dashboards with custom reports and data visualization for strategic decisions." },
    { icon: Shield, title: "Security & Compliance", description: "Enterprise-grade security with role-based access control and full data encryption." },
    { icon: Workflow, title: "Workflow Automation", description: "Streamlined approval chains, automated notifications, and process optimization tools." },
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
    { name: "Sarah Ahmed", role: "HR Director, TechVentures", quote: "AdiCorp transformed how we manage our 200+ employees. Payroll that used to take days now takes minutes.", rating: 5 },
    { name: "Omar Farooq", role: "CEO, BuildRight Co.", quote: "The attendance tracking alone saved us thousands in overtime discrepancies. Highly recommended.", rating: 5 },
    { name: "Fatima Khan", role: "Operations Manager, GreenLeaf", quote: "Clean interface, powerful features, excellent support. Exactly what a growing company needs.", rating: 5 },
  ];

  const howItWorks = [
    { step: "01", title: "Create Your Account", description: "Sign up in under 2 minutes. No credit card required to start your free trial." },
    { step: "02", title: "Set Up Your Company", description: "Configure your organization structure, departments, and working policies." },
    { step: "03", title: "Add Your Team", description: "Import employees via spreadsheet or add them manually with all their details." },
    { step: "04", title: "Start Managing", description: "Track attendance, process payroll, and generate reports from day one." },
  ];

  const trustLogos = [
    { icon: Lock, label: "256-bit Encryption" },
    { icon: Globe, label: "GDPR Compliant" },
    { icon: Layers, label: "SOC 2 Type II" },
    { icon: HeadphonesIcon, label: "24/7 Support" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <img src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" alt="AdiCorp Logo" className="w-9 h-9 rounded-lg object-cover" />
          <span className="text-lg font-semibold text-foreground">AdiCorp</span>
        </div>
        <nav className="ml-auto flex items-center gap-2">
          <Button variant="ghost" className="text-muted-foreground hidden sm:inline-flex" onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }}>Features</Button>
          <Button variant="ghost" className="text-muted-foreground hidden sm:inline-flex" onClick={() => {
            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
          }}>Pricing</Button>
          <Button variant="ghost" className="text-muted-foreground" onClick={() => navigate("/auth")}>Sign In</Button>
          <Button onClick={() => navigate("/auth")}>
            Get Started <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section ref={heroRef.ref} className="py-20 md:py-28 lg:py-36 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.06),transparent_70%)]" />
          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center relative">
            <div className={`transition-all duration-700 ${heroRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8 border border-border">
                <Zap className="w-3.5 h-3.5 text-primary" />
                Trusted by 1,000+ companies worldwide
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
                The Modern Way to
                <br />
                <span className="text-primary">Manage Your Workforce</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
                From attendance tracking to payroll processing, AdiCorp gives you the tools to manage your entire team efficiently — so you can focus on growing your business.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="text-base px-8 h-12" onClick={() => navigate("/auth")}>
                  Start Free — No Card Required
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
                <Button variant="outline" size="lg" className="text-base px-8 h-12" onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  See How It Works
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section ref={statsRef.ref} className="py-12 border-y border-border bg-muted/30">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 delay-200 ${statsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { value: `${companiesCount.toLocaleString()}+`, label: "Companies" },
                { value: `${(usersCount / 1000).toFixed(0)}K+`, label: "Active Users" },
                { value: `${(uptimeVal / 100).toFixed(2)}%`, label: "Uptime SLA" },
                { value: "<1s", label: "Avg Response" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges */}
        <section className="py-10 bg-background">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
              {trustLogos.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" ref={featuresRef.ref} className="py-20 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className={`text-center mb-14 transition-all duration-700 ${featuresRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Features</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Everything You Need</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Comprehensive tools to manage your entire workforce from a single, intuitive dashboard.
              </p>
            </div>

            <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-5 transition-all duration-700 delay-200 ${featuresRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="bg-card border border-border rounded-xl p-6 group" style={{ transitionDelay: `${i * 50}ms` }}>
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-background">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">How It Works</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Up and Running in Minutes</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Get your HR operations streamlined in four simple steps.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item) => (
                <div key={item.step} className="relative">
                  <div className="text-4xl font-bold text-primary/15 mb-3">{item.step}</div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section ref={benefitsRef.ref} className="py-20 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className={`grid md:grid-cols-2 gap-14 items-center transition-all duration-700 ${benefitsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Why AdiCorp</p>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Modern Teams</h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  AdiCorp helps organizations of all sizes automate HR processes, reduce errors, and focus on what matters most — their people.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Button className="mt-8" onClick={() => navigate("/auth")}>
                  Get Started Free <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
                {[
                  { icon: Users, label: "Active Employees", value: "248", color: "text-primary" },
                  { icon: Clock, label: "Attendance Today", value: "96%", color: "text-primary" },
                  { icon: DollarSign, label: "Payroll Status", value: "Processed", color: "text-primary" },
                  { icon: BarChart3, label: "Reports Generated", value: "1,240", color: "text-primary" },
                  { icon: Shield, label: "Security Score", value: "A+", color: "text-primary" },
                ].map((row) => {
                  const Icon = row.icon;
                  return (
                    <div key={row.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{row.label}</span>
                      </div>
                      <span className={`text-sm font-semibold ${row.color}`}>{row.value}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section ref={testimonialsRef.ref} className="py-20 bg-background">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className={`text-center mb-14 transition-all duration-700 ${testimonialsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Testimonials</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Loved by HR Teams</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                See what our customers have to say about their experience with AdiCorp.
              </p>
            </div>

            <div className={`grid md:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${testimonialsRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {testimonials.map((t) => (
                <div key={t.name} className="bg-card border border-border rounded-xl p-6">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground leading-relaxed mb-5">"{t.quote}"</p>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" ref={pricingRef.ref} className="py-20 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className={`text-center mb-14 transition-all duration-700 ${pricingRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Pricing</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Start free and scale as your team grows. No hidden fees.
              </p>
            </div>

            <div className={`grid md:grid-cols-3 gap-6 transition-all duration-700 delay-200 ${pricingRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                {
                  name: "Starter",
                  price: "Free",
                  period: "forever",
                  description: "For small teams getting started",
                  features: ["Up to 10 employees", "Basic attendance", "Monthly reports", "Email support"],
                  cta: "Start Free",
                  popular: false,
                },
                {
                  name: "Professional",
                  price: "$29",
                  period: "/month",
                  description: "For growing organizations",
                  features: ["Up to 100 employees", "Advanced analytics", "Payroll processing", "Priority support", "Custom reports"],
                  cta: "Start Trial",
                  popular: true,
                },
                {
                  name: "Enterprise",
                  price: "Custom",
                  period: "",
                  description: "For large-scale operations",
                  features: ["Unlimited employees", "Dedicated account manager", "Custom integrations", "SLA guarantee", "On-premise option"],
                  cta: "Contact Sales",
                  popular: false,
                },
              ].map((plan) => (
                <div key={plan.name} className={`bg-card border rounded-xl p-6 relative ${plan.popular ? 'border-primary ring-1 ring-primary' : 'border-border'}`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-lg font-semibold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground">
                        <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section ref={faqRef.ref} className="py-20 bg-background">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto">
            <div className={`text-center mb-14 transition-all duration-700 ${faqRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Common Questions</h2>
            </div>

            <div className={`space-y-4 transition-all duration-700 delay-200 ${faqRef.inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              {[
                { q: "How long does setup take?", a: "Most teams are up and running within 15 minutes. Our guided onboarding walks you through every step." },
                { q: "Is my data secure?", a: "Absolutely. We use 256-bit encryption, comply with GDPR, and maintain SOC 2 Type II certification." },
                { q: "Can I import existing employee data?", a: "Yes. You can bulk import employees via spreadsheet (XLSX/CSV) or add them manually." },
                { q: "Do you offer a free trial?", a: "Yes, our Starter plan is free forever for up to 10 employees. Professional plans include a 14-day free trial." },
              ].map((item) => (
                <div key={item.q} className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-2">{item.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Transform Your HR?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of companies that trust AdiCorp to manage their workforce. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" className="text-base px-8 h-12" onClick={() => navigate("/auth")}>
                Create Your Account <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <p className="text-primary-foreground/60 text-sm mt-4">No credit card required · Free plan available</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png" alt="AdiCorp" className="w-7 h-7 rounded object-cover" />
                <span className="font-semibold text-foreground">AdiCorp</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modern HR management for modern teams.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="cursor-pointer" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>Features</li>
                <li className="cursor-pointer" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>Pricing</li>
                <li>Integrations</li>
                <li>Changelog</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <span className="text-sm text-muted-foreground">© 2025 AdiCorp. All rights reserved.</span>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
