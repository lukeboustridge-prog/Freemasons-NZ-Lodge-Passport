import React from "react";
function Chevron({ open }: { open: boolean }) {
  return (
    <svg className={`w-4 h-4 shrink-0 transition-transform ${open ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 5L15 12L8 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
export function RowShell({ header, actions, children, open, onToggle }: { header: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; open: boolean; onToggle: () => void; }) {
  return (
    <div className="row">
      <button type="button" onClick={onToggle} className="row-toggle">
        <div className="row-meta">
          <Chevron open={open} />
          <div className="truncate">{header}</div>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </button>
      {open && <div className="row-body">{children}</div>}
    </div>
  );
}
