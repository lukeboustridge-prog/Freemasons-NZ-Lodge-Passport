// Optional modal left for potential reuse if you prefer modal add flow in future.
// Not used by the full app by default.
import React, { useState } from "react";

export type Visit = {
  id: string;
  date: string;
  lodgeId: string;
  purpose?: string;
  notes?: string;
};

export function VisitFormModal({
  open,
  onClose,
  onSave,
  lodges,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (visit: Visit) => void;
  lodges: { id: string; name: string }[];
}) {
  const [form, setForm] = useState<Visit>({
    id: "new",
    date: "",
    lodgeId: "",
    purpose: "Regular meeting",
    notes: "",
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add visit</h3>
          <button onClick={onClose} className="text-sm">Close</button>
        </div>

        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave({ ...form, id: crypto.randomUUID() });
            onClose();
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
            <span className="mb-1 font-medium">Lodge</span>
            <select
              value={form.lodgeId}
              onChange={(e) => setForm({ ...form, lodgeId: e.target.value })}
              className="border rounded-xl px-3 py-2"
              required
            >
              <option value="">Select lodge</option>
              {lodges.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>

          <label className="sm:col-span-2 flex flex-col text-sm">
            <span className="mb-1 font-medium">Purpose</span>
            <input
              value={form.purpose || ""}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              className="border rounded-xl px-3 py-2"
              placeholder="Regular meeting, installation, degree, rehearsal"
            />
          </label>

          <label className="sm:col-span-2 flex flex-col text-sm">
            <span className="mb-1 font-medium">Notes</span>
            <textarea
              value={form.notes || ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="border rounded-xl px-3 py-2 min-h-[88px]"
            />
          </label>

          <div className="sm:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-2 rounded-xl border">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
              Save visit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
