import { frontendEnvironment } from "@/config/environment";
export { API_BASE, endpoints as apiRoutes, wsEndpoints } from "@/lib/powerchain/endpoints";

export const apiOrigins = {
  sameOrigin: "/api/v1",
  publicV1: frontendEnvironment.apiBaseUrl,
  appGatewayV1: frontendEnvironment.appApiBaseUrl
} as const;

export const publicApiFallbacks = [apiOrigins.publicV1, apiOrigins.appGatewayV1] as const;
