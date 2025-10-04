import React from "react";
export function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="card">
      <header className="card-header">
        <h2 className="card-title">{title}</h2>
        {action}
      </header>
      <div className="card-body">{children}</div>
    </section>
  );
}
