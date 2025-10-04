import React from "react";

export type Visit = {
  id: string;
  date: string; // YYYY-MM-DD
  lodgeId?: string;
  notes?: string;
};

type Ctx = { visits: Visit[]; setVisits: (v: Visit[]) => void; };
const VisitsCtx = React.createContext<Ctx | undefined>(undefined);

export function VisitsProvider({ children, initial }: { children: React.ReactNode; initial?: Visit[] }) {
  const [visits, setVisits] = React.useState<Visit[]>(initial || []);
  return <VisitsCtx.Provider value={{ visits, setVisits }}>{children}</VisitsCtx.Provider>;
}

export function useVisits() {
  const ctx = React.useContext(VisitsCtx);
  if (!ctx) throw new Error("useVisits must be used within VisitsProvider");
  return ctx;
}
