import React from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

export default function NavBar() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        <Link to="/dashboard" className="flex items-center gap-2 min-w-0">
          <Logo className="h-8 w-auto" />
          <span className="font-semibold truncate">My Masonic Passport</span>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <NavLink to="/dashboard" className={({isActive}) => (isActive ? "font-semibold" : "text-gray-600")}>Dashboard</NavLink>
          <NavLink to="/profile" className={({isActive}) => (isActive ? "font-semibold" : "text-gray-600")}>Profile</NavLink>
          <NavLink to="/offices" className={({isActive}) => (isActive ? "font-semibold" : "text-gray-600")}>Offices</NavLink>
          <NavLink to="/milestones" className={({isActive}) => (isActive ? "font-semibold" : "text-gray-600")}>Milestones</NavLink>
          <NavLink to="/visits" className={({isActive}) => (isActive ? "font-semibold" : "text-gray-600")}>Visits</NavLink>
          <NavLink to="/settings" className={({isActive}) => (isActive ? "font-semibold" : "text-gray-600")}>Settings</NavLink>
        </nav>
      </div>
    </header>
  );
}
