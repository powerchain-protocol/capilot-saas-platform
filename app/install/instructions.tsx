import { CheckCircle2 } from "lucide-react";
export type Platform = "macOS"|"Windows"|"iOS"|"Android"|"Web";
const steps: Record<Platform,string[]> = {
  macOS:["Request native beta access","Receive a signed PowerChain build when your beta is approved","Install the signed application","Sign in to your workspace","Connect optional organization, asset, and wallet integrations"],
  Windows:["Request native beta access","Receive the signed PowerChain installer when approved","Complete the operating-system prompts","Launch PowerChain from Start","Sign in and synchronize your workspace"],
  iOS:["Request mobile beta access","Open the approved beta or store distribution when available","Install PowerChain Copilot","Sign in securely","Enable only the notifications you need"],
  Android:["Request mobile beta access","Open the approved beta or store distribution when available","Install PowerChain Copilot","Sign in securely","Connect your workspace"],
  Web:["Open the PowerChain web application","Sign in","Select or create a workspace","Review environment status","Start Copilot"],
};
export function InstallInstructions({platform}:{platform:Platform}){return <ol className="mt-6 space-y-3">{steps[platform].map((s,i)=><li key={s} className="flex gap-3 rounded-xl border border-[#E0E5E1] bg-white p-4"><span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#EAF3ED] text-xs font-bold text-[#167A4A]">{i+1}</span><div><b className="text-sm">{s}</b>{i===steps[platform].length-1&&<p className="mt-1 text-[10px] text-[#7B8580]">Keep signing and execution controls explicit. PowerChain never asks you to expose private keys.</p>}</div></li>)}</ol>}
