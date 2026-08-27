import { randomUUID } from "node:crypto";
import { assertDurablePersistence, hasSupabase } from "./env";
import { mutateLocalState, readLocalState } from "./local-store";
import { supabaseRest } from "./supabase-rest";
import type { Activity, Approval, Asset, ContactRequest, LegalAcceptance, Message, Plan, Role, User, Workspace } from "@/lib/types/domain";
import { slugify } from "@/utils/helpers";

const now = () => new Date().toISOString();
const eq = (v: string) => encodeURIComponent(v);

function userFromRow(r: any): User { return { id:r.id,email:r.email,name:r.name,passwordHash:r.password_hash,createdAt:r.created_at }; }
function workspaceFromRow(r:any): Workspace { return { id:r.id,name:r.name,slug:r.slug,plan:r.plan,createdAt:r.created_at }; }
function assetFromRow(r:any): Asset { return { id:r.id,workspaceId:r.workspace_id,name:r.name,type:r.type,location:r.location,capacityMw:Number(r.capacity_mw),availability:Number(r.availability),status:r.status,verified:Boolean(r.verified) }; }
function approvalFromRow(r:any): Approval { return { id:r.id,workspaceId:r.workspace_id,title:r.title,description:r.description,severity:r.severity,amount:r.amount||undefined,status:r.status,updatedAt:r.updated_at }; }
function activityFromRow(r:any): Activity { return { id:r.id,workspaceId:r.workspace_id,kind:r.kind,title:r.title,detail:r.detail,createdAt:r.created_at }; }
function messageFromRow(r:any): Message { return { id:r.id,workspaceId:r.workspace_id,userId:r.user_id,role:r.role,content:r.content,createdAt:r.created_at }; }

export async function findUserByEmail(email: string): Promise<User | null> {
  if (hasSupabase) {
    const rows = await supabaseRest.list<any>("users", `select=*&email=eq.${eq(email.toLowerCase())}&limit=1`);
    return rows[0] ? userFromRow(rows[0]) : null;
  }
  const state = await readLocalState();
  return state.users.find((u)=>u.email.toLowerCase()===email.toLowerCase()) || null;
}

export async function findUserById(id: string): Promise<User | null> {
  if (hasSupabase) {
    const rows = await supabaseRest.list<any>("users", `select=*&id=eq.${eq(id)}&limit=1`);
    return rows[0] ? userFromRow(rows[0]) : null;
  }
  const state = await readLocalState();
  return state.users.find((u)=>u.id===id) || null;
}

export async function createAccount(input: { email:string; name:string; passwordHash:string; workspaceName:string; plan:Plan }) {
  assertDurablePersistence();
  const user: User = { id:randomUUID(), email:input.email.toLowerCase(), name:input.name, passwordHash:input.passwordHash, createdAt:now() };
  const workspace: Workspace = { id:randomUUID(), name:input.workspaceName, slug:`${slugify(input.workspaceName) || "workspace"}-${Math.random().toString(36).slice(2,6)}`, plan:input.plan, createdAt:now() };
  const membership = { id:randomUUID(), userId:user.id, workspaceId:workspace.id, role:"owner" as Role };
  const seeded = seedResources(workspace.id);

  if (hasSupabase) {
    await supabaseRest.insert("users", { id:user.id,email:user.email,name:user.name,password_hash:user.passwordHash,created_at:user.createdAt });
    await supabaseRest.insert("workspaces", { id:workspace.id,name:workspace.name,slug:workspace.slug,plan:workspace.plan,created_at:workspace.createdAt });
    await supabaseRest.insert("memberships", { id:membership.id,user_id:user.id,workspace_id:workspace.id,role:membership.role });
    await supabaseRest.insert("assets", seeded.assets.map(a=>({id:a.id,workspace_id:a.workspaceId,name:a.name,type:a.type,location:a.location,capacity_mw:a.capacityMw,availability:a.availability,status:a.status,verified:a.verified})));
    await supabaseRest.insert("approvals", seeded.approvals.map(a=>({id:a.id,workspace_id:a.workspaceId,title:a.title,description:a.description,severity:a.severity,amount:a.amount,status:a.status,updated_at:a.updatedAt})));
    await supabaseRest.insert("activities", seeded.activities.map(a=>({id:a.id,workspace_id:a.workspaceId,kind:a.kind,title:a.title,detail:a.detail,created_at:a.createdAt})));
  } else {
    await mutateLocalState((state)=>{ state.users.push(user); state.workspaces.push(workspace); state.memberships.push(membership); state.assets.push(...seeded.assets); state.approvals.push(...seeded.approvals); state.activities.push(...seeded.activities); });
  }
  return { user, workspace, role: membership.role };
}

export async function ensureDemoAccount(passwordHash: string) {
  const email = "demo@powerchain.energy";
  const existing = await findUserByEmail(email);
  if (existing) {
    const membership = await getMembershipForUser(existing.id);
    const workspace = membership ? await getWorkspace(membership.workspaceId) : null;
    if (membership && workspace) return { user:existing, workspace, role:membership.role };
  }
  return createAccount({ email, name:"Demo Operator", passwordHash, workspaceName:"PowerChain Demo Energy", plan:"pro" });
}

export async function getMembershipForUser(userId:string) {
  if (hasSupabase) {
    const rows = await supabaseRest.list<any>("memberships", `select=*&user_id=eq.${eq(userId)}&limit=1`);
    const r=rows[0]; return r ? { id:r.id,userId:r.user_id,workspaceId:r.workspace_id,role:r.role as Role } : null;
  }
  const state=await readLocalState(); return state.memberships.find(m=>m.userId===userId)||null;
}

export async function getWorkspace(id:string): Promise<Workspace|null> {
  if (hasSupabase) { const rows=await supabaseRest.list<any>("workspaces",`select=*&id=eq.${eq(id)}&limit=1`); return rows[0]?workspaceFromRow(rows[0]):null; }
  const state=await readLocalState(); return state.workspaces.find(w=>w.id===id)||null;
}

export async function updateProfile(input:{userId:string;workspaceId:string;name:string;workspaceName:string}) {
  assertDurablePersistence();
  if (hasSupabase) {
    const u=await supabaseRest.update<any>("users",`id=eq.${eq(input.userId)}`,{name:input.name});
    const w=await supabaseRest.update<any>("workspaces",`id=eq.${eq(input.workspaceId)}`,{name:input.workspaceName});
    return { user:userFromRow(u[0]), workspace:workspaceFromRow(w[0]) };
  }
  return mutateLocalState((state)=>{
    const user=state.users.find(u=>u.id===input.userId); const workspace=state.workspaces.find(w=>w.id===input.workspaceId);
    if (!user||!workspace) throw new Error("Profile not found"); user.name=input.name; workspace.name=input.workspaceName; return {user,workspace};
  });
}

export async function listAssets(workspaceId:string): Promise<Asset[]> {
  if (hasSupabase) return (await supabaseRest.list<any>("assets",`select=*&workspace_id=eq.${eq(workspaceId)}&order=name.asc`)).map(assetFromRow);
  const state=await readLocalState(); return state.assets.filter(a=>a.workspaceId===workspaceId);
}

export async function listApprovals(workspaceId:string): Promise<Approval[]> {
  if (hasSupabase) return (await supabaseRest.list<any>("approvals",`select=*&workspace_id=eq.${eq(workspaceId)}&order=updated_at.desc`)).map(approvalFromRow);
  const state=await readLocalState(); return state.approvals.filter(a=>a.workspaceId===workspaceId).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt));
}

export async function updateApproval(workspaceId:string,id:string,status:Approval["status"]): Promise<Approval|null> {
  assertDurablePersistence();
  const updatedAt=now();
  if (hasSupabase) {
    const rows=await supabaseRest.update<any>("approvals",`id=eq.${eq(id)}&workspace_id=eq.${eq(workspaceId)}`,{status,updated_at:updatedAt});
    return rows[0]?approvalFromRow(rows[0]):null;
  }
  return mutateLocalState((state)=>{const approval=state.approvals.find(a=>a.id===id&&a.workspaceId===workspaceId); if(!approval)return null; approval.status=status;approval.updatedAt=updatedAt;return approval;});
}

export async function addActivity(workspaceId:string,kind:Activity["kind"],title:string,detail:string) {
  assertDurablePersistence();
  const item:Activity={id:randomUUID(),workspaceId,kind,title,detail,createdAt:now()};
  if(hasSupabase) await supabaseRest.insert("activities",{id:item.id,workspace_id:item.workspaceId,kind:item.kind,title:item.title,detail:item.detail,created_at:item.createdAt});
  else await mutateLocalState(s=>{s.activities.push(item);});
  return item;
}

export async function listActivities(workspaceId:string,limit=10): Promise<Activity[]> {
  if(hasSupabase) return (await supabaseRest.list<any>("activities",`select=*&workspace_id=eq.${eq(workspaceId)}&order=created_at.desc&limit=${limit}`)).map(activityFromRow);
  const state=await readLocalState(); return state.activities.filter(a=>a.workspaceId===workspaceId).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,limit);
}

export async function addMessage(workspaceId:string,userId:string,role:Message["role"],content:string) {
  assertDurablePersistence();
  const item:Message={id:randomUUID(),workspaceId,userId,role,content,createdAt:now()};
  if(hasSupabase) await supabaseRest.insert("messages",{id:item.id,workspace_id:item.workspaceId,user_id:item.userId,role:item.role,content:item.content,created_at:item.createdAt});
  else await mutateLocalState(s=>{s.messages.push(item);});
  return item;
}

export async function listMessages(workspaceId:string,userId:string,limit=30): Promise<Message[]> {
  if(hasSupabase) return (await supabaseRest.list<any>("messages",`select=*&workspace_id=eq.${eq(workspaceId)}&user_id=eq.${eq(userId)}&order=created_at.asc&limit=${limit}`)).map(messageFromRow);
  const state=await readLocalState(); return state.messages.filter(m=>m.workspaceId===workspaceId&&m.userId===userId).sort((a,b)=>a.createdAt.localeCompare(b.createdAt)).slice(-limit);
}

export async function addContact(input:Omit<ContactRequest,"id"|"createdAt">) {
  assertDurablePersistence();
  const item:ContactRequest={id:randomUUID(),createdAt:now(),...input};
  if(hasSupabase) await supabaseRest.insert("contacts",{id:item.id,name:item.name,email:item.email,company:item.company,message:item.message,intent:item.intent,created_at:item.createdAt});
  else await mutateLocalState(s=>{s.contacts.push(item);});
  return item;
}

export async function recordLegalAcceptance(userId:string, version:string) {
  assertDurablePersistence();
  const item:LegalAcceptance={id:randomUUID(),userId,document:"terms",version,acceptedAt:now()};
  if(hasSupabase) await supabaseRest.insert("legal_acceptances",{id:item.id,user_id:item.userId,document:item.document,version:item.version,accepted_at:item.acceptedAt});
  else await mutateLocalState(s=>{s.legalAcceptances.push(item);});
  return item;
}

function seedResources(workspaceId:string) {
  const assets:Asset[]=[
    {id:randomUUID(),workspaceId,name:"Solar Farm 45",type:"solar",location:"Mojave, California",capacityMw:120,availability:98,status:"operational",verified:true},
    {id:randomUUID(),workspaceId,name:"Wind Farm North",type:"wind",location:"Aberdeenshire, Scotland",capacityMw:80,availability:96,status:"operational",verified:true},
    {id:randomUUID(),workspaceId,name:"Battery Site 08",type:"storage",location:"Espoo, Finland",capacityMw:42,availability:94,status:"attention",verified:true},
    {id:randomUUID(),workspaceId,name:"EV Network West",type:"ev",location:"Amsterdam, Netherlands",capacityMw:18,availability:99,status:"operational",verified:false},
  ];
  const approvals:Approval[]=[
    {id:randomUUID(),workspaceId,title:"Energy Batch Verification",description:"Solar Farm 45 · 1,250 MWh · meter evidence complete",severity:"high",status:"pending",updatedAt:now()},
    {id:randomUUID(),workspaceId,title:"Settlement Execution",description:"Treasury settlement to approved counterparty",severity:"medium",amount:"$24,500 USDC",status:"pending",updatedAt:now()},
    {id:randomUUID(),workspaceId,title:"Device Onboarding",description:"GW-3001 · Sensor Gateway · policy checks passed",severity:"low",status:"pending",updatedAt:now()},
  ];
  const activities:Activity[]=[
    {id:randomUUID(),workspaceId,kind:"asset",title:"Wind Farm North · batch verified",detail:"1,250 MWh · evidence accepted",createdAt:now()},
    {id:randomUUID(),workspaceId,kind:"system",title:"Telemetry health check",detail:"4 assets · 98% source freshness",createdAt:now()},
  ];
  return {assets,approvals,activities};
}
