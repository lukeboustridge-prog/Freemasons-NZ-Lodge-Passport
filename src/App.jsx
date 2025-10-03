import React, { useEffect, useMemo, useRef, useState } from "react";
import { BOC_RANKS, PREFIX_ORDER, maxPrefix } from "./bocMapping";

const storeKey = "fnz-passport-demo-v3";
const saveState = (s) => localStorage.setItem(storeKey, JSON.stringify(s));
const loadState = () => { try { return JSON.parse(localStorage.getItem(storeKey)) ?? null; } catch { return null; } };
const uid = () => Math.random().toString(36).slice(2, 9);

const RankSelect = ({ value, onChange }) => (
  <select value={value} onChange={(e)=>onChange(e.target.value)}>
    {Object.entries(BOC_RANKS).map(([code, r]) => (
      <option key={code} value={code}>{code === "NONE" ? "— (None)" : `${r.title} (${code})`}</option>
    ))}
  </select>
);

/* ---------------- Profile ---------------- */
function ProfileCard({ profile, update }){
  const entitlementPrefix = useMemo(() => {
    const curr = BOC_RANKS[profile.currentGrandRank]?.entitlementPrefix ?? "Bro";
    const past = BOC_RANKS[profile.pastGrandRank]?.entitlementPrefix ?? "Bro";
    return maxPrefix(curr, past);
  }, [profile.currentGrandRank, profile.pastGrandRank]);

  return (
    <div className="card">
      <h3>Member Profile</h3>
      <div className="row">
        <div><label>First name</label><input inputMode="text" autoComplete="given-name" value={profile.firstName} onChange={e=>update({firstName:e.target.value})}/></div>
        <div><label>Last name</label><input inputMode="text" autoComplete="family-name" value={profile.lastName} onChange={e=>update({lastName:e.target.value})}/></div>
      </div>

      <div className="card" style={{padding:12, marginTop:12}}>
        <div className="row" style={{alignItems:"center"}}>
          <div style={{flex:1}}><label>Current Grand Rank</label><RankSelect value={profile.currentGrandRank} onChange={(v)=>update({currentGrandRank:v})}/></div>
          <div style={{flex:1}}><label>Past Grand Rank</label><RankSelect value={profile.pastGrandRank} onChange={(v)=>update({pastGrandRank:v})}/></div>
        </div>
        <div className="controls">
          <label className="pill"><input type="checkbox" checked={profile.autoPrefix} onChange={(e)=>update({autoPrefix:e.target.checked})}/> Auto prefix</label>
          {!profile.autoPrefix && (<select style={{maxWidth:180}} value={profile.manualPrefix} onChange={(e)=>update({manualPrefix:e.target.value})}>
            {PREFIX_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
          </select>)}
          <span className="muted">Entitlement (BOC): <b>{entitlementPrefix}</b></span>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Dashboard ---------------- */
function DashboardCard({ profile }){
  const entitlementPrefix = useMemo(() => {
    const curr = BOC_RANKS[profile.currentGrandRank]?.entitlementPrefix ?? "Bro";
    const past = BOC_RANKS[profile.pastGrandRank]?.entitlementPrefix ?? "Bro";
    return maxPrefix(curr, past);
  }, [profile.currentGrandRank, profile.pastGrandRank]);
  const activePrefix = profile.autoPrefix ? entitlementPrefix : profile.manualPrefix;

  const postNominals = useMemo(() => {
    const out = [];
    if (profile.currentGrandRank !== "NONE") out.push(BOC_RANKS[profile.currentGrandRank]?.postNominal ?? "");
    if (profile.pastGrandRank !== "NONE") out.push(BOC_RANKS[profile.pastGrandRank]?.pastPostNominal ?? "");
    return out.filter(Boolean).join(" ");
  }, [profile.currentGrandRank, profile.pastGrandRank]);

  const displayName = `${activePrefix} ${profile.firstName} ${profile.lastName}${postNominals ? " " + postNominals : ""}`.replaceAll("  ", " ").trim();

  return (
    <div className="card">
      <h3>Dashboard</h3>
      <div className="name-line">{displayName}</div>
      <div className="muted">Auto-updates as you change rank/prefix.</div>
      <div style={{marginTop:14}}><div className="pill">Post-nominals: <span className="code">{postNominals || "—"}</span></div></div>
    </div>
  );
}

/* ---------------- Lodges ---------------- */
function LodgesCard({ profile, update }){
  const updateLodge = (i, patch) => { const c=[...profile.lodges]; c[i]={...c[i],...patch}; update({lodges:c}); };
  const add = () => update({lodges: [...profile.lodges, { name:"", status:"Active", resignedDate:"" }]});
  const remove = () => update({lodges: profile.lodges.slice(0, -1)});

  return (
    <div className="card">
      <h3>Lodges</h3>
      <table><thead><tr><th style={{width:"45%"}}>Lodge</th><th style={{width:"22%"}}>Status</th><th style={{width:"33%"}}>Resigned date</th></tr></thead>
      <tbody>
        {profile.lodges.map((lg, idx)=>(
          <tr key={idx}>
            <td><input value={lg.name} onChange={e=>updateLodge(idx,{name:e.target.value})}/></td>
            <td>
              <select value={lg.status} onChange={e=>updateLodge(idx,{status:e.target.value})}>
                <option>Active</option><option>Resigned</option>
              </select>
            </td>
            <td><input type="date" placeholder="YYYY-MM-DD" value={lg.resignedDate} onChange={e=>updateLodge(idx,{resignedDate:e.target.value})}/></td>
          </tr>
        ))}
      </tbody></table>
      <div className="controls">
        <button onClick={add} className="primary">Add lodge</button>
        <button onClick={remove} disabled={profile.lodges.length===0}>Remove last</button>
      </div>
    </div>
  );
}

/* ---------------- Visits ---------------- */
function VisitsCard({ profile, update }){
  const [form, setForm] = useState({ date:"", lodge:"", notes:"" });
  const addVisit = () => {
    if (!form.date || !form.lodge) return;
    const entry = { id: uid(), ...form };
    update({ visits: [entry, ...profile.visits] });
    setForm({ date:"", lodge:"", notes:"" });
  };
  const remove = (id) => update({ visits: profile.visits.filter(v => v.id !== id) });

  return (
    <div className="card">
      <h3>Visits</h3>
      <div className="row">
        <div><label>Date</label><input type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/></div>
        <div><label>Lodge</label><input placeholder="Which lodge?" value={form.lodge} onChange={e=>setForm({...form, lodge:e.target.value})}/></div>
      </div>
      <label>Notes</label>
      <input placeholder="E.g., Installation, First degree, Remarks" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
      <div className="controls"><button className="primary" onClick={addVisit}>Add visit</button></div>

      <table style={{marginTop:8}}>
        <thead><tr><th style={{width:"18%"}}>Date</th><th style={{width:"42%"}}>Lodge</th><th style={{width:"32%"}}>Notes</th><th style={{width:"8%"}}></th></tr></thead>
        <tbody>
          {profile.visits.map(v => (
            <tr key={v.id}>
              <td>{v.date}</td>
              <td>{v.lodge}</td>
              <td className="muted">{v.notes}</td>
              <td><button onClick={()=>remove(v.id)}>✕</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- Settings ---------------- */
function SettingsCard({ profile, setProfile }){
  const fileRef = useRef(null);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fnz-passport-profile.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJson = (file) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        // Minimal shape guard
        if (!data || typeof data !== "object") throw new Error("Invalid file");
        setProfile(data);
      } catch (e) { alert("Could not import file: " + e.message); }
    };
    reader.readAsText(file);
  };

  const resetAll = () => {
    if (!confirm("Reset all local data? This cannot be undone.")) return;
    localStorage.removeItem(storeKey);
    location.reload();
  };

  return (
    <div className="card">
      <h3>Settings</h3>
      <div className="controls">
        <button onClick={exportJson} className="primary">Export profile (JSON)</button>
        <input ref={fileRef} type="file" accept="application/json" style={{display:"none"}} onChange={(e)=> e.target.files?.[0] && importJson(e.target.files[0])} />
        <button onClick={()=>fileRef.current?.click()}>Import profile (JSON)</button>
        <button onClick={resetAll}>Reset local data</button>
      </div>
      <div className="muted" style={{marginTop:8}}>Data is stored only on this device (localStorage). Export to back up or move to another device.</div>
    </div>
  );
}

/* ---------------- App Shell ---------------- */
export default function App(){
  const [tab, setTab] = useState("dashboard"); // dashboard | profile | lodges | visits | settings
  const [profile, setProfile] = useState(() => loadState() ?? {
    firstName: "Luke", lastName: "Boustridge", autoPrefix: true, manualPrefix: "Bro",
    currentGrandRank: "GSWB", pastGrandRank: "NONE",
    lodges: [{ name: "Corinthian Lodge No. 123", status: "Active", resignedDate: "" },
             { name: "Southern Star Lodge No. 45", status: "Resigned", resignedDate: "2024-11-12" }],
    visits: [
      { id: uid(), date: "2025-09-10", lodge: "Example Lodge No. 99", notes: "Installation" }
    ]
  });
  useEffect(()=> saveState(profile), [profile]);
  const update = (patch) => setProfile(p => ({...p, ...patch}));

  return (
    <div className="container">
      {/* Mobile tab bar */}
      <div className="tabbar">
        <div className="tabs">
          <button className={`tab ${tab==='dashboard'?'active':''}`} onClick={()=>setTab('dashboard')}>Dashboard</button>
          <button className={`tab ${tab==='profile'?'active':''}`} onClick={()=>setTab('profile')}>Profile</button>
          <button className={`tab ${tab==='lodges'?'active':''}`} onClick={()=>setTab('lodges')}>Lodges</button>
          <button className={`tab ${tab==='visits'?'active':''}`} onClick={()=>setTab('visits')}>Visits</button>
          <button className={`tab ${tab==='settings'?'active':''}`} onClick={()=>setTab('settings')}>Settings</button>
        </div>
      </div>

      {/* Mobile stack */}
      <div className="stack">
        {tab === 'dashboard' && <DashboardCard profile={profile}/>}
        {tab === 'profile' && <ProfileCard profile={profile} update={(p)=>update(p)}/>}
        {tab === 'lodges' && <LodgesCard profile={profile} update={(p)=>update(p)}/>}
        {tab === 'visits' && <VisitsCard profile={profile} update={(p)=>update(p)}/>}
        {tab === 'settings' && <SettingsCard profile={profile} setProfile={setProfile}/>}
      </div>

      {/* Desktop grid */}
      <div className="grid">
        <ProfileCard profile={profile} update={(p)=>update(p)}/>
        <DashboardCard profile={profile}/>
      </div>
      <div className="grid">
        <LodgesCard profile={profile} update={(p)=>update(p)}/>
        <VisitsCard profile={profile} update={(p)=>update(p)}/>
      </div>
      <div className="grid">
        <SettingsCard profile={profile} setProfile={setProfile}/>
      </div>
    </div>
  );
}
