import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";

// === REAL SCREENS ===
import Dashboard from "../screens/Dashboard";
import { MilestonesScreen } from "../screens/Milestones";
import { VisitsScreen } from "../screens/Visits";

// TODO: Replace these with your real components when ready:
// import Offices from "../screens/Offices";
// import Profile from "../screens/Profile";
// import Settings from "../screens/Settings";

export default function AppShell() {
  // Minimal demo data; replace with your store/api
  const memberships = [{ id: "m1", lodgeName: "Lodge Example No. 123", status: "Current", startDate: "2019-03-15" }];
  const offices = [
    { id: "o1", scope: "Lodge" as const, lodgeName: "Lodge Example No. 123", officeName: "Inner Guard", startDate: "2024-04-01", isCurrent: true },
    { id: "o2", scope: "Grand" as const, officeName: "Grand Sword Bearer", startDate: "2025-08-01", isCurrent: true },
  ];
  const lodges = [{ id: "l1", name: "Lodge Example No. 123" }];
  const milestones = [
    { id: "ms1", type: "Initiation", date: "2017-02-10" },
    { id: "ms2", type: "Raising", date: "2018-10-05" },
  ];
  const visits = [{ id: "v1", date: "2025-09-14", lodgeId: "l1", purpose: "Regular meeting" }];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar />
      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard memberships={memberships as any} offices={offices as any} />} />
          <Route path="/milestones" element={
            <MilestonesScreen
              milestones={milestones as any}
              onSave={() => {}}
              onUpdate={() => {}}
            />
          } />
          <Route path="/visits" element={
            <VisitsScreen
              visits={visits as any}
              lodges={lodges as any}
              onSave={() => {}}
              onUpdate={() => {}}
            />
          } />
          {/* TEMP stubs until real components are connected */}
          <Route path="/profile" element={<div className="text-sm text-gray-600">Profile screen coming from your real component.</div>} />
          <Route path="/offices" element={<div className="text-sm text-gray-600">Offices Held screen coming from your real component.</div>} />
          <Route path="/settings" element={<div className="text-sm text-gray-600">Settings screen coming from your real component.</div>} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
