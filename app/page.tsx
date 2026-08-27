import dynamic from "next/dynamic";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { TrustStrip } from "@/components/marketing/trust-strip";
import { Footer } from "@/components/marketing/footer";

const SectionFallback = () => (
  <div className="pc-shell my-12 overflow-hidden rounded-[24px] border border-[#E1E6E2] bg-white p-6" aria-hidden="true">
    <div className="pc-skeleton h-4 w-32 rounded-full" />
    <div className="pc-skeleton mt-5 h-10 max-w-xl rounded-xl" />
    <div className="mt-8 grid gap-4 md:grid-cols-3"><div className="pc-skeleton h-48 rounded-2xl" /><div className="pc-skeleton h-48 rounded-2xl" /><div className="pc-skeleton h-48 rounded-2xl" /></div>
  </div>
);

const DashboardPreview = dynamic(() => import("@/components/marketing/dashboard-preview").then((m) => m.DashboardPreview), { loading: SectionFallback });
const Workflow = dynamic(() => import("@/components/marketing/workflow").then((m) => m.Workflow), { loading: SectionFallback });
const Capabilities = dynamic(() => import("@/components/marketing/capabilities").then((m) => m.Capabilities), { loading: SectionFallback });
const ServiceGrid = dynamic(() => import("@/components/services/service-grid").then((m) => m.ServiceGrid), { loading: SectionFallback });
const PwrcCredits = dynamic(() => import("@/components/marketing/pwrc-credits").then((m) => m.PwrcCredits), { loading: SectionFallback });
const Downloads = dynamic(() => import("@/components/marketing/downloads").then((m) => m.Downloads), { loading: SectionFallback });
const Testimonials = dynamic(() => import("@/components/marketing/testimonials").then((m) => m.Testimonials), { loading: SectionFallback });
const PricingSection = dynamic(() => import("@/components/marketing/pricing-section").then((m) => m.PricingSection), { loading: SectionFallback });
const FAQ = dynamic(() => import("@/components/marketing/faq").then((m) => m.FAQ), { loading: SectionFallback });
const FinalCTA = dynamic(() => import("@/components/marketing/final-cta").then((m) => m.FinalCTA), { loading: SectionFallback });

export default function Home() {
  return <><Navbar /><main><Hero /><TrustStrip /><DashboardPreview /><Workflow /><Capabilities /><ServiceGrid /><PwrcCredits /><Downloads /><Testimonials /><PricingSection /><FAQ /><FinalCTA /></main><Footer /></>;
}
