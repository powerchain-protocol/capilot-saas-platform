"use client";

import { useMemo } from "react";
import { GENERATED_API_OPERATIONS, GENERATED_API_VERSION, GENERATED_APP_GATEWAY_URL, GENERATED_PUBLIC_API_URL } from "@/generators/api/generated";

export function useApiGenerator() {
  return useMemo(() => ({
    version: GENERATED_API_VERSION,
    publicBaseUrl: GENERATED_PUBLIC_API_URL,
    appGatewayBaseUrl: GENERATED_APP_GATEWAY_URL,
    operations: GENERATED_API_OPERATIONS
  }), []);
}
