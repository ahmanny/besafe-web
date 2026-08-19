"use client";

import { useEffect, useState } from "react";
import { Download, Smartphone, X, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PwaInstaller() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[PWA] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[PWA] Service Worker registration failed:", err);
        });
    }

    // 2. Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
      return;
    }

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 4. Capture native install prompt (Android, Chrome, Edge)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      // Automatically show banner after 3 seconds on landing page if not dismissed previously
      const dismissed = sessionStorage.getItem("besafe_pwa_dismissed");
      if (!dismissed) {
        setTimeout(() => setShowBanner(true), 2500);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    window.addEventListener("appinstalled", () => {
      setIsInstalled(true);
      setShowBanner(false);
      setInstallPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setIsInstalled(true);
        setShowBanner(false);
      }
      setInstallPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    sessionStorage.setItem("besafe_pwa_dismissed", "true");
  };

  if (isInstalled || (!showBanner && !showIosGuide)) return null;

  return (
    <>
      {/* ─── Floating Smart PWA Install Banner ──────────────────────── */}
      {showBanner && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto sm:max-w-md z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-4 rounded-2xl bg-[#0F172A]/95 border border-[#353FAB]/50 shadow-2xl backdrop-blur-xl text-white flex items-center justify-between gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#353FAB] to-[#4E59D4] flex items-center justify-center shadow-lg shadow-[#353FAB]/30 shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>Install BeSafe Command</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">PWA</span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug mt-0.5">
                  Launch full screen with instant offline access and direct dispatch alerts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="h-8 px-3 text-xs font-bold bg-[#353FAB] hover:bg-[#4E59D4] text-white shadow-md shadow-[#353FAB]/40"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                Install
              </Button>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── iOS Safari Add-to-Home-Screen Modal ────────────────────── */}
      {showIosGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in-50"
          onClick={() => setShowIosGuide(false)}
        >
          <div
            className="p-5 rounded-2xl bg-[#0F172A] border border-border/80 shadow-2xl text-white max-w-sm w-full space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold">Install on iPhone / iPad</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="text-muted-foreground hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-mono font-bold text-primary">1.</span>
                <span>Tap the <strong>Share</strong> icon in Safari's bottom toolbar (the square with an arrow pointing up).</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-mono font-bold text-primary">2.</span>
                <span>Scroll down and select <strong>&quot;Add to Home Screen&quot;</strong>.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-900 border border-slate-800">
                <span className="font-mono font-bold text-primary">3.</span>
                <span>Tap <strong>Add</strong> in the top right corner to enjoy BeSafe in standalone mode!</span>
              </div>
            </div>

            <Button
              className="w-full h-8 text-xs font-bold bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setShowIosGuide(false)}
            >
              <Check className="w-3.5 h-3.5 mr-1" />
              Got It
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
