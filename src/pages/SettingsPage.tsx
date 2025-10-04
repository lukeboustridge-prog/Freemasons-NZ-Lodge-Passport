import React from "react";
export default function SettingsPage(){
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Settings</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-4 py-3 sm:px-6 sm:py-4 space-y-3 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" defaultChecked className="rounded" />
            Enable dark text (high contrast)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="rounded" />
            Reduce motion
          </label>
        </div>
      </div>
    </div>
  );
}
