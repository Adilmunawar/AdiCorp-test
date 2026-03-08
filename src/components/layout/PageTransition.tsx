import { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"enter" | "exit">("enter");

  useEffect(() => {
    if (children !== displayChildren) {
      setPhase("exit");
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setPhase("enter");
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [children, location.pathname]);

  return (
    <div
      className="transition-all duration-300 ease-out"
      style={{
        opacity: phase === "enter" ? 1 : 0,
        transform: phase === "enter" ? "translateY(0) scale(1)" : "translateY(12px) scale(0.99)",
      }}
    >
      {displayChildren}
    </div>
  );
}
