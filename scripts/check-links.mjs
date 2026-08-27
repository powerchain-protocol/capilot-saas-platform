import fs from "node:fs";
import path from "node:path";

const root=process.cwd();
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const pages=walk(path.join(root,"app")).filter(f=>f.endsWith("page.tsx"));
const routes=new Set(pages.map(f=>{let r=path.relative(path.join(root,"app"),path.dirname(f)).replaceAll(path.sep,"/");return r?`/${r}`:"/";}));
const source=walk(root).filter(f=>/\.(tsx|ts)$/.test(f)&&!f.includes(`${path.sep}.next${path.sep}`));
const links=new Set();
for(const f of source){const text=fs.readFileSync(f,"utf8");for(const re of [/href\s*=\s*["'](\/[^"]*?)["']/g,/href\s*:\s*["'](\/[^"]*?)["']/g]){let m;while((m=re.exec(text))){const clean=m[1].split(/[?#]/)[0]||"/";if(!clean.startsWith("/api/"))links.add(clean);}}}
const missing=[...links].filter(r=>!routes.has(r)&&!r.includes("["));
console.log(`Detected ${routes.size} page routes and ${links.size} literal internal links.`);
if(missing.length){console.error("Missing page routes:",missing);process.exit(1)}
console.log("Internal literal route audit passed: no dead page links detected.");
