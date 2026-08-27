export const navigation = [
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/solutions" },
  { label: "Copilot", href: "/dashboard/copilot" },
  { label: "Pricing", href: "/pricing" },
  { label: "Install", href: "/install" },
  { label: "Docs", href: "/docs" },
] as const;

export const routes = {
  home: "/",
  getStarted: "/get-started",
  product: "/product",
  pricing: "/pricing",
  install: "/install",
  setup: "/setup",
  signIn: "/sign-in",
  dashboard: "/dashboard",
  copilot: "/dashboard/copilot",
  contact: "/contact",
  docs: "/docs",
  security: "/security",
  status: "/status",
} as const;
