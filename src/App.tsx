import React, { useState } from "react";
import Dashboard from "./screens/Dashboard";
import { MilestonesScreen, Milestone } from "./screens/Milestones";
import { VisitsScreen, Visit } from "./screens/Visits";

type Tab = "dashboard" | "milestones" | "visits";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard"); // default to dashboard

  // Demo state (replace with your store/API as needed)
  const memberships = [{ id: "m1", lodgeName: "Lodge Example No. 123", status: "Current", startDate: "2019-03-15" }];
  const offices = [
    { id: "o1", scope: "Lodge" as const, lodgeName: "Lodge Example No. 123", officeName: "Inner Guard", startDate: "2024-04-01", isCurrent: true },
    { id: "o2", scope: "Grand" as const, officeName: "Grand Sword Bearer", startDate: "2025-08-01", isCurrent: true },
  ];
  const lodges = [{ id: "l1", name: "Lodge Example No. 123" }];
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "ms1", type: "Initiation", date: "2017-02-10" },
    { id: "ms2", type: "Raising", date: "2018-10-05" },
  ]);
  const [visits, setVisits] = useState<Visit[]>([
    { id: "v1", date: "2025-09-14", lodgeId: "l1", purpose: "Regular meeting" },
  ]);

  const NavBtn = ({ value, label }: { value: Tab; label: string }) => (
    <button
      onClick={() => setTab(value)}
      className={"px-4 py-2 rounded-xl border " + (tab === value ? "bg-blue-600 text-white" : "bg-white")}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-3">
          <img src={(import.meta as any).env.BASE_URL + "fmnz-logo.png"} alt="FMNZ" className="w-20 h-auto" />
          <div className="ml-auto flex gap-2">
            <NavBtn value="dashboard" label="Dashboard" />
            <NavBtn value="milestones" label="Milestones" />
            <NavBtn value="visits" label="Visits" />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        {tab === "dashboard" && <Dashboard memberships={memberships} offices={offices} />}
        {tab === "milestones" && (
          <MilestonesScreen
            milestones={milestones}
            onSave={(m) => setMilestones((s) => [...s, m])}
            onUpdate={(m) => setMilestones((s) => s.map((x) => (x.id === m.id ? m : x)))}
            onDelete={(id) => setMilestones((s) => s.filter((x) => x.id !== id))}
          />
        )}
        {tab === "visits" && (
          <VisitsScreen
            visits={visits}
            lodges={lodges}
            onSave={(v) => setVisits((s) => [...s, { ...v, id: crypto.randomUUID() }])}
            onUpdate={(v) => setVisits((s) => s.map((x) => (x.id === v.id ? v : x)))}
            onDelete={(id) => setVisits((s) => s.filter((x) => x.id !== id))}
          />
        )}
      </main>
    </div>
  );
}
