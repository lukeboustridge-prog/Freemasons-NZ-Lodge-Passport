import React from "react";

type LogoProps = {
  className?: string;
};

export default function FMNZLogo({ className = "w-32 h-auto" }: LogoProps) {
  const src =
    "https://freemasonsnz.org/wp-content/uploads/2024/05/Freemasons-logo-colour-blue-BG-S";
  return (
    <img
      src={src}
      alt="Freemasons New Zealand"
      className={className}
      loading="eager"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/assets/fmnz-logo.png";
      }}
    />
  );
}
