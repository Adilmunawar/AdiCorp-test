
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Status = "loading" | "success" | "error";

export default function AuthConfirm() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handleConfirmation = async () => {
      try {
        // Supabase appends tokens as hash fragments: #access_token=...&type=signup
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        // Also check for error in hash
        const errorDescription = hashParams.get("error_description");
        if (errorDescription) {
          setStatus("error");
          setMessage(decodeURIComponent(errorDescription));
          return;
        }

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            setStatus("error");
            setMessage(error.message);
            return;
          }

          if (type === "recovery") {
            setStatus("success");
            setMessage("Password reset verified. Redirecting to reset your password...");
            setTimeout(() => navigate("/auth", { replace: true }), 2000);
          } else {
            setStatus("success");
            setMessage("Your email has been verified successfully! Redirecting to dashboard...");
            setTimeout(() => navigate("/dashboard", { replace: true }), 2500);
          }
        } else {
          // If no tokens, try the URL search params (some flows use query params)
          const urlParams = new URLSearchParams(window.location.search);
          const tokenHash = urlParams.get("token_hash");
          const urlType = urlParams.get("type");

          if (tokenHash && urlType) {
            const { error } = await supabase.auth.verifyOtp({
              token_hash: tokenHash,
              type: urlType as any,
            });

            if (error) {
              setStatus("error");
              setMessage(error.message);
              return;
            }

            setStatus("success");
            setMessage("Your email has been verified successfully! Redirecting...");
            setTimeout(() => navigate("/dashboard", { replace: true }), 2500);
          } else {
            setStatus("error");
            setMessage("Invalid or expired confirmation link. Please try again.");
          }
        }
      } catch (err: any) {
        setStatus("error");
        setMessage(err?.message || "An unexpected error occurred.");
      }
    };

    handleConfirmation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <img
            src="/AdilMunawar-Uploads/31e3e556-6bb0-44a2-bd2d-6d5fa04f0ba9.png"
            alt="AdiCorp Logo"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <span className="text-xl font-bold text-foreground">AdiCorp</span>
        </div>

        {/* Status Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm space-y-5">
          {status === "loading" && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Verifying your email</h2>
                <p className="text-muted-foreground mt-2 text-sm">Please wait while we confirm your account...</p>
              </div>
            </>
          )}

          {status === "success" && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Verified!</h2>
                <p className="text-muted-foreground mt-2 text-sm">{message}</p>
              </div>
              <div className="pt-2">
                <div className="h-1.5 w-32 mx-auto rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-[progress_2.5s_ease-in-out]" />
                </div>
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-destructive" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Verification Failed</h2>
                <p className="text-muted-foreground mt-2 text-sm">{message}</p>
              </div>
              <Button onClick={() => navigate("/auth")} className="mt-2">
                Back to Login <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </div>

        <p className="text-xs text-muted-foreground">© 2026 AdiCorp. All rights reserved.</p>
      </div>
    </div>
  );
}
