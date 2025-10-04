import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Dashboard from "../screens/Dashboard";
import { MilestonesScreen } from "../screens/Milestones";
import { VisitsScreen } from "../screens/Visits";
import ProfilePage from "./ProfilePage";
import OfficesPage from "./OfficesPage";
import { ProfileProvider } from "../context/ProfileContext";
import { OfficesProvider, Office } from "../context/OfficesContext";
import { LodgesProvider, Lodge } from "../context/LodgesContext";
import { VisitsProvider } from "../context/VisitsContext";
import { MilestonesProvider, Milestone } from "../context/MilestonesContext";

export default function AppShell() {
  const offices: Office[] = [
    { id: "o1", scope: "Lodge", lodgeName: "Lodge Example No. 123", officeName: "Master", startDate: "2024-04-01", isCurrent: true },
  ];
  const lodges: Lodge[] = [
    { id: "l1", name: "Lodge Example", lodgeNumber: "123", joinDate: "2019-03-15" },
  ];
  const milestones: Milestone[] = [
    { id: "ms1", type: "Initiation", date: "2017-02-10" },
  ];
  const visits = [];

  return (
    <ProfileProvider>
      <LodgesProvider initial={lodges}>
        <OfficesProvider initial={offices}>
          <VisitsProvider initial={visits as any}>
            <MilestonesProvider initial={milestones}>
              <div className="min-h-screen bg-gray-50 text-gray-900">
                <NavBar />
                <main className="max-w-5xl mx-auto p-4 sm:p-6">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/offices" element={<OfficesPage />} />
                    <Route path="/milestones" element={<MilestonesScreen />} />
                    <Route path="/visits" element={<VisitsScreen />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </main>
              </div>
            </MilestonesProvider>
          </VisitsProvider>
        </OfficesProvider>
      </LodgesProvider>
    </ProfileProvider>
  );
}
