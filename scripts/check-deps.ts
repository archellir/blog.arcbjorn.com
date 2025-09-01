// Lightweight dependency checker for this repo.
// - Scans deno.json import map and source files for remote imports
// - Queries deno.land and npm registries for latest versions
// - Prints a concise report of current vs latest

type DepKind = "deno" | "npm";

interface DepKey {
  kind: DepKind;
  name: string; // deno module name (std, fresh, gfm, ...) or npm package (e.g. preact, @preact/signals)
}

interface DepInfo extends DepKey {
  versions: Set<string>; // versions discovered in code/import map
}

interface ImportMap {
  imports?: Record<string, string>;
}

const decoder = new TextDecoder();

function normalizeVersion(v: string): string {
  return v.replace(/^v/, "").trim();
}

function ensureSet<T>(map: Map<string, Set<T>>, key: string): Set<T> {
  let s = map.get(key);
  if (!s) {
    s = new Set<T>();
    map.set(key, s);
  }
  return s;
}

function encodePkgForNpm(pkg: string): string {
  // Encode scoped names for the npm registry API
  return encodeURIComponent(pkg);
}

function parseDenoUrl(u: URL): DepInfo | null {
  // deno.land has two patterns we care about: /std@<ver>/... and /x/<name>@<ver>/...
  if (u.hostname !== "deno.land") return null;
  const segs = u.pathname.split("/").filter(Boolean);
  if (segs.length === 0) return null;

  if (segs[0] === "std" || segs[0].startsWith("std@")) {
    // Could be /std@<ver>/...
    const first = segs[0];
    if (first.startsWith("std@")) {
      const version = first.slice("std@".length);
      return { kind: "deno", name: "std", versions: new Set([version]) };
    }
    // Edge: sometimes path can be /std/<...> with no version — skip
    return { kind: "deno", name: "std", versions: new Set() };
  }

  if (segs[0] === "x" && segs.length >= 2) {
    const modAt = segs[1]; // e.g. gfm@0.6.0 or canvas@v1.4.1
    const at = modAt.indexOf("@");
    if (at > 0) {
      const name = modAt.slice(0, at);
      const version = modAt.slice(at + 1);
      return { kind: "deno", name, versions: new Set([version]) };
    }
    return { kind: "deno", name: modAt, versions: new Set() };
  }

  return null;
}

function parseEsmUrl(u: URL): DepInfo | null {
  if (u.hostname !== "esm.sh") return null;
  // esm.sh paths may be:
  // - /preact@10.27.0
  // - /@preact/signals@2.2.1
  // - /v135/postcss@8.4.49/... (registry-pinned build version)
  const segs = u.pathname.split("/").filter(Boolean);
  if (segs.length === 0) return null;

  let first = segs[0];
  if (/^v\d+$/i.test(first) && segs.length >= 2) {
    first = segs[1];
  }

  // decode to restore scoped names
  const decoded = decodeURIComponent(first);
  const at = decoded.indexOf("@");
  if (at > 0) {
    const name = decoded.slice(0, at);
    const version = decoded.slice(at + 1);
    return { kind: "npm", name, versions: new Set([version]) };
  }
  // No explicit version present
  return { kind: "npm", name: decoded, versions: new Set() };
}

function parseRemoteImport(url: string): DepInfo | null {
  try {
    const u = new URL(url);
    return parseDenoUrl(u) ?? parseEsmUrl(u);
  } catch {
    return null;
  }
}

async function readFile(path: string): Promise<string> {
  const data = await Deno.readFile(path);
  return decoder.decode(data);
}

async function collectFromImportMap(root = "deno.json"): Promise<DepInfo[]> {
  try {
    const txt = await readFile(root);
    const json = JSON.parse(txt) as ImportMap;
    const out: DepInfo[] = [];
    const imports = json.imports ?? {};
    for (const [, url] of Object.entries(imports)) {
      const info = parseRemoteImport(url);
      if (info) out.push(info);
    }
    return out;
  } catch {
    return [];
  }
}

async function collectFromSources(): Promise<DepInfo[]> {
  const out: DepInfo[] = [];
  const importRegexes = [
    /from\s+["'](https?:\/\/[^"']+)["']/g,
    /import\s+["'](https?:\/\/[^"']+)["']/g,
  ];

  // Simple recursive walk without std deps
  async function walk(dir: string) {
    for await (const entry of Deno.readDir(dir)) {
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "_fresh" || entry.name === "node_modules" || entry.name === ".git") continue;
      const path = `${dir}/${entry.name}`;
      if (entry.isDirectory) {
        await walk(path);
      } else if (entry.isFile) {
        if (!/\.(t|j)sx?$/.test(entry.name)) continue;
        let text = "";
        try {
          text = await readFile(path);
        } catch { /* ignore */ }
        for (const rx of importRegexes) {
          rx.lastIndex = 0;
          let m: RegExpExecArray | null;
          while ((m = rx.exec(text))) {
            const url = m[1];
            const info = parseRemoteImport(url);
            if (info) out.push(info);
          }
        }
      }
    }
  }

  await walk(".");
  return out;
}

function mergeDeps(infos: DepInfo[]): Map<string, DepInfo> {
  const map = new Map<string, DepInfo>();
  for (const info of infos) {
    const key = `${info.kind}:${info.name}`;
    const existing = map.get(key);
    if (existing) {
      info.versions.forEach(v => existing.versions.add(v));
    } else {
      map.set(key, { ...info, versions: new Set(info.versions) });
    }
  }
  return map;
}

async function getDenoLatest(mod: string): Promise<string | null> {
  const url = `https://cdn.deno.land/${mod}/meta/versions.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.latest === "string" ? data.latest : null;
  } catch {
    return null;
  }
}

async function getNpmLatest(pkg: string): Promise<string | null> {
  const url = `https://registry.npmjs.org/${encodePkgForNpm(pkg)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    const latest = data?.["dist-tags"]?.latest;
    return typeof latest === "string" ? latest : null;
  } catch {
    return null;
  }
}

function fmtList(set: Set<string>): string {
  const arr = Array.from(set).filter(Boolean);
  if (arr.length === 0) return "-";
  return arr.join(", ");
}

async function main() {
  const fromMap = await collectFromImportMap();
  const fromSrc = await collectFromSources();
  const merged = mergeDeps([...fromMap, ...fromSrc]);

  // Print header
  console.log("Dependency report (current -> latest)\n");

  const entries = Array.from(merged.values()).sort((a, b) => {
    if (a.kind !== b.kind) return a.kind < b.kind ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  for (const dep of entries) {
    const current = new Set(
      Array.from(dep.versions)
        .map(v => v.trim())
        .filter(Boolean),
    );

    let latest: string | null = null;
    if (dep.kind === "deno") {
      latest = await getDenoLatest(dep.name);
    } else {
      latest = await getNpmLatest(dep.name);
    }

    const latestNorm = latest ? normalizeVersion(latest) : null;
    const currentsNorm = new Set(Array.from(current).map(normalizeVersion));
    const status = latestNorm
      ? (currentsNorm.size > 0 && currentsNorm.has(latestNorm) ? "up-to-date" : "outdated")
      : "unknown";

    const currentStr = fmtList(current);
    const latestStr = latest ?? "-";
    const kindStr = dep.kind === "deno" ? "deno" : "npm";
    console.log(`${kindStr}:${dep.name}  current=[${currentStr}]  latest=${latestStr}  ${status}`);
  }

  console.log("\nTip: Update imports in deno.json and source files where versions differ.");
}

if (import.meta.main) {
  await main();
}

