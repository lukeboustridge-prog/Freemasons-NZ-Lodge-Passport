import React from "react";
import { EMBEDDED_LOGO } from "../assets/LogoData";

const LOCAL = "/fmnz-logo.png";
const REMOTE = "https://freemasonsnz.org/wp-content/uploads/2019/05/freemason_colour_standardonwhite.png";

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  const [src, setSrc] = React.useState<string>(EMBEDDED_LOGO);
  const [triedLocal, setTriedLocal] = React.useState(false);
  const [triedRemote, setTriedRemote] = React.useState(false);
  return (
    <img
      src={src}
      alt="Freemasons New Zealand"
      className={className}
      onError={() => {
        if (!triedLocal) { setTriedLocal(true); setSrc(LOCAL); return; }
        if (!triedRemote) { setTriedRemote(true); setSrc(REMOTE); return; }
      }}
      loading="eager"
      decoding="async"
    />
  );
}
