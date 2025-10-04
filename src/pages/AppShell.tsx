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
import { OfficesProvider, Office } from "../context/OfficesContext";
import { LodgesProvider, Lodge } from "../context/LodgesContext";
import { VisitsProvider } from "../context/VisitsContext";

export default function AppShell() {
  const offices: Office[] = [
    { id: "o1", scope: "Lodge", lodgeName: "Lodge Example No. 123", officeName: "Worshipful Master", startDate: "2024-04-01", isCurrent: true },
    { id: "o2", scope: "Grand", officeName: "Grand Sword Bearer", startDate: "2025-08-01", isCurrent: true },
  ];

  const lodges: Lodge[] = [
    { id: "l1", name: "Lodge Example", lodgeNumber: "123", joinDate: "2019-03-15" },
    { id: "l2", name: "Corinthian Lodge", lodgeNumber: "45", joinDate: "2021-06-10", resignedDate: "2023-11-20" },
  ];

  const milestones = [
    { id: "ms1", type: "Initiation", date: "2017-02-10" },
    { id: "ms2", type: "Raising", date: "2018-10-05" },
  ];
  const visits = [{ id: "v1", date: "2025-09-14", lodgeId: "l1", notes: "Regular meeting" }];

  return (
    <ProfileProvider>
      <LodgesProvider initial={lodges}>
        <OfficesProvider initial={offices}>
          <VisitsProvider initial={visits}>
            <div className="min-h-screen bg-gray-50 text-gray-900">
              <NavBar />
              <main className="max-w-5xl mx-auto p-4 sm:p-6">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/offices" element={<OfficesPage />} />
                  <Route path="/milestones" element={<MilestonesScreen milestones={milestones as any} onSave={()=>{}} onUpdate={()=>{}} />} />
                  <Route path="/visits" element={<VisitsScreen visits={visits as any} lodges={lodges.map(l => ({id:l.id, name: l.name + (l.lodgeNumber ? " No. " + l.lodgeNumber : "")})) as any} onSave={()=>{}} onUpdate={()=>{}} />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </VisitsProvider>
        </OfficesProvider>
      </LodgesProvider>
    </ProfileProvider>
  );
}
