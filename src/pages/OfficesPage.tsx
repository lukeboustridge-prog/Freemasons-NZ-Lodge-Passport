import React from "react";
import { useOffices, Office } from "../context/OfficesContext";
import { SectionCard } from "../components/SectionCard";

function OfficeRow({ o, onUpdate, onDelete }: { o: Office; onUpdate: (o: Office)=>void; onDelete: ()=>void; }) {
  const [open, setOpen] = React.useState(false);
  const [edit, setEdit] = React.useState(false);
  const [form, setForm] = React.useState(o);
  React.useEffect(()=>setForm(o), [o]);

  function save() { onUpdate(form); setEdit(false); }

  return (
    <div className="rounded-xl border border-gray-200">
      <button className="w-full text-left px-3 py-2 flex items-center justify-between" onClick={()=>setOpen(v=>!v)}>
        <div className="min-w-0">
          <div className="font-medium truncate">{o.officeName}</div>
          <div className="text-sm text-gray-500 truncate">{o.scope === "Grand" ? "Grand Lodge" : (o.lodgeName || "Lodge")}</div>
        </div>
        <div className="text-sm text-gray-600">{o.isCurrent ? "Current" : (o.endDate ? `Ended ${o.endDate}` : "Past")}</div>
      </button>
      {open && (
        <div className="px-3 pb-3 space-y-3">
          {!edit ? (
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>setEdit(true)}>Edit</button>
              <button className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm" onClick={onDelete}>Delete</button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Scope</span>
                  <select className="rounded-lg border border-gray-300 px-3 py-2" value={form.scope} onChange={(e)=>setForm({...form, scope: e.target.value as Office["scope"]})}>
                    <option value="Lodge">Lodge</option>
                    <option value="Grand">Grand</option>
                  </select>
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Office name</span>
                  <input className="rounded-lg border border-gray-300 px-3 py-2" value={form.officeName} onChange={(e)=>setForm({...form, officeName: e.target.value})} />
                </label>
                {form.scope === "Lodge" && (
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Lodge name</span>
                    <input className="rounded-lg border border-gray-300 px-3 py-2" value={form.lodgeName || ""} onChange={(e)=>setForm({...form, lodgeName: e.target.value})} />
                  </label>
                )}
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">Start date</span>
                  <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={form.startDate} onChange={(e)=>setForm({...form, startDate: e.target.value})} />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                  <span className="font-medium">End date</span>
                  <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={form.endDate || ""} onChange={(e)=>setForm({...form, endDate: e.target.value})} />
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" checked={form.isCurrent} onChange={(e)=>setForm({...form, isCurrent: e.target.checked})} />
                  Current
                </label>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setEdit(false); setForm(o);}}>Cancel</button>
                <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={save}>Save</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OfficesPage(){
  const { offices, setOffices } = useOffices();
  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState<Office>({
    id: crypto.randomUUID(),
    scope: "Lodge",
    lodgeName: "",
    officeName: "",
    startDate: new Date().toISOString().slice(0,10),
    isCurrent: true
  } as Office);

  function add() {
    setOffices([{ ...draft, id: crypto.randomUUID() }, ...offices]);
    setAdding(false);
  }
  function updateOne(updated: Office) {
    setOffices(offices.map(o => o.id === updated.id ? updated : o));
  }
  function deleteOne(id: string) {
    setOffices(offices.filter(o => o.id != id));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Offices Held</h1>
        {!adding ? (
          <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>setAdding(true)}>Add</button>
        ) : (
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setAdding(False);}}>Cancel</button>
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={add}>Save</button>
          </div>
        )}
      </div>

      {adding && (
        <SectionCard title="New office">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Scope</span>
              <select className="rounded-lg border border-gray-300 px-3 py-2" value={draft.scope} onChange={(e)=>setDraft({...draft, scope: e.target.value as Office["scope"]})}>
                <option value="Lodge">Lodge</option>
                <option value="Grand">Grand</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Office name</span>
              <input className="rounded-lg border border-gray-300 px-3 py-2" value={draft.officeName} onChange={(e)=>setDraft({...draft, officeName: e.target.value})} />
            </label>
            {draft.scope === "Lodge" && (
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Lodge name</span>
                <input className="rounded-lg border border-gray-300 px-3 py-2" value={draft.lodgeName || ""} onChange={(e)=>setDraft({...draft, lodgeName: e.target.value})} />
              </label>
            )}
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Start date</span>
              <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={draft.startDate} onChange={(e)=>setDraft({...draft, startDate: e.target.value})} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">End date</span>
              <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={draft.endDate || ""} onChange={(e)=>setDraft({...draft, endDate: e.target.value})} />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="rounded" checked={draft.isCurrent} onChange={(e)=>setDraft({...draft, isCurrent: e.target.checked})} />
              Current
            </label>
          </div>
        </SectionCard>
      )}

      <div className="space-y-3">
        {offices.map(o => (
          <OfficeRow
            key={o.id}
            o={o}
            onUpdate={updateOne}
            onDelete={()=>deleteOne(o.id)}
          />
        ))}
        {offices.length === 0 && <div className="text-sm text-gray-500">No offices recorded yet.</div>}
      </div>
    </div>
  );
}
