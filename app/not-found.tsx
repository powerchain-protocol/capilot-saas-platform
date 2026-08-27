import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-[#F7F9F7] p-6"><div className="max-w-xl text-center"><Logo className="justify-center"/><p className="pc-kicker mt-12">404</p><h1 className="mt-4 text-5xl font-bold tracking-[-.05em]">This route is off-grid.</h1><p className="mt-4 text-[#66706A]">The page you requested is not available in this PowerChain workspace.</p><div className="mt-8 flex justify-center"><Button href="/" arrow>Return home</Button></div></div></main>;
}
