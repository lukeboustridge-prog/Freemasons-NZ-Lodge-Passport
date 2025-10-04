import React from "react";

export default function ProfilePage(){
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <header className="px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-semibold">Add new</h2>
        </header>
        <div className="px-4 py-3 sm:px-6 sm:py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Date</span>
            <input type="date" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Details</span>
            <input type="text" placeholder="..." className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="flex flex-col gap-1 text-sm sm:col-span-2">
            <span className="font-medium">Notes</span>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[88px]" />
          </label>
          <div className="sm:col-span-2">
            <button className="inline-flex items-center rounded-lg bg-blue-600 text-white px-3 py-2 text-sm">Save</button>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <header className="px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-semibold">Records</h2>
        </header>
        <div className="px-4 py-3 sm:px-6 sm:py-4 space-y-2">
          <details className="rounded-lg border border-gray-200 bg-white">
            <summary className="px-3 py-2 cursor-pointer">Sample record <span className="text-xs text-gray-600 ml-2">01/01/2024</span></summary>
            <div className="border-t px-3 py-3 text-sm">
              This is a placeholder. We can drop your real component here next.
            </div>
          </details>
        </div>
      </section>
    </div>
  );
}
