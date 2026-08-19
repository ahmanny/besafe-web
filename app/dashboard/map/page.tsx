"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  AlertTriangle,
  MapPin,
  PhoneCall,
  User,
  Shield,
  Clock,
  CheckCircle2,
  Radio,
  Volume2,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { useAlertStore } from "@/stores/useAlertStore"
import { alertsApi } from "@/lib/api"
import type { Alert } from "@/types"

const MapboxView = dynamic(() => import("@/components/map/MapboxView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-[var(--bg-card)] rounded-2xl border border-[var(--border-subtle)]">
      <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
        <div className="w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold">Initializing Vector Command Radar...</span>
      </div>
    </div>
  ),
})

export default function LiveMapCommandPage() {
  const { agency } = useAuthStore()
  const { alerts, selectedAlertId, setSelectedAlertId, updateAlert } = useAlertStore()
  const [filterPriority, setFilterPriority] = useState<"all" | "high" | "active">("all")

  const filteredAlerts = alerts.filter((a) => {
    if (filterPriority === "active") return a.status === "active"
    if (filterPriority === "high") return a.priority === "high"
    return true
  })

  const selectedAlert = alerts.find((a) => a.id === selectedAlertId) || filteredAlerts[0]

  const handleStatusChange = async (newStatus: Alert["status"]) => {
    if (!selectedAlert) return
    const updated = { ...selectedAlert, status: newStatus }
    updateAlert(updated)
    try {
      await alertsApi.updateStatus(selectedAlert.id, newStatus)
    } catch {
      // local state update maintained
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      {/* ─── Top Filter & Status Strip ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-[var(--border-subtle)]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 text-[var(--emergency)] flex items-center justify-center font-bold">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              Live Mapbox Command Center
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium border border-emerald-500/30">
                Vector Stream Active
              </span>
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              Station Sector: {agency?.name || "Metropolitan Safety HQ"} • Radius: {agency?.coverage_radius_km || 25} km
            </p>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterPriority("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterPriority === "all"
                ? "bg-[var(--primary)] text-white shadow-md"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            All Beacons ({alerts.length})
          </button>
          <button
            onClick={() => setFilterPriority("active")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterPriority === "active"
                ? "bg-[var(--emergency)] text-white shadow-md"
                : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
            }`}
          >
            Active SOS ({alerts.filter((a) => a.status === "active").length})
          </button>
        </div>
      </div>

      {/* ─── Map Canvas & Floating Triage Drawer ─────────────────────── */}
      <div className="flex-1 grid lg:grid-cols-12 gap-4 min-h-0 relative">
        {/* Left Side: Incident Selection & Triage Drawer (4 cols) */}
        <div className="lg:col-span-4 flex flex-col space-y-4 overflow-y-auto">
          {/* Active Emergencies Queue */}
          <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex-1 flex flex-col space-y-3 min-h-[220px]">
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Jurisdiction Queue ({filteredAlerts.length})
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Live GPS Sync</span>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-8 text-xs text-[var(--text-muted)]">No active emergency signals</div>
              ) : (
                filteredAlerts.map((alert) => {
                  const isSelected = alert.id === (selectedAlert?.id ?? null)
                  const isActive = alert.status === "active"
                  return (
                    <div
                      key={alert.id}
                      onClick={() => setSelectedAlertId(alert.id)}
                      className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? "bg-[var(--primary)]/20 border-[var(--primary)] shadow-md"
                          : isActive
                          ? "bg-[var(--bg-card)] border-red-500/30 hover:border-red-500"
                          : "bg-[var(--bg-card)] border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                            isActive ? "bg-[var(--emergency)] text-white" : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                          }`}
                        >
                          {alert.status}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)] font-mono">
                          {new Date(alert.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1.5 truncate">{alert.description || "SOS Alert"}</h4>
                      <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 flex items-center justify-between">
                        <span>{alert.user?.name || "Citizen"}</span>
                        <span className="font-mono text-[10px] text-[var(--info)]">
                          {alert.location?.latitude.toFixed(2)}°, {alert.location?.longitude.toFixed(2)}°
                        </span>
                      </p>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Selected Incident Deep-Dive Panel */}
          {selectedAlert && (
            <div className="p-5 rounded-2xl glass-panel border border-[var(--primary)]/40 shadow-xl space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[var(--primary-light)] uppercase font-bold">
                    Incident #{selectedAlert.id}
                  </span>
                  <h3 className="text-base font-bold text-white mt-0.5">{selectedAlert.description || "SOS Distress Signal"}</h3>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase border ${
                    selectedAlert.status === "active"
                      ? "bg-red-500/20 text-[var(--emergency)] border-red-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                  }`}
                >
                  {selectedAlert.status}
                </span>
              </div>

              {/* Citizen Information */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--primary-light)]" /> Name:
                  </span>
                  <span className="text-white font-semibold">{selectedAlert.user?.name || "Anonymous User"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" /> Phone:
                  </span>
                  <a href={`tel:${selectedAlert.user?.phone}`} className="text-emerald-400 hover:underline font-mono">
                    {selectedAlert.user?.phone || "No phone listed"}
                  </a>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[var(--info)]" /> Address:
                  </span>
                  <span className="text-white truncate max-w-[180px]">{selectedAlert.location?.address || "GPS Position"}</span>
                </div>
              </div>

              {/* Dispatch Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                {selectedAlert.status === "active" && (
                  <button
                    onClick={() => handleStatusChange("dispatched")}
                    className="py-2.5 px-3 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-md"
                  >
                    Dispatch Squad
                  </button>
                )}
                {selectedAlert.status === "dispatched" && (
                  <button
                    onClick={() => handleStatusChange("resolved")}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all"
                  >
                    Mark Resolved
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange("false_alarm")}
                  className="py-2.5 px-3 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card-hover)] text-[var(--text-muted)] hover:text-white text-xs font-semibold transition-all border border-[var(--border-subtle)]"
                >
                  False Alarm
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Mapbox Canvas (8 cols) */}
        <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-[var(--border-subtle)] relative">
          <MapboxView
            alerts={filteredAlerts}
            selectedAlertId={selectedAlert?.id}
            onSelectAlert={(a) => setSelectedAlertId(a.id)}
            zoom={13}
            interactive={true}
            showControls={true}
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
      </div>
    </div>
  )
}
