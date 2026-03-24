const normalizeBaseUrl = (value: string): string => {
  const trimmed = value.trim();
  if (!trimmed) return "";

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const url = new URL(withProtocol);
    return url.origin;
  } catch {
    return "";
  }
};

const getConfiguredBaseUrl = (): string => {
  const envCandidates = [
    import.meta.env.VITE_PUBLIC_APP_URL as string | undefined,
    import.meta.env.VITE_APP_URL as string | undefined,
  ];

  for (const candidate of envCandidates) {
    if (!candidate) continue;
    const normalized = normalizeBaseUrl(candidate);
    if (normalized) return normalized;
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return "";
};

export const getAuthRedirectUrl = (path = "/auth"): string => {
  const baseUrl = getConfiguredBaseUrl();

  if (!baseUrl) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
