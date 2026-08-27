import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata = { title: "Get Started" };

export default function GetStartedPage() {
  return (
    <main className="min-h-screen bg-[#F7F9F7]">
      <header className="pc-shell flex min-h-20 items-center justify-between gap-4 py-3">
        <Logo />
        <Link className="text-right text-xs font-semibold text-[#1E6B4B] hover:underline sm:text-sm" href="/sign-in">Already have an account? Sign in</Link>
      </header>
      <section className="pc-shell pb-16 pt-6 sm:pt-10">
        <div className="mx-auto max-w-3xl text-center">
          <Link href="/pricing" className="mb-6 inline-flex items-center gap-1 text-[10px] font-bold text-[#6D7771] hover:text-[#1E6B4B]"><ArrowLeft className="size-3" />Back to pricing</Link>
          <p className="pc-kicker">Get started</p>
          <h1 className="pc-title mt-4 text-4xl sm:text-5xl">Create your PowerChain workspace.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#66706A]">Set up your identity, organization and authenticated workspace. Your initial operational data is provisioned automatically so you can explore the full product flow.</p>
        </div>
        <Suspense fallback={<RegistrationSkeleton />}><RegisterForm /></Suspense>
        <div className="mx-auto mt-6 flex max-w-2xl flex-wrap justify-center gap-x-5 gap-y-2 text-[10px] font-semibold text-[#727C76]">
          {["Secure authentication", "Signed session", "Workspace-scoped access", "Policy controlled"].map((item) => <span key={item} className="flex items-center gap-1.5"><ShieldCheck className="size-3 text-[#167A4A]" />{item}</span>)}
        </div>
      </section>
    </main>
  );
}

function RegistrationSkeleton() {
  return <div className="pc-card mx-auto mt-10 max-w-2xl p-8" aria-hidden="true"><div className="pc-skeleton h-5 w-1/3 rounded"/><div className="mt-6 grid gap-4 sm:grid-cols-2">{Array.from({length:4}).map((_,i)=><div key={i}><div className="pc-skeleton h-3 w-20 rounded"/><div className="pc-skeleton mt-2 h-12 rounded-xl"/></div>)}</div><div className="pc-skeleton mt-6 h-12 rounded-xl"/></div>;
}
