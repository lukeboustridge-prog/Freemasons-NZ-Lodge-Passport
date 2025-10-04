import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useProfile } from "../context/ProfileContext";
import { useOffices, computePrefix, computePostNominals } from "../context/OfficesContext";
import { useLodges, formatLodgeName } from "../context/LodgesContext";

export default function Dashboard() {
  const { profile } = useProfile();
  const { offices } = useOffices();
  const { lodges } = useLodges();

  const prefix = computePrefix(offices);
  const posts = computePostNominals(offices);
  const post = posts.length ? ", " + posts[0] : "";
  const fullName = `${prefix} ${profile.firstName} ${profile.lastName}${post}`;

  // Years in Freemasonry = from earliest lodge join date
  function yearsInFreemasonry(): number | null {
    if (!lodges.length) return null;
    const dates = lodges.map(l => l.joinDate).filter(Boolean).sort();
    const first = dates[0];
    if (!first) return null;
    const start = new Date(first + "T00:00:00");
    const now = new Date();
    const diff = now.getTime() - start.getTime();
    const years = Math.floor(diff / (1000*60*60*24*365.25));
    return years < 0 ? 0 : years;
  }
  const yif = yearsInFreemasonry();

  const currentMemberships = lodges.filter(l => !l.resignedDate);
  const currentLodgeOffices = offices.filter(o => o.scope === "Lodge" && o.isCurrent);
  const currentGrandOffices = offices.filter(o => o.scope === "Grand" && o.isCurrent);

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{fullName}</h1>
        <p className="text-sm text-gray-600">Your Masonic Passport{typeof yif === "number" ? ` • ${yif} years in Freemasonry` : ""}</p>
      </div>

      <SectionCard title="Lodge memberships">
        <ul className="divide-y divide-gray-200">
          {currentMemberships.map((m) => (
            <li key={m.id} className="py-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                <span className="font-medium truncate">{formatLodgeName(m)}</span>
                <span className="text-sm text-gray-500 sm:whitespace-nowrap">{m.joinDate} {m.resignedDate ? `– ${m.resignedDate}` : ""}</span>
              </div>
            </li>
          ))}
          {currentMemberships.length === 0 && <li className="py-2 text-gray-500">No current memberships</li>}
        </ul>
      </SectionCard>

      <SectionCard title="Current lodge offices">
        <ul className="space-y-2">
          {currentLodgeOffices.length === 0 && <li className="text-gray-500">No current lodge offices</li>}
          {currentLodgeOffices.map((o) => (
            <li key={o.id} className="bg-gray-50 rounded-xl px-3 py-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{o.officeName}</div>
                  <div className="text-sm text-gray-500 truncate">{o.lodgeName}</div>
                </div>
                <div className="text-sm text-gray-600 sm:whitespace-nowrap">{o.startDate}</div>
              </div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Current grand lodge offices">
        <ul className="space-y-2">
          {currentGrandOffices.map((o) => (
            <li key={o.id} className="bg-gray-50 rounded-xl px-3 py-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{o.officeName}</div>
                  <div className="text-sm text-gray-500 truncate">Grand Lodge</div>
                </div>
                <div className="text-sm text-gray-600 sm:whitespace-nowrap">{o.startDate}</div>
              </div>
            </li>
          ))}
          {currentGrandOffices.length === 0 && <li className="text-gray-500">No current or past grand rank recorded</li>}
        </ul>
      </SectionCard>
    </main>
  );
}
