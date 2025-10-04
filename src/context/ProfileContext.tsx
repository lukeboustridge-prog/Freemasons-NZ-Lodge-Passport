import React from "react";

export type Profile = {
  firstName: string;
  lastName: string;
};

const defaultProfile: Profile = {
  firstName: "John",
  lastName: "Doe",
};

function loadProfile(): Profile {
  try { const raw = localStorage.getItem("fmnzProfile"); if (raw) return { ...defaultProfile, ...JSON.parse(raw) }; } catch {}
  return defaultProfile;
}
function saveProfile(p: Profile) { try { localStorage.setItem("fmnzProfile", JSON.stringify(p)); } catch {} }

type Ctx = { profile: Profile; setProfile: (p: Profile) => void; };
const ProfileCtx = React.createContext<Ctx | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = React.useState<Profile>(loadProfile());
  const setProfile = (p: Profile) => { setProfileState(p); saveProfile(p); };
  return <ProfileCtx.Provider value={{ profile, setProfile }}>{children}</ProfileCtx.Provider>;
}
export function useProfile() { const v = React.useContext(ProfileCtx); if (!v) throw new Error("useProfile must be used within ProfileProvider"); return v; }
