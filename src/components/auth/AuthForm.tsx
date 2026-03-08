
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthForm() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password, { first_name: firstName, last_name: lastName });
      }
    } catch (error) {
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-primary items-center justify-center p-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute top-20 -left-10 w-72 h-72 rounded-full border-2 border-primary-foreground" />
          <div className="absolute bottom-32 right-10 w-96 h-96 rounded-full border border-primary-foreground" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full border border-primary-foreground" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 70%, hsl(168 80% 30% / 0.4) 0%, transparent 60%), radial-gradient(circle at 70% 20%, hsl(168 90% 50% / 0.2) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 max-w-md space-y-8">
          <div className="flex items-center gap-3">
            <img
              src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png"
              alt="AdiCorp Logo"
              className="w-12 h-12 rounded-xl object-cover ring-2 ring-primary-foreground/20"
            />
            <span className="text-2xl font-bold text-primary-foreground tracking-tight">
              AdiCorp
            </span>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl font-bold text-primary-foreground leading-tight">
              Manage your
              <br />
              workforce with
              <br />
              <span className="opacity-80">confidence.</span>
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed">
              Streamlined HR operations, payroll management, and employee tracking — all in one powerful platform.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-4">
            {[
              { value: "500+", label: "Companies" },
              { value: "10K+", label: "Employees" },
              { value: "99.9%", label: "Uptime" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                <div className="text-xs text-primary-foreground/50 uppercase tracking-wider mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-[420px] space-y-8">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <img
              src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png"
              alt="AdiCorp Logo"
              className="w-10 h-10 rounded-xl object-cover"
            />
            <span className="text-xl font-bold text-foreground">AdiCorp HR</span>
          </div>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              {mode === "signin" ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-muted-foreground">
              {mode === "signin"
                ? "Enter your credentials to access your dashboard"
                : "Fill in your details to get started"}
            </p>
          </div>

          {/* Mode toggle pills */}
          <div className="flex bg-muted rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === "signin"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                mode === "signup"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    First Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="pl-10 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Last Name
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="pl-10 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email Address
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Password
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 transition-colors group-focus-within:text-primary" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signin" ? "Enter your password" : "Min. 8 characters"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-12 h-12 rounded-xl border-border/60 bg-muted/30 focus:bg-background transition-colors"
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
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-muted-foreground text-xs pt-4">
            © 2025 AdiCorp HR. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
