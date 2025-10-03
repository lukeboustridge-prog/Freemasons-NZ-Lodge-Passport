import React, { useState } from "react";
import { SectionCard } from "../components/SectionCard";

export type Milestone = {
  id: string;
  date: string;
  type: "Initiation" | "Passing" | "Raising" | "Installation" | "50 Year" | "60 Year" | "Other";
  notes?: string;
};

export function MilestonesScreen({
  milestones,
  onSave,
}: {
  milestones: Milestone[];
  onSave: (m: Milestone) => void;
}) {
  const [form, setForm] = useState<Milestone>({
    id: "new",
    date: "",
    type: "Initiation",
    notes: "",
  });

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6">
      <SectionCard title="Milestones">
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...form, id: crypto.randomUUID() });
            setForm({ id: "new", date: "", type: "Initiation", notes: "" });
          }}
        >
          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Date</span>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="border rounded-xl px-3 py-2"
              required
            />
          </label>

          <label className="flex flex-col text-sm">
            <span className="mb-1 font-medium">Type</span>
            <select
              value={form.type}
              onChange={(e) =>
                setForm({ ...form, type: e.target.value as Milestone["type"] })
              }
              className="border rounded-xl px-3 py-2"
            >
              <option>Initiation</option>
              <option>Passing</option>
              <option>Raising</option>
              <option>Installation</option>
              <option>50 Year</option>
              <option>60 Year</option>
              <option>Other</option>
            </select>
          </label>

          <label className="sm:col-span-2 flex flex-col text-sm">
            <span className="mb-1 font-medium">Notes</span>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border rounded-xl px-3 py-2 min-h-[88px]"
              placeholder="Optional"
            />
          </label>

          <div className="sm:col-span-2 flex justify-end gap-2">
            <button
              type="reset"
              onClick={() => setForm({ id: "new", date: "", type: "Initiation", notes: "" })}
              className="px-3 py-2 rounded-xl border"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white"
            >
              Add milestone
            </button>
          </div>
        </form>

        <ul className="mt-6 divide-y">
          {milestones
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((m) => (
              <li key={m.id} className="py-3">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium">{m.type}</div>
                    <div className="text-sm text-gray-600">{m.date}</div>
                    {m.notes && (
                      <div className="text-sm text-gray-500 mt-1">{m.notes}</div>
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </SectionCard>
    </main>
  );
}
