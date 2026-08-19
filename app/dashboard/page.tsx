"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  MessageSquare,
  Map,
  ArrowRight,
  Shield,
  PhoneCall,
  User,
  Radio,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { useAlertStore } from "@/stores/useAlertStore"
import { alertsApi, reportsApi } from "@/lib/api"
import type { Alert, Report } from "@/types"
import dynamic from "next/dynamic"

// Dynamic import for Mapbox to bypass SSR
const MapboxView = dynamic(() => import("@/components/map/MapboxView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-[var(--bg-card)] rounded-xl border border-[var(--border-subtle)]">
      <span className="text-xs text-[var(--text-muted)]">Loading Map Radar...</span>
    </div>
  ),
})

export default function OverviewDashboardPage() {
  const { agency } = useAuthStore()
  const { alerts, setAlerts, updateAlert } = useAlertStore()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch initial alerts and reports
  useEffect(() => {
    async function loadData() {
      try {
        const [alertsData, reportsData] = await Promise.allSettled([
          alertsApi.getAlerts({ limit: 10 }),
          reportsApi.getReports({ limit: 5 }),
        ])

        if (alertsData.status === "fulfilled" && alertsData.value?.length > 0) {
          setAlerts(alertsData.value)
        } else {
          // Provide rich mock alerts if backend is spinning up
          const demoAlerts: Alert[] = [
            {
              id: 101,
              user_id: 12,
              status: "active",
              priority: "high",
              description: "Voice Distress Trigger: 'Help me please'",
              location: { latitude: 15.5007, longitude: 32.5599, address: "Sector 4 Central Highway" },
              user: { name: "Sarah Jenkins", phone: "+1 (555) 234-8901" },
              created_at: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
            },
            {
              id: 102,
              user_id: 18,
              status: "dispatched",
              priority: "high",
              description: "One-Touch SOS Button Triggered",
              location: { latitude: 15.512, longitude: 32.545, address: "West End Metro Entrance" },
              user: { name: "David Miller", phone: "+1 (555) 789-1234" },
              created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
            },
            {
              id: 103,
              user_id: 25,
              status: "resolved",
              priority: "medium",
              description: "Unsafe Ride Distress Flag",
              location: { latitude: 15.489, longitude: 32.57, address: "Airport Bypass Rd" },
              user: { name: "Anonymous Citizen", phone: "+1 (555) 908-4455" },
              created_at: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
            },
          ]
          setAlerts(demoAlerts)
        }

        if (reportsData.status === "fulfilled" && reportsData.value?.length > 0) {
          setReports(reportsData.value)
        } else {
          const demoReports: Report[] = [
            {
              id: 401,
              category: "harassment",
              description: "Suspicious individual following near university dorms.",
              status: "investigating",
              created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
            },
            {
              id: 402,
              category: "abuse-home",
              description: "Ongoing domestic disturbance reported anonymously.",
              status: "pending",
              created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
            },
          ]
          setReports(demoReports)
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const activeAlerts = alerts.filter((a) => a.status === "active" || a.priority === "high")
  const resolvedCount = alerts.filter((a) => a.status === "resolved").length

  const handleStatusChange = async (alert: Alert, newStatus: Alert["status"]) => {
    const updated = { ...alert, status: newStatus }
    updateAlert(updated)
    try {
      await alertsApi.updateStatus(alert.id, newStatus)
    } catch {
      // local state update maintained
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ─── Executive Header with Top-Right Action ──────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--primary-light)] uppercase tracking-wider">
            <span>Station Dashboard</span>
            <span>•</span>
            <span className="text-emerald-400">Sector Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {agency?.name || "Metropolitan Safety Command HQ"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">Real-time emergency incident monitoring and dispatch triage</p>
        </div>

        {/* TOP RIGHT PRIMARY CTA: View Live Map */}
        <Link
          href="/dashboard/map"
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-[var(--emergency)] to-[#DC2626] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-[var(--emergency-glow)] flex items-center gap-2.5 transition-all self-stretch sm:self-auto justify-center"
        >
          <Map className="w-4 h-4" />
          <span>View Live Map Monitor</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* ─── KPI Metric Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Active SOS</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-[var(--emergency)] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{activeAlerts.length}</span>
            {activeAlerts.length > 0 && (
              <span className="text-xs text-[var(--emergency)] font-bold animate-pulse">URGENT</span>
            )}
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">Immediate response required</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Total Today</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 text-[#A5B4FC] flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{alerts.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">+12% vs yesterday</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">Logged incidents across sector</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Avg Response Time</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">2.4 <span className="text-base font-semibold text-[var(--text-muted)]">mins</span></span>
            <span className="text-xs text-emerald-400 font-semibold">Optimal</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">From trigger to unit arrival</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Safe Chat Reports</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-[var(--info)] flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{reports.length}</span>
            <span className="text-xs text-[#8B93FF] font-semibold">Evidence Vault</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-1">Anonymous guided cases</p>
        </div>
      </div>

      {/* ─── Main Content Grid: Triage Queue & Mapbox Radar ───────────── */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Live Emergency Triage Queue (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--emergency)]"></span>
              </span>
              <h2 className="text-lg font-bold text-white">Live Emergency Triage Queue</h2>
            </div>
            <Link href="/dashboard/alerts" className="text-xs text-[#8B93FF] hover:underline font-semibold flex items-center gap-1">
              View All Alerts <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {alerts.length === 0 ? (
              <div className="p-12 rounded-2xl glass-panel text-center text-[var(--text-muted)] text-sm">
                No active incidents in your jurisdiction. Grid is secure.
              </div>
            ) : (
              alerts.slice(0, 4).map((alert) => {
                const isActive = alert.status === "active"
                return (
                  <div
                    key={alert.id}
                    className={`p-5 rounded-2xl glass-panel border transition-all ${
                      isActive
                        ? "border-[var(--emergency)]/50 bg-gradient-to-r from-red-500/5 via-[var(--bg-card)] to-[var(--bg-card)]"
                        : "border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border ${
                              isActive
                                ? "bg-red-500/20 text-[var(--emergency)] border-red-500/30 animate-pulse"
                                : alert.status === "dispatched"
                                ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                                : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            }`}
                          >
                            {alert.status}
                          </span>
                          <span className="text-xs text-[var(--text-muted)] font-mono">ID #{alert.id}</span>
                          <span className="text-xs text-[var(--text-muted)]">• {new Date(alert.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <h4 className="text-base font-bold text-white">{alert.description || "Emergency SOS Trigger"}</h4>
                        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
                          <span className="font-medium text-white">{alert.user?.name || "Citizen"}</span>
                          {alert.user?.phone && <span>({alert.user.phone})</span>}
                          <span>•</span>
                          <span className="text-[var(--text-muted)]">{alert.location?.address || "GPS Position Attached"}</span>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        {isActive && (
                          <button
                            onClick={() => handleStatusChange(alert, "dispatched")}
                            className="px-3 py-1.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-sm"
                          >
                            Dispatch Unit
                          </button>
                        )}
                        {alert.status === "dispatched" && (
                          <button
                            onClick={() => handleStatusChange(alert, "resolved")}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                          >
                            Mark Resolved
                          </button>
                        )}
                        <Link
                          href="/dashboard/map"
                          className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-card-hover)] text-[var(--text-secondary)] hover:text-white text-xs font-semibold border border-[var(--border-subtle)] flex items-center gap-1 transition-all"
                        >
                          <Map className="w-3.5 h-3.5" />
                          Track
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Mini Mapbox Preview & Safe Chat Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Mini Mapbox Vector Radar */}
          <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-[var(--primary-light)]" />
                <h3 className="text-sm font-bold text-white">Live Radius Radar</h3>
              </div>
              <Link href="/dashboard/map" className="text-xs text-[#8B93FF] hover:underline font-semibold flex items-center gap-1">
                Full-Screen <ExternalLink className="w-3 h-3" />
              </Link>
            </div>

            {/* Embedded Mapbox View */}
            <div className="h-64 rounded-xl overflow-hidden relative border border-[var(--border-subtle)]">
              <MapboxView
                alerts={alerts}
                zoom={11}
                interactive={true}
                showControls={false}
                agencyLocation={
                  agency
                    ? {
                        latitude: agency.latitude || 15.5007,
                        longitude: agency.longitude || 32.5599,
                        name: agency.name,
                      }
                    : undefined
                }
              />
            </div>
            <p className="text-[11px] text-[var(--text-muted)] flex items-center justify-between">
              <span>Mapbox Dark Vector Engine</span>
              <span>{agency?.coverage_radius_km || 25} km Coverage Zone</span>
            </p>
          </div>

          {/* Safe Chat Reports Preview */}
          <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-[var(--info)]" />
                <h3 className="text-sm font-bold text-white">Recent Safe Chat Cases</h3>
              </div>
              <Link href="/dashboard/reports" className="text-xs text-[#8B93FF] hover:underline font-semibold">
                Open Vault →
              </Link>
            </div>

            <div className="space-y-2.5">
              {reports.map((report) => (
                <Link
                  key={report.id}
                  href="/dashboard/reports"
                  className="p-3 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)] flex items-center justify-between block transition-all group"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white group-hover:text-[#8B93FF] transition-colors">
                      #{report.id} • {report.category.toUpperCase()}
                    </span>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{report.description}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--text-secondary)] uppercase">
                    {report.status}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
