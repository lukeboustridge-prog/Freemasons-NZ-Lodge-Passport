import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import AppBrandBar from "../components/AppBrandBar";
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
  const offices: Office[] = [];
  const lodges: Lodge[] = [];
  const milestones: Milestone[] = [];
  const visits: any[] = [];

  return (
    <ProfileProvider>
      <LodgesProvider initial={lodges}>
        <OfficesProvider initial={offices}>
          <VisitsProvider initial={visits as any}>
            <MilestonesProvider initial={milestones}>
              <div className="min-h-screen bg-gray-50 text-gray-900">
                <AppBrandBar />
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
