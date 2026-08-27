type Entry={count:number;resetAt:number};
type GlobalRate=typeof globalThis & {__pcRateLimit?:Map<string,Entry>};
const globalRate=globalThis as GlobalRate;
const buckets=globalRate.__pcRateLimit ?? new Map<string,Entry>();
if(!globalRate.__pcRateLimit)globalRate.__pcRateLimit=buckets;

export function sameOrigin(req:Request){
  const origin=req.headers.get("origin");
  if(!origin)return true;
  try{const host=req.headers.get("host");return Boolean(host)&&new URL(origin).host===host;}catch{return false;}
}

export function allowRequest(req:Request,namespace:string,limit:number,windowMs:number){
  const ip=(req.headers.get("x-forwarded-for")||req.headers.get("x-real-ip")||"local").split(",")[0].trim();
  const key=`${namespace}:${ip}`;const now=Date.now();const entry=buckets.get(key);
  if(!entry||entry.resetAt<=now){buckets.set(key,{count:1,resetAt:now+windowMs});return true;}
  if(entry.count>=limit)return false;entry.count+=1;return true;
}
