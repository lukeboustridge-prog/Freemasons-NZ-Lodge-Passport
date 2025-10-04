import React from "react";
import { useVisits, Visit } from "../context/VisitsContext";

const WORK_OPTIONS = [
  "First Degree",
  "Second Degree",
  "Third Degree",
  "Installation",
  "Grand Lodge Visit",
  "Other"
];

export function VisitsScreen() {
  const { visits, add, update } = useVisits();
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState<Visit>({
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0,10),
    lodge: "",
    workOfEvening: "",
    notes: ""
  });

  function saveNew() {
    add({ ...draft, id: crypto.randomUUID() });
    setAdding(false);
    setDraft({ id: crypto.randomUUID(), date: new Date().toISOString().slice(0,10), lodge: "", workOfEvening: "", notes: "" });
  }

  function Row({ v }: { v: Visit }) {
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [form, setForm] = React.useState<Visit>(v);
    React.useEffect(()=>setForm(v), [v]);
    function save() { update(form); setEdit(false); }

    const subtitle = [form.workOfEvening || "Visit", form.lodge || ""].filter(Boolean).join(" • ");

    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <button className="w-full text-left px-3 py-2 flex items-center justify-between" onClick={()=>setOpen(o=>!o)}>
          <div className="min-w-0">
            <div className="font-medium truncate">{subtitle || "Visit"}</div>
            <div className="text-sm text-gray-500 truncate">{form.notes || "—"}</div>
          </div>
          <div className="text-sm text-gray-600">{form.date}</div>
        </button>
        {open && (
          <div className="px-3 pb-3 space-y-3">
            {!edit ? (
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>setEdit(true)}>Edit</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Date</span>
                    <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={form.date} onChange={(e)=>setForm({...form, date: e.target.value})} />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Work of the Evening</span>
                    <select className="rounded-lg border border-gray-300 px-3 py-2" value={form.workOfEvening || ""} onChange={(e)=>setForm({...form, workOfEvening: e.target.value})}>
                      <option value="">Select…</option>
                      {WORK_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Lodge (free text)</span>
                    <input className="rounded-lg border border-gray-300 px-3 py-2" value={form.lodge || ""} onChange={(e)=>setForm({...form, lodge: e.target.value})} placeholder="e.g., Lodge Example No. 123" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                    <span className="font-medium">Notes</span>
                    <input className="rounded-lg border border-gray-300 px-3 py-2" value={form.notes || ""} onChange={(e)=>setForm({...form, notes: e.target.value})} placeholder="(optional)" />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setEdit(false); setForm(v);}}>Cancel</button>
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
        <h1 className="text-xl font-semibold">Visits</h1>
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
        <div className="rounded-xl border border-gray-200 bg-white p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Date</span>
              <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={draft.date} onChange={(e)=>setDraft({...draft, date: e.target.value})} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Work of the Evening</span>
              <select className="rounded-lg border border-gray-300 px-3 py-2" value={draft.workOfEvening || ""} onChange={(e)=>setDraft({...draft, workOfEvening: e.target.value})}>
                <option value="">Select…</option>
                {WORK_OPTIONS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Lodge (free text)</span>
              <input className="rounded-lg border border-gray-300 px-3 py-2" value={draft.lodge || ""} onChange={(e)=>setDraft({...draft, lodge: e.target.value})} placeholder="e.g., Lodge Example No. 123" />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium">Notes</span>
              <input className="rounded-lg border border-gray-300 px-3 py-2" value={draft.notes || ""} onChange={(e)=>setDraft({...draft, notes: e.target.value})} />
            </label>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {visits.map(v => <Row key={v.id} v={v} />)}
        {visits.length === 0 && <div className="text-sm text-gray-500">No visits recorded yet.</div>}
      </div>
    </div>
  );
}
