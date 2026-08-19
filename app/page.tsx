"use client"

import Link from "next/link"
import { useState } from "react"
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
} from "lucide-react"

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"citizens" | "agencies">("citizens")

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex flex-col selection:bg-[var(--primary)] selection:text-white">
      {/* ─── Top Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-base)]/85 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#353FAB] to-[#4E59D4] flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
                BeSafe <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--primary)]/20 text-[#8B93FF] border border-[var(--primary)]/40 font-medium">v1.0</span>
              </span>
              <span className="text-[11px] text-[var(--text-muted)] -mt-1 font-medium tracking-wider uppercase">Emergency Network</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-[var(--text-secondary)]">
            <a href="#features" className="hover:text-white transition-colors">Safety Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#safe-chat" className="hover:text-white transition-colors">Safe Chat</a>
            <a href="#agencies" className="hover:text-white transition-colors">For Agencies</a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] hover:text-white transition-colors flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[var(--primary)]" />
              Agency Portal
            </Link>
            <Link
              href="#download"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#353FAB] to-[#4E59D4] hover:from-[#2B3394] hover:to-[#353FAB] text-white text-sm font-semibold shadow-lg shadow-[var(--primary-glow)] hover:shadow-xl hover:shadow-[var(--primary-glow)] transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Get App
            </Link>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-24 overflow-hidden border-b border-[var(--border-subtle)]">
        {/* Background glow flares */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-[var(--primary)]/25 to-red-500/10 blur-[130px] pointer-events-none -z-10 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-semibold text-[#A5B4FC]">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                AI-Powered Emergency Detection & Proximity Dispatch
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
                Instant Safety When <br />
                <span className="bg-gradient-to-r from-white via-slate-200 to-[#8B93FF] bg-clip-text text-transparent">
                  Every Second Counts.
                </span>
              </h1>

              <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                BeSafe protects you 24/7 with continuous voice threat recognition, one-touch discreet SOS alerts, and anonymous Safe Chat reporting connected directly to verified response stations.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <Link
                  href="#download"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#353FAB] to-[#4E59D4] hover:opacity-95 text-white font-semibold shadow-lg shadow-[var(--primary-glow)] flex items-center justify-center gap-2.5 transition-all text-base"
                >
                  <Smartphone className="w-5 h-5" />
                  Download Mobile App
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl glass-panel glass-panel-hover text-white font-semibold flex items-center justify-center gap-2.5 transition-all text-base border border-[var(--border-subtle)]"
                >
                  <Radio className="w-5 h-5 text-[var(--emergency)]" />
                  Agency Live Command
                  <ArrowRight className="w-4 h-4 text-[var(--text-muted)]" />
                </Link>
              </div>

              <div className="pt-6 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0 border-t border-[var(--border-subtle)] text-left">
                <div>
                  <div className="text-2xl font-bold text-white">&lt; 3 sec</div>
                  <div className="text-xs text-[var(--text-muted)]">SOS Auto-Trigger</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-xs text-[var(--text-muted)]">Encrypted Evidence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Live GPS</div>
                  <div className="text-xs text-[var(--text-muted)]">Station Routing</div>
                </div>
              </div>
            </div>

            {/* Simulated Live Alert Display Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-2xl glass-panel p-6 shadow-2xl border border-[var(--border-subtle)]">
                {/* Simulated Header */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--emergency)]"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-[var(--emergency)]">Active SOS Stream</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-mono">ID: #SOS-9821</span>
                </div>

                {/* Simulated Body */}
                <div className="py-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-base font-semibold text-white">Threat Voice Triggered</h4>
                      <p className="text-xs text-[var(--text-secondary)]">Speech Keyword: &ldquo;Help me please&rdquo;</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-[var(--emergency)]/20 text-[var(--emergency)] text-xs font-bold border border-[var(--emergency)]/30">
                      HIGH PRIORITY
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[var(--info)]" /> Live Location
                      </span>
                      <span className="text-white font-mono font-medium">15.5007° N, 32.5599° E</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[var(--primary)]" /> Assigned Station
                      </span>
                      <span className="text-[#A5B4FC] font-medium">Central Police Division 1</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-1">
                    <span className="flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-emerald-400" /> Audio Recorded: 00:24s
                    </span>
                    <span className="text-emerald-400 font-medium">Emergency Contacts Notified</span>
                  </div>
                </div>

                {/* Simulated Action */}
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold text-center block transition-all shadow-md"
                >
                  Open Live Incident Triage →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Core Capabilities Grid ───────────────────────────────────── */}
      <section id="features" className="py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--primary-light)]">Built for Absolute Reliability</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Comprehensive Safety Architecture</h3>
            <p className="text-[var(--text-secondary)] text-base">
              Engineered with advanced on-device intelligence, silent emergency triggers, and automatic station routing.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl glass-panel space-y-4 border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-[var(--emergency)]">
                <Mic className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">AI Threat Voice Detection</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Background microphone intelligence listens for distress keywords and automatically initiates a 3-second auto-dispatch countdown.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-4 border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 flex items-center justify-center text-[#A5B4FC]">
                <Radio className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">One-Touch SOS & Broadcast</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Hold-to-trigger gesture instantly sends real-time GPS coordinates to response units and sends SMS alerts to emergency contacts.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-4 border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Safe Chat Reporting</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Anonymous guided questionnaires for domestic abuse or harassment with end-to-end encrypted audio and photo evidence vaulting.
              </p>
            </div>

            <div className="p-6 rounded-2xl glass-panel space-y-4 border border-[var(--border-subtle)] hover:border-[var(--border-hover)] transition-all">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-[var(--info)]">
                <MapPin className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white">Proximity Dispatch Routing</h4>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Coordinates are dynamically matched against registered agency geofences to route emergencies to the nearest responder.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works (Citizen & Agency Switcher) ─────────────────── */}
      <section id="how-it-works" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#8B93FF]">Workflow Coordination</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white">How BeSafe Connects the Ecosystem</h3>
            
            {/* Tab Switcher */}
            <div className="inline-flex p-1.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] mt-4">
              <button
                onClick={() => setActiveTab("citizens")}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "citizens"
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                For Citizens (Mobile App)
              </button>
              <button
                onClick={() => setActiveTab("agencies")}
                className={`px-6 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === "agencies"
                    ? "bg-[var(--primary)] text-white shadow-md"
                    : "text-[var(--text-secondary)] hover:text-white"
                }`}
              >
                For Agencies (Command Portal)
              </button>
            </div>
          </div>

          {activeTab === "citizens" ? (
            <div className="grid md:grid-cols-3 gap-8 pt-4">
              <div className="p-8 rounded-2xl glass-panel space-y-4">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 text-[#A5B4FC] font-bold flex items-center justify-center text-base border border-[var(--primary)]/40">
                  1
                </div>
                <h4 className="text-xl font-bold text-white">Trigger SOS or Safe Chat</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Trigger SOS by speaking distress phrases, holding the emergency button, or filling out a discreet guided incident report.
                </p>
              </div>

              <div className="p-8 rounded-2xl glass-panel space-y-4">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 text-[#A5B4FC] font-bold flex items-center justify-center text-base border border-[var(--primary)]/40">
                  2
                </div>
                <h4 className="text-xl font-bold text-white">Live Stream & GPS Lock</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Your device captures background coordinates and evidence, encrypts the payload, and sends alerts to family and emergency services.
                </p>
              </div>

              <div className="p-8 rounded-2xl glass-panel space-y-4">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 text-[#A5B4FC] font-bold flex items-center justify-center text-base border border-[var(--primary)]/40">
                  3
                </div>
                <h4 className="text-xl font-bold text-white">Immediate Assistance</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  The nearest patrol or emergency team receives your exact location and dispatches help straight to you.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8 pt-4">
              <div className="p-8 rounded-2xl glass-panel space-y-4">
                <div className="w-10 h-10 rounded-full bg-[var(--emergency)]/20 text-[var(--emergency)] font-bold flex items-center justify-center text-base border border-[var(--emergency)]/40">
                  1
                </div>
                <h4 className="text-xl font-bold text-white">Real-Time Triage Alert</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Receive instant audible alarms and map beacons whenever an SOS or Safe Chat report occurs within your coverage radius.
                </p>
              </div>

              <div className="p-8 rounded-2xl glass-panel space-y-4">
                <div className="w-10 h-10 rounded-full bg-[var(--emergency)]/20 text-[var(--emergency)] font-bold flex items-center justify-center text-base border border-[var(--emergency)]/40">
                  2
                </div>
                <h4 className="text-xl font-bold text-white">Mapbox Live Tracking</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Track live moving victims on full-screen vector maps with breadcrumb trails, audio recordings, and medical contact information.
                </p>
              </div>

              <div className="p-8 rounded-2xl glass-panel space-y-4">
                <div className="w-10 h-10 rounded-full bg-[var(--emergency)]/20 text-[var(--emergency)] font-bold flex items-center justify-center text-base border border-[var(--emergency)]/40">
                  3
                </div>
                <h4 className="text-xl font-bold text-white">Unit Dispatch & Closure</h4>
                <p className="text-sm text-[var(--text-secondary)]">
                  Assign response units, update incident statuses, log resolution notes, and generate agency performance analytics.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── Agency Sign-up Callout ────────────────────────────────────── */}
      <section id="agencies" className="py-20 border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-10 lg:p-16 bg-gradient-to-r from-[var(--bg-card)] via-[#161D2C] to-[var(--bg-card)] border border-[var(--border-subtle)] relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-[#8B93FF]">Command Center Onboarding</span>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white">Are You an Emergency Response Agency?</h3>
              <p className="text-[var(--text-secondary)] text-base">
                Police departments, campus safety units, private security patrols, and emergency medical teams can register for real-time dispatch dashboard access.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 pt-2 text-sm text-[var(--text-secondary)]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mapbox Vector Live Feeds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Evidence Audio & Photo Vault
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated Webhook Notifications
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Geofence Radius Routing
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/login"
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#353FAB] to-[#4E59D4] hover:opacity-95 text-white font-bold text-center shadow-lg shadow-[var(--primary-glow)] transition-all"
              >
                Access Agency Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Download CTA Section ──────────────────────────────────────── */}
      <section id="download" className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h3 className="text-3xl sm:text-5xl font-extrabold text-white">Protect Yourself & Loved Ones Today</h3>
          <p className="text-[var(--text-secondary)] text-base max-w-xl mx-auto">
            Download the BeSafe mobile app for Android and iOS to activate instant voice threat detection and 24/7 emergency response.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#"
              className="px-7 py-3.5 rounded-xl bg-white text-[var(--bg-base)] hover:bg-slate-100 font-bold flex items-center gap-3 transition-all shadow-lg"
            >
              <Smartphone className="w-5 h-5 text-[#353FAB]" />
              Download APK for Android
            </a>
            <a
              href="#"
              className="px-7 py-3.5 rounded-xl glass-panel text-white hover:bg-[var(--bg-card-hover)] font-bold flex items-center gap-3 transition-all border border-[var(--border-subtle)]"
            >
              <Smartphone className="w-5 h-5 text-white" />
              Download for iOS (TestFlight)
            </a>
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[var(--border-subtle)] bg-[var(--bg-sidebar)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[var(--text-muted)]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white font-bold">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-sm font-semibold text-white">BeSafe Safety Platform</span>
          </div>

          <p>© {new Date().getFullYear()} BeSafe Network. All rights reserved. For true life-threatening emergencies, always dial 911 / 112.</p>

          <div className="flex items-center space-x-6">
            <Link href="/login" className="hover:text-white transition-colors">Agency Login</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Command Monitor</Link>
            <a href="#features" className="hover:text-white transition-colors">Privacy & Encryption</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
