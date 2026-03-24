
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, loading, userProfile } = useAuth();
  const location = useLocation();
  const isOnboardingRoute = location.pathname === "/onboarding";
  const requiresOnboarding = !!user && userProfile !== null && !userProfile?.company_id;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiresOnboarding && !isOnboardingRoute) {
    const intendedPath = `${location.pathname}${location.search}${location.hash}`;
    sessionStorage.setItem("post_onboarding_path", intendedPath);
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
