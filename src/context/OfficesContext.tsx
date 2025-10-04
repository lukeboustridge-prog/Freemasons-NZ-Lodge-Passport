import React from "react";
import { GRAND_OFFICES_ORDERED } from "../data/offices";

/** Office model shared across features */
export type Office = {
  id: string;
  scope: "Lodge" | "Grand";
  lodgeName?: string;
  officeName: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
};

type Ctx = { offices: Office[]; setOffices: (o: Office[]) => void; };
const OfficesCtx = React.createContext<Ctx | undefined>(undefined);

export function OfficesProvider({ children, initial }: { children: React.ReactNode; initial?: Office[] }) {
  const [offices, setOffices] = React.useState<Office[]>(initial || []);
  return <OfficesCtx.Provider value={{ offices, setOffices }}>{children}</OfficesCtx.Provider>;
}

export function useOffices() {
  const ctx = React.useContext(OfficesCtx);
  if (!ctx) throw new Error("useOffices must be used within OfficesProvider");
  return ctx;
}

/** Mapping (prefix/post‑nominal/precedence) — from your final list */
type Prefix = "MWBro" | "RWBro" | "VWBro" | "WBro" | "Bro";
type MapVal = { abbr: string; prefix: Prefix; rank: number; pastAbbr?: string };

const GRAND_MAP: Record<string, MapVal> = {
  // WBro tier
  "grand stewards": { abbr: "GStwd", prefix: "WBro", rank: 1, pastAbbr: "PGStwd" },
  "grand steward": { abbr: "GStwd", prefix: "WBro", rank: 1, pastAbbr: "PGStwd" },
  "grand tyler": { abbr: "GTy", prefix: "WBro", rank: 2, pastAbbr: "PGTy" },
  "grand inner guard": { abbr: "GIG", prefix: "WBro", rank: 3, pastAbbr: "PGIG" },
  "grand organist": { abbr: "GOrg", prefix: "WBro", rank: 4, pastAbbr: "PGOrg" },
  "grand standard bearer": { abbr: "GStB", prefix: "WBro", rank: 5, pastAbbr: "PGStB" },
  "grand sword bearer": { abbr: "GSwB", prefix: "WBro", rank: 6, pastAbbr: "PGSwB" },
  "grand bible bearer": { abbr: "GBB", prefix: "WBro", rank: 7, pastAbbr: "PGBB" },
  "junior grand deacon": { abbr: "JGD", prefix: "WBro", rank: 8, pastAbbr: "PGD" },
  "senior grand deacon": { abbr: "SGD", prefix: "WBro", rank: 9, pastAbbr: "PGD" },
  "grand deacon": { abbr: "GD", prefix: "WBro", rank: 9, pastAbbr: "PGD" },
  "district grand director of ceremonies": { abbr: "DGDC", prefix: "WBro", rank: 10, pastAbbr: "PDGDC" },
  // VWBro tier
  "assistant grand director of ceremonies": { abbr: "AGDC", prefix: "VWBro", rank: 20, pastAbbr: "PAGDC" },
  "grand director of ceremonies": { abbr: "GDC", prefix: "VWBro", rank: 21, pastAbbr: "PGDC" },
  "grand lecturer": { abbr: "GLec", prefix: "VWBro", rank: 22, pastAbbr: "PGLec" },
  "grand superintendent of research & education": { abbr: "GSRE", prefix: "VWBro", rank: 23, pastAbbr: "PGSRE" },
  "divisional grand almoner": { abbr: "DGA", prefix: "VWBro", rank: 24, pastAbbr: "PDGA" },
  "grand superintendent of ceremonies": { abbr: "GSC", prefix: "VWBro", rank: 25, pastAbbr: "PGSC" },
  "grand superintendent of works": { abbr: "GSW", prefix: "VWBro", rank: 26, pastAbbr: "PGSw" },
  "grand treasurer": { abbr: "GT", prefix: "VWBro", rank: 27, pastAbbr: "PGT" },
  "grand registrar": { abbr: "GReg", prefix: "VWBro", rank: 28, pastAbbr: "PGReg" },
  "grand chaplain": { abbr: "GChap", prefix: "VWBro", rank: 29, pastAbbr: "PGChap" },
  "grand secretary": { abbr: "GSec", prefix: "VWBro", rank: 30, pastAbbr: "PGSec" },
  "grand superintendent of regions": { abbr: "GSR", prefix: "VWBro", rank: 31, pastAbbr: "PGSR" },
  "district grand master": { abbr: "DGM", prefix: "VWBro", rank: 32, pastAbbr: "PDGM" },
  "past presidents board of general purposes": { abbr: "PPBGP", prefix: "RWBro", rank: 33 },
  "past president board of benevolence": { abbr: "PPBB", prefix: "RWBro", rank: 34 },
  "past superintendent of the freemasons charity": { abbr: "PPSC", prefix: "RWBro", rank: 34 },
  // RWBro tier
  "divisional grand master": { abbr: "DGM", prefix: "RWBro", rank: 40, pastAbbr: "PDGM" },
  "senior grand warden": { abbr: "SGW", prefix: "RWBro", rank: 41, pastAbbr: "PASGW" },
  "junior grand warden": { abbr: "JGW", prefix: "RWBro", rank: 42, pastAbbr: "PAJGW" },
  "past grand warden": { abbr: "PGW", prefix: "RWBro", rank: 39 },
  "grand almoner": { abbr: "GA", prefix: "RWBro", rank: 38, pastAbbr: "PGA" },
  "past grand almoner": { abbr: "PGA", prefix: "RWBro", rank: 38 },
  "grand secretary (rw tier)": { abbr: "GSec", prefix: "RWBro", rank: 37, pastAbbr: "PGSec" },
  "past grand secretary": { abbr: "PGSec", prefix: "RWBro", rank: 37 },
  "deputy grand master": { abbr: "DGM", prefix: "RWBro", rank: 45, pastAbbr: "PDGM" },
  "past deputy grand master": { abbr: "PDGM", prefix: "RWBro", rank: 44 },
  "past provincial grand master": { abbr: "PProvGM", prefix: "RWBro", rank: 43 },
  "past divisional grand master": { abbr: "PDGM", prefix: "RWBro", rank: 43 },
  // MWBro tier
  "grand master": { abbr: "GM", prefix: "MWBro", rank: 50, pastAbbr: "PGM" },
  "pro grand master": { abbr: "PGM", prefix: "MWBro", rank: 49, pastAbbr: "PPGM" },
  "past grand master": { abbr: "PGM", prefix: "MWBro", rank: 48 },
  "past pro grand master": { abbr: "PPGM", prefix: "MWBro", rank: 47 },
};

function findGrandMap(title: string): MapVal | null {
  const t = title.toLowerCase();
  let best: MapVal | null = null;
  let bestRank = -1;
  for (const key of Object.keys(GRAND_MAP)) {
    if (t.includes(key)) {
      const m = GRAND_MAP[key];
      if (m.rank > bestRank) {
        best = m; bestRank = m.rank;
      }
    }
  }
  return best;
}

function grandSeniorityIndex(title: string) {
  const idx = GRAND_OFFICES_ORDERED.findIndex(t => title.toLowerCase().includes(t.toLowerCase()));
  return idx === -1 ? -1 : idx;
}

export function pickPrimaryGrandOffice(offices: Office[]): { office: Office | null; isPast: boolean } {
  const current = offices.find(o => o.scope === "Grand" && o.isCurrent);
  if (current) return { office: current, isPast: false };
  const past = offices.filter(o => o.scope === "Grand" && !o.isCurrent);
  if (past.length === 0) return { office: null, isPast: false };
  const sorted = [...past].sort((a, b) => {
    const sa = grandSeniorityIndex(a.officeName);
    const sb = grandSeniorityIndex(b.officeName);
    if (sa !== sb) return sb - sa; // more senior first
    return (b.startDate || "").localeCompare(a.startDate || ""); // then most recent
  });
  return { office: sorted[0], isPast: true };
}

/** Prefix: prefer Grand mapping; else if Lodge Master/IPM/PM (not Deputy Master) → WBro; else Bro. */
export function computePrefix(offices: Office[]): Prefix {
  const { office: primary } = pickPrimaryGrandOffice(offices);
  if (primary) {
    const m = findGrandMap(primary.officeName);
    if (m) return m.prefix;
  }
  // Lodge-only fallback: robust word checks
  const names = offices.map(o => (o.officeName || "").toLowerCase());
  const hasDeputyMaster = names.some(n => n.replace(/\s+/g, " ").includes("deputy master"));
  const tokensLists = names.map(n => n.split(/[^a-z]+/));
  const hasWM = names.some(n =>
    n.includes("worshipful master") ||
    n.includes("immediate past master") ||
    n.includes("past master")
  ) || tokensLists.some(tokens => tokens.includes("master"));
  if (hasWM && !hasDeputyMaster) return "WBro";
  return "Bro";
}

export function computeHighestPostNominal(offices: Office[]): string | null {
  const { office: primary, isPast } = pickPrimaryGrandOffice(offices);
  if (!primary) return null;
  const map = findGrandMap(primary.officeName);
  if (map) {
    return isPast && map.pastAbbr ? map.pastAbbr : map.abbr;
  }
  return null;
}

export function computePostNominals(offices: Office[]): string[] {
  const one = computeHighestPostNominal(offices);
  return one ? [one] : [];
}

export function computeDisplayGrandTitleAndAbbr(offices: Office[]): { title: string | null; abbr: string | null } {
  const { office: primary, isPast } = pickPrimaryGrandOffice(offices);
  if (!primary) return { title: null, abbr: null };
  const map = findGrandMap(primary.officeName);
  const abbr = map ? (isPast && map.pastAbbr ? map.pastAbbr : map.abbr) : null;
  const title = (isPast ? "Past " : "") + primary.officeName;
  return { title, abbr };
}
