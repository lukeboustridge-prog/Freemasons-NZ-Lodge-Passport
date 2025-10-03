import React, { useEffect, useMemo, useState } from "react";
import { BOC_RANKS, PREFIX_ORDER, maxPrefix } from "./bocMapping";

const storeKey = "fnz-passport-demo-v1";
const saveState = (s) => localStorage.setItem(storeKey, JSON.stringify(s));
const loadState = () => { try { return JSON.parse(localStorage.getItem(storeKey)) ?? null; } catch { return null; } };

const RankSelect = ({ value, onChange }) => (
  <select value={value} onChange={(e)=>onChange(e.target.value)}>
    {Object.entries(BOC_RANKS).map(([code, r]) => (
      <option key={code} value={code}>{code === "NONE" ? "— (None)" : `${r.title} (${code})`}</option>
    ))}
  </select>
);

export default function App() {
  const [profile, setProfile] = useState(() => loadState() ?? {
    firstName: "Luke", lastName: "Boustridge", autoPrefix: true, manualPrefix: "Bro",
    currentGrandRank: "GSWB", pastGrandRank: "NONE",
    lodges: [{ name: "Corinthian Lodge No. 123", status: "Active", resignedDate: "" },
             { name: "Southern Star Lodge No. 45", status: "Resigned", resignedDate: "2024-11-12" }]
  });
  useEffect(()=> saveState(profile), [profile]);

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
  const update = (patch) => setProfile(p => ({...p, ...patch}));
  const updateLodge = (i, patch) => { const c=[...profile.lodges]; c[i]={...c[i],...patch}; update({lodges:c}); };

  return (
    <div className="container">
      <div className="grid">
        <div className="card">
          <h3>Member Profile</h3>
          <div className="row">
            <div><label>First name</label><input value={profile.firstName} onChange={e=>update({firstName:e.target.value})}/></div>
            <div><label>Last name</label><input value={profile.lastName} onChange={e=>update({lastName:e.target.value})}/></div>
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
              <span className="muted">Entitlement (from BOC): <b>{entitlementPrefix}</b></span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Dashboard (Preview)</h3>
          <div className="name-line">{displayName}</div>
          <div className="muted">Auto-updates as you change rank/prefix.</div>
          <div style={{marginTop:14}}><div className="pill">Post-nominals: <span className="code">{postNominals || "—"}</span></div></div>
        </div>
      </div>

      <div className="card" style={{marginTop:18}}>
        <h3>Lodges Summary</h3>
        <table><thead><tr><th style={{width:"45%"}}>Lodge</th><th style={{width:"20%"}}>Status</th><th style={{width:"35%"}}>Resigned date</th></tr></thead>
        <tbody>
          {profile.lodges.map((lg, idx)=>(
            <tr key={idx}>
              <td><input value={lg.name} onChange={e=>updateLodge(idx,{name:e.target.value})}/></td>
              <td><select value={lg.status} onChange={e=>updateLodge(idx,{status:e.target.value})}><option>Active</option><option>Resigned</option></select></td>
              <td><input placeholder="YYYY-MM-DD" value={lg.resignedDate} onChange={e=>updateLodge(idx,{resignedDate:e.target.value})}/></td>
            </tr>
          ))}
        </tbody></table>
      </div>
    </div>
  );
}
