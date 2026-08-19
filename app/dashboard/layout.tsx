"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Shield,
  LayoutDashboard,
  AlertTriangle,
  MessageSquare,
  BarChart3,
  Settings,
  Map,
  Volume2,
  VolumeX,
  LogOut,
  Radio,
  Building2,
  ChevronRight,
  Menu,
  X,
  BellRing,
  PhoneCall,
  ExternalLink,
} from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { useAlertStore } from "@/stores/useAlertStore"
import { useSocket } from "@/hooks/useSocket"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { agency, isAuthenticated, isLoading, hydrate, logout } = useAuthStore()
  const { alerts, soundAlertsEnabled, toggleSoundAlerts, latestEmergency, isEmergencyModalOpen, dismissLatestEmergency } =
    useAlertStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Initialize socket listener
  useSocket()

  // Hydrate auth session
  useEffect(() => {
    hydrate()
  }, [])

  const activeSosCount = alerts.filter((a) => a.status === "active" || a.priority === "high").length

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Emergency Alerts", href: "/dashboard/alerts", icon: AlertTriangle, badge: activeSosCount },
    { name: "Safe Chat Reports", href: "/dashboard/reports", icon: MessageSquare },
    { name: "Analytics & Trends", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Agency Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] flex">
      {/* ─── Mobile Sidebar Overlay ───────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ─── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-subtle)] flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-[var(--border-subtle)]">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#353FAB] to-[#4E59D4] flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                BeSafe <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--primary)]/20 text-[#A5B4FC] font-semibold">COMMAND</span>
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Dispatch Grid
              </div>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-[var(--text-muted)] hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Agency Profile Summary */}
        <div className="p-4 mx-4 mt-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white truncate max-w-[170px]">
              {agency?.name || "Metropolitan Safety HQ"}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
            <Radio className="w-3 h-3 text-[var(--primary-light)]" /> Radius: {agency?.coverage_radius_km || 25} km
          </p>
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
            Navigation
          </div>
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary-glow)]"
                    : "text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)]"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[var(--text-muted)]"}`} />
                  <span>{item.name}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--emergency)] text-white shadow-sm animate-pulse">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* ─── Prominent Bottom Map Button (Under Settings) ─────────── */}
          <div className="pt-4 mt-4 border-t border-[var(--border-subtle)]">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-3 mb-2">
              Full-Screen Monitor
            </div>
            <Link
              href="/dashboard/map"
              onClick={() => setSidebarOpen(false)}
              className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-bold transition-all border ${
                pathname === "/dashboard/map"
                  ? "bg-gradient-to-r from-[#353FAB] to-[#4E59D4] text-white border-transparent shadow-lg shadow-[var(--primary-glow)]"
                  : "bg-gradient-to-r from-[var(--bg-card)] to-[#161D2C] hover:from-[#161D2C] hover:to-[#1B2436] text-white border-[var(--border-subtle)] hover:border-[var(--primary)]"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--emergency)]/20 border border-[var(--emergency)]/30 flex items-center justify-center text-[var(--emergency)]">
                  <Map className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    Live Command Map
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">Vector GPS Tracking</div>
                </div>
              </div>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--emergency)]"></span>
              </span>
            </Link>
          </div>
        </nav>

        {/* Sidebar Footer Controls */}
        <div className="p-4 border-t border-[var(--border-subtle)] space-y-2">
          <button
            onClick={toggleSoundAlerts}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] transition-all"
          >
            <div className="flex items-center gap-2.5">
              {soundAlertsEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-[var(--text-muted)]" />
              )}
              <span>Emergency Audio Sirens</span>
            </div>
            <span className="text-[10px] font-bold text-[var(--text-muted)]">
              {soundAlertsEnabled ? "ON" : "MUTED"}
            </span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Station</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content Canvas ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Ticker Header */}
        <header className="h-20 bg-[var(--bg-sidebar)]/80 backdrop-blur-md border-b border-[var(--border-subtle)] px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Emergency Alert Ticker */}
            <div className="hidden sm:flex items-center space-x-3 px-3.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]">
              <span className="flex h-2.5 w-2.5 relative">
                {activeSosCount > 0 ? (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--emergency)]"></span>
                  </>
                ) : (
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                )}
              </span>
              <span className="text-xs font-semibold text-white">
                {activeSosCount > 0
                  ? `${activeSosCount} ACTIVE EMERGENCY ALERT${activeSosCount > 1 ? "S" : ""}`
                  : "All Sectors Secure & Monitored"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Link to Landing Page */}
            <Link
              href="/"
              target="_blank"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[var(--text-muted)] hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Public Site
            </Link>

            {/* Live Map Header Shortcut Button */}
            <Link
              href="/dashboard/map"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--emergency)] hover:bg-[var(--emergency-hover)] text-white text-xs font-bold shadow-md shadow-[var(--emergency-glow)] transition-all"
            >
              <Map className="w-4 h-4" />
              <span className="hidden sm:inline">View Live Map</span>
            </Link>
          </div>
        </header>

        {/* Page Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
      </div>

      {/* ─── Global Incoming SOS Alert Popup Modal ────────────────────── */}
      {isEmergencyModalOpen && latestEmergency && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-lg w-full rounded-2xl glass-panel p-6 shadow-2xl border-2 border-[var(--emergency)] animate-sos-pulse space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-[var(--emergency)] flex items-center justify-center font-bold">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">NEW EMERGENCY SOS TRIGGER</h3>
                  <p className="text-xs text-red-400 font-mono">Incident #{latestEmergency.id} • Immediate Response Required</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Victim / User:</span>
                <span className="text-white font-semibold">{latestEmergency.user?.name || "Anonymous User"}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Coordinates:</span>
                <span className="text-white font-mono">{latestEmergency.location?.latitude?.toFixed(4)}° N, {latestEmergency.location?.longitude?.toFixed(4)}° E</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[var(--text-muted)]">Trigger Source:</span>
                <span className="text-[#A5B4FC] font-semibold uppercase">{latestEmergency.description || "One-Touch SOS"}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={dismissLatestEmergency}
                className="flex-1 py-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card-hover)] text-xs font-semibold text-[var(--text-secondary)] transition-all"
              >
                Acknowledge & Close
              </button>
              <Link
                href="/dashboard/map"
                onClick={dismissLatestEmergency}
                className="flex-1 py-3 rounded-xl bg-[var(--emergency)] hover:bg-[var(--emergency-hover)] text-white text-xs font-bold text-center transition-all shadow-lg shadow-[var(--emergency-glow)]"
              >
                Dispatch on Live Map →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
