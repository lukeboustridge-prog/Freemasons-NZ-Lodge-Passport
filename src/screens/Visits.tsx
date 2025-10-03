import React, { useState } from "react";
import { SectionCard } from "../components/SectionCard";
import { Visit, VisitFormModal } from "../components/VisitFormModal";

export function VisitsScreen({
  visits,
  lodges,
  onSave,
}: {
  visits: Visit[];
  lodges: { id: string; name: string }[];
  onSave: (v: Visit) => void;
}) {
  const [open, setOpen] = useState(false);

  const lodgeName = (id: string) => lodges.find((l) => l.id === id)?.name || "Unknown";

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6">
      <SectionCard
        title="Visits"
        action={
          <button
            onClick={() => setOpen(true)}
            className="px-3 py-2 rounded-xl bg-blue-600 text-white"
          >
            Add visit
          </button>
        }
      >
        <ul className="divide-y">
          {visits
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((v) => (
              <li key={v.id} className="py-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{lodgeName(v.lodgeId)}</div>
                    <div className="text-sm text-gray-600">{v.date}</div>
                    {v.purpose && (
                      <div className="text-sm text-gray-500">{v.purpose}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          {visits.length === 0 && (
            <li className="py-3 text-gray-500">No visits recorded</li>
          )}
        </ul>
      </SectionCard>

      <VisitFormModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={onSave}
        lodges={lodges}
      />
    </main>
  );
}
