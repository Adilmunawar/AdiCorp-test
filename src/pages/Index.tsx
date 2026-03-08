
import { useEffect } from "react";
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
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description:
        "Centralized employee database with profiles, roles, and organizational hierarchy.",
    },
    {
      icon: Clock,
      title: "Time & Attendance",
      description:
        "Automated attendance tracking with real-time monitoring and overtime calculations.",
    },
    {
      icon: DollarSign,
      title: "Payroll Processing",
      description:
        "Accurate salary calculations, tax deductions, and compliant payroll operations.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Interactive dashboards with actionable insights for informed decision making.",
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description:
        "Enterprise-grade security with role-based access and data encryption.",
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description:
        "Streamlined approval chains and automated notifications for efficiency.",
    },
  ];

  const benefits = [
    "Reduce payroll processing time by 80%",
    "Real-time workforce visibility across locations",
    "Automated compliance with labor regulations",
    "Secure, cloud-based with 99.99% uptime",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border bg-background sticky top-0 z-50">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png"
            alt="AdiCorp Logo"
            className="w-9 h-9 rounded-lg object-cover"
          />
          <span className="text-lg font-semibold text-foreground">
            AdiCorp
          </span>
        </div>
        <nav className="ml-auto flex items-center gap-3">
          <Button
            variant="ghost"
            className="text-muted-foreground"
            onClick={() => navigate("/auth")}
          >
            Sign In
          </Button>
          <Button onClick={() => navigate("/auth")}>
            Get Started
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              HR Management Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Streamline Your
              <br />
              <span className="text-primary">Workforce Operations</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              A comprehensive HR management system that simplifies employee
              management, attendance tracking, and payroll processing — all in
              one place.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-16">
              <Button
                size="lg"
                className="text-base px-8"
                onClick={() => navigate("/auth")}
              >
                Start Free Trial
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8"
                onClick={() => navigate("/auth")}
              >
                View Demo
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              {[
                { value: "1,000+", label: "Companies" },
                { value: "25K+", label: "Users" },
                { value: "99.99%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-muted/40">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-foreground mb-3">
                Everything You Need
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Comprehensive tools to manage your entire workforce from a single
                dashboard.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="bg-card border border-border rounded-xl p-6"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">
                  Built for Modern Teams
                </h2>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  AdiCorp helps organizations of all sizes automate HR processes,
                  reduce errors, and focus on what matters — their people.
                </p>
                <ul className="space-y-4">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-foreground text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-muted/50 border border-border rounded-2xl p-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Active Employees</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">248</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Attendance Today</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">96%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Payroll Status</span>
                    </div>
                    <span className="text-sm font-semibold text-teal-600">Processed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-primary">
          <div className="container px-4 md:px-6 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of companies that trust AdiCorp for their HR
              management needs.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8"
              onClick={() => navigate("/auth")}
            >
              Create Your Account
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img
              src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png"
              alt="AdiCorp"
              className="w-6 h-6 rounded object-cover"
            />
            <span className="text-sm text-muted-foreground">
              © 2025 AdiCorp. All rights reserved.
            </span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <span>Privacy</span>
            <span>Terms</span>
            <span>Support</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
