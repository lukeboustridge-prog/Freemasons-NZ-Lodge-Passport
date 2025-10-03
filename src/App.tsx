import React, { useMemo, useState } from "react";
import Dashboard, { LodgeMembership, Office } from "./screens/Dashboard";
import { MilestonesScreen, Milestone } from "./screens/Milestones";
import { VisitsScreen } from "./screens/Visits";
import type { Visit } from "./components/VisitFormModal";
import FMNZLogo from "./components/Logo";

type Tab = "dashboard" | "milestones" | "visits";

export default function App() {
  const [tab, setTab] = useState<Tab>("dashboard");

  // Sample data. Replace with your API store as needed.
  const [memberships, setMemberships] = useState<LodgeMembership[]>([
    { id: "m1", lodgeName: "Lodge Matariki No. 406", status: "Current", startDate: "2019-03-15" },
    { id: "m2", lodgeName: "Example Lodge No. 123", status: "Past", startDate: "2015-05-01", endDate: "2018-11-20" },
  ]);

  const [offices, setOffices] = useState<Office[]>([
    { id: "o1", scope: "Lodge", lodgeName: "Lodge Matariki No. 406", officeName: "Inner Guard", startDate: "2024-04-01", isCurrent: true },
    { id: "o2", scope: "Grand", officeName: "Grand Sword Bearer", startDate: "2025-08-01", isCurrent: true },
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "ms1", type: "Initiation", date: "2017-02-10", notes: "Special night" },
    { id: "ms2", type: "Raising", date: "2018-10-05" },
  ]);

  const [lodges] = useState<{ id: string; name: string }[]>([
    { id: "l1", name: "Lodge Matariki No. 406" },
    { id: "l2", name: "Example Lodge No. 123" },
  ]);

  const [visits, setVisits] = useState<Visit[]>([
    { id: "v1", date: "2025-09-14", lodgeId: "l1", purpose: "Regular meeting" },
    { id: "v2", date: "2025-08-22", lodgeId: "l2", purpose: "Installation" },
  ]);

  const navBtn = (key: Tab, label: string) => (
    <button
      key={key}
      onClick={() => setTab(key)}
      className={"px-4 py-2 rounded-xl border " + (tab === key ? "bg-blue-600 text-white" : "bg-white")}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-3">
          <FMNZLogo className="w-24 h-auto" />
          <div>
            <h1 className="text-2xl font-bold">Freemasons NZ Passport</h1>
            <p className="text-sm text-gray-600">Compact UI with collapsible rows</p>
          </div>
          <div className="ml-auto flex gap-2">
            {navBtn("dashboard", "Dashboard")}
            {navBtn("milestones", "Milestones")}
            {navBtn("visits", "Visits")}
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
