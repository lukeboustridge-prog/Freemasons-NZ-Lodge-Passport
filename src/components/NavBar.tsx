import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

const item = (isActive: boolean) =>
  [
    "px-2 py-1 rounded-md transition-colors",
    isActive ? "text-blue-600 bg-blue-50" : "text-gray-700 hover:text-blue-600 hover:bg-gray-100",
  ].join(" ");

export default function NavBar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link to="/dashboard" className="flex items-center gap-2 min-w-0">
          <Logo className="h-8 w-auto" />
          <span className="font-semibold truncate">My Masonic Passport</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <NavLink to="/dashboard" className={({isActive}) => item(isActive)}>Dashboard</NavLink>
          <NavLink to="/profile" className={({isActive}) => item(isActive)}>Profile</NavLink>
          <NavLink to="/offices" className={({isActive}) => item(isActive)}>Offices</NavLink>
          <NavLink to="/milestones" className={({isActive}) => item(isActive)}>Milestones</NavLink>
          <NavLink to="/visits" className={({isActive}) => item(isActive)}>Visits</NavLink>
          <NavLink to="/settings" className={({isActive}) => item(isActive)}>Settings</NavLink>
        </nav>
      </div>
    </header>
  );
}
