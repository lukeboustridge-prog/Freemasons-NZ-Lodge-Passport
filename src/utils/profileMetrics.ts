export type MilestoneLike = { type: string; date: string };

export function yearsFromInitiation(milestones: MilestoneLike[], today = new Date()): number | null {
  if (!Array.isArray(milestones)) return null;
  const init = milestones
    .filter(m => typeof m?.type === "string" && /initiation/i.test(m.type) && m?.date)
    .sort((a, b) => (a.date || "").localeCompare(b.date || ""))[0];
  if (!init) return null;
  const start = new Date(init.date);
  if (isNaN(start.getTime())) return null;
  const millis = today.getTime() - start.getTime();
  const years = Math.floor(millis / (365.2425 * 24 * 60 * 60 * 1000));
  return years >= 0 ? years : null;
}
