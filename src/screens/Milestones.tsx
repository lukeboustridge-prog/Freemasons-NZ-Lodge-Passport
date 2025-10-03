import React, { useState } from "react";
import { SectionCard } from "../components/SectionCard";
import { RowShell } from "../components/CollapseRow";

export type Milestone = {
  id: string;
  date: string;
  type: "Initiation" | "Passing" | "Raising" | "Installation" | "50 Year" | "60 Year" | "Other";
  notes?: string;
};

function MilestoneItem({
  item,
  onUpdate,
  onDelete,
}: {
  item: Milestone;
  onUpdate: (m: Milestone) => void;
  onDelete?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState<Milestone>(item);

  const header = (
    <div>
      <div className="font-medium">{item.type}</div>
      <div className="text-sm text-gray-600">{item.date}</div>
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
            className="border rounded-xl px-3 py-2"
            required
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-1 font-medium">Type</span>
          <select
            value={edit.type}
            onChange={(e) =>
              setEdit({ ...edit, type: e.target.value as Milestone["type"] })
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
            value={edit.notes || ""}
            onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
            className="border rounded-xl px-3 py-2 min-h-[88px]"
            placeholder="Optional"
          />
        </label>

        <div className="sm:col-span-2 flex justify-between gap-2">
          {onDelete ? (
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="px-3 py-2 rounded-xl border text-red-600"
            >
              Delete
            </button>
          ) : <span />}
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
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 text-white"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </RowShell>
  );
}

export function MilestonesScreen({
  milestones,
  onSave,
  onUpdate,
  onDelete,
}: {
  milestones: Milestone[];
  onSave: (m: Milestone) => void;
  onUpdate: (m: Milestone) => void;
  onDelete?: (id: string) => void;
}) {
  const [form, setForm] = useState<Milestone>({
    id: "new",
    date: "",
    type: "Initiation",
    notes: "",
  });

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6">
      <SectionCard title="Milestones" action={null}>
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

        <div className="mt-6 space-y-2">
          {milestones
            .slice()
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((m) => (
              <MilestoneItem
                key={m.id}
                item={m}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          {milestones.length === 0 && (
            <div className="py-3 text-gray-500">No milestones yet</div>
          )}
        </div>
      </SectionCard>
    </main>
  );
}
