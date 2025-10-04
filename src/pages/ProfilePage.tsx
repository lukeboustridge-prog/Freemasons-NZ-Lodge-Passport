import React from "react";
import { useProfile, Profile } from "../context/ProfileContext";

export default function ProfilePage() {
  const { profile, setProfile } = useProfile();
  const [form, setForm] = React.useState<Profile>(profile);

  function update<K extends keyof Profile>(k: K, v: Profile[K]) {
    setForm({ ...form, [k]: v });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="px-4 py-3 sm:px-6 sm:py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">First name</span>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.firstName} onChange={(e)=>update("firstName", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Last name</span>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.lastName} onChange={(e)=>update("lastName", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Rank</span>
            <select className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" value={form.rank} onChange={(e)=>update("rank", e.target.value as Profile["rank"])}>
              <option>Brother</option>
              <option>Warden</option>
              <option>Worshipful Master</option>
              <option>Past Master</option>
              <option>Grand Officer</option>
              <option>Grand Master</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Grand rank post-nominals</span>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" placeholder="e.g., PAGDC" value={form.grandPostNominals || ""} onChange={(e)=>update("grandPostNominals", e.target.value)} />
          </label>
        </div>
        <div className="px-4 py-3 sm:px-6 sm:py-4 border-t flex justify-end">
          <button className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm" onClick={()=>setProfile(form)}>Save</button>
        </div>
      </div>
    </div>
  );
}
