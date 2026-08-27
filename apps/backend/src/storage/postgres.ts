import { Pool, type PoolClient, type QueryResultRow } from "pg";
import type {
  AccountBundle,
  Activity,
  Approval,
  ApprovalStatus,
  Asset,
  Chat,
  ContactRequest,
  CreditAccount,
  CreditLedgerEntry,
  Membership,
  Message,
  Plan,
  SessionRecord,
  Store,
  User,
  Workspace
} from "../store/types";
import { createId } from "../utils/ids";
import { entitySlug, slugify } from "../utils/slugs";

function now(): string { return new Date().toISOString(); }
function row<T>(value: QueryResultRow): T { return value as T; }

export class PostgresStore implements Store {
  readonly pool: Pool;
  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString, max: 10, idleTimeoutMillis: 30_000, connectionTimeoutMillis: 5_000 });
  }

  async health() {
    const started = Date.now();
    await this.pool.query("select 1 as ok");
    return { ok: true, adapter: "postgres" as const, latencyMs: Date.now() - started };
  }

  async findUserByEmail(email: string) { const result = await this.pool.query("select id,email,name,password_hash as \"passwordHash\",created_at as \"createdAt\" from users where lower(email)=lower($1) limit 1", [email]); return result.rows[0] ? row<User>(result.rows[0]) : null; }
  async findUserById(id: string) { const result = await this.pool.query("select id,email,name,password_hash as \"passwordHash\",created_at as \"createdAt\" from users where id=$1 limit 1", [id]); return result.rows[0] ? row<User>(result.rows[0]) : null; }
  async getWorkspace(id: string) { const result = await this.pool.query("select id,name,slug,plan,created_at as \"createdAt\" from workspaces where id=$1 limit 1", [id]); return result.rows[0] ? row<Workspace>(result.rows[0]) : null; }
  async getMembershipForUser(userId: string) { const result = await this.pool.query("select id,user_id as \"userId\",workspace_id as \"workspaceId\",role from memberships where user_id=$1 order by id limit 1", [userId]); return result.rows[0] ? row<Membership>(result.rows[0]) : null; }

  async createAccount(input: { name: string; email: string; passwordHash: string; workspaceName: string; plan: Plan }): Promise<AccountBundle> {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      const user: User = { id: createId("usr"), email: input.email.toLowerCase(), name: input.name, passwordHash: input.passwordHash, createdAt: now() };
      const workspace: Workspace = { id: createId("wsp"), name: input.workspaceName, slug: `${slugify(input.workspaceName)}-${Date.now().toString(36)}`, plan: input.plan, createdAt: now() };
      const membership: Membership = { id: createId("mem"), userId: user.id, workspaceId: workspace.id, role: "owner" };
      await client.query("insert into users(id,email,name,password_hash,created_at) values($1,$2,$3,$4,$5)", [user.id,user.email,user.name,user.passwordHash,user.createdAt]);
      await client.query("insert into workspaces(id,name,slug,plan,created_at) values($1,$2,$3,$4,$5)", [workspace.id,workspace.name,workspace.slug,workspace.plan,workspace.createdAt]);
      await client.query("insert into memberships(id,user_id,workspace_id,role) values($1,$2,$3,$4)", [membership.id,membership.userId,membership.workspaceId,membership.role]);
      await this.seedWorkspace(client, workspace.id);
      const initialCredits = user.email === "demo@powerchain.energy" ? "1000000" : "0";
      const creditAccountId = createId("crd");
      await client.query("insert into credit_accounts(id,workspace_id,user_id,asset,decimals,available,reserved,spent,funded,updated_at) values($1,$2,$3,'PWRC',9,$4,0,0,$4,now())", [creditAccountId, workspace.id, user.id, initialCredits]);
      if (initialCredits !== "0") {
        await client.query("insert into credit_ledger(id,account_id,workspace_id,user_id,kind,amount,balance_after,reference,created_at) values($1,$2,$3,$4,'fund',$5,$5,'demo_grant',now())", [createId("clg"), creditAccountId, workspace.id, user.id, initialCredits]);
      }
      await client.query("commit");
      return { user, workspace, membership };
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async ensureDemoAccount(passwordHash: string): Promise<AccountBundle> {
    const existing = await this.findUserByEmail("demo@powerchain.energy");
    if (existing) {
      const membership = await this.getMembershipForUser(existing.id);
      if (!membership) throw new Error("Demo membership is missing.");
      const workspace = await this.getWorkspace(membership.workspaceId);
      if (!workspace) throw new Error("Demo workspace is missing.");
      return { user: existing, workspace, membership };
    }
    return this.createAccount({ name: "Demo Operator", email: "demo@powerchain.energy", passwordHash, workspaceName: "PowerChain Demo", plan: "pro" });
  }

  async updateProfile(input: { userId: string; workspaceId: string; name: string; workspaceName: string }) {
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      await client.query("update users set name=$1 where id=$2", [input.name,input.userId]);
      await client.query("update workspaces set name=$1 where id=$2", [input.workspaceName,input.workspaceId]);
      await client.query("commit");
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally { client.release(); }
    const [user, workspace] = await Promise.all([this.findUserById(input.userId), this.getWorkspace(input.workspaceId)]);
    return user && workspace ? { user, workspace } : null;
  }

  async createSession(input: Omit<SessionRecord, "createdAt" | "lastSeenAt" | "revokedAt">) {
    const record: SessionRecord = { ...input, createdAt: now(), lastSeenAt: now(), revokedAt: null };
    await this.pool.query("insert into sessions(id,user_id,workspace_id,role,persistent,expires_at,revoked_at,created_at,last_seen_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9)", [record.id,record.userId,record.workspaceId,record.role,record.persistent,record.expiresAt,record.revokedAt,record.createdAt,record.lastSeenAt]);
    return record;
  }

  async getSession(id: string) { const result = await this.pool.query("select id,user_id as \"userId\",workspace_id as \"workspaceId\",role,persistent,expires_at as \"expiresAt\",revoked_at as \"revokedAt\",created_at as \"createdAt\",last_seen_at as \"lastSeenAt\" from sessions where id=$1 limit 1", [id]); return result.rows[0] ? row<SessionRecord>(result.rows[0]) : null; }
  async touchSession(id: string) { await this.pool.query("update sessions set last_seen_at=now() where id=$1 and revoked_at is null", [id]); }
  async listSessions(userId: string) { const result = await this.pool.query("select id,user_id as \"userId\",workspace_id as \"workspaceId\",role,persistent,expires_at as \"expiresAt\",revoked_at as \"revokedAt\",created_at as \"createdAt\",last_seen_at as \"lastSeenAt\" from sessions where user_id=$1 order by created_at desc", [userId]); return result.rows.map((item) => row<SessionRecord>(item)); }
  async revokeSession(id: string, userId: string) { const result = await this.pool.query("update sessions set revoked_at=now() where id=$1 and user_id=$2 and revoked_at is null", [id,userId]); return (result.rowCount ?? 0) > 0; }

  async listAssets(workspaceId: string) { const result = await this.pool.query("select id,workspace_id as \"workspaceId\",slug,name,type,location,capacity_mw::float8 as \"capacityMw\",availability::float8,status,verified from assets where workspace_id=$1 order by name", [workspaceId]); return result.rows.map((item) => row<Asset>(item)); }
  async listApprovals(workspaceId: string) { const result = await this.pool.query("select id,workspace_id as \"workspaceId\",slug,title,description,severity,amount,status,updated_at as \"updatedAt\" from approvals where workspace_id=$1 order by updated_at desc", [workspaceId]); return result.rows.map((item) => row<Approval>(item)); }
  async updateApproval(workspaceId: string, approvalId: string, status: ApprovalStatus) { const result = await this.pool.query("update approvals set status=$1,updated_at=now() where workspace_id=$2 and id=$3 returning id,workspace_id as \"workspaceId\",slug,title,description,severity,amount,status,updated_at as \"updatedAt\"", [status,workspaceId,approvalId]); return result.rows[0] ? row<Approval>(result.rows[0]) : null; }
  async listActivities(workspaceId: string, limit = 10) { const result = await this.pool.query("select id,workspace_id as \"workspaceId\",kind,title,detail,created_at as \"createdAt\" from activities where workspace_id=$1 order by created_at desc limit $2", [workspaceId,limit]); return result.rows.map((item) => row<Activity>(item)); }
  async addActivity(workspaceId: string, kind: Activity["kind"], title: string, detail: string) { const item: Activity = { id:createId("act"),workspaceId,kind,title,detail,createdAt:now() }; await this.pool.query("insert into activities(id,workspace_id,kind,title,detail,created_at) values($1,$2,$3,$4,$5,$6)", [item.id,item.workspaceId,item.kind,item.title,item.detail,item.createdAt]); return item; }

  async createChat(workspaceId: string, userId: string, title: string) { const id=createId("cht"); const item: Chat={id,workspaceId,userId,title,slug:entitySlug(title,id),createdAt:now(),updatedAt:now()}; await this.pool.query("insert into chats(id,workspace_id,user_id,slug,title,created_at,updated_at) values($1,$2,$3,$4,$5,$6,$7)", [item.id,item.workspaceId,item.userId,item.slug,item.title,item.createdAt,item.updatedAt]); return item; }
  async listChats(workspaceId: string, userId: string) { const result=await this.pool.query("select id,workspace_id as \"workspaceId\",user_id as \"userId\",slug,title,created_at as \"createdAt\",updated_at as \"updatedAt\" from chats where workspace_id=$1 and user_id=$2 order by updated_at desc",[workspaceId,userId]); return result.rows.map((item)=>row<Chat>(item)); }
  async getChat(workspaceId: string, userId: string, idOrSlug: string) { const result=await this.pool.query("select id,workspace_id as \"workspaceId\",user_id as \"userId\",slug,title,created_at as \"createdAt\",updated_at as \"updatedAt\" from chats where workspace_id=$1 and user_id=$2 and (id=$3 or slug=$3) limit 1",[workspaceId,userId,idOrSlug]); return result.rows[0]?row<Chat>(result.rows[0]):null; }
  async addMessage(input: { chatId: string; workspaceId: string; userId: string; role: Message["role"]; content: string }) { const item: Message={id:createId("msg"),...input,createdAt:now()}; const client=await this.pool.connect(); try { await client.query("begin"); await client.query("insert into messages(id,chat_id,workspace_id,user_id,role,content,created_at) values($1,$2,$3,$4,$5,$6,$7)",[item.id,item.chatId,item.workspaceId,item.userId,item.role,item.content,item.createdAt]); await client.query("update chats set updated_at=$1 where id=$2",[item.createdAt,item.chatId]); await client.query("commit"); } catch(error){ await client.query("rollback"); throw error; } finally { client.release(); } return item; }
  async listMessages(chatId:string,workspaceId:string,userId:string,limit=100){const result=await this.pool.query("select id,chat_id as \"chatId\",workspace_id as \"workspaceId\",user_id as \"userId\",role,content,created_at as \"createdAt\" from messages where chat_id=$1 and workspace_id=$2 and user_id=$3 order by created_at asc limit $4",[chatId,workspaceId,userId,limit]);return result.rows.map((item)=>row<Message>(item));}
  async getMessage(messageId:string,workspaceId:string,userId:string){const result=await this.pool.query("select id,chat_id as \"chatId\",workspace_id as \"workspaceId\",user_id as \"userId\",role,content,created_at as \"createdAt\" from messages where id=$1 and workspace_id=$2 and user_id=$3 limit 1",[messageId,workspaceId,userId]);return result.rows[0]?row<Message>(result.rows[0]):null;}
  async addContact(input:Omit<ContactRequest,"id"|"createdAt">){const item:ContactRequest={id:createId("cnt"),...input,createdAt:now()};await this.pool.query("insert into contacts(id,name,email,company,message,intent,created_at) values($1,$2,$3,$4,$5,$6,$7)",[item.id,item.name,item.email,item.company,item.message,item.intent,item.createdAt]);return item;}

  async getCreditAccount(workspaceId: string, userId: string): Promise<CreditAccount> {
    await this.pool.query(
      "insert into credit_accounts(id,workspace_id,user_id,asset,decimals,available,reserved,spent,funded,updated_at) values($1,$2,$3,'PWRC',9,0,0,0,0,now()) on conflict(workspace_id,user_id,asset) do nothing",
      [createId("crd"), workspaceId, userId]
    );
    const result = await this.pool.query(
      "select id,workspace_id as \"workspaceId\",user_id as \"userId\",asset,decimals,available::text,reserved::text,spent::text,funded::text,updated_at as \"updatedAt\" from credit_accounts where workspace_id=$1 and user_id=$2 and asset='PWRC' limit 1",
      [workspaceId, userId]
    );
    const record = result.rows[0];
    if (!record) throw new Error("PWRC credit account could not be initialized.");
    return row<CreditAccount>(record);
  }

  async listCreditLedger(workspaceId: string, userId: string, limit = 50): Promise<CreditLedgerEntry[]> {
    const bounded = Math.max(1, Math.min(limit, 100));
    const result = await this.pool.query(
      "select id,account_id as \"accountId\",workspace_id as \"workspaceId\",user_id as \"userId\",kind,amount::text,balance_after::text as \"balanceAfter\",reference,created_at as \"createdAt\" from credit_ledger where workspace_id=$1 and user_id=$2 order by created_at desc limit $3",
      [workspaceId, userId, bounded]
    );
    return result.rows.map((item) => row<CreditLedgerEntry>(item));
  }

  private async seedWorkspace(client: PoolClient, workspaceId: string): Promise<void> {
    const assetInputs = [
      ["Solar Farm 45","solar","Mojave, California",120,98,"operational",true],
      ["Wind Farm North","wind","Aberdeenshire, Scotland",80,96,"operational",true],
      ["Battery Site 08","storage","Espoo, Finland",42,94,"attention",true],
      ["EV Network West","ev","Amsterdam, Netherlands",18,99,"operational",false]
    ] as const;
    for (const [name,type,location,capacity,availability,status,verified] of assetInputs) {
      const id=createId("ast"); await client.query("insert into assets(id,workspace_id,slug,name,type,location,capacity_mw,availability,status,verified) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",[id,workspaceId,entitySlug(name,id),name,type,location,capacity,availability,status,verified]);
    }
    const approvals = [
      ["Energy Batch Verification","Solar Farm 45 · 1,250 MWh · meter evidence complete","high",null],
      ["Settlement Execution","Treasury settlement to approved counterparty","medium","$24,500 USDC"]
    ] as const;
    for (const [title,description,severity,amount] of approvals) { const id=createId("apr"); await client.query("insert into approvals(id,workspace_id,slug,title,description,severity,amount,status,updated_at) values($1,$2,$3,$4,$5,$6,$7,'pending',now())",[id,workspaceId,entitySlug(title,id),title,description,severity,amount]); }
    await client.query("insert into activities(id,workspace_id,kind,title,detail,created_at) values($1,$2,'system','Workspace provisioned','Representative renewable infrastructure data initialized.',now())",[createId("act"),workspaceId]);
  }
}
