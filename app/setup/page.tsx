import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { SetupClient } from "@/components/setup/setup-client";
import { installConfig, type Platform } from "@/config/install";
import { isAllowedInstallSource, type InstallSource } from "@/config/rules";

export const metadata = { title: "Setup" };

export default async function SetupPage({ searchParams }: { searchParams: Promise<{ platform?: string; source?: string }> }) {
  const params = await searchParams;
  const initialPlatform = installConfig.platforms.includes(params.platform as Platform) ? params.platform as Platform : "Web";
  const initialSource = params.source && isAllowedInstallSource(params.source) ? params.source as InstallSource : undefined;

  return (
    <>
      <Navbar />
      <main className="bg-[#F7F9F7] py-14 sm:py-20">
        <div className="pc-shell">
          <div className="mx-auto mb-9 max-w-3xl text-center sm:mb-12">
            <p className="pc-kicker">PowerChain setup</p>
            <h1 className="mt-4 text-4xl font-bold tracking-[-.055em] sm:text-5xl">Install securely. Start quickly.</h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#66706A]">Choose a platform and trusted distribution source. GitHub Releases, Google Drive, managed stores, and the web app are routed through one canonical setup flow.</p>
          </div>
          <SetupClient initialPlatform={initialPlatform} initialSource={initialSource} />
        </div>
      </main>
      <Footer />
    </>
  );
}
