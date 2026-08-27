export const faqItems = [
  { q: "What is PowerChain Copilot?", a: "PowerChain Copilot is an AI-assisted workspace for renewable infrastructure, operational intelligence, evidence review, and governed onchain workflows." },
  { q: "Who is PowerChain designed for?", a: "Energy operators, renewable asset owners, infrastructure teams, analysts, and organizations coordinating digital-energy workflows." },
  { q: "Can I use PowerChain without connecting a wallet?", a: "Yes. Core exploration and operational workflows do not require a wallet. Wallet signing is introduced only when a workflow explicitly requires onchain authorization." },
  { q: "Does Copilot automatically execute actions?", a: "No. Sensitive workflows separate analysis, review, approval, and execution. Policy and explicit user authorization remain part of the execution boundary." },
  { q: "Is all operational data written onchain?", a: "No. Only defined verification records and transactions are submitted onchain. Operational telemetry remains governed by the relevant data and evidence policies." },
  { q: "Which platforms are supported?", a: "The frontend is designed for Web, iOS, Android, macOS, and Windows delivery surfaces. Availability can be configured independently for each release channel." },
] as const;
