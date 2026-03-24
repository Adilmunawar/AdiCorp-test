import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, CheckCircle2, ShieldCheck } from "lucide-react";
import CompanySetupForm from "@/components/company/CompanySetupForm";
import { useAuth } from "@/context/AuthContext";

const STEPS = [
  {
    title: "Account Created",
    description: "Your login is ready and secure.",
    icon: CheckCircle2,
  },
  {
    title: "Set Up Company",
    description: "Complete company details to unlock your workspace.",
    icon: Building2,
  },
  {
    title: "Start Managing",
    description: "Access dashboard actions after setup is complete.",
    icon: ShieldCheck,
  },
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, loading, userProfile } = useAuth();

  const destination = useMemo(() => sessionStorage.getItem("post_onboarding_path") || "/dashboard", []);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
      return;
    }

    if (!loading && userProfile?.company_id) {
      sessionStorage.removeItem("post_onboarding_path");
      navigate(destination, { replace: true });
    }
  }, [loading, user, userProfile?.company_id, navigate, destination]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Preparing onboarding...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-16">
        <div className="mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Welcome to AdiCorp</h1>
          <p className="mt-2 text-muted-foreground text-base md:text-lg">
            Let’s complete your first-time setup before unlocking dashboard actions.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <section className="rounded-3xl border border-border bg-card p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground mb-6">Onboarding Wizard</h2>
            <ol className="space-y-4">
              {STEPS.map((step, index) => {
                const Icon = step.icon;
                const state = index < 1 ? "complete" : index === 1 ? "active" : "pending";

                return (
                  <li
                    key={step.title}
                    className="rounded-2xl border border-border bg-background/70 p-4 flex items-start gap-3"
                  >
                    <div
                      className={`mt-0.5 rounded-xl p-2 ${
                        state === "complete"
                          ? "bg-primary/15 text-primary"
                          : state === "active"
                            ? "bg-accent text-accent-foreground"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Step {index + 1}</p>
                      <h3 className="font-semibold text-foreground">{step.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>

          <section>
            <CompanySetupForm
              onComplete={() => {
                sessionStorage.removeItem("post_onboarding_path");
                navigate(destination, { replace: true });
              }}
            />
          </section>
        </div>
      </div>
    </div>
  );
}
