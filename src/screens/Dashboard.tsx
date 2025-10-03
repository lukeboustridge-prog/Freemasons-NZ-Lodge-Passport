import React from "react";
import FMNZLogo from "../components/Logo";
import { SectionCard } from "../components/SectionCard";

export type LodgeMembership = {
  id: string;
  lodgeName: string;
  status: "Current" | "Resigned" | "Past";
  startDate?: string;
  endDate?: string;
};

export type Office = {
  id: string;
  scope: "Lodge" | "Grand";
  lodgeName?: string;
  officeName: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
};

export default function Dashboard({
  memberships,
  offices,
}: {
  memberships: LodgeMembership[];
  offices: Office[];
}) {
  const currentMemberships = memberships.filter((m) => m.status === "Current");

  const currentLodgeOffices = offices.filter(
    (o) => o.scope === "Lodge" && o.isCurrent
  );
  const currentGrandOffices = offices.filter(
    (o) => o.scope === "Grand" && o.isCurrent
  );

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-4">
        <FMNZLogo className="w-28 h-auto" />
        <h1 className="text-2xl font-bold">Your Masonic Passport</h1>
      </div>

      <SectionCard title="Lodge memberships">
        <ul className="divide-y">
          {currentMemberships.map((m) => (
            <li key={m.id} className="py-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{m.lodgeName}</span>
                <span className="text-sm text-gray-500">
                  {m.startDate} {m.endDate ? `– ${m.endDate}` : ""}
                </span>
              </div>
            </li>
          ))}
          {currentMemberships.length === 0 && (
            <li className="py-2 text-gray-500">No current memberships</li>
          )}
        </ul>
      </SectionCard>

      <SectionCard title="Current lodge offices">
        <ul className="space-y-2">
          {currentLodgeOffices.length === 0 && (
            <li className="text-gray-500">No current lodge offices</li>
          )}
          {currentLodgeOffices.map((o) => (
            <li
              key={o.id}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
            >
              <div>
                <div className="font-medium">{o.officeName}</div>
                <div className="text-sm text-gray-500">{o.lodgeName}</div>
              </div>
              <div className="text-sm text-gray-600">{o.startDate}</div>
            </li>
          ))}
        </ul>
      </SectionCard>

      <SectionCard title="Current grand lodge offices">
        <ul className="space-y-2">
          {currentGrandOffices.length === 0 && (
            <li className="text-gray-500">No current grand lodge offices</li>
          )}
          {currentGrandOffices.map((o) => (
            <li
              key={o.id}
              className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2"
            >
              <div>
                <div className="font-medium">{o.officeName}</div>
                <div className="text-sm text-gray-500">Grand Lodge</div>
              </div>
              <div className="text-sm text-gray-600">{o.startDate}</div>
            </li>
          ))}
        </ul>
      </SectionCard>
    </main>
  );
}
