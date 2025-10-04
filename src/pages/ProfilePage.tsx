import React from "react";
import { useProfile } from "../context/ProfileContext";
import { useOffices, computePrefix, computePostNominals } from "../context/OfficesContext";
import { SectionCard } from "../components/SectionCard";

export default function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const { offices } = useOffices();
  const [editing, setEditing] = React.useState(false);
  const [form, setForm] = React.useState(profile);

  React.useEffect(() => setForm(profile), [profile]);

  const prefix = computePrefix(offices);
  const posts = computePostNominals(offices);
  const displayName = `${prefix} ${profile.firstName} ${profile.lastName}${posts.length ? ", " + posts.join(", ") : ""}`;

  function save() {
    setProfile(form);
    setEditing(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Profile</h1>
        {!editing ? (
          <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>setEditing(true)}>Edit</button>
        ) : (
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-gray-200 text-gray-900 text-sm" onClick={()=>{setEditing(false); setForm(profile);}}>Cancel</button>
            <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={save}>Save</button>
          </div>
        )}
      </div>

      <SectionCard title="Name">
        {!editing ? (
          <div className="space-y-1">
            <div className="text-lg font-medium">{displayName}</div>
            <div className="text-sm text-gray-600">Prefix and post-nominals are automated from your Offices Held.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">First name</span>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.firstName} onChange={(e)=>setForm({...form, firstName: e.target.value})} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              <span className="font-medium">Last name</span>
              <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.lastName} onChange={(e)=>setForm({...form, lastName: e.target.value})} />
            </label>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
