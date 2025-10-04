export const LODGE_OFFICES_ORDERED: string[] = [
  "Tyler",
  "Inner Guard",
  "Junior Steward",
  "Senior Steward",
  "Junior Deacon",
  "Senior Deacon",
  "Almoner",
  "Organist",
  "Chaplain",
  "Assistant Director of Ceremonies",
  "Director of Ceremonies",
  "Treasurer",
  "Secretary",
  "Junior Warden",
  "Senior Warden",
  "Worshipful Master",
  "Past Master",
];

/**
 * Grand Offices — ordered junior → senior.
 * Based on BoC precedence, with the list beginning at "Grand Steward" per your instruction.
 * (We exclude all "Past ..." entries and any District/Provincial roles.)
 */
export const GRAND_OFFICES_ORDERED: string[] = [
  "Grand Steward",
  "Grand Inner Guard",
  "Grand Organist",
  "Grand Standard Bearer",
  "Grand Sword Bearer",
  "Grand Bible Bearer",
  "Grand Deacon",
  "Assistant Grand Director of Ceremonies",
  "Grand Director of Ceremonies",
  "Grand Superintendent of Ceremonies",
  "Grand Superintendent of Works",
  "Grand Registrar",
  "Grand Treasurer",
  "Grand Secretary",
  "Junior Grand Warden",
  "Senior Grand Warden",
  "Deputy Grand Master",
  "Pro Grand Master",
  "Grand Master",
];
