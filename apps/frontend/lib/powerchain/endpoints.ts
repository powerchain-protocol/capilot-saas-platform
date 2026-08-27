export const API_BASE = "/api/v1" as const;

export const endpoints = {
  health: `${API_BASE}/health`,
  services: `${API_BASE}/services`,
  dashboard: `${API_BASE}/dashboard`,
  assets: `${API_BASE}/assets`,
  approvals: `${API_BASE}/approvals`,
  approval: (id: string) => `${API_BASE}/approvals/${encodeURIComponent(id)}`,
  ai: { generate: `${API_BASE}/ai/generate` },
  chat: {
    list: `${API_BASE}/chat`,
    byId: (idOrSlug: string) => `${API_BASE}/chat/${encodeURIComponent(idOrSlug)}`,
    messages: (idOrSlug: string) => `${API_BASE}/chat/${encodeURIComponent(idOrSlug)}/messages`,
  },
  message: (id: string) => `${API_BASE}/messages/${encodeURIComponent(id)}`,
  copilot: `${API_BASE}/copilot`,
  profile: `${API_BASE}/profile`,
  contact: `${API_BASE}/contact`,
  auth: {
    signIn: `${API_BASE}/auth/sign-in`,
    signOut: `${API_BASE}/auth/sign-out`,
    register: `${API_BASE}/auth/register`,
    demo: `${API_BASE}/auth/demo`,
  },
  sessions: {
    current: `${API_BASE}/sessions/current`,
    list: `${API_BASE}/sessions`,
    revoke: (id: string) => `${API_BASE}/sessions/${encodeURIComponent(id)}`,
  },
  marketPrice: `${API_BASE}/market/price`,
  credits: `${API_BASE}/credits`,
  creditLedger: `${API_BASE}/credits/ledger`,
  tokens: `${API_BASE}/tokens`,
  pwrcToken: `${API_BASE}/tokens/pwrc`,
  solanaNetwork: `${API_BASE}/network/solana`,
  securitySession: `${API_BASE}/security/session`,
} as const;

export function websocketEndpoint(path: string): string | null {
  const configured = process.env.NEXT_PUBLIC_POWERCHAIN_WS_URL?.replace(/\/$/, "");
  if (configured) return `${configured}${path.startsWith("/") ? path : `/${path}`}`;
  if (typeof window === "undefined") return null;
  const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const backendPort = process.env.NEXT_PUBLIC_POWERCHAIN_WS_PORT;
  const host = backendPort ? `${window.location.hostname}:${backendPort}` : window.location.host;
  return `${protocol}//${host}${path.startsWith("/") ? path : `/${path}`}`;
}

export const wsEndpoints = {
  chat: (idOrSlug: string) => websocketEndpoint(`/ws/v1/chat/${encodeURIComponent(idOrSlug)}`),
} as const;
