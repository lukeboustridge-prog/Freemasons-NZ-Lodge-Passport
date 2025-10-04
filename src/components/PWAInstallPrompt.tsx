import React from "react";

type DeferEvt = any;

const SNOOZE_KEY = "pwaPromptSnoozeUntil";
const HIDE_KEY = "pwaPromptDismissed";

function isStandalone(): boolean {
  const nav: any = navigator;
  return window.matchMedia("(display-mode: standalone)").matches || nav.standalone === true;
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

function snoozed(): boolean {
  const v = localStorage.getItem(SNOOZE_KEY);
  if (!v) return false;
  const until = Number(v);
  return Date.now() < until;
}

function snooze(days = 7) {
  const until = Date.now() + days * 24 * 60 * 60 * 1000;
  localStorage.setItem(SNOOZE_KEY, String(until));
}

export default function PWAInstallPrompt() {
  const [deferred, setDeferred] = React.useState<DeferEvt | null>(null);
  const [visible, setVisible] = React.useState(false);
  const [platform, setPlatform] = React.useState<"ios" | "android" | null>(null);

  React.useEffect(() => {
    if (isStandalone() || localStorage.getItem(HIDE_KEY) === "1" || snoozed()) return;

    // Android: capture beforeinstallprompt
    function onBIP(e: Event) {
      e.preventDefault();
      setDeferred(e as DeferEvt);
      setPlatform("android");
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", onBIP as any);

    // iOS: no event — show guidance banner if Safari on iOS and not standalone
    if (isIOS()) {
      setPlatform("ios");
      setVisible(true);
    }

    // If app becomes installed, hide
    function onAppInstalled() {
      setVisible(false);
      setDeferred(null);
      localStorage.setItem(HIDE_KEY, "1");
    }
    window.addEventListener("appinstalled", onAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP as any);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!visible || platform === null) return null;

  const base = "fixed inset-x-0 bottom-3 z-50 mx-auto max-w-xl";
  const card = "mx-3 rounded-2xl border border-gray-200 bg-white shadow-lg p-3 sm:p-4";
  const row = "flex items-center gap-3";

  function dismissForever() {
    localStorage.setItem(HIDE_KEY, "1");
    setVisible(false);
  }
  function remindLater() {
    snooze(7);
    setVisible(false);
  }

  return (
    <div className={base}>
      <div className={card}>
        {platform === "android" && (
          <div className={row}>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">Install “My Masonic Passport”</div>
              <div className="text-sm text-gray-600 truncate">Add the app to your home screen for faster access.</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={remindLater}>Later</button>
              <button
                className="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm"
                onClick={async () => {
                  if (!deferred) return;
                  deferred.prompt();
                  const choice = deferred.userChoice ? await deferred.userChoice : null;
                  setDeferred(null);
                  if (choice && choice.outcome === "accepted") {
                    dismissForever();
                  } else {
                    remindLater();
                  }
                }}
              >
                Install
              </button>
            </div>
          </div>
        )}

        {platform === "ios" && (
          <div className="space-y-2">
            <div className="font-medium">Add “My Masonic Passport” to your Home Screen</div>
            <div className="text-sm text-gray-700">
              Tap <span className="inline-block px-1 py-0.5 rounded bg-gray-100 border border-gray-300">Share</span> →
              <span className="inline-block ml-1 px-1 py-0.5 rounded bg-gray-100 border border-gray-300">Add to Home Screen</span>.
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-gray-200 text-sm" onClick={remindLater}>Later</button>
              <button className="px-3 py-2 rounded-lg bg-gray-800 text-white text-sm" onClick={dismissForever}>Don’t show again</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
