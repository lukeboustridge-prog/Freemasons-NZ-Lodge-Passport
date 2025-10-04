import React from "react";
import { GRAND_OFFICES_ORDERED } from "../data/offices";

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

function titleIncludes(sought: string, title: string) {
  return title.toLowerCase().includes(sought.toLowerCase());
}

// Seniority helper: higher index = more senior (array is junior → senior)
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
    if (sa !== sb) return sb - sa;
    return (b.startDate || "").localeCompare(a.startDate || "");
  });
  return { office: sorted[0], isPast: true };
}

// Prefix rules (per your spec): GM -> MW Bro; DGM/SGW/JGW -> RW Bro; others Grand -> W Bro; Lodge WM/PM -> W Bro; else Bro.
export function computePrefix(offices: Office[]): "MW Bro" | "RW Bro" | "W Bro" | "Bro" {
  const { office: primary } = pickPrimaryGrandOffice(offices);
  if (primary) {
    const t = primary.officeName.toLowerCase();
    if (t.includes("grand master")) return "MW Bro";
    if (t.includes("deputy grand master") || t.includes("senior grand warden") || t.includes("junior grand warden")) return "RW Bro";
    return "W Bro";
  }
  const names = offices.map(o => o.officeName.toLowerCase());
  if (names.some(n => n.includes("worshipful master") || n.includes("past master"))) return "W Bro";
  return "Bro";
}

// Grand post‑nominals mapping (extend/adjust to exact BoC abbreviations if needed).
export const GRAND_ABBR: Record<string, string> = {
  "Grand Master": "GM",
  "Deputy Grand Master": "DGM",
  "Senior Grand Warden": "SGW",
  "Junior Grand Warden": "JGW",
  "Grand Registrar": "GReg",
  "Grand Treasurer": "GTreas",
  "Grand Secretary": "GSec",
  "Grand Superintendent of Works": "GSupWks",
  "Grand Superintendent of Ceremonies": "GSupCer",
  "Grand Director of Ceremonies": "GDC",
  "Assistant Grand Director of Ceremonies": "AGDC",
  "Grand Chaplain": "GCh",
  "Grand Almoner": "GAlm",
  "Grand Sword Bearer": "GSwdB",
  "Grand Standard Bearer": "GStdB",
  "Grand Inner Guard": "GIG",
  "Grand Organist": "GOrg",
  "Grand Tyler": "GTyl",
  "Grand Deacon": "GDeac"
};

function abbrFor(title: string): string {
  const direct = GRAND_ABBR[title];
  if (direct) return direct;
  const k = Object.keys(GRAND_ABBR).find(n => title.toLowerCase().includes(n.toLowerCase()));
  if (k) return GRAND_ABBR[k];
  return title.split(" ").map(w => (w[0] || "").toUpperCase()).join("");
}

/** Highest single post‑nominal only — matches the same precedence we use for prefix selection. */
export function computeHighestPostNominal(offices: Office[]): string | null {
  const { office: primary, isPast } = pickPrimaryGrandOffice(offices);
  if (!primary) return null;
  const base = abbrFor(primary.officeName);
  return (isPast ? "P" : "") + base;
}

// Backwards compat: computePostNominals() now returns an array with at most ONE item (the highest).
export function computePostNominals(offices: Office[]): string[] {
  const one = computeHighestPostNominal(offices);
  return one ? [one] : [];
}
