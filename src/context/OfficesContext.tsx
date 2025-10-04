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

function titleIncludes(o: Office, s: string) {
  return o.officeName.toLowerCase().includes(s.toLowerCase());
}

function grandSeniorityIndex(title: string) {
  const idx = GRAND_OFFICES_ORDERED.findIndex(t => title.toLowerCase().includes(t.toLowerCase()));
  return idx === -1 ? -1 : idx;
}

function mostRecentOrMostSeniorGrand(offices: Office[]): Office | undefined {
  const pastGrand = offices.filter(o => o.scope === "Grand" && !o.isCurrent);
  if (pastGrand.length === 0) return undefined;
  // Most recent by startDate
  const sorted = [...pastGrand].sort((a, b) => (b.startDate || "").localeCompare(a.startDate || ""));
  // If dates equal or missing, prefer more senior (higher in ordered list -> larger index)
  sorted.sort((a, b) => {
    const ai = grandSeniorityIndex(a.officeName);
    const bi = grandSeniorityIndex(b.officeName);
    return bi - ai;
  });
  return sorted[0];
}

function prefixForGrandOffice(o: Office): "MW Bro" | "RW Bro" | "VW Bro" {
  if (titleIncludes(o, "Grand Master")) return "MW Bro";
  if (titleIncludes(o, "Deputy Grand Master")) return "RW Bro";
  if (titleIncludes(o, "Senior Grand Warden") || titleIncludes(o, "Junior Grand Warden")) return "RW Bro";
  // All other Grand offices → VW Bro
  return "VW Bro";
}

// Public helper
export function computePrefix(offices: Office[]): "MW Bro" | "RW Bro" | "VW Bro" | "W Bro" | "Bro" {
  const currentGrand = offices.find(o => o.scope === "Grand" && o.isCurrent);
  if (currentGrand) return prefixForGrandOffice(currentGrand);

  const pastGrandBest = mostRecentOrMostSeniorGrand(offices);
  if (pastGrandBest) return prefixForGrandOffice(pastGrandBest);

  const names = offices.map(o => o.officeName.toLowerCase());
  if (names.some(n => n.includes("worshipful master") || n.includes("past master"))) return "W Bro";
  return "Bro";
}

// Grand rank abbreviations (extendable)
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
  "Grand Chaplain": "GCh",
  "Grand Almoner": "GAlm",
  "Grand Sword Bearer": "GSwdB",
  "Grand Standard Bearer": "GStdB",
  "Grand Inner Guard": "GIG",
  "Grand Organist": "GOrg",
  "Grand Tyler": "GTyl",
  "Grand Deacon": "GDeac",
  "Assistant Grand Director of Ceremonies": "AGDC",
};

export function computePostNominals(offices: Office[]): string[] {
  // prefer current grand, else use all grand (dedup)
  const grands = offices.filter(o => o.scope === "Grand");
  if (grands.length === 0) return [];
  const dedup = new Set<string>();
  for (const g of grands) {
    let abbr = GRAND_ABBR[g.officeName];
    if (!abbr) {
      const k = Object.keys(GRAND_ABBR).find(n => g.officeName.toLowerCase().includes(n.toLowerCase()));
      if (k) abbr = GRAND_ABBR[k];
    }
    if (!abbr) {
      abbr = g.officeName.split(" ").map(w => (w[0] || "").toUpperCase()).join("");
    }
    if (abbr) dedup.add(abbr);
  }
  return Array.from(dedup);
}
