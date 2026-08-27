export type LegalSection = { heading: string; body: string };
export type LegalDocument = { title: string; description: string; updated: string; sections: LegalSection[] };

export const LEGAL_VERSION = "2026-08-27";
const updated = "August 27, 2026";

export const legalDocuments: Record<"terms" | "privacy" | "cookies" | "disclaimer", LegalDocument> = {
  terms: {
    title: "Terms of Service",
    description: "Terms governing access to and use of PowerChain Copilot.",
    updated,
    sections: [
      { heading: "1. Service", body: "PowerChain Copilot provides software interfaces for renewable-infrastructure information, AI-assisted analysis, workspace collaboration, approvals, and configured blockchain or external-service integrations. Features may vary by deployment, plan, jurisdiction, and connected provider." },
      { heading: "2. Accounts and security", body: "You are responsible for maintaining accurate account information, protecting credentials, and ensuring that authorized users follow your organization’s policies. Do not share authentication credentials or use the service to bypass security, authorization, or approval controls." },
      { heading: "3. AI-assisted outputs", body: "Copilot outputs may be incomplete, inaccurate, delayed, or unsuitable for a particular operational decision. Users must independently verify material facts, telemetry, prices, balances, approvals, and proposed actions before relying on them." },
      { heading: "4. Operational and onchain actions", body: "Analysis does not constitute authorization. Actions that affect energy infrastructure, funds, wallets, contracts, or external systems must pass the applicable policy, approval, signature, and execution controls. Blockchain transactions may be irreversible." },
      { heading: "5. Acceptable use", body: "You may not misuse the service, attempt unauthorized access, interfere with availability, introduce malicious code, scrape protected data, circumvent quotas or controls, or use PowerChain in violation of applicable law or third-party rights." },
      { heading: "6. Third-party services", body: "PowerChain may integrate with third-party infrastructure, data, AI, wallet, blockchain, and cloud providers. Those services remain subject to their own terms, availability, data practices, and technical limitations." },
      { heading: "7. Fees and plans", body: "Any commercial pricing, usage allowances, taxes, payment obligations, credits, or enterprise terms shown in a configured production deployment are governed by the applicable order form or commercial agreement. Demo values are representative only." },
      { heading: "8. Availability and changes", body: "The service may change as features, integrations, security controls, and infrastructure evolve. Production service levels, support commitments, warranties, liability limits, and termination rights should be governed by the final customer agreement approved for the deployment." },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    description: "How PowerChain Copilot handles account, workspace, operational, and support data.",
    updated,
    sections: [
      { heading: "Information processed", body: "The application may process account identity, workspace membership, configuration, asset metadata, operational records, approval activity, Copilot conversations, support requests, security metadata, and technically necessary request information." },
      { heading: "How information is used", body: "Information is used to authenticate users, provide workspace functionality, enforce authorization, maintain security, operate configured integrations, respond to support requests, and improve reliability." },
      { heading: "Security metadata", body: "The application may transiently inspect request metadata such as IP address, headers, timestamps, and rate-limit keys to protect the service. The reference implementation does not persist raw IP addresses to the application database." },
      { heading: "Providers and transfers", body: "Production deployments may use configured cloud, database, AI, blockchain, oracle, RPC, analytics, or support providers. Operators should document final subprocessors, regions, retention periods, and transfer mechanisms before public launch." },
      { heading: "Your choices", body: "Workspace administrators should provide appropriate processes for access, correction, export, retention, and deletion requests as required by the deployment’s contractual and legal obligations." },
    ],
  },
  cookies: {
    title: "Cookie Policy",
    description: "Cookies and local preferences used by PowerChain Copilot.",
    updated,
    sections: [
      { heading: "Strictly necessary cookies", body: "PowerChain Copilot uses a signed HttpOnly session cookie to keep authenticated sessions secure. A small preference cookie may record that the cookie notice was acknowledged. These functions are required for sign-in and basic application operation." },
      { heading: "Remember me", body: "When you explicitly select Remember me at sign-in, the session cookie may persist for the configured remembered-session period. Without that option, the browser cookie is session-scoped while the signed session token still has a limited lifetime." },
      { heading: "Optional cookies", body: "The reference application does not enable advertising or marketing cookies. Analytics or other optional cookies should not be added until the deployment has implemented the applicable consent and policy requirements." },
      { heading: "Managing cookies", body: "You can clear browser cookies at any time. Removing the authentication cookie signs you out. Browser privacy controls may affect other locally stored interface preferences." },
    ],
  },
  disclaimer: {
    title: "Product Disclaimer",
    description: "Important limitations for AI, energy, financial, and blockchain workflows.",
    updated,
    sections: [
      { heading: "Not professional advice", body: "PowerChain Copilot is software. Content and AI outputs are not legal, tax, investment, financial, engineering, grid-control, safety, or regulatory advice. Obtain qualified professional review where appropriate." },
      { heading: "Verify operational truth", body: "Telemetry, market data, forecasts, balances, asset state, and evidence can be delayed, incomplete, simulated, or supplied by third parties. Verify critical information against authoritative sources before making operational decisions." },
      { heading: "Human authorization", body: "Copilot recommendations are not execution authority. Sensitive actions should remain subject to policy evaluation, evidence review, simulation where applicable, explicit user approval, and wallet or system authorization." },
      { heading: "Blockchain and tokens", body: "Blockchain transactions can be irreversible and may involve network fees, smart-contract risk, provider outages, and market volatility. PWRC, credits, tokenized receipts, or other digital representations shown in demo or development environments must not be interpreted as guaranteed financial value or investment performance." },
      { heading: "Third-party dependencies", body: "External networks, data providers, AI models, wallets, exchanges, oracles, cloud services, and APIs are outside PowerChain’s direct control and may fail, change, throttle, or return inaccurate information." },
    ],
  },
};

export const legalDisclaimer = "AI output and connected data can be wrong or delayed. Verify operational, financial, legal, safety, and onchain decisions against authoritative evidence before acting.";
