import React, { useEffect, useMemo, useState } from "react";
import { BOC_RANKS, PREFIX_ORDER, maxPrefix } from "./bocMapping";

// Utility: localStorage wrapper
const storeKey = "fnz-passport-demo-v1";
const saveState = (s) => localStorage.setItem(storeKey, JSON.stringify(s));
const loadState = () => {
  try { return JSON.parse(localStorage.getItem(storeKey)) ?? null; }
  catch { return null; }
};

const RankSelect = ({ label, value, onChange }) => {
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={(e)=>onChange(e.target.value)}>
        {Object.entries(BOC_RANKS).map(([code, r]) => (
          <option key={code} value={code}>{code === "NONE" ? "— (None)" : `${r.title} (${code})`}</option>
        ))}
      </select>
      <div className="muted">Post‑nominal: <span className="pill code">{value === "NONE" ? "—" : BOC_RANKS[value].postNominal}</span></div>
    </div>
  )
};

export default function App() {
  const [profile, setProfile] = useState(() => loadState() ?? {
    firstName: "Luke",
    lastName: "Boustridge",
    autoPrefix: true,
    manualPrefix: "Bro",
    currentGrandRank: "GSWB",
    pastGrandRank: "NONE",
    lodges: [
      { name: "Corinthian Lodge No. 123", status: "Active", resignedDate: "" },
      { name: "Southern Star Lodge No. 45", status: "Resigned", resignedDate: "2024-11-12" }
    ]
  });

  useEffect(()=> saveState(profile), [profile]);

  // Determine entitlement prefix from highest of current/past ranks (per BOC mapping)
  const entitlementPrefix = useMemo(() => {
    const curr = BOC_RANKS[profile.currentGrandRank]?.entitlementPrefix ?? "Bro";
    const past = BOC_RANKS[profile.pastGrandRank]?.entitlementPrefix ?? "Bro";
    return maxPrefix(curr, past);
  }, [profile.currentGrandRank, profile.pastGrandRank]);

  const activePrefix = profile.autoPrefix ? entitlementPrefix : profile.manualPrefix;

  // Compute display post‑nominals:
  // - Always include current rank post‑nominal if any
  // - If a Past Grand Rank is set, append its "pastPostNominal"
  const postNominals = useMemo(() => {
    const out = [];
    if (profile.currentGrandRank !== "NONE") {
      const pn = BOC_RANKS[profile.currentGrandRank]?.postNominal ?? "";
      if (pn) out.push(pn);
    }
    if (profile.pastGrandRank !== "NONE") {
      const ppn = BOC_RANKS[profile.pastGrandRank]?.pastPostNominal ?? "";
      if (ppn) out.push(ppn);
    }
    return out.join(" ");
  }, [profile.currentGrandRank, profile.pastGrandRank]);

  const displayName = `${activePrefix} ${profile.firstName} ${profile.lastName}${postNominals ? " " + postNominals : ""}`.replaceAll("  ", " ").trim();

  const update = (patch) => setProfile(p => ({...p, ...patch}));

  const addLodge = () => {
    const n = { name: "", status: "Active", resignedDate: "" };
    update({ lodges: [...profile.lodges, n] });
  };

  const updateLodge = (idx, patch) => {
    const clone = [...profile.lodges];
    clone[idx] = { ...clone[idx], ...patch };
    update({ lodges: clone });
  };

  const removeLodge = (idx) => {
    const clone = profile.lodges.filter((_, i)=> i !== idx);
    update({ lodges: clone });
  };

  const reset = () => {
    localStorage.removeItem(storeKey);
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="grid">
        {/* Profile Editor */}
        <div className="card">
          <h3>Member Profile</h3>
          <div className="row">
            <div>
              <label>First name</label>
              <input value={profile.firstName} onChange={(e)=>update({firstName: e.target.value})} />
            </div>
            <div>
              <label>Last name</label>
              <input value={profile.lastName} onChange={(e)=>update({lastName: e.target.value})} />
            </div>
          </div>

          <div className="card" style={{padding:12, marginTop:12}}>
            <div className="row" style={{alignItems:"center"}}>
              <div style={{flex:1}}>
                <label>Current Grand Rank</label>
                <RankSelect label="Current Grand Rank" value={profile.currentGrandRank} onChange={(v)=>update({currentGrandRank: v})} />
              </div>
              <div style={{flex:1}}>
                <label>Past Grand Rank</label>
                <select value={profile.pastGrandRank} onChange={(e)=>update({pastGrandRank: e.target.value})}>
                  {Object.entries(BOC_RANKS).map(([code, r]) => (
                    <option key={code} value={code}>{code === "NONE" ? "— (None)" : `${r.title} (${code})`}</option>
                  ))}
                </select>
                <div className="muted">Past post‑nominal: <span className="pill code">{profile.pastGrandRank === "NONE" ? "—" : BOC_RANKS[profile.pastGrandRank].pastPostNominal}</span></div>
              </div>
            </div>

            <div className="controls">
              <label className="pill"><input type="checkbox" checked={profile.autoPrefix} onChange={(e)=>update({autoPrefix: e.target.checked})}/> Auto prefix</label>
              {!profile.autoPrefix && (
                <select style={{maxWidth:180}} value={profile.manualPrefix} onChange={(e)=>update({manualPrefix: e.target.value})}>
                  {PREFIX_ORDER.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              )}
              <span className="muted">Entitlement (from BOC): <b>{entitlementPrefix}</b></span>
            </div>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="card">
          <h3>Dashboard (Preview)</h3>
          <div className="name-line">{displayName}</div>
          <div className="muted">This line auto‑updates as you change rank/prefix settings.</div>

          <div style={{marginTop:14}}>
            <div className="pill">Prefix in use: <b>{profile.autoPrefix ? "Auto" : "Manual"}</b> → <span className="code">{activePrefix}</span></div>
          </div>

          <div style={{marginTop:14}}>
            <div className="pill">Post‑nominals: <span className="code">{postNominals || "—"}</span></div>
          </div>

          <div className="footer">
            <div>Logo source can be replaced with the official brand mark once available:</div>
            <div className="code">/public/logo.svg</div>
          </div>
        </div>
      </div>

      {/* Lodges */}
      <div className="card" style={{marginTop:18}}>
        <h3>Lodges Summary</h3>
        <div className="muted">Shows resigned dates where applicable.</div>
        <table>
          <thead>
            <tr>
              <th style={{width:"45%"}}>Lodge</th>
              <th style={{width:"20%"}}>Status</th>
              <th style={{width:"35%"}}>Resigned date</th>
            </tr>
          </thead>
          <tbody>
            {profile.lodges.map((lg, idx) => (
              <tr key={idx}>
                <td>
                  <input value={lg.name} onChange={(e)=>updateLodge(idx, {name: e.target.value})}/>
                </td>
                <td>
                  <select value={lg.status} onChange={(e)=>updateLodge(idx, {status: e.target.value})}>
                    <option>Active</option>
                    <option>Resigned</option>
                  </select>
                </td>
                <td>
                  <input placeholder="YYYY-MM-DD" value={lg.resignedDate} onChange={(e)=>updateLodge(idx, {resignedDate: e.target.value})}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="controls">
          <button onClick={addLodge}>Add lodge</button>
          <button onClick={()=>removeLodge(profile.lodges.length-1)} disabled={profile.lodges.length===0}>Remove last</button>
          <button onClick={reset}>Reset demo data</button>
          <a href="https://freemasonsnz.org/wp-content/uploads/2024/05/Freemasons-logo-colour-blue-BG-S" target="_blank" rel="noreferrer">
            <button>Official Logo (URL)</button>
          </a>
        </div>
      </div>
    </div>
  );
}
