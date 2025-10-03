// Editable Book of Constitution (BOC) mapping.
// IMPORTANT: Update to match the official BOC.
// Each rank defines the maximum entitlement prefix and post-nominals for current and past service.
export const BOC_RANKS = {
  "NONE": { title: "—", entitlementPrefix: "Bro", postNominal: "", pastPostNominal: "" },

  // Examples (please confirm each against the BOC)
  "GSWB": { title: "Grand Sword Bearer", entitlementPrefix: "WBro", postNominal: "GSWB", pastPostNominal: "PGSWB" },
  "GDC":  { title: "Grand Director of Ceremonies", entitlementPrefix: "WBro", postNominal: "GDC", pastPostNominal: "PGDC" },
  "GAlm": { title: "Grand Almoner", entitlementPrefix: "VWBro", postNominal: "GAlm", pastPostNominal: "PGAlm" },
  "GSuptWks": { title: "Grand Superintendent of Works", entitlementPrefix: "RWBro", postNominal: "GSuptWks", pastPostNominal: "PGSuptWks" },
  "DepGM": { title: "Deputy Grand Master", entitlementPrefix: "RWBro", postNominal: "DepGM", pastPostNominal: "PDepGM" },
  "GM": { title: "Grand Master", entitlementPrefix: "MWBro", postNominal: "GM", pastPostNominal: "PGM" }
};

export const PREFIX_ORDER = ["Bro", "WBro", "VWBro", "RWBro", "MWBro"];

// Return the higher of two prefixes by seniority based on PREFIX_ORDER.
export function maxPrefix(a, b) {
  const ia = PREFIX_ORDER.indexOf(a);
  const ib = PREFIX_ORDER.indexOf(b);
  if (ia === -1) return b;
  if (ib === -1) return a;
  return ia >= ib ? a : b;
}
