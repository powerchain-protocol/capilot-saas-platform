import { env, hasManagedAi } from "./env";
import type { Asset } from "@/lib/types/domain";

export type CopilotReply={text:string;mode:"managed"|"demo";actions:{label:string;href:string}[]};

export async function generateCopilotReply(prompt:string,assets:Asset[]):Promise<CopilotReply>{
  if(hasManagedAi){
    try{
      const context=assets.map(a=>`${a.name}: ${a.type}, ${a.capacityMw} MW, ${a.availability}% available, ${a.status}, verified=${a.verified}`).join("\n");
      const res=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{authorization:`Bearer ${env.openAiKey}`,"content-type":"application/json"},body:JSON.stringify({model:env.openAiModel,input:[{role:"system",content:[{type:"input_text",text:"You are PowerChain Copilot. Answer concisely using only supplied workspace context. Never claim real-world settlement or live telemetry unless the context says so. Label demo/sample values clearly."}]},{role:"user",content:[{type:"input_text",text:`Workspace assets:\n${context}\n\nUser request: ${prompt}`}]}]})});
      if(res.ok){const data:any=await res.json();const text=data.output_text||data.output?.flatMap((o:any)=>o.content||[]).map((c:any)=>c.text).filter(Boolean).join("\n");if(text)return{text,mode:"managed",actions:actionsFor(prompt)};}
    }catch{/* fail closed to deterministic demo answer */}
  }
  const total=assets.reduce((s,a)=>s+a.capacityMw,0);const avg=assets.length?assets.reduce((s,a)=>s+a.availability,0)/assets.length:0;const attention=assets.filter(a=>a.status!=="operational");
  const lower=prompt.toLowerCase();let text=`Demo workspace summary: ${assets.length} connected assets represent ${total.toFixed(0)} MW with average availability of ${avg.toFixed(1)}%. ${attention.length?`${attention.length} asset${attention.length===1?"":"s"} require attention.`:"No seeded assets currently require attention."}`;
  if(lower.includes("solar")){const solar=assets.find(a=>a.type==="solar");if(solar)text=`Demo asset analysis — ${solar.name}: ${solar.capacityMw} MW, ${solar.availability}% availability, status ${solar.status}, ${solar.verified?"verification evidence present":"verification evidence not present"}. This is representative product data, not live telemetry.`;}
  if(lower.includes("approval"))text="There are policy-gated actions waiting in the Approval Center. Open Approvals to review evidence and explicitly approve or request changes; Copilot does not auto-execute them.";
  if(lower.includes("treasury")||lower.includes("settlement"))text="Treasury and settlement values in this demo are representative. PowerChain keeps analysis, approval, execution, and verification as separate states so a suggested action cannot become a settlement without authorization.";
  return{text,mode:"demo",actions:actionsFor(prompt)};
}
function actionsFor(prompt:string){const q=prompt.toLowerCase();if(q.includes("approval"))return[{label:"Open approvals",href:"/dashboard/approvals"},{label:"View assets",href:"/dashboard/assets"}];return[{label:"View assets",href:"/dashboard/assets"},{label:"Open approvals",href:"/dashboard/approvals"},{label:"Workspace settings",href:"/dashboard/settings"}];}
