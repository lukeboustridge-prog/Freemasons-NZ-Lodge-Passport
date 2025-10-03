import React, { useEffect, useMemo, useRef, useState } from "react";
import { BOC_RANKS, PREFIX_ORDER, maxPrefix } from "./bocMapping";

const storeKey = "fnz-passport-demo-v7";
const saveState = (s) => localStorage.setItem(storeKey, JSON.stringify(s));
const loadState = () => { try { return JSON.parse(localStorage.getItem(storeKey)) ?? null; } catch { return null; } };
const uid = () => Math.random().toString(36).slice(2, 9);

const toYears = (iso) => {
  if (!iso) return 0;
  try {
    const d = new Date(iso);
    const diff = Date.now() - d.getTime();
    return Math.max(0, Math.floor(diff / (1000*60*60*24*365.25)));
  } catch { return 0; }
};

const RankSelect = ({ value, onChange, disabled }) => (
  <select disabled={disabled} value={value} onChange={(e)=>onChange(e.target.value)}>
    {Object.entries(BOC_RANKS).map(([code, r]) => (
      <option key={code} value={code}>{code === "NONE" ? "— (None)" : `${r.title} (${code})`}</option>
    ))}
  </select>
);

// Lodge roles in reverse order as requested (including Deputy Master)
const LODGE_ROLES = [
  "Inner Guard",
  "Junior Deacon",
  "Senior Deacon",
  "Junior Warden",
  "Senior Warden",
  "Worshipful Master",
  "Immediate Past Master",
  "Deputy Master",
  "Director of Ceremonies",
  "Almoner",
  "Chaplain",
  "Treasurer",
  "Secretary",
  "Organist",
  "Other"
];

const GL_ROLES = [
  "Grand Sword Bearer",
  "Grand Director of Ceremonies",
  "Grand Almoner",
  "Grand Superintendent of Works",
  "Deputy Grand Master",
  "Assistant Grand Director of Ceremonies",
  "Grand Tyler",
  "Other"
];

/* ---------------- Profile (includes Lodges) ---------------- */
function ProfileCard({ profile, update }){
  const [edit, setEdit] = useState(false);

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Profile</h3>
        <div className="controls">
          {!edit ? <button onClick={()=>setEdit(true)}>Edit</button> : <button className="primary" onClick={()=>setEdit(false)}>Save</button>}
        </div>
      </div>

      <div className="row">
        <div>
          <label>First name</label>
          <input disabled={!edit} inputMode="text" autoComplete="given-name" value={profile.firstName} onChange={e=>update({firstName:e.target.value})}/>
        </div>
        <div>
          <label>Last name</label>
          <input disabled={!edit} inputMode="text" autoComplete="family-name" value={profile.lastName} onChange={e=>update({lastName:e.target.value})}/>
        </div>
      </div>

      {/* Lodges under Profile */}
      <div className="card" style={{padding:12, marginTop:12}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h3 style={{margin:0}}>Lodges</h3>
        </div>
        <table className="offices-table"><thead><tr><th>Lodge</th><th>Status</th><th>Resigned date</th></tr></thead>
        <tbody>
          {profile.lodges.map((lg, idx)=>(
            <tr key={idx}>
              <td><input disabled={!edit} value={lg.name} onChange={e=>{
                const c=[...profile.lodges]; c[idx]={...c[idx], name:e.target.value}; update({lodges:c});
              }}/></td>
              <td>
                <select disabled={!edit} value={lg.status} onChange={e=>{
                  const c=[...profile.lodges]; c[idx]={...c[idx], status:e.target.value}; update({lodges:c});
                }}>
                  <option>Active</option><option>Resigned</option>
                </select>
              </td>
              <td><input disabled={!edit} type="date" value={lg.resignedDate} onChange={e=>{
                const c=[...profile.lodges]; c[idx]={...c[idx], resignedDate:e.target.value}; update({lodges:c});
              }}/></td>
            </tr>
          ))}
        </tbody></table>

        {/* Mobile cards */}
        <div className="office-cards">
          {profile.lodges.map((lg, idx)=> (
            <div className="office-card" key={idx}>
              <h5>Lodge</h5>
              <div className="row">
                <div><label>Name</label><input disabled={!edit} value={lg.name} onChange={e=>{
                  const c=[...profile.lodges]; c[idx]={...c[idx], name:e.target.value}; update({lodges:c});
                }}/></div>
                <div><label>Status</label>
                  <select disabled={!edit} value={lg.status} onChange={e=>{
                    const c=[...profile.lodges]; c[idx]={...c[idx], status:e.target.value}; update({lodges:c});
                  }}>
                    <option>Active</option><option>Resigned</option>
                  </select>
                </div>
                <div><label>Resigned</label><input disabled={!edit} type="date" value={lg.resignedDate} onChange={e=>{
                  const c=[...profile.lodges]; c[idx]={...c[idx], resignedDate:e.target.value}; update({lodges:c});
                }}/></div>
              </div>
            </div>
          ))}
        </div>

        <div className="controls">
          <button disabled={!edit} className="primary" onClick={()=>update({lodges:[...profile.lodges,{name:"",status:"Active",resignedDate:""}]})}>Add lodge</button>
          <button disabled={!edit || profile.lodges.length===0} onClick={()=>update({lodges: profile.lodges.slice(0,-1)})}>Remove last</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Offices Held ---------------- */
function OfficesCard({ profile, update }){
  const [edit, setEdit] = useState(false);
  const offices = profile.offices || [];
  const setOffices = (arr) => update({ offices: arr });

  // Separate arrays for Lodge vs Grand Lodge
  const lodgeOffices = offices.filter(o => o.level === "Lodge");
  const glOffices = offices.filter(o => o.level === "Grand Lodge");

  const addLodgeOffice = () => setOffices([{ id: uid(), level:"Lodge", role:"Inner Guard", lodge:"", startDate:"", endDate:"", roleOther:"" }, ...offices]);
  const addGLOffice = () => setOffices([{ id: uid(), level:"Grand Lodge", role:"Grand Sword Bearer", lodge:"", startDate:"", endDate:"", roleOther:"" }, ...offices]);

  const updateOffice = (id, patch) => setOffices(offices.map(o => o.id === id ? ({...o, ...patch}) : o));
  const removeOffice = (id) => setOffices(offices.filter(o => o.id !== id));

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Offices Held</h3>
        <div className="controls">
          {!edit ? <button onClick={()=>setEdit(true)}>Edit</button> : <button className="primary" onClick={()=>setEdit(false)}>Save</button>}
        </div>
      </div>

      {/* Lodge Offices FIRST */}
      <div className="card" style={{padding:12, marginTop:12}}>
        <h4 style={{margin:'0 0 8px 0'}}>Lodge Offices</h4>

        {/* Desktop table */}
        <div className="offices-table">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Lodge</th>
                <th>Start</th>
                <th>End</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lodgeOffices.map(o => (
                <tr key={o.id}>
                  <td>
                    <select disabled={!edit} value={o.role} onChange={e=>updateOffice(o.id,{role:e.target.value})}>
                      {LODGE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {o.role === "Other" && (
                      <input disabled={!edit} placeholder="Specify role" value={o.roleOther||""} onChange={e=>updateOffice(o.id,{roleOther:e.target.value})}/>
                    )}
                  </td>
                  <td><input disabled={!edit} value={o.lodge} onChange={e=>updateOffice(o.id,{lodge:e.target.value})}/></td>
                  <td><input disabled={!edit} type="date" value={o.startDate} onChange={e=>updateOffice(o.id,{startDate:e.target.value})}/></td>
                  <td><input disabled={!edit} type="date" value={o.endDate} onChange={e=>updateOffice(o.id,{endDate:e.target.value})}/></td>
                  <td><button disabled={!edit} onClick={()=>removeOffice(o.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="office-cards">
          {lodgeOffices.map(o => (
            <div className="office-card" key={o.id}>
              <h5>Lodge Office</h5>
              <div className="row">
                <div>
                  <label>Role</label>
                  <select disabled={!edit} value={o.role} onChange={e=>updateOffice(o.id,{role:e.target.value})}>
                    {LODGE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {o.role === "Other" && (
                    <input disabled={!edit} placeholder="Specify role" value={o.roleOther||""} onChange={e=>updateOffice(o.id,{roleOther:e.target.value})}/>
                  )}
                </div>
                <div><label>Lodge</label><input disabled={!edit} value={o.lodge} onChange={e=>updateOffice(o.id,{lodge:e.target.value})}/></div>
                <div><label>Start</label><input disabled={!edit} type="date" value={o.startDate} onChange={e=>updateOffice(o.id,{startDate:e.target.value})}/></div>
                <div><label>End</label><input disabled={!edit} type="date" value={o.endDate} onChange={e=>updateOffice(o.id,{endDate:e.target.value})}/></div>
                <div><button disabled={!edit} onClick={()=>removeOffice(o.id)}>Remove</button></div>
              </div>
            </div>
          ))}
        </div>

        <div className="controls">
          <button disabled={!edit} className="primary" onClick={addLodgeOffice}>Add lodge office</button>
        </div>
      </div>

      {/* Grand Lodge Offices SECOND */}
      <div className="card" style={{padding:12, marginTop:12}}>
        <h4 style={{margin:'0 0 8px 0'}}>Grand Lodge Offices</h4>

        {/* Desktop table */}
        <div className="offices-table">
          <table>
            <thead>
              <tr>
                <th>Role</th>
                <th>Notes / Region</th>
                <th>Start</th>
                <th>End</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {glOffices.map(o => (
                <tr key={o.id}>
                  <td>
                    <select disabled={!edit} value={o.role} onChange={e=>updateOffice(o.id,{role:e.target.value})}>
                      {GL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {o.role === "Other" && (
                      <input disabled={!edit} placeholder="Specify role" value={o.roleOther||""} onChange={e=>updateOffice(o.id,{roleOther:e.target.value})}/>
                    )}
                  </td>
                  <td><input disabled={!edit} placeholder="District/Notes" value={o.lodge||""} onChange={e=>updateOffice(o.id,{lodge:e.target.value})}/></td>
                  <td><input disabled={!edit} type="date" value={o.startDate} onChange={e=>updateOffice(o.id,{startDate:e.target.value})}/></td>
                  <td><input disabled={!edit} type="date" value={o.endDate} onChange={e=>updateOffice(o.id,{endDate:e.target.value})}/></td>
                  <td><button disabled={!edit} onClick={()=>removeOffice(o.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="office-cards">
          {glOffices.map(o => (
            <div className="office-card" key={o.id}>
              <h5>Grand Lodge Office</h5>
              <div className="row">
                <div>
                  <label>Role</label>
                  <select disabled={!edit} value={o.role} onChange={e=>updateOffice(o.id,{role:e.target.value})}>
                    {GL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                  {o.role === "Other" && (
                    <input disabled={!edit} placeholder="Specify role" value={o.roleOther||""} onChange={e=>updateOffice(o.id,{roleOther:e.target.value})}/>
                  )}
                </div>
                <div><label>Notes / Region</label><input disabled={!edit} placeholder="District/Notes" value={o.lodge||""} onChange={e=>updateOffice(o.id,{lodge:e.target.value})}/></div>
                <div><label>Start</label><input disabled={!edit} type="date" value={o.startDate} onChange={e=>updateOffice(o.id,{startDate:e.target.value})}/></div>
                <div><label>End</label><input disabled={!edit} type="date" value={o.endDate} onChange={e=>updateOffice(o.id,{endDate:e.target.value})}/></div>
                <div><button disabled={!edit} onClick={()=>removeOffice(o.id)}>Remove</button></div>
              </div>
            </div>
          ))}
        </div>

        <div className="controls">
          <button disabled={!edit} className="primary" onClick={addGLOffice}>Add GL office</button>
        </div>
      </div>

      {/* Grand Rank LAST */}
      <div className="card" style={{padding:12, marginTop:12}}>
        <h4 style={{margin:'0 0 8px 0'}}>Grand Rank</h4>
        <div className="row" style={{alignItems:"center"}}>
          <div style={{flex:1}}>
            <label>Current Grand Rank</label>
            <RankSelect disabled={!edit} value={profile.currentGrandRank} onChange={(v)=>update({currentGrandRank:v})}/>
          </div>
          <div style={{flex:1}}>
            <label>Past Grand Rank</label>
            <RankSelect disabled={!edit} value={profile.pastGrandRank} onChange={(v)=>update({pastGrandRank:v})}/>
          </div>
        </div>
        <div className="controls">
          <label className="pill">
            <input disabled={!edit} type="checkbox" checked={profile.autoPrefix} onChange={(e)=>update({autoPrefix:e.target.checked})}/>
            Auto prefix
          </label>
          {!profile.autoPrefix && (
            <select disabled={!edit} style={{maxWidth:180}} value={profile.manualPrefix} onChange={(e)=>update({manualPrefix:e.target.value})}>
              {PREFIX_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          )}
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
  const years = toYears(profile?.milestones?.initiatedDate);
  const totalVisits = profile.visits?.length || 0;

  return (
    <div className="card">
      <h3>Dashboard</h3>
      <div className="name-line">{displayName}</div>
      <div className="muted">Auto-updates as you change data.</div>

      <div style={{marginTop:14, display:'grid', gap:8}}>
        <div className="pill">Years in Craft: <b>{years}</b></div>
        <div className="pill">Installed as Master: <b>{profile?.milestones?.installedDate ? "Yes" : "No"}</b></div>
        <div className="pill">Total visits: <b>{totalVisits}</b></div>
      </div>
    </div>
  );
}

/* ---------------- Milestones ---------------- */
function MilestonesCard({ profile, update }){
  const [edit, setEdit] = useState(false);
  const ms = profile.milestones || { initiatedDate:"", passedDate:"", raisedDate:"", installedDate:"" };
  const set = (patch) => update({ milestones: { ...ms, ...patch } });

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Milestones</h3>
        <div className="controls">
          {!edit ? <button onClick={()=>setEdit(true)}>Edit</button> : <button className="primary" onClick={()=>setEdit(false)}>Save</button>}
        </div>
      </div>

      <div className="row">
        <div>
          <label>Initiated</label>
          <input disabled={!edit} type="date" value={ms.initiatedDate} onChange={e=>set({initiatedDate:e.target.value})}/>
        </div>
        <div>
          <label>Passed</label>
          <input disabled={!edit} type="date" value={ms.passedDate} onChange={e=>set({passedDate:e.target.value})}/>
        </div>
      </div>
      <div className="row">
        <div>
          <label>Raised</label>
          <input disabled={!edit} type="date" value={ms.raisedDate} onChange={e=>set({raisedDate:e.target.value})}/>
        </div>
        <div>
          <label>Installed as Master</label>
          <input disabled={!edit} type="date" value={ms.installedDate} onChange={e=>set({installedDate:e.target.value})}/>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Visits ---------------- */
function VisitsCard({ profile, update }){
  const [edit, setEdit] = useState(false);
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
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Visits</h3>
        <div className="controls">
          {!edit ? <button onClick={()=>setEdit(true)}>Edit</button> : <button className="primary" onClick={()=>setEdit(false)}>Save</button>}
        </div>
      </div>

      <div className="row">
        <div><label>Date</label><input disabled={!edit} type="date" value={form.date} onChange={e=>setForm({...form, date:e.target.value})}/></div>
        <div><label>Lodge</label><input disabled={!edit} placeholder="Which lodge?" value={form.lodge} onChange={e=>setForm({...form, lodge:e.target.value})}/></div>
      </div>
      <label>Notes</label>
      <input disabled={!edit} placeholder="E.g., Installation, First degree, Remarks" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})}/>
      <div className="controls"><button disabled={!edit} className="primary" onClick={addVisit}>Add visit</button></div>

      <table style={{marginTop:8}}>
        <thead><tr><th>Date</th><th>Lodge</th><th>Notes</th><th></th></tr></thead>
        <tbody>
          {profile.visits.map(v => (
            <tr key={v.id}>
              <td>{v.date}</td>
              <td>{v.lodge}</td>
              <td className="muted">{v.notes}</td>
              <td><button disabled={!edit} onClick={()=>remove(v.id)}>✕</button></td>
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
  const [tab, setTab] = useState("offices"); // default to Offices for quick testing
  const [profile, setProfile] = useState(() => loadState() ?? {
    firstName: "Luke", lastName: "Boustridge", autoPrefix: true, manualPrefix: "Bro",
    currentGrandRank: "GSWB", pastGrandRank: "NONE",
    milestones: { initiatedDate:"", passedDate:"", raisedDate:"", installedDate:"" },
    lodges: [{ name: "Corinthian Lodge No. 123", status: "Active", resignedDate: "" }],
    offices: [
      { id: uid(), level:"Lodge", role:"Inner Guard", lodge:"Corinthian Lodge No. 123", startDate:"2023-06-01", endDate:"" },
      { id: uid(), level:"Grand Lodge", role:"Grand Sword Bearer", lodge:"", startDate:"2024-04-01", endDate:"" }
    ],
    visits: [{ id: uid(), date: "2025-09-10", lodge: "Example Lodge No. 99", notes: "Installation" }]
  });
  useEffect(()=> saveState(profile), [profile]);

  const update = (patch) => setProfile(p => ({...p, ...patch}));

  return (
    <div className="container">
      {/* Mobile tab bar */}
      <div className="tabbar">
        <div className="tabs" style={{overflowX:'auto'}}>
          <button className={`tab ${tab==='dashboard'?'active':''}`} onClick={()=>setTab('dashboard')}>Dashboard</button>
          <button className={`tab ${tab==='profile'?'active':''}`} onClick={()=>setTab('profile')}>Profile</button>
          <button className={`tab ${tab==='offices'?'active':''}`} onClick={()=>setTab('offices')}>Offices Held</button>
          <button className={`tab ${tab==='milestones'?'active':''}`} onClick={()=>setTab('milestones')}>Milestones</button>
          <button className={`tab ${tab==='visits'?'active':''}`} onClick={()=>setTab('visits')}>Visits</button>
          <button className={`tab ${tab==='settings'?'active':''}`} onClick={()=>setTab('settings')}>Settings</button>
        </div>
      </div>

      {/* Mobile stack */}
      <div className="stack">
        {tab === 'dashboard' && <DashboardCard profile={profile}/>}
        {tab === 'profile' && <ProfileCard profile={profile} update={(p)=>update(p)}/>}
        {tab === 'offices' && <OfficesCard profile={profile} update={(p)=>update(p)}/>}
        {tab === 'milestones' && <MilestonesCard profile={profile} update={(p)=>update(p)}/>}
        {tab === 'visits' && <VisitsCard profile={profile} update={(p)=>update(p)}/>}
        {tab === 'settings' && <SettingsCard profile={profile} setProfile={setProfile}/>}
      </div>

      {/* Desktop grid */}
      <div className="grid">
        <ProfileCard profile={profile} update={(p)=>update(p)}/>
        <DashboardCard profile={profile}/>
      </div>
      <div className="grid">
        <OfficesCard profile={profile} update={(p)=>update(p)}/>
        <MilestonesCard profile={profile} update={(p)=>update(p)}/>
      </div>
      <div className="grid">
        <VisitsCard profile={profile} update={(p)=>update(p)}/>
        <SettingsCard profile={profile} setProfile={setProfile}/>
      </div>
    </div>
  );
}
