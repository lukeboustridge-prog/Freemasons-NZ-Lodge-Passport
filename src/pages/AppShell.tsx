import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Dashboard from "../screens/Dashboard";
import { MilestonesScreen } from "../screens/Milestones";
import { VisitsScreen } from "../screens/Visits";
import ProfilePage from "./ProfilePage";
import OfficesPage from "./OfficesPage";
import SettingsPage from "./SettingsPage";
import { ProfileProvider } from "../context/ProfileContext";

export default function AppShell() {
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
    <ProfileProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <NavBar />
        <main className="max-w-5xl mx-auto p-4 sm:p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard memberships={memberships as any} offices={offices as any} />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/offices" element={<OfficesPage />} />
            <Route path="/milestones" element={<MilestonesScreen milestones={milestones as any} onSave={()=>{}} onUpdate={()=>{}} />} />
            <Route path="/visits" element={<VisitsScreen visits={visits as any} lodges={lodges as any} onSave={()=>{}} onUpdate={()=>{}} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </ProfileProvider>
  );
}
