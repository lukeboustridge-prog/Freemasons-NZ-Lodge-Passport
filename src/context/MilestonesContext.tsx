import React from "react";

export type Milestone = {
  id: string;
  type: string;     // e.g., Initiation, Passing, Raising, Installation, 25-year badge, etc.
  date: string;     // YYYY-MM-DD
  notes?: string;
};

type Ctx = {
  milestones: Milestone[];
  setMilestones: (m: Milestone[]) => void;
  add: (m: Milestone) => void;
  update: (m: Milestone) => void;
  remove: (id: string) => void;
};

const MilestonesCtx = React.createContext<Ctx | undefined>(undefined);

export function MilestonesProvider({ children, initial }: { children: React.ReactNode; initial?: Milestone[] }) {
  const [milestones, setMilestones] = React.useState<Milestone[]>(initial || []);
  const add = (m: Milestone) => setMilestones(prev => [m, ...prev]);
  const update = (m: Milestone) => setMilestones(prev => prev.map(x => x.id === m.id ? m : x));
  const remove = (id: string) => setMilestones(prev => prev.filter(x => x.id != id));
  return <MilestonesCtx.Provider value={{ milestones, setMilestones, add, update, remove }}>{children}</MilestonesCtx.Provider>;
}

export function useMilestones() {
  const ctx = React.useContext(MilestonesCtx);
  if (!ctx) throw new Error("useMilestones must be used within MilestonesProvider");
  return ctx;
}
