import React from "react";

/**
 * Brand bar (logo + name) — now REMOTE-FIRST per user request.
 * Load order:
 *   1) REMOTE FMNZ URL
 *   2) Local BASE_URL + fmnz-logo.png
 *   3) Embedded SVG fallback
 */
const REMOTE = "https://freemasonsnz.org/wp-content/uploads/2019/05/freemason_colour_standardonwhite.png";
const LOCAL  = (import.meta as any).env?.BASE_URL ? ((import.meta as any).env.BASE_URL + "fmnz-logo.png") : "fmnz-logo.png";
const EMBED_SVG = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="640" height="160" viewBox="0 0 640 160"><rect width="640" height="160" fill="#0b3d91"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial" font-size="40" fill="white">My Masonic Passport</text></svg>')}`;

export default function AppBrandBar() {
  const [src, setSrc] = React.useState<string>(REMOTE);
  const [stage, setStage] = React.useState<0 | 1>(0);
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
        <img
          src={src}
          alt="Freemasons New Zealand"
          className="h-8 w-auto rounded-sm object-contain"
          onError={() => {
            if (src === REMOTE) { setSrc(LOCAL); return; }
            if (src === LOCAL)  { setSrc(EMBED_SVG); return; }
          }}
          loading="eager"
          decoding="async"
        />
        <div className="text-base sm:text-lg font-semibold truncate">My Masonic Passport</div>
      </div>
    </div>
  );
}
