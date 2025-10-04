import React from "react";

export default function DashboardPage(){
  return (
    <div className="space-y-4">
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <header className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lodge memberships</h2>
        </header>
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          <ul className="list-disc pl-6">
            <li>Papakura Lodge No. 56 — Member since 2019</li>
            <li>Corinthian Lodge No. 123 — Member since 2023</li>
          </ul>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <header className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Current offices</h2>
        </header>
        <div className="px-4 py-3 sm:px-6 sm:py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="font-medium">Inner Guard</div>
            <div className="text-sm text-gray-600">Corinthian Lodge No. 123</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-3">
            <div className="font-medium">Grand Sword Bearer</div>
            <div className="text-sm text-gray-600">Grand Lodge</div>
          </div>
        </div>
      </section>
    </div>
  );
}
