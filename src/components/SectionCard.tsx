import React from "react";

export function SectionCard({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode; }) {
  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <header className="px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between">
        <h2 className="text-base font-semibold">{title}</h2>
        {right}
      </header>
      <div className="px-4 py-3 sm:px-6 sm:py-4">{children}</div>
    </section>
  );
}
