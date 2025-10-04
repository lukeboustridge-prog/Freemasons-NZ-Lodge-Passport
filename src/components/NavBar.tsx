import React from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const link = ({ isActive }: { isActive: boolean }) =>
    "px-3 py-2 rounded-lg text-sm font-medium " + (isActive ? "bg-blue-600 text-white" : "bg-white border border-gray-300 hover:bg-gray-50");

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-3 py-3 flex items-center gap-2">
        <div className="font-semibold">FMNZ Passport</div>
        <div className="ml-auto flex items-center gap-1">
          <NavLink to="/dashboard" className={link}>Dashboard</NavLink>
          <NavLink to="/profile" className={link}>Profile</NavLink>
          <NavLink to="/offices" className={link}>Offices Held</NavLink>
          <NavLink to="/milestones" className={link}>Milestones</NavLink>
          <NavLink to="/visits" className={link}>Visits</NavLink>
          <NavLink to="/settings" className={link}>Settings</NavLink>
        </div>
      </div>
    </nav>
  );
}
