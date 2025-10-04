import React, { useState } from "react";
import { SectionCard } from "../components/SectionCard";
import { RowShell } from "../components/CollapseRow";

export type Visit = {
  id: string;
  date: string;
  lodgeId: string;
  purpose?: string;
  notes?: string;
};

function VisitItem({
  item,
  lodgeName,
  onUpdate,
  onDelete,
}: {
  item: Visit;
  lodgeName: (id: string) => string;
  onUpdate: (v: Visit) => void;
  onDelete?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Visit>(item);

  const header = (
    <div className="min-w-0">
      <div className="font-medium truncate">{lodgeName(item.lodgeId)}</div>
      <div className="text-sm text-gray-600">{item.date}</div>
      {item.purpose && <div className="text-sm text-gray-500 truncate">{item.purpose}</div>}
    </div>
  );

  return (
    <RowShell
      open={open}
      onToggle={() => setOpen(!open)}
      header={header}
      actions={
        <button
          type="button"
          className="text-sm px-2 py-1 rounded-lg border"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
        >
          Edit
        </button>
      }
    >
      <form
        className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onUpdate(edit);
          setOpen(false);
        }}
      >
        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Date</span>
          <input
            type="date"
            value={edit.date}
            onChange={(e) => setEdit({ ...edit, date: e.target.value })}
            className="border rounded-xl px-3 py-2 w-full"
            required
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Lodge</span>
          <input value={lodgeName(edit.lodgeId)} readOnly className="border rounded-xl px-3 py-2 bg-gray-50 w-full" />
        </label>

        <label className="sm:col-span-2 flex flex-col text-sm">
          <span className="mb-1 font-medium">Purpose</span>
          <input
            value={edit.purpose || ""}
            onChange={(e) => setEdit({ ...edit, purpose: e.target.value })}
            className="border rounded-xl px-3 py-2 w-full"
            placeholder="Regular meeting, installation, degree, rehearsal"
          />
        </label>

        <label className="sm:col-span-2 flex flex-col text-sm">
          <span className="mb-1 font-medium">Notes</span>
          <textarea
            value={edit.notes || ""}
            onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
            className="border rounded-xl px-3 py-2 min-h-[88px] w-full"
          />
        </label>

        <div className="sm:col-span-2 flex justify-between gap-2">
          {onDelete ? (
            <button type="button" onClick={() => onDelete(item.id)} className="px-3 py-2 rounded-xl border text-red-600">
              Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEdit(item);
                setOpen(false);
              }}
              className="px-3 py-2 rounded-xl border"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
              Save
            </button>
          </div>
        </div>
      </form>
    </RowShell>
  );
}

export function VisitsScreen({
  visits,
  lodges,
  onSave,
  onUpdate,
  onDelete,
}: {
  visits: Visit[];
  lodges: { id: string; name: string }[];
  onSave: (v: Visit) => void;
  onUpdate: (v: Visit) => void;
  onDelete?: (id: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Visit>({ id: "new", date: "", lodgeId: "", purpose: "", notes: "" });

  const lodgeName = (id: string) => lodges.find((l) => l.id === id)?.name || "Unknown";

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6">
      <SectionCard
        title="Visits"
        action={
          <button onClick={() => setAdding((s) => !s)} className="px-3 py-2 rounded-xl bg-blue-600 text-white">
            {adding ? "Close" : "Add visit"}
          </button>
        }
      >
        {adding && (
          <form
            className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border p-3 bg-white"
            onSubmit={(e) => {
              e.preventDefault();
              onSave({ ...form, id: crypto.randomUUID() });
              setForm({ id: "new", date: "", lodgeId: "", purpose: "", notes: "" });
              setAdding(false);
            }}
          >
            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Date</span>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="border rounded-xl px-3 py-2 w-full"
                required
              />
            </label>

            <label className="flex flex-col text-sm">
              <span className="mb-1 font-medium">Lodge</span>
              <select
                value={form.lodgeId}
                onChange={(e) => setForm({ ...form, lodgeId: e.target.value })}
                className="border rounded-xl px-3 py-2 w-full"
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
                className="border rounded-xl px-3 py-2 w-full"
                placeholder="Regular meeting, installation, degree, rehearsal"
              />
            </label>

            <label className="sm:col-span-2 flex flex-col text-sm">
              <span className="mb-1 font-medium">Notes</span>
              <textarea
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="border rounded-xl px-3 py-2 min-h-[88px] w-full"
              />
            </label>

            <div className="sm:col-span-2 flex justify-end gap-2">
              <button type="button" onClick={() => setAdding(false)} className="px-3 py-2 rounded-xl border">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                Save visit
              </button>
            </div>
          </form>
        )}

        <div className="space-y-2">
          {visits
            .slice()
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((v) => (
              <VisitItem key={v.id} item={v} lodgeName={lodgeName} onUpdate={onUpdate} onDelete={onDelete} />
            ))}
          {visits.length === 0 && <div className="py-3 text-gray-500">No visits recorded</div>}
        </div>
      </SectionCard>
    </main>
  );
}
