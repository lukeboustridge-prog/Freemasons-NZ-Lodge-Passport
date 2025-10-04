import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useProfile } from "../context/ProfileContext";
import { useOffices, computePrefix, computePostNominals, computeDisplayGrandTitleAndAbbr } from "../context/OfficesContext";
import { useLodges, formatLodgeName } from "../context/LodgesContext";
import { useVisits } from "../context/VisitsContext";
import { useMilestones } from "../context/MilestonesContext";
import { yearsFromInitiation } from "../utils/profileMetrics";

export type LodgeMembership = { id: string; lodgeName: string; lodgeNumber?: string; status: "Current" | "Resigned" | "Past"; startDate?: string; endDate?: string };

export default function Dashboard() {
  const { profile } = useProfile?.() ?? ({ profile: {} } as any);
  const { offices } = useOffices();
  const { lodges } = useLodges();
  const { visits } = useVisits();
  const { milestones } = useMilestones();

  const prefix = computePrefix(offices);
  const post = computePostNominals(offices);
  const grand = computeDisplayGrandTitleAndAbbr(offices);
  const years = yearsFromInitiation(milestones);

  const lodgeOffices = offices.filter(o => o.scope === "Lodge" && o.isCurrent);
  const grandOffice = offices.find(o => o.scope === "Grand" && o.isCurrent);

  function lodgeLabel(l: { name?: string; lodgeNumber?: string }) {
    if (!l) return "";
    if (l.lodgeNumber) return `${l.name || ""} No. ${l.lodgeNumber}`.trim();
    return l.name || "";
  }

  const memberships = lodges?.map(l => ({
    id: l.id,
    lodgeName: lodgeLabel(l),
    status: "Current" as const,
    startDate: l.joinDate,
  })) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <SectionCard title="Welcome" className="lg:col-span-3">
        <div className="text-lg font-medium">
          {prefix} {profile?.firstName || ""} {profile?.lastName || ""}
          {post && post.length ? <span className="text-gray-600">, {post[0]}</span> : null}
        </div>
        {grand?.title && <div className="text-sm text-gray-600">{grand.title}{grand.abbr ? ` (${grand.abbr})` : ""}</div>}
        <div className="mt-2 text-sm text-gray-700">
          {years !== null ? <>Years in Freemasonry: <strong>{years}</strong></> : <>Add an <em>Initiation</em> milestone to see your years.</>}
        </div>
      </SectionCard>

      <SectionCard title="Lodge Memberships">
        <div className="space-y-2">
          {memberships.length === 0 && <div className="text-sm text-gray-500">No lodges added yet.</div>}
          {memberships.map(m => (
            <div key={m.id} className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{m.lodgeName}</div>
                <div className="text-xs text-gray-500">Joined {m.startDate || "—"}</div>
              </div>
              <div className="text-xs px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-200">{m.status}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Current Lodge Offices">
        <div className="space-y-2">
          {lodgeOffices.length === 0 && <div className="text-sm text-gray-500">No current lodge offices.</div>}
          {lodgeOffices.map(o => (
            <div key={o.id} className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{o.officeName}</div>
                <div className="text-xs text-gray-500 truncate">{o.lodgeName || "Lodge"}</div>
              </div>
              <div className="text-xs text-gray-600">{o.startDate || ""}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Grand Lodge Office">
        <div className="space-y-2">
          {!grandOffice && grand?.title === null && <div className="text-sm text-gray-500">No current Grand Lodge office.</div>}
          {(grandOffice || grand?.title) && (
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="font-medium truncate">{grand?.title || (grandOffice?.officeName ?? "")}</div>
                {grand?.abbr && <div className="text-xs text-gray-500">{grand.abbr}</div>}
              </div>
              <div className="text-xs text-gray-600">{grandOffice?.startDate || ""}</div>
            </div>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Activity" className="lg:col-span-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-sm text-gray-500">Total Visits</div>
            <div className="text-2xl font-semibold">{visits?.length ?? 0}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-sm text-gray-500">Milestones</div>
            <div className="text-2xl font-semibold">{milestones?.length ?? 0}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-sm text-gray-500">Lodges</div>
            <div className="text-2xl font-semibold">{lodges?.length ?? 0}</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3">
            <div className="text-sm text-gray-500">Offices Held</div>
            <div className="text-2xl font-semibold">{offices?.length ?? 0}</div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
