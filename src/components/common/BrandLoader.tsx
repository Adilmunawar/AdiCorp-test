import { ADICORP_LOGO_PATH } from "@/lib/branding";

interface BrandLoaderProps {
  message?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

export default function BrandLoader({
  message = "Loading your workspace...",
  subtitle = "Please wait a moment",
  fullScreen = false,
}: BrandLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center px-4 ${fullScreen ? "min-h-screen" : "min-h-[36vh]"}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card/95 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-4 flex h-24 w-24 items-center justify-center">
            <span className="absolute inline-flex h-20 w-20 rounded-2xl border border-primary/30 animate-ping motion-reduce:animate-none" />
            <span className="absolute inline-flex h-24 w-24 rounded-2xl border border-primary/20 animate-[pulse_2s_ease-in-out_infinite] motion-reduce:animate-none" />
            <div className="relative inline-flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-primary/25 bg-primary/15">
              <img src={ADICORP_LOGO_PATH} alt="AdiCorp" className="h-full w-full object-cover" />
            </div>
          </div>

          <p className="text-sm font-semibold text-foreground">{message}</p>
          <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>

          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <span className="loader-progress-line block h-full w-1/2 rounded-full bg-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}