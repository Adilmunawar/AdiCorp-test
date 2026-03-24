import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { PERMISSION_ERROR_EVENT } from "@/lib/permissionErrors";

type PermissionEventDetail = {
  title: string;
  description: string;
  signature: string;
};

export default function PermissionErrorToaster() {
  const lastShownRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<PermissionEventDetail>;
      const detail = customEvent.detail;

      if (!detail?.signature) return;

      const now = Date.now();
      const lastShownAt = lastShownRef.current[detail.signature] || 0;
      if (now - lastShownAt < 3000) return;

      lastShownRef.current[detail.signature] = now;
      toast.error(detail.title, {
        description: detail.description,
        duration: 6000,
      });
    };

    window.addEventListener(PERMISSION_ERROR_EVENT, handler as EventListener);
    return () => window.removeEventListener(PERMISSION_ERROR_EVENT, handler as EventListener);
  }, []);

  return null;
}
