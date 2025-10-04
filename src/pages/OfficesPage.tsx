import React from "react";
import { useOffices, Office } from "../context/OfficesContext";
import { SectionCard } from "../components/SectionCard";

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

  function add() { setOffices([{ ...draft, id: crypto.randomUUID() }, ...offices]); setAdding(false); }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Offices Held</h1>
        {!adding ? (
          <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>setAdding(true)}>Add</button>
        ) : (
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setAdding(false);}}>Cancel</button>
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
    </div>
  );
}
