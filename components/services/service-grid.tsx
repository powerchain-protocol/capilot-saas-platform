import { serviceCatalog } from "@/data/services";
import { ServiceCard } from "./service-card";

export function ServiceGrid() {
  return (
    <section className="bg-[#F7F9F7] py-16 sm:py-20" aria-labelledby="services-heading">
      <div className="pc-shell">
        <div className="max-w-2xl"><p className="pc-kicker">Services</p><h2 id="services-heading" className="mt-3 text-3xl font-bold tracking-[-.045em] sm:text-4xl">Provider adapters without provider lock-in.</h2><p className="mt-3 text-sm leading-6 text-[#66706A]">Pyth, Birdeye, Helius, and Solana RPC integrations stay behind server-side interfaces, short-lived caches, timeouts, and fail-closed configuration.</p></div>
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">{serviceCatalog.map((service) => <ServiceCard key={service.key} {...service} />)}</div>
      </div>
    </section>
  );
}
