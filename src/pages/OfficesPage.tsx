import React from "react";
import { useOffices, Office } from "../context/OfficesContext";
import { useLodges, formatLodgeName } from "../context/LodgesContext";
import { SectionCard } from "../components/SectionCard";
import { LODGE_OFFICES_ORDERED, GRAND_OFFICES_ORDERED } from "../data/offices";

export default function OfficesPage(){
  const { offices, setOffices } = useOffices();
  const { lodges } = useLodges();
  const [adding, setAdding] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [draft, setDraft] = React.useState<Office>({
    id: crypto.randomUUID(),
    scope: "Lodge",
    lodgeName: "",
    officeName: LODGE_OFFICES_ORDERED[0],
    startDate: new Date().toISOString().slice(0,10),
    isCurrent: true
  } as Office);

  React.useEffect(()=>{
    setDraft(d => ({
      ...d,
      officeName: d.scope === "Grand" ? GRAND_OFFICES_ORDERED[0] : LODGE_OFFICES_ORDERED[0],
      lodgeName: d.scope === "Grand" ? "" : d.lodgeName
    }));
  }, [draft.scope]);

  function validate(o: Office): string | null {
    if (o.scope === "Lodge" && !o.lodgeName) return "Please select a lodge for lodge offices.";
    if (o.scope === "Grand" && o.isCurrent) {
      const anotherCurrentGrand = offices.some(of => of.scope === "Grand" && of.isCurrent);
      if (anotherCurrentGrand) return "Only one current Grand Lodge office is allowed.";
    }
    return null;
  }

  function add() {
    const err = validate(draft);
    if (err) { setError(err); return; }
    setOffices([{ ...draft, id: crypto.randomUUID() }, ...offices]);
    setAdding(false);
    setError(null);
  }

  function updateOne(updated: Office) {
    const err = validate(updated);
    if (err) return setError(err);
    setOffices(offices.map(o => o.id === updated.id ? updated : o));
    setError(null);
  }

  function deleteOne(id: string) {
    setOffices(offices.filter(o => o.id !== id));
  }

  function Options({ scope, value, onChange }:{ scope: Office["scope"]; value: string; onChange:(v:string)=>void }) {
    const items = scope === "Grand" ? GRAND_OFFICES_ORDERED : LODGE_OFFICES_ORDERED;
    return (
      <select className="rounded-lg border border-gray-300 px-3 py-2" value={value} onChange={e=>onChange(e.target.value)}>
        {items.map((name)=> (<option key={name} value={name}>{name}</option>))}
      </select>
    );
  }

  function LodgeSelect({ value, onChange }:{ value: string; onChange:(v:string)=>void }) {
    return (
      <select className="rounded-lg border border-gray-300 px-3 py-2" value={value} onChange={e=>onChange(e.target.value)}>
        <option value="">Select lodge…</option>
        {lodges.map(l => {
          const label = formatLodgeName(l);
          return <option key={l.id} value={label}>{label}</option>
        })}
      </select>
    );
  }

  function Row({ o }:{ o: Office }) {
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [form, setForm] = React.useState<Office>(o);
    const [rowError, setRowError] = React.useState<string | null>(null);
    React.useEffect(()=>setForm(o), [o]);

    function save() {
      const err = validate(form);
      if (err) { setRowError(err); return; }
      updateOne(form);
      setEdit(false);
      setRowError(null);
    }

    const status = o.isCurrent ? "Current" : (o.endDate ? "Ended " + o.endDate : "Past");

    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <button className="w-full text-left px-3 py-2 flex items-center justify-between" onClick={()=>setOpen(v=>!v)}>
          <div className="min-w-0">
            <div className="font-medium truncate">{o.officeName}</div>
            <div className="text-sm text-gray-500 truncate">{o.scope === "Grand" ? "Grand Lodge" : (o.lodgeName || "Lodge")}</div>
          </div>
          <div className="text-sm text-gray-600">{status}</div>
        </button>
        {open && (
          <div className="px-3 pb-3 space-y-3">
            {!edit ? (
              <>
                <div className="text-sm text-gray-600">
                  <div><span className="text-gray-500">Start:</span> {o.startDate || "—"}</div>
                  <div><span className="text-gray-500">End:</span> {o.endDate || "—"}</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>setEdit(true)}>Edit</button>
                  <button className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm" onClick={()=>deleteOne(o.id)}>Delete</button>
                </div>
              </>
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
                    <span className="font-medium">Office</span>
                    <Options scope={form.scope} value={form.officeName} onChange={(v)=>setForm({...form, officeName: v})} />
                  </label>
                  {form.scope === "Lodge" && (
                    <label className="flex flex-col gap-1 text-sm">
                      <span className="font-medium">Lodge</span>
                      <LodgeSelect value={form.lodgeName || ""} onChange={(v)=>setForm({...form, lodgeName: v})} />
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
                {rowError && <div className="text-sm text-red-600">{rowError}</div>}
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setEdit(false); setForm(o); setRowError(null);}}>Cancel</button>
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
        <h1 className="text-xl font-semibold">Offices Held</h1>
        {!adding ? (
          <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>{setDraft(d=>({ ...d, lodgeName: "" })); setAdding(true);}}>Add</button>
        ) : (
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setAdding(false); setError(null);}}>Cancel</button>
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
              <span className="font-medium">Office</span>
              <Options scope={draft.scope} value={draft.officeName} onChange={(v)=>setDraft({...draft, officeName: v})} />
            </label>
            {draft.scope === "Lodge" && (
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-medium">Lodge</span>
                <LodgeSelect value={draft.lodgeName || ""} onChange={(v)=>setDraft({...draft, lodgeName: v})} />
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
          {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
        </SectionCard>
      )}

      <div className="space-y-3">
        {offices.map(o => <Row key={o.id} o={o} />)}
        {offices.length === 0 && <div className="text-sm text-gray-500">No offices recorded yet.</div>}
      </div>
    </div>
  );
}
