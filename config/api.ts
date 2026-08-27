export const API_BASE = "/api/v1";

export const apiRoutes = {
  health: `${API_BASE}/health`,
  services: `${API_BASE}/services`,
  dashboard: `${API_BASE}/dashboard`,
  assets: `${API_BASE}/assets`,
  approvals: `${API_BASE}/approvals`,
  approval: (id: string) => `${API_BASE}/approvals/${encodeURIComponent(id)}`,
  copilot: `${API_BASE}/copilot`,
  profile: `${API_BASE}/profile`,
  contact: `${API_BASE}/contact`,
  auth: {
    signIn: `${API_BASE}/auth/sign-in`,
    signOut: `${API_BASE}/auth/sign-out`,
    register: `${API_BASE}/auth/register`,
    demo: `${API_BASE}/auth/demo`,
    session: `${API_BASE}/auth/session`,
  },
  marketPrice: `${API_BASE}/market/price`,
  solanaNetwork: `${API_BASE}/network/solana`,
  securitySession: `${API_BASE}/security/session`,
} as const;
