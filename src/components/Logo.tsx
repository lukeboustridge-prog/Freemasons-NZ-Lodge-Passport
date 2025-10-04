import React from "react";

function resolveLogoPath() {
  const repo = "/Freemasons-NZ-Lodge-Passport/";
  const local = (path: string) => {
    // Prefer GitHub Pages base if present in current pathname
    const base = (location.pathname.includes(repo) ? repo : "/");
    return base + path.replace(/^\//, "");
  };
  return local("fmnz-logo.png");
}

export default function FMNZLogo({ className = "w-24 h-auto" }: { className?: string }) {
  const [src, setSrc] = React.useState(resolveLogoPath());
  const external = "https://freemasonsnz.org/wp-content/uploads/2024/05/Freemasons-logo-colour-blue-BG-S";
  return <img src={src} alt="Freemasons New Zealand" className={className} onError={() => setSrc(external)} />;
}
