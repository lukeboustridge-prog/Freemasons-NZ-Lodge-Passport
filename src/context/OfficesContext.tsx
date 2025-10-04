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

// Utilities from your earlier mapping could be present elsewhere; here we keep only lodge fallback tweak.
export function computePrefix(offices: Office[]): "MWBro" | "RWBro" | "VWBro" | "WBro" | "Bro" {
  // If no Grand precedence in this simplified file, fall back to lodge titles:
  const names = offices.map(o => o.officeName.toLowerCase());
  const hasIPM = names.some(n => n.includes("immediate past master"));
  const hasMaster = names.some(n => n.includes(" master") && !n.includes("deputy master")); // avoid Deputy Master
  if (hasIPM || hasMaster) return "WBro";
  return "Bro";
}

// Back-compat shim — still return single highest or empty; if you use the full GRAND mapping file it will override.
export function computePostNominals(offices: Office[]): string[] { return []; }
