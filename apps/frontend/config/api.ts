export { API_BASE, endpoints as apiRoutes, wsEndpoints } from "@/lib/powerchain/endpoints";

export const apiOrigins = {
  sameOrigin: "/api/v1",
  publicV1: process.env.NEXT_PUBLIC_POWERCHAIN_API_URL ?? "https://api.capilot.powerchain.energy/v1",
  appGatewayV1: process.env.NEXT_PUBLIC_POWERCHAIN_APP_API_URL ?? "https://capilot.powerchain.app/v1"
} as const;

export const publicApiFallbacks = [apiOrigins.publicV1, apiOrigins.appGatewayV1] as const;
