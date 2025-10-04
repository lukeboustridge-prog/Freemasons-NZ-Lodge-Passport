import React from "react";

const REMOTE = "https://freemasonsnz.org/wp-content/uploads/2019/05/freemason_colour_standardonwhite.png";
const LOCAL = "/fmnz-logo.png"; // served from /public

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  const [src, setSrc] = React.useState<string>(REMOTE);
  const [failed, setFailed] = React.useState(false);

  return (
    <img
      src={src}
      alt="Freemasons New Zealand"
      className={className}
      onError={() => {
        if (!failed) {
          setFailed(true);
          setSrc(LOCAL);
        }
      }}
      loading="eager"
      decoding="async"
    />
  );
}
