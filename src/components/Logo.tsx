import React from "react";
type LogoProps = { className?: string };
export default function FMNZLogo({ className = "w-28 h-auto" }: LogoProps) {
  const base = (import.meta as any).env?.BASE_URL || "/";
  const local = `${base}fmnz-logo.png`;
  const external = "https://freemasonsnz.org/wp-content/uploads/2024/05/Freemasons-logo-colour-blue-BG-S";
  const [src, setSrc] = React.useState(local);
  return <img src={src} alt="Freemasons New Zealand" className={className} loading="eager" onError={() => setSrc(external)} />;
}
