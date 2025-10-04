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
  // GRAND_OFFICES_ORDERED is junior -> senior; higher index means more senior
  const idx = GRAND_OFFICES_ORDERED.findIndex(t => title.toLowerCase().includes(t.toLowerCase()));
  return idx === -1 ? -1 : idx;
}

/** Choose the grand office to represent the brother: current if present; otherwise the **most senior** past grand office (tie-break by most recent startDate). */
export function pickPrimaryGrandOffice(offices: Office[]): { office: Office | null; isPast: boolean } {
  const currentGrand = offices.find(o => o.scope === "Grand" && o.isCurrent);
  if (currentGrand) return { office: currentGrand, isPast: false };

  const pastGrand = offices.filter(o => o.scope === "Grand" && !o.isCurrent);
  if (pastGrand.length === 0) return { office: null, isPast: false };

  const sorted = [...pastGrand].sort((a, b) => {
    const sa = grandSeniorityIndex(a.officeName);
    const sb = grandSeniorityIndex(b.officeName);
    if (sa !== sb) return sb - sa; // more senior first
    return (b.startDate || "").localeCompare(a.startDate || ""); // then most recent
  });
  return { office: sorted[0], isPast: true };
}

/** Prefix rules for grand & lodge offices */
function prefixForGrandOfficeTitle(title: string): "MW Bro" | "RW Bro" | "W Bro" {
  const t = title.toLowerCase();
  if (t.includes("grand master")) return "MW Bro";
  if (t.includes("deputy grand master")) return "RW Bro";
  if (t.includes("senior grand warden") || t.includes("junior grand warden")) return "RW Bro";
  // All other grand titles (e.g., Grand Sword Bearer, Grand Deacon, etc.) -> W Bro
  return "W Bro";
}

/** Compute the display prefix using grand precedence if any; else lodge precedence. */
export function computePrefix(offices: Office[]): "MW Bro" | "RW Bro" | "W Bro" | "Bro" {
  const { office: primary, isPast } = pickPrimaryGrandOffice(offices);
  if (primary) {
    return prefixForGrandOfficeTitle(primary.officeName);
  }
  // No grand office current/past -> check lodge rank
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

/** Return the display title and post-nominals for the primary grand office.
 *  - For current grand: title = original (e.g., Grand Sword Bearer), abbr = GSwdB
 *  - For past grand: title = "Past " + original (e.g., Past Grand Sword Bearer), abbr = "P" + GSwdB (PGSwdB)
 */
export function computeDisplayGrandTitleAndAbbr(offices: Office[]): { title: string | null; abbr: string | null } {
  const { office: primary, isPast } = pickPrimaryGrandOffice(offices);
  if (!primary) return { title: null, abbr: null };

  // Find abbreviation
  let abbr = GRAND_ABBR[primary.officeName];
  if (!abbr) {
    const k = Object.keys(GRAND_ABBR).find(n => primary.officeName.toLowerCase().includes(n.toLowerCase()));
    if (k) abbr = GRAND_ABBR[k];
  }
  if (!abbr) {
    abbr = primary.officeName.split(" ").map(w => (w[0] || "").toUpperCase()).join("");
  }
  const title = (isPast ? "Past " : "") + primary.officeName;
  const post = (isPast ? "P" : "") + abbr;
  return { title, abbr: post };
}

/** All grand post-nominals (including P- forms for past) — for completeness if ever needed */
export function computePostNominals(offices: Office[]): string[] {
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
    if (!g.isCurrent) abbr = "P" + abbr;
    dedup.add(abbr);
  }
  return Array.from(dedup);
}
