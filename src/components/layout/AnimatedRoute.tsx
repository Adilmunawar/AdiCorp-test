import { ReactNode, useEffect, useState } from "react";

export default function AnimatedRoute({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after mount
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="transition-opacity duration-300 ease-out"
      style={{
        opacity: mounted ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
