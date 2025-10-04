import React from "react";

export type Visit = {
  id: string;
  date: string; // YYYY-MM-DD
  lodge?: string; // free text
  workOfEvening?: string; // e.g., First Degree, Second Degree, Installation, GL Visit, Other
  notes?: string;
};

type Ctx = { visits: Visit[]; setVisits: (v: Visit[]) => void; add: (v: Visit)=>void; update:(v: Visit)=>void; };
const VisitsCtx = React.createContext<Ctx | undefined>(undefined);

export function VisitsProvider({ children, initial }: { children: React.ReactNode; initial?: Visit[] }) {
  const [visits, setVisits] = React.useState<Visit[]>(initial || []);
  const add = (v: Visit) => setVisits(prev => [v, ...prev]);
  const update = (v: Visit) => setVisits(prev => prev.map(x => x.id === v.id ? v : x));
  return <VisitsCtx.Provider value={{ visits, setVisits, add, update }}>{children}</VisitsCtx.Provider>;
}

export function useVisits() {
  const ctx = React.useContext(VisitsCtx);
  if (!ctx) throw new Error("useVisits must be used within VisitsProvider");
  return ctx;
}
