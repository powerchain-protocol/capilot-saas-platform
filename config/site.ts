import { APP_DESCRIPTION, APP_NAME, APP_VERSION } from "@/config/app";
import { navigation, routes } from "@/config/navigation";

export const siteConfig = {
  name: APP_NAME,
  version: APP_VERSION,
  description: APP_DESCRIPTION,
  nav: navigation,
  routes,
} as const;
