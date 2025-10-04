import React from "react";
import { SectionCard } from "../components/SectionCard";
import { useProfile } from "../context/ProfileContext";
import { useOffices, computePrefix, computePostNominals, computeDisplayGrandTitleAndAbbr } from "../context/OfficesContext";
import { useLodges } from "../context/LodgesContext";
import { useVisits } from "../context/VisitsContext";
import { useMilestones } from "../context/MilestonesContext";
import { yearsFromInitiation } from "../utils/profileMetrics";

export default function Dashboard() {
  const { profile } = useProfile?.() ?? ({ profile: {} } as any);
  const { offices } = useOffices();
  const { milestones } = useMilestones();
  const { visits } = useVisits();
  const { lodges } = useLodges();

  const prefix = computePrefix(offices);
  const post = computePostNominals(offices);
  const grand = computeDisplayGrandTitleAndAbbr(offices);

  const years = yearsFromInitiation(milestones);

  return (
    <div className="grid grid-cols-1 gap-4">
      <SectionCard title="Welcome">
        <div className="text-lg font-medium">
          {prefix} {profile?.firstName || ""} {profile?.lastName || ""}
          {post && post.length ? <span className="text-gray-600">, {post[0]}</span> : null}
        </div>
        {grand?.title && <div className="text-sm text-gray-600">{grand.title}{grand.abbr ? ` (${grand.abbr})` : ""}</div>}
        <div className="mt-2 text-sm text-gray-700">
          {years !== null ? <>Years in Freemasonry: <strong>{years}</strong></> : <>Add an <em>Initiation</em> milestone to see your years.</>}
        </div>
      </SectionCard>
    </div>
  );
}
