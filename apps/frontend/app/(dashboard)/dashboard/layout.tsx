import { DashboardSessionGate } from "@/components/dashboard/dashboard-session-gate";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardSessionGate>{children}</DashboardSessionGate>;
}
