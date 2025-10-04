import React from "react";
import { EMBEDDED_LOGO_DATA_URI } from "../assets/LogoEmbedded";

const REMOTE = "https://freemasonsnz.org/wp-content/uploads/2019/05/freemason_colour_standardonwhite.png";
const LOCAL = (import.meta as any).env?.BASE_URL ? ((import.meta as any).env.BASE_URL + "fmnz-logo.png") : "fmnz-logo.png";

export default function Logo({ className = "h-8 w-auto" }: { className?: string }) {
  const [src, setSrc] = React.useState<string>(EMBEDDED_LOGO_DATA_URI);
  const [step, setStep] = React.useState<0 | 1 | 2>(0); // 0=embed, 1=local, 2=remote

  return (
    <img
      src={src}
      alt="Freemasons New Zealand"
      className={className}
      onError={() => {
        if (step === 0) { setStep(1); setSrc(LOCAL); return; }
        if (step === 1) { setStep(2); setSrc(REMOTE); return; }
      }}
      loading="eager"
      decoding="async"
    />
  );
}
