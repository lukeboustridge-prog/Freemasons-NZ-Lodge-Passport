import React from "react";

export type Lodge = {
  id: string;
  name: string;
  lodgeNumber?: string;  // e.g., "No. 123" or just "123"
  joinDate: string;      // YYYY-MM-DD
  resignedDate?: string;
};

type Ctx = {
  lodges: Lodge[];
  setLodges: (l: Lodge[]) => void;
};

const LodgesCtx = React.createContext<Ctx | undefined>(undefined);

export function LodgesProvider({ children, initial }: { children: React.ReactNode; initial?: Lodge[] }) {
  const [lodges, setLodges] = React.useState<Lodge[]>(initial || []);
  return <LodgesCtx.Provider value={{ lodges, setLodges }}>{children}</LodgesCtx.Provider>;
}

export function useLodges() {
  const ctx = React.useContext(LodgesCtx);
  if (!ctx) throw new Error("useLodges must be used within LodgesProvider");
  return ctx;
}

// formatting helper
export function formatLodgeName(l: Lodge) {
  const num = (l.lodgeNumber || "").toString().trim();
  if (!num) return l.name;
  const hasNo = /^no\.?\s*/i.test(num);
  const clean = hasNo ? num : ("No. " + num);
  return l.name + " " + clean;
}
