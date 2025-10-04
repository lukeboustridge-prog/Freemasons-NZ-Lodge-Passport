import React from "react";
export function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl shadow p-4 sm:p-6 mb-4">
      <header className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </header>
      <div>{children}</div>
    </section>
  );
}
