import { Logo } from "@/components/brand/logo";

export default function Loading() {
  return <div className="grid min-h-screen place-items-center bg-[#F7F9F7]"><div className="flex flex-col items-center"><Logo/><div className="mt-6 h-1 w-32 overflow-hidden rounded-full bg-[#E0E6E2]"><div className="h-full w-1/2 animate-pulse rounded-full bg-[#1E6B4B]"/></div><p className="mt-3 text-xs text-[#7B8580]">Loading PowerChain Copilot…</p></div></div>;
}
