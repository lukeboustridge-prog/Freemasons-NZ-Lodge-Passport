import React, { useEffect, useMemo, useRef, useState } from "react";
import { BOC_RANKS, PREFIX_ORDER, maxPrefix } from "./bocMapping";

const storeKey = "fnz-passport-demo-v9";
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

// Lodge roles order (as requested)
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

const lodgeDisplay = (lg) => {
  if (!lg) return "";
  const name = lg.name || "";
  const num = lg.number || "";
  return num ? `${name} No. ${num}` : name;
};

/* ---------------- Profile (includes Lodges with add form) ---------------- */
function ProfileCard({ profile, update }){
  const [edit, setEdit] = useState(false);

  const [newLodge, setNewLodge] = useState({ name:"", number:"", status:"Active", resignedDate:"" });

  const addLodge = () => {
    if (!newLodge.name) { alert("Please enter Lodge Name."); return; }
    update({ lodges: [...profile.lodges, { ...newLodge }] });
    setNewLodge({ name:"", number:"", status:"Active", resignedDate:"" });
  };

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Profile</h3>
        <div className="controls">
          {!edit ? <button onClick={()=>setEdit(true)}>Edit existing</button> : <button className="primary" onClick={()=>setEdit(false)}>Save changes</button>}
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

        {/* Add new Lodge (always enabled) */}
        <div className="office-card" style={{marginBottom:10, borderStyle:'dashed'}}>
          <h5>Add a new Lodge</h5>
          <div className="row">
            <div><label>Lodge Name</label><input placeholder="e.g., Corinthian Lodge" value={newLodge.name} onChange={e=>setNewLodge({...newLodge, name:e.target.value})}/></div>
            <div><label>Number</label><input placeholder="e.g., 123" inputMode="numeric" value={newLodge.number} onChange={e=>setNewLodge({...newLodge, number:e.target.value})}/></div>
            <div><label>Status</label>
              <select value={newLodge.status} onChange={e=>setNewLodge({...newLodge, status:e.target.value})}>
                <option>Active</option><option>Resigned</option>
              </select>
            </div>
            <div><label>Resigned date</label><input type="date" value={newLodge.resignedDate} onChange={e=>setNewLodge({...newLodge, resignedDate:e.target.value})}/></div>
            <div><button className="primary" onClick={addLodge}>Add lodge</button></div>
          </div>
        </div>

        <table className="offices-table"><thead><tr><th>Lodge</th><th>Status</th><th>Resigned date</th></tr></thead>
        <tbody>
          {profile.lodges.map((lg, idx)=>(
            <tr key={idx}>
              <td>
                {edit
                  ? (<>
                      <div className="row">
                        <div><label style={{display:'block'}}>Name</label><input value={lg.name||""} onChange={e=>{
                          const c=[...profile.lodges]; c[idx]={...c[idx], name:e.target.value}; update({lodges:c});
                        }}/></div>
                        <div><label style={{display:'block'}}>Number</label><input value={lg.number||""} onChange={e=>{
                          const c=[...profile.lodges]; c[idx]={...c[idx], number:e.target.value}; update({lodges:c});
                        }}/></div>
                      </div>
                    </>)
                  : (<span>{lodgeDisplay(lg)}</span>)
                }
              </td>
              <td>
                <select disabled={!edit} value={lg.status} onChange={e=>{
                  const c=[...profile.lodges]; c[idx]={...c[idx], status:e.target.value}; update({lodges:c});
                }}>
                  <option>Active</option><option>Resigned</option>
                </select>
              </td>
              <td><input disabled={!edit} type="date" value={lg.resignedDate||""} onChange={e=>{
                const c=[...profile.lodges]; c[idx]={...c[idx], resignedDate:e.target.value}; update({lodges:c});
              }}/></td>
            </tr>
          ))}
        </tbody></table>

        {/* Mobile cards for existing lodges */}
        <div className="office-cards">
          {profile.lodges.map((lg, idx)=> (
            <div className="office-card" key={idx}>
              <h5>Existing Lodge</h5>
              <div className="row">
                {edit ? (
                  <>
                    <div><label>Name</label><input value={lg.name||""} onChange={e=>{
                      const c=[...profile.lodges]; c[idx]={...c[idx], name:e.target.value}; update({lodges:c});
                    }}/></div>
                    <div><label>Number</label><input value={lg.number||""} onChange={e=>{
                      const c=[...profile.lodges]; c[idx]={...c[idx], number:e.target.value}; update({lodges:c});
                    }}/></div>
                  </>
                ) : (
                  <div><label>Lodge</label><input disabled value={lodgeDisplay(lg)} /></div>
                )}
                <div><label>Status</label>
                  <select disabled={!edit} value={lg.status} onChange={e=>{
                    const c=[...profile.lodges]; c[idx]={...c[idx], status:e.target.value}; update({lodges:c});
                  }}>
                    <option>Active</option><option>Resigned</option>
                  </select>
                </div>
                <div><label>Resigned</label><input disabled={!edit} type="date" value={lg.resignedDate||""} onChange={e=>{
                  const c=[...profile.lodges]; c[idx]={...c[idx], resignedDate:e.target.value}; update({lodges:c});
                }}/></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Offices Held ---------------- */
function OfficesCard({ profile, update }){
  const [edit, setEdit] = useState(false); // for editing existing
  const offices = profile.offices || [];
  const setOffices = (arr) => update({ offices: arr });

  const [newLodge, setNewLodge] = useState({ role:"Inner Guard", lodgeKey:"", startDate:"", endDate:"", roleOther:"" });
  const [newGL, setNewGL] = useState({ role:"Grand Sword Bearer", notes:"", startDate:"", endDate:"", roleOther:"" });

  // Build lodge dropdown options from Profile
  const lodgeOptions = (profile.lodges || []).map((lg, i) => ({ key: String(i), label: lodgeDisplay(lg) }));

  // Separate arrays for Lodge vs Grand Lodge
  const lodgeOffices = offices.filter(o => o.level === "Lodge");
  const glOffices = offices.filter(o => o.level === "Grand Lodge");

  const addLodgeOffice = () => {
    if (!newLodge.role || !newLodge.startDate) { alert("Please select a role and start date."); return; }
    if (!newLodge.lodgeKey) { alert("Please choose a Lodge from your Profile."); return; }
    const idx = parseInt(newLodge.lodgeKey, 10);
    const lg = profile.lodges[idx];
    setOffices([{ id: uid(), level:"Lodge", role:newLodge.role, lodge:lodgeDisplay(lg), startDate:newLodge.startDate, endDate:newLodge.endDate, roleOther: newLodge.role === "Other" ? (newLodge.roleOther||"") : "" }, ...offices]);
    setNewLodge({ role:"Inner Guard", lodgeKey:"", startDate:"", endDate:"", roleOther:"" });
  };
  const addGLOffice = () => {
    if (!newGL.role || !newGL.startDate) { alert("Please select a role and start date."); return; }
    setOffices([{ id: uid(), level:"Grand Lodge", role:newGL.role, lodge:newGL.notes, startDate:newGL.startDate, endDate:newGL.endDate, roleOther: newGL.role === "Other" ? (newGL.roleOther||"") : "" }, ...offices]);
    setNewGL({ role:"Grand Sword Bearer", notes:"", startDate:"", endDate:"", roleOther:"" });
  };

  const updateOffice = (id, patch) => setOffices(offices.map(o => o.id === id ? ({...o, ...patch}) : o));
  const removeOffice = (id) => setOffices(offices.filter(o => o.id !== id));

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <h3>Offices Held</h3>
        <div className="muted">Add a new office using the forms below. Use <b>Edit</b> only to modify existing entries.</div>
        <div className="controls">
          {!edit ? <button onClick={()=>setEdit(true)}>Edit existing</button> : <button className="primary" onClick={()=>setEdit(false)}>Save changes</button>}
        </div>
      </div>

      {/* Lodge Offices FIRST */}
      <div className="card" style={{padding:12, marginTop:12}}>
        <h4 style={{margin:'0 0 8px 0'}}>Lodge Offices</h4>

        {/* Add new Lodge Office (pulls from Profile lodges) */}
        <div className="office-card" style={{marginBottom:10, borderStyle:'dashed'}}>
          <h5>Add a new Lodge Office</h5>
          <div className="row">
            <div>
              <label>Role</label>
              <select value={newLodge.role} onChange={e=>setNewLodge({...newLodge, role:e.target.value})}>
                {LODGE_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {newLodge.role === "Other" && (
                <input placeholder="Specify role" value={newLodge.roleOther||""} onChange={e=>setNewLodge({...newLodge, roleOther:e.target.value})}/>
              )}
            </div>
            <div>
              <label>Lodge (from Profile)</label>
              <select value={newLodge.lodgeKey} onChange={e=>setNewLodge({...newLodge, lodgeKey:e.target.value})}>
                <option value="">Select a lodge…</option>
                {lodgeOptions.map(opt => <option key={opt.key} value={opt.key}>{opt.label}</option>)}
              </select>
            </div>
            <div><label>Start</label><input type="date" value={newLodge.startDate} onChange={e=>setNewLodge({...newLodge, startDate:e.target.value})}/></div>
            <div><label>End</label><input type="date" value={newLodge.endDate} onChange={e=>setNewLodge({...newLodge, endDate:e.target.value})}/></div>
            <div><button className="primary" onClick={addLodgeOffice}>Add office</button></div>
          </div>
        </div>

        {/* Existing Lodge Offices */}
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
                  <td>
                    <select disabled={!edit} value={o.lodge} onChange={e=>updateOffice(o.id,{lodge:e.target.value})}>
                      {[{label:o.lodge||"", key:o.lodge||""}, ...lodgeOptions].map(opt => (
                        <option key={opt.key} value={opt.label || opt.key}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td><input disabled={!edit} type="date" value={o.startDate} onChange={e=>updateOffice(o.id,{startDate:e.target.value})}/></td>
                  <td><input disabled={!edit} type="date" value={o.endDate} onChange={e=>updateOffice(o.id,{endDate:e.target.value})}/></td>
                  <td><button disabled={!edit} onClick={()=>removeOffice(o.id)}>✕</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards for existing */}
        <div className="office-cards">
          {lodgeOffices.map(o => (
            <div className="office-card" key={o.id}>
              <h5>Existing Lodge Office</h5>
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
                <div>
                  <label>Lodge (from Profile)</label>
                  <select disabled={!edit} value={o.lodge} onChange={e=>updateOffice(o.id,{lodge:e.target.value})}>
                    {[{label:o.lodge||"", key:o.lodge||""}, ...lodgeOptions].map(opt => (
                      <option key={opt.key} value={opt.label || opt.key}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div><label>Start</label><input disabled={!edit} type="date" value={o.startDate} onChange={e=>updateOffice(o.id,{startDate:e.target.value})}/></div>
                <div><label>End</label><input disabled={!edit} type="date" value={o.endDate} onChange={e=>updateOffice(o.id,{endDate:e.target.value})}/></div>
                <div><button disabled={!edit} onClick={()=>removeOffice(o.id)}>Remove</button></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grand Lodge Offices SECOND */}
      <div className="card" style={{padding:12, marginTop:12}}>
        <h4 style={{margin:'0 0 8px 0'}}>Grand Lodge Offices</h4>

        {/* Add new GL Office */}
        <div className="office-card" style={{marginBottom:10, borderStyle:'dashed'}}>
          <h5>Add a new Grand Lodge Office</h5>
          <div className="row">
            <div>
              <label>Role</label>
              <select value={newGL.role} onChange={e=>setNewGL({...newGL, role:e.target.value})}>
                {GL_ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              {newGL.role === "Other" && (
                <input placeholder="Specify role" value={newGL.roleOther||""} onChange={e=>setNewGL({...newGL, roleOther:e.target.value})}/>
              )}
            </div>
            <div><label>Notes / Region</label><input placeholder="District or notes" value={newGL.notes} onChange={e=>setNewGL({...newGL, notes:e.target.value})}/></div>
            <div><label>Start</label><input type="date" value={newGL.startDate} onChange={e=>setNewGL({...newGL, startDate:e.target.value})}/></div>
            <div><label>End</label><input type="date" value={newGL.endDate} onChange={e=>setNewGL({...newGL, endDate:e.target.value})}/></div>
            <div><button className="primary" onClick={addGLOffice}>Add office</button></div>
          </div>
        </div>

        {/* Existing GL list */}
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

        {/* Mobile cards for existing */}
        <div className="office-cards">
          {glOffices.map(o => (
            <div className="office-card" key={o.id}>
              <h5>Existing Grand Lodge Office</h5>
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
      </div>

      {/* Grand Rank LAST */}
      <div className="card" style={{padding:12, marginTop:12}}>
        <h4 style={{margin:'0 0 8px 0'}}>Grand Rank</h4>
        <div className="row" style={{alignItems:"center"}}>
          <div style={{flex:1}}>
            <label>Current Grand Rank</label>
            <RankSelect value={profile.currentGrandRank} onChange={(v)=>update({currentGrandRank:v})}/>
          </div>
          <div style={{flex:1}}>
            <label>Past Grand Rank</label>
            <RankSelect value={profile.pastGrandRank} onChange={(v)=>update({pastGrandRank:v})}/>
          </div>
        </div>
        <div className="controls">
          <label className="pill">
            <input type="checkbox" checked={profile.autoPrefix} onChange={(e)=>update({autoPrefix:e.target.checked})}/>
            Auto prefix
          </label>
          {!profile.autoPrefix && (
            <select style={{maxWidth:180}} value={profile.manualPrefix} onChange={(e)=>update({manualPrefix:e.target.value})}>
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
        {/* Removed Installed as Master per instruction */}
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
  const [profile, setProfile] = useState(() => {
    const init = loadState() ?? {
      firstName: "Luke", lastName: "Boustridge", autoPrefix: true, manualPrefix: "Bro",
      currentGrandRank: "GSWB", pastGrandRank: "NONE",
      milestones: { initiatedDate:"", passedDate:"", raisedDate:"", installedDate:"" },
      lodges: [{ name: "Corinthian Lodge", number: "123", status: "Active", resignedDate: "" }],
      offices: [
        { id: uid(), level:"Lodge", role:"Inner Guard", lodge:"Corinthian Lodge No. 123", startDate:"2023-06-01", endDate:"" },
        { id: uid(), level:"Grand Lodge", role:"Grand Sword Bearer", lodge:"", startDate:"2024-04-01", endDate:"" }
      ],
      visits: [{ id: uid(), date: "2025-09-10", lodge: "Example Lodge No. 99", notes: "Installation" }]
    };
    // Ensure all lodges have separate name/number fields (migration)
    init.lodges = (init.lodges || []).map(lg => {
      if (lg.name && !lg.number && / No\.\s*\d+/.test(lg.name)) {
        const m = lg.name.match(/^(.*)\s+No\.\s*(\d+)\s*$/);
        if (m) return { ...lg, name: m[1], number: m[2] };
      }
      return lg;
    });
    return init;
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
