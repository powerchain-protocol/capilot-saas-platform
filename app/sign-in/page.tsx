import { Suspense } from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata = { title: "Sign In" };

export default function SignInPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#F7F9F7] p-5">
      <div className="pointer-events-none absolute inset-0 pc-grid-lines opacity-35" />
      <div className="pointer-events-none absolute -right-32 top-16 size-96 rounded-full bg-[#E6F0E9] blur-3xl" />
      <div className="relative w-full max-w-md rounded-[26px] border border-[#DCE2DD] bg-white p-6 shadow-[0_30px_80px_rgba(16,21,19,.08)] sm:p-8">
        <div className="flex items-center justify-between gap-3"><Logo /><span className="rounded-full bg-[#F0F6F2] px-2.5 py-1 text-[8px] font-bold text-[#167A4A]">SECURE</span></div>
        <h1 className="mt-10 text-3xl font-bold tracking-[-.04em]">Welcome back.</h1>
        <p className="mt-2 text-sm leading-6 text-[#66706A]">Sign in to your PowerChain Copilot workspace.</p>
        <Suspense fallback={<SignInSkeleton />}><SignInForm /></Suspense>
        <div className="mt-6 border-t border-[#EDF0EE] pt-4 text-center text-[9px] leading-4 text-[#8A938D]"><ShieldCheck className="mr-1 inline size-3 text-[#167A4A]" />Protected by signed workspace sessions and server-side authorization.</div>
      </div>
    </main>
  );
}

function SignInSkeleton() { return <div className="mt-7 space-y-4" aria-hidden="true"><div className="pc-skeleton h-12 rounded-xl"/><div className="pc-skeleton h-12 rounded-xl"/><div className="pc-skeleton h-12 rounded-xl"/></div>; }
