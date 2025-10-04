import React from "react";
import { useProfile } from "../context/ProfileContext";
import { useOffices, computePrefix, computePostNominals } from "../context/OfficesContext";
import { useLodges, Lodge } from "../context/LodgesContext";
import { SectionCard } from "../components/SectionCard";

export default function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const { offices } = useOffices();
  const { lodges, setLodges } = useLodges();
  const [editingName, setEditingName] = React.useState(false);
  const [nameForm, setNameForm] = React.useState(profile);

  const prefix = computePrefix(offices);
  const posts = computePostNominals(offices);
  const displayName = `${prefix} ${profile.firstName} ${profile.lastName}${posts.length ? ", " + posts.join(", ") : ""}`;

  function saveName() { setProfile(nameForm); setEditingName(false); }

  const [adding, setAdding] = React.useState(false);
  const [draft, setDraft] = React.useState<Lodge>({
    id: crypto.randomUUID(),
    name: "",
    joinDate: new Date().toISOString().slice(0,10),
  });

  function addLodge() {
    if (!draft.name.trim()) return;
    setLodges([{ ...draft, id: crypto.randomUUID() }, ...lodges]);
    setAdding(false);
  }

  function updateLodge(updated: Lodge) {
    setLodges(lodges.map(l => l.id === updated.id ? updated : l));
  }
  function deleteLodge(id: string) {
    setLodges(lodges.filter(l => l.id !== id));
  }

  function LodgeRow({ l }: { l: Lodge }) {
    const [open, setOpen] = React.useState(false);
    const [edit, setEdit] = React.useState(false);
    const [form, setForm] = React.useState<Lodge>(l);
    React.useEffect(()=>setForm(l), [l]);
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <button className="w-full text-left px-3 py-2 flex items-center justify-between" onClick={()=>setOpen(v=>!v)}>
          <div className="min-w-0">
            <div className="font-medium truncate">{l.name}</div>
            <div className="text-sm text-gray-500 truncate">
              {l.joinDate}{l.resignedDate ? " – " + l.resignedDate : ""}
            </div>
          </div>
        </button>
        {open && (
          <div className="px-3 pb-3 space-y-3">
            {!edit ? (
              <div className="flex gap-2">
                <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>setEdit(true)}>Edit</button>
                <button className="px-3 py-2 rounded-lg bg-red-600 text-white text-sm" onClick={()=>deleteLodge(l.id)}>Delete</button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Lodge name</span>
                    <input className="rounded-lg border border-gray-300 px-3 py-2" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Join date</span>
                    <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={form.joinDate} onChange={(e)=>setForm({...form, joinDate: e.target.value})} />
                  </label>
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Resigned date</span>
                    <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={form.resignedDate || ""} onChange={(e)=>setForm({...form, resignedDate: e.target.value})} />
                  </label>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setEdit(false); setForm(l);}}>Cancel</button>
                  <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>{updateLodge(form); setEdit(false);}}>Save</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Profile</h1>
        {!editingName ? (
          <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>setEditingName(true)}>Edit</button>
        ) : (
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setEditingName(false); setNameForm(profile);}}>Cancel</button>
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={saveName}>Save</button>
          </div>
        )}
      </div>

      <SectionCard title="Name">
        {!editingName ? (
          <div className="space-y-1">
            <div className="text-lg font-medium">{displayName}</div>
            <div className="text-sm text-gray-600">Prefix and post-nominals are automated from your Offices Held.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">First name</span>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={nameForm.firstName} onChange={(e)=>setNameForm({...nameForm, firstName: e.target.value})} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Last name</span>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={nameForm.lastName} onChange={(e)=>setNameForm({...nameForm, lastName: e.target.value})} />
            </label>
          </div>
        )}
      </SectionCard>

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Lodges</h2>
        {!adding ? (
          <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>setAdding(true)}>Add lodge</button>
        ) : (
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={()=>{setAdding(false);}}>Cancel</button>
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={addLodge}>Save</button>
          </div>
        )}
      </div>
      {adding && (
        <SectionCard title="New lodge">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Lodge name</span>
              <input className="rounded-lg border border-gray-300 px-3 py-2" value={draft.name} onChange={(e)=>setDraft({...draft, name: e.target.value})} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Join date</span>
              <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={draft.joinDate} onChange={(e)=>setDraft({...draft, joinDate: e.target.value})} />
            </label>
            <label className="flex flex-col gap-1 text-sm sm:col-span-2">
              <span className="font-medium">Resigned date (optional)</span>
              <input type="date" className="rounded-lg border border-gray-300 px-3 py-2" value={draft.resignedDate || ""} onChange={(e)=>setDraft({...draft, resignedDate: e.target.value})} />
            </label>
          </div>
        </SectionCard>
      )}

      <div className="space-y-3">
        {lodges.map(l => <LodgeRow key={l.id} l={l} />)}
        {lodges.length === 0 && <div className="text-sm text-gray-500">No lodges recorded yet.</div>}
      </div>
    </div>
  );
}
