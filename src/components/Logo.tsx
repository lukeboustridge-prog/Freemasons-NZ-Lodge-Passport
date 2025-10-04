import React from "react";
// Import from /public via Vite so the built URL includes the correct base on GitHub Pages.
import logoUrl from "/fmnz-logo.png";

type Props = { className?: string, alt?: string };
export default function FMNZLogo({ className = "w-28 h-auto", alt = "Freemasons New Zealand" }: Props) {
  const [src, setSrc] = React.useState<string>(logoUrl);
  const fallback = "https://freemasonsnz.org/wp-content/uploads/2024/05/Freemasons-logo-colour-blue-BG-S";
  return <img src={src} alt={alt} className={className} onError={() => setSrc(fallback)} />;
}
