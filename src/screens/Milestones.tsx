import React from "react";
import { useMilestones, Milestone } from "../context/MilestonesContext";
import { SectionCard } from "../components/SectionCard";

const TYPES = [
  "Initiation",
  "Passing",
  "Raising",
  "Installation",
  "Grand Lodge Appointment",
  "5-year badge",
  "10-year badge",
  "15-year badge",
  "20-year badge",
  "25-year badge",
  "50-year jewel",
  "60-year bar",
  "70-year bar",
  "Other",
];

export function MilestonesScreen() {
  const { milestones, add, update, remove } = useMilestones();
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState<Milestone>({
    id: crypto.randomUUID(),
    type: "Initiation",
    date: new Date().toISOString().slice(0,10),
    notes: ""
  });

  function saveNew() {
    add({ ...draft, id: crypto.randomUUID() });
    setAdding(false);
    setDraft({
      id: crypto.randomUUID(),
      type: "Initiation",
      date: new Date().toISOString().slice(0,10),
      notes: ""
    });
  }

  function Row({ m }: { m: Milestone }) {
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [form, setForm] = React.useState<Milestone>(m);
    React.useEffect(()=>setForm(m), [m]);
    function save() { update(form); setEdit(false); }

    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <button className="w-full text-left px-3 py-2 flex items-center justify-between" onClick={()=>setOpen(o=>!o)}>
          <div className="min-w-0">
            <div className="font-medium truncate">{m.type}</div>
            <div className="text-sm text-gray-500 truncate">{m.notes || "—"}</div>
          </div>
          <div className="text-sm text-gray-600">{m.date}</div>
        </button>
        {open && (
          <div className="px-3 pb-3 space-y-3">
            {!edit ? (
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>setEdit(true)}>Edit</button>
                <button className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm" onClick={()=>remove(m.id)}>Delete</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Type</span>
                    <select className="rounded-lg border border-gray-300 px-3 py-2" value={form.type} onChange={(e)=>setForm({...form, type: e.target.value})}>
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Date</span>
                    <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})} />
                  </label>
                  <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                    <span className="font-medium">Notes</span>
                    <input className="rounded-lg border border-gray-300 px-3 py-2" value={form.notes || ""} onChange={(e)=>setForm({...form, notes: e.target.value})} placeholder="(optional)" />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setEdit(false); setForm(m);}}>Cancel</button>
                  <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={save}>Save</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Milestones</h1>
        {!adding ? (
          <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>setAdding(true)}>Add</button>
        ) : (
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>setAdding(false)}>Cancel</button>
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={saveNew}>Save</button>
          </div>
        )}
      </div>

      {adding && (
        <SectionCard title="New milestone">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Type</span>
              <select className="rounded-lg border border-gray-300 px-3 py-2" value={draft.type} onChange={(e)=>setDraft({...draft, type: e.target.value})}>
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Date</span>
              <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={draft.date} onChange={(e)=>setDraft({...draft, date: e.target.value})} />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium">Notes</span>
              <input className="rounded-lg border border-gray-300 px-3 py-2" value={draft.notes || ""} onChange={(e)=>setDraft({...draft, notes: e.target.value})} placeholder="(optional)" />
            </label>
          </div>
        </SectionCard>
      )}

      <div className="space-y-3">
        {milestones.map(m => <Row key={m.id} m={m} />)}
        {milestones.length === 0 && <div className="text-sm text-gray-500">No milestones recorded yet.</div>}
      </div>
    </div>
  );
}
