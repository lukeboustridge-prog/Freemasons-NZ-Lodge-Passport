import React from "react";

export function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${open ? "rotate-90" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M8 5L15 12L8 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export function RowShell({
  header,
  actions,
  children,
  open,
  onToggle,
}: {
  header: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border bg-white overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-3 py-2 text-left"
      >
        <div className="flex items-center gap-2">
          <Chevron open={open} />
          <div>{header}</div>
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </button>
      {open && <div className="border-t p-3">{children}</div>}
    </div>
  );
}
