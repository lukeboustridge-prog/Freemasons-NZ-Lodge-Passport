import React from "react";

export type Visit = {
  id: string;
  date: string; // YYYY-MM-DD
  lodge?: string; // free text
  purpose?: string;
};

export function VisitsScreen({
  visits,
  onSave,
  onUpdate
}: {
  visits: Visit[];
  onSave: (v: Visit) => void;
  onUpdate: (v: Visit) => void;
}) {
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState<Visit>({
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0,10),
    lodge: "",
    purpose: ""
  });

  function add() {
    const v = { ...draft, id: crypto.randomUUID() };
    onSave(v);
    setAdding(false);
    setDraft({
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0,10),
      lodge: "",
      purpose: ""
    });
  }

  function Row({ v }: { v: Visit }) {
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [form, setForm] = React.useState<Visit>(v);
    React.useEffect(()=>setForm(v), [v]);

    function save() {
      onUpdate(form);
      setEdit(false);
    }

    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <button className="w-full text-left px-3 py-2 flex items-center justify-between" onClick={()=>setOpen(o=>!o)}>
          <div className="min-w-0">
            <div className="font-medium truncate">{form.lodge || "Lodge (unspecified)"}</div>
            <div className="text-sm text-gray-500 truncate">{form.purpose || "Visit"}</div>
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
                    <span className="font-medium">Lodge (free text)</span>
                    <input className="rounded-lg border border-gray-300 px-3 py-2" value={form.lodge || ""} onChange={(e)=>setForm({...form, lodge: e.target.value})} placeholder="e.g., Lodge Example No. 123" />
                  </label>
                  <label className="flex flex-col gap-1 text-sm sm:col-span-2">
                    <span className="font-medium">Purpose / notes</span>
                    <input className="rounded-lg border border-gray-300 px-3 py-2" value={form.purpose || ""} onChange={(e)=>setForm({...form, purpose: e.target.value})} placeholder="e.g., Installation, Regular, Charity night" />
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
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={add}>Save</button>
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
              <span className="font-medium">Lodge (free text)</span>
              <input className="rounded-lg border border-gray-300 px-3 py-2" value={draft.lodge || ""} onChange={(e)=>setDraft({...draft, lodge: e.target.value})} placeholder="e.g., Lodge Example No. 123" />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium">Purpose / notes</span>
              <input className="rounded-lg border border-gray-300 px-3 py-2" value={draft.purpose || ""} onChange={(e)=>setDraft({...draft, purpose: e.target.value})} />
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
