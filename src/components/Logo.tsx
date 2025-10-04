import React from "react";
import logoUrl from "/fmnz-logo.png";

type Props = { className?: string, alt?: string };
export default function FMNZLogo({ className = "h-8 w-auto", alt = "Freemasons New Zealand" }: Props) {
  const [src, setSrc] = React.useState<string>(logoUrl);
  const fallback = "https://freemasonsnz.org/wp-content/uploads/2024/05/Freemasons-logo-colour-blue-BG-S";
  return <img src={src} alt={alt} className={className} onError={() => setSrc(fallback)} />;
}
