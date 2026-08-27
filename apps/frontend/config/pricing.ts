export const pricingPlans = [
  {
    id: "free", name: "Free", eyebrow: "Explore PowerChain", description: "For evaluation, individual analysis, and representative data.", price: "$0", suffix: "/month", cta: "Start Free", href: "/get-started?plan=free", featured: false,
    features: ["Copilot access", "Seeded workspace", "Asset registry", "Approval workflow", "Community support"],
  },
  {
    id: "pro", name: "Pro", eyebrow: "Operate with Copilot", description: "For energy professionals managing governed operational workflows.", price: "Custom", suffix: "", cta: "Request Pro Access", href: "/contact?intent=pro", featured: true,
    features: ["Full Copilot workspace", "Asset intelligence", "Advanced analysis", "Evidence workflows", "Approval controls", "Higher usage limits"],
  },
  {
    id: "business", name: "Business", eyebrow: "Run Energy Operations", description: "For infrastructure teams that require governance and integrations.", price: "Contact", suffix: "sales", cta: "Contact Sales", href: "/contact?intent=business", featured: false,
    features: ["Multi-user organizations", "Roles and permissions", "Approval policies", "Production data adapter", "API integrations", "Priority support"],
  },
] as const;
