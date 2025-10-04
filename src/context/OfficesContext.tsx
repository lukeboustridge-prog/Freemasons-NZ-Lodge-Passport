import React from "react";

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

// Prefix rules:
export function computePrefix(offices: Office[]): "MW Bro" | "RW Bro" | "W Bro" | "Bro" {
  const names = offices.map(o => o.officeName.toLowerCase());
  if (names.some(n => n.includes("grand master"))) return "MW Bro";
  if (offices.some(o => o.scope === "Grand")) return "RW Bro";
  if (names.some(n => n.includes("worshipful master") || n.includes("past master"))) return "W Bro";
  return "Bro";
}

// Grand rank abbreviations
const GRAND_ABBR: Record<string, string> = {
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
  "Grand Deacon": "GDeac"
};

export function computePostNominals(offices: Office[]): string[] {
  const grands = offices.filter(o => o.scope === "Grand");
  const dedup = new Set<string>();
  for (const g of grands) {
    const key = Object.keys(GRAND_ABBR).find(n => g.officeName.toLowerCase().includes(n.toLowerCase()));
    const abbr = key ? GRAND_ABBR[key] : g.officeName.split(" ").map(w => (w[0] || "").toUpperCase()).join("");
    if (abbr) dedup.add(abbr);
  }
  return Array.from(dedup);
}
