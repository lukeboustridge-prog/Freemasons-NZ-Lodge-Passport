import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useProfile, rankPrefix } from "../context/ProfileContext";

export type LodgeMembership = { id: string; lodgeName: string; status: "Current" | "Resigned" | "Past"; startDate?: string; endDate?: string; };
export type Office = { id: string; scope: "Lodge" | "Grand"; lodgeName?: string; officeName: string; startDate: string; endDate?: string; isCurrent: boolean; };

export default function Dashboard({ memberships, offices }: { memberships: LodgeMembership[]; offices: Office[]; }) {
  const { profile } = useProfile();
  const prefix = rankPrefix(profile.rank);
  const fullName = `${prefix} ${profile.firstName} ${profile.lastName}${profile.grandPostNominals ? ", " + profile.grandPostNominals : ""}`;

  const currentMemberships = memberships.filter((m) => m.status === "Current");
  const currentLodgeOffices = offices.filter((o) => o.scope === "Lodge" && o.isCurrent);
  const currentGrandOffices = offices.filter((o) => o.scope === "Grand" && o.isCurrent);

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{fullName}</h1>
        <p className="text-sm text-gray-600">Your Masonic Passport</p>
      </div>

      <SectionCard title="Lodge memberships">
        <ul className="divide-y divide-gray-200">
          {currentMemberships.map((m) => (
            <li key={m.id} className="py-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                <span className="font-medium truncate">{m.lodgeName}</span>
                <span className="text-sm text-gray-500 sm:whitespace-nowrap">{m.startDate} {m.endDate ? `– ${m.endDate}` : ""}</span>
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
          {currentGrandOffices.length === 0 && <li className="text-gray-500">No current grand lodge offices</li>}
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
        </ul>
      </SectionCard>
    </main>
  );
}
