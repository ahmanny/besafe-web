"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Shield,
  Radio,
  Mic,
  MapPin,
  MessageSquare,
  AlertTriangle,
  Lock,
  ArrowRight,
  Download,
  Building2,
  CheckCircle2,
  Smartphone,
  ChevronRight,
  Sparkles,
  Zap,
  Activity,
  Cpu,
  Layers,
  HelpCircle,
  ChevronDown,
  ShieldAlert,
  Users,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [activePerspective, setActivePerspective] = useState<"citizens" | "agencies">("citizens");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does BeSafe detect threats in the background?",
      a: "BeSafe uses low-power on-device voice processing and an advanced natural language processing (NLP) model to identify acute distress phrases and emergency sounds. When a threat is verified, an encrypted SOS package is instantly transmitted with zero manual input required.",
    },
    {
      q: "How does proximity-based agency routing work?",
      a: "When an SOS is triggered, BeSafe calculates the citizen's exact GPS coordinates and matches them with verified response agencies, safety units, and authorized organizations within that jurisdiction, guaranteeing that the closest available emergency operators receive the distress telemetry.",
    },
    {
      q: "Can I install BeSafe without downloading from an app store?",
      a: "Yes! BeSafe is a full Progressive Web App (PWA). You can install it directly onto your iPhone, Android, or desktop browser by tapping 'Install' or 'Add to Home Screen' for instant full-screen offline access.",
    },
    {
      q: "Is SafeChat reporting truly anonymous and secure?",
      a: "All qualitative reports, evidence attachments, and witness testimonies are protected with 256-bit encryption. Citizens can choose full anonymity, and our AI pattern detection highlights escalation hazards directly to authorized response agencies and support NGOs.",
    },
  ];


  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col selection:bg-[#353FAB] selection:text-white font-sans antialiased overflow-x-hidden">
      {/* ─── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#070B14]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#353FAB] to-[#4E59D4] flex items-center justify-center shadow-lg shadow-[#353FAB]/30 border border-[#8B93FF]/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                BeSafe
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#353FAB]/20 text-[#8B93FF] border border-[#353FAB]/40 font-mono font-bold">
                  COMMAND v2.0
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Tactical Emergency Network
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-8 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              Telemetry Flow
            </a>
            <a href="#perspectives" className="hover:text-white transition-colors">
              Citizen vs Agency
            </a>
            <a href="#download" className="hover:text-white transition-colors">
              Mobile App
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 rounded-xl hover:bg-slate-800/60"
            >
              <Building2 className="w-4 h-4 text-[#8B93FF]" />
              <span className="hidden sm:inline">Agency</span> Portal
            </Link>
            <a
              href="#download"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#353FAB] to-[#4E59D4] hover:from-[#2B3394] hover:to-[#353FAB] text-white text-xs font-bold shadow-lg shadow-[#353FAB]/30 transition-all flex items-center gap-1.5"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Get Mobile App</span>
            </a>
          </div>
        </div>
      </header>

      {/* ─── Hero Section with Ambient Glow ───────────────────────────── */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-slate-800/60">
        {/* Dynamic Glow Meshes */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-[#353FAB]/30 via-indigo-600/15 to-red-600/10 blur-[140px] pointer-events-none -z-10 rounded-full" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Pitch */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-bold text-[#A5B4FC] shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Emergency Mesh • Proximity-Routed Response
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
                Instant Safety When <br />
                <span className="bg-gradient-to-r from-white via-slate-200 to-[#8B93FF] bg-clip-text text-transparent">
                  Every Second Counts.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                BeSafe safeguards citizens 24/7 with continuous voice threat recognition, one-touch discreet SOS beacons, and encrypted SafeChat intelligence linked directly to verified response agencies and support organizations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
                <a
                  href="#download"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#353FAB] to-[#4E59D4] hover:opacity-95 text-white font-bold shadow-xl shadow-[#353FAB]/30 flex items-center justify-center gap-2 transition-all text-sm"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Download Mobile App</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-2 transition-all text-sm border border-slate-700/80"
                >
                  <Building2 className="w-4 h-4 text-[#8B93FF]" />
                  <span>Agency Command Portal</span>
                </Link>
              </div>

              {/* Real-time Metrics Pill */}
              <div className="pt-6 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 border-t border-slate-800/80 text-left">

                <div>
                  <div className="text-2xl font-extrabold text-white font-mono">&lt; 3.0s</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Response Latency
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white font-mono">256-Bit</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Encrypted Evidence
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">100%</div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                    Agency Routing
                  </div>
                </div>
              </div>
            </div>

            {/* Right Hero Interactive Simulation Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl bg-[#0F172A]/90 border border-slate-700/80 shadow-2xl p-5 backdrop-blur-xl overflow-hidden space-y-4">
                {/* Header Banner */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                    <span className="text-xs font-bold font-mono text-red-400 uppercase">
                      CRITICAL ALERT • #6A380031
                    </span>
                  </div>
                  <Badge className="bg-red-500/20 text-red-300 border-red-500/30 text-[10px] font-mono">
                    VOICE SOS TRIGGER
                  </Badge>
                </div>

                {/* Simulated GPS Radar Snapshot */}
                <div className="relative h-44 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[radial-gradient(#353FAB_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
                  
                  {/* Radar Circles */}
                  <div className="absolute w-36 h-36 rounded-full border border-indigo-500/20 animate-ping" />
                  <div className="absolute w-24 h-24 rounded-full border border-indigo-500/40" />

                  {/* Target Beacon */}
                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-9 h-9 rounded-full bg-red-500 border-2 border-white shadow-lg shadow-red-500/60 flex items-center justify-center font-bold text-[10px] text-white animate-pulse">
                      SOS
                    </div>
                    <span className="mt-1 text-[9px] font-mono font-bold bg-black/80 px-2 py-0.5 rounded text-slate-200 border border-slate-800">
                      David DOE • 9.8494°, 8.8889°
                    </span>
                  </div>

                  {/* Assigned Agency HQ */}
                  <div className="absolute top-3 left-3 bg-[#353FAB]/90 px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-bold text-white flex items-center gap-1.5 shadow-md">
                    <span>🏛️</span>
                    <span>FutMinna Police Agency (1.2 km)</span>
                  </div>
                </div>


                {/* AI Threat Classification Box */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> AI Threat Score:
                    </span>
                    <span className="font-mono font-bold text-amber-400">0.96 (CRITICAL)</span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic line-clamp-2">
                    &quot;User distress signal initiated. High-likelihood acute threat requiring priority dispatcher review.&quot;
                  </p>
                </div>

                {/* Simulated Action Dispatch */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                    <span>Live GPS Telemetry Active</span>
                  </div>
                  <Link
                    href="/login"
                    className="text-xs font-bold text-[#8B93FF] hover:underline flex items-center gap-1"
                  >
                    View in Console <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4 Core Capabilities Grid ─────────────────────────────────── */}
      <section id="features" className="py-24 border-b border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-[#8B93FF]">
              Core Tactical Architecture
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white">
              End-to-End Emergency Intelligence
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every layer of the BeSafe platform is engineered for zero-latency detection, fail-safe communication, and rapid dispatch.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-[#353FAB]/60 transition-all group shadow-lg hover:shadow-[#353FAB]/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center font-bold border border-red-500/20 group-hover:scale-110 transition-transform">
                <Mic className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Voice Threat Recognition</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Background audio pipeline processes acoustic keywords and distress cues, triggering automated alerts without touching the device.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-[#353FAB]/60 transition-all group shadow-lg hover:shadow-[#353FAB]/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#353FAB]/20 text-[#8B93FF] flex items-center justify-center font-bold border border-[#353FAB]/30 group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Vector Radar & Proximity</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Automated Haversine and geospatial indexing routes alerts to the physically closest command post in sub-second timeframes.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-[#353FAB]/60 transition-all group shadow-lg hover:shadow-[#353FAB]/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold border border-amber-500/20 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">SafeChat Citizen Reports</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Encrypted qualitative reporting interface with AI-driven escalation dossiers, forensic timelines, and evidence vaults.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#0F172A]/70 border border-slate-800 hover:border-[#353FAB]/60 transition-all group shadow-lg hover:shadow-[#353FAB]/10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center font-bold border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Multi-Role Agency Dispatch</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Discrete role segregation between Agency Admins and frontline Operators with live WebSocket assignment queues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Citizen Defense vs Agency Command (Interactive Tab) ───────── */}
      <section id="perspectives" className="py-24 border-b border-slate-800/60 bg-[#0B0F19]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-[#8B93FF]">
              Tailored Experiences
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              Built for Citizens. Optimized for Response Agencies & Support NGOs.
            </h3>
            
            {/* Toggle Switch */}
            <div className="inline-flex p-1 rounded-xl bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setActivePerspective("citizens")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activePerspective === "citizens"
                    ? "bg-[#353FAB] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                For Citizens & Families
              </button>
              <button
                type="button"
                onClick={() => setActivePerspective("agencies")}
                className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                  activePerspective === "agencies"
                    ? "bg-[#353FAB] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                For Response Agencies, NGOs & Admins
              </button>
            </div>
          </div>

          {activePerspective === "citizens" ? (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Discreet Silent Trigger</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Trigger an SOS discreetly by voice phrase, lock screen widget, or emergency contact broadcast without raising suspicion.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Real-Time Circle Broadcast</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatically sends simultaneous SMS alerts with your live location coordinates to all designated family emergency contacts.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Zero-Trace SafeChat</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Submit confidential reports regarding harassment, abuse, or transport hazards with full evidence encryption.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-primary/20 text-[#8B93FF] flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Live Vector Radar</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Full-screen interactive Mapbox telemetry canvas showing live distress vectors, active markers, and agency headquarters.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Explainable AI Dossiers</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time threat pattern categorization, severity scoring, and evidence summaries generated via Gemini models.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Staff Assignment Queue</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Assign incidents to specific agency dispatchers with instant WebSocket sync across all connected command consoles.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>


      {/* ─── Official Mobile App Showcase (Google Play & App Store) ───── */}
      <section id="download" className="py-24 border-b border-slate-800/60 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-[#0F172A] to-[#141B2D] border border-slate-700/80 p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-[#8B93FF] text-xs font-mono font-bold">
                  📱 OFFICIAL MOBILE APPLICATION
                </div>

                <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Download BeSafe for Android & iOS
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  Protect yourself and your loved ones everywhere you go. The BeSafe mobile application runs lightweight continuous voice threat recognition, offline SMS broadcast, and direct proximity routing to emergency units.
                </p>

                {/* Mobile App Download Cards */}
                <div className="grid sm:grid-cols-2 gap-4 pt-2">
                  {/* Google Play */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/40 transition-all space-y-2 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🤖</span>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">GET IT ON</span>
                          <span className="text-sm font-extrabold text-white group-hover:text-emerald-400 transition-colors">Google Play</span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[9px] font-mono">
                        OFFICIAL
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">Standard Android release for all smartphone brands.</p>
                  </div>

                  {/* Apple App Store */}
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-[#353FAB]/40 transition-all space-y-2 group cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">🍏</span>
                        <div className="text-left">
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">DOWNLOAD ON</span>
                          <span className="text-sm font-extrabold text-white group-hover:text-[#8B93FF] transition-colors">App Store</span>
                        </div>
                      </div>
                      <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[9px] font-mono">
                        IOS RELEASE
                      </Badge>
                    </div>
                    <p className="text-[11px] text-slate-400">Native iOS build with Siri shortcut & lock screen widget.</p>
                  </div>
                </div>
              </div>


              {/* Phone Mockup Showcase */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-64 sm:w-72 p-4 rounded-3xl bg-slate-950 border-4 border-slate-800 shadow-2xl space-y-3">
                  <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto" />
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-[#353FAB] to-[#4E59D4] text-white text-center space-y-2 shadow-lg shadow-[#353FAB]/30">
                    <Shield className="w-10 h-10 mx-auto text-white" />
                    <h5 className="font-extrabold text-sm">BeSafe Mobile</h5>
                    <p className="text-[10px] text-slate-200">Native Citizen Defense App</p>
                  </div>
                  <div className="space-y-2 text-[11px] font-mono text-slate-300">
                    <div className="flex justify-between p-2 rounded bg-slate-900">
                      <span>AI Threat Listener:</span>
                      <span className="text-emerald-400 font-bold">ACTIVE (24/7)</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-900">
                      <span>Proximity GPS:</span>
                      <span className="text-primary font-bold">LOCKED</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-slate-900">
                      <span>Emergency Circle:</span>
                      <span className="text-emerald-400 font-bold">SYNCED</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ─── Frequently Asked Questions ───────────────────────────────── */}
      <section id="faq" className="py-24 border-b border-slate-800/60 bg-[#070B14]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-xs font-bold font-mono uppercase tracking-widest text-[#8B93FF]">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl font-extrabold text-white">
              Questions & Security Protocols
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#8B93FF]" />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800/80">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="py-12 bg-[#05080F] border-t border-slate-900 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-[#353FAB] flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white">BeSafe Emergency Network</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="hover:text-white transition-colors">
              Agency Login
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Live HUD
            </Link>
            <a href="#pwa-install" className="hover:text-white transition-colors">
              PWA Install
            </a>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            <span>Operational Mesh Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
