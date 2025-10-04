import React from "react";

const LOCAL = "/fmnz-logo.png"; // Put real PNG here in /public
const REMOTE = "https://freemasonsnz.org/wp-content/uploads/2019/05/freemason_colour_standardonwhite.png";

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  const [src, setSrc] = React.useState<string>(LOCAL);
  const [triedRemote, setTriedRemote] = React.useState(false);

  return (
    <img
      src={src}
      alt="Freemasons New Zealand"
      className={className}
      onError={() => {
        if (!triedRemote) {
          setTriedRemote(true);
          setSrc(REMOTE);
        }
      }}
      loading="eager"
      decoding="async"
    />
  );
}
