import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import DashboardPage from "./DashboardPage";
import ProfilePage from "./ProfilePage";
import OfficesPage from "./OfficesPage";
import MilestonesPage from "./MilestonesPage";
import VisitsPage from "./VisitsPage";
import SettingsPage from "./SettingsPage";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <NavBar />
      <main className="max-w-5xl mx-auto p-4 sm:p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/offices" element={<OfficesPage />} />
          <Route path="/milestones" element={<MilestonesPage />} />
          <Route path="/visits" element={<VisitsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}
