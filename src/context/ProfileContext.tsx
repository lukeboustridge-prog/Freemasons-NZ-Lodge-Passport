import React from "react";

export type Profile = {
  firstName: string;
  lastName: string;
  rank: "Brother" | "Warden" | "Worshipful Master" | "Past Master" | "Grand Officer" | "Grand Master";
  grandPostNominals?: string; // e.g., PAGDC, PDepGDC
};

const defaultProfile: Profile = {
  firstName: "John",
  lastName: "Doe",
  rank: "Brother",
  grandPostNominals: "",
};

function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem("fmnzProfile");
    if (raw) return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {}
  return defaultProfile;
}

function saveProfile(p: Profile) {
  try { localStorage.setItem("fmnzProfile", JSON.stringify(p)); } catch {}
}

export function rankPrefix(rank: Profile["rank"]): "Bro" | "W Bro" | "RW Bro" | "MW Bro" {
  if (rank === "Grand Master") return "MW Bro";
  if (rank === "Grand Officer") return "RW Bro";
  if (rank === "Worshipful Master" || rank === "Past Master") return "W Bro";
  return "Bro";
}

type Ctx = { profile: Profile; setProfile: (p: Profile) => void; };
const ProfileCtx = React.createContext<Ctx | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = React.useState<Profile>(loadProfile());
  const setProfile = (p: Profile) => {
    setProfileState(p);
    saveProfile(p);
  };
  return <ProfileCtx.Provider value={{ profile, setProfile }}>{children}</ProfileCtx.Provider>;
}

export function useProfile() {
  const ctx = React.useContext(ProfileCtx);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
