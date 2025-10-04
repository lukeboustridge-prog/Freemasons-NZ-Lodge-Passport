import React from "react";

const REMOTE = "https://freemasonsnz.org/wp-content/uploads/2019/05/freemason_colour_standardonwhite.png";
const LOCAL = (import.meta as any).env?.BASE_URL ? ((import.meta as any).env.BASE_URL + "fmnz-logo.png") : "fmnz-logo.png";

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  const [src, setSrc] = React.useState<string>(REMOTE);
  const [fellBack, setFellBack] = React.useState(false);
  return (
    <img
      src={src}
      alt="Freemasons New Zealand"
      className={className}
      onError={() => {
        if (!fellBack) { setFellBack(true); setSrc(LOCAL); }
      }}
      loading="eager"
      decoding="async"
    />
  );
}
