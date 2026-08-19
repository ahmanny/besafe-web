"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  Search,
  Filter,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  User,
  Map,
  X,
  ChevronRight,
  Shield,
} from "lucide-react"
import { useAlertStore } from "@/stores/useAlertStore"
import { useFilterStore } from "@/stores/useFilterStore"
import { alertsApi } from "@/lib/api"
import type { Alert, AlertStatus, AlertPriority } from "@/types"

export default function AlertsManagementPage() {
  const { alerts, updateAlert, setSelectedAlertId } = useAlertStore()
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter, priorityFilter, setPriorityFilter } =
    useFilterStore()
  const [inspectAlert, setInspectAlert] = useState<Alert | null>(null)

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      (alert.description?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (alert.user?.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (alert.location?.address?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      alert.id.toString().includes(searchQuery)

    const matchesStatus = statusFilter === "all" || alert.status === statusFilter
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusChange = async (alert: Alert, newStatus: AlertStatus) => {
    const updated = { ...alert, status: newStatus }
    updateAlert(updated)
    if (inspectAlert?.id === alert.id) setInspectAlert(updated)
    try {
      await alertsApi.updateStatus(alert.id, newStatus)
    } catch {
      // local update kept
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Emergency Alerts Log</h1>
          <p className="text-sm text-[var(--text-secondary)]">Search, filter, and review all SOS incident triggers in your sector</p>
        </div>
        <Link
          href="/dashboard/map"
          className="px-4 py-2.5 rounded-xl bg-[var(--emergency)] hover:bg-[var(--emergency-hover)] text-white text-xs font-bold shadow-md shadow-[var(--emergency-glow)] flex items-center gap-2"
        >
          <Map className="w-4 h-4" />
          View Live Command Map
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by incident ID, citizen name, address or keyword..."
            className="block w-full pl-10 pr-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active SOS</option>
            <option value="dispatched">Dispatched Units</option>
            <option value="resolved">Resolved</option>
            <option value="false_alarm">False Alarm</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as any)}
            className="px-3 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="rounded-2xl glass-panel border border-[var(--border-subtle)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-sidebar)] text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                <th className="py-3.5 px-4">Incident ID</th>
                <th className="py-3.5 px-4">Citizen / Victim</th>
                <th className="py-3.5 px-4">Description & Trigger</th>
                <th className="py-3.5 px-4">Coordinates / Location</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
              {filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[var(--text-muted)]">
                    No alerts matched your search criteria.
                  </td>
                </tr>
              ) : (
                filteredAlerts.map((alert) => {
                  const isActive = alert.status === "active"
                  return (
                    <tr
                      key={alert.id}
                      className="hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
                      onClick={() => setInspectAlert(alert)}
                    >
                      <td className="py-4 px-4 font-mono font-bold text-white">#{alert.id}</td>
                      <td className="py-4 px-4 font-medium text-white">
                        <div>{alert.user?.name || "Anonymous Citizen"}</div>
                        <div className="text-[10px] text-[var(--text-muted)]">{alert.user?.phone || "No phone"}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white font-medium truncate max-w-xs">{alert.description || "SOS Alert"}</div>
                        <div className="text-[10px] text-[var(--text-muted)] uppercase">{alert.priority} PRIORITY</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-[var(--info)] font-mono text-[11px]">
                          {alert.location?.latitude.toFixed(4)}°, {alert.location?.longitude.toFixed(4)}°
                        </div>
                        <div className="text-[10px] text-[var(--text-muted)] truncate max-w-[150px]">
                          {alert.location?.address || "GPS Lock"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border ${
                            isActive
                              ? "bg-red-500/20 text-[var(--emergency)] border-red-500/30 animate-pulse"
                              : alert.status === "dispatched"
                              ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          }`}
                        >
                          {alert.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-[11px] text-[var(--text-muted)]">
                        {new Date(alert.created_at).toLocaleString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setInspectAlert(alert)
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-card)] text-white text-xs font-semibold border border-[var(--border-subtle)]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident Deep Inspection Drawer Modal */}
      {inspectAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-xl w-full rounded-2xl glass-panel p-6 shadow-2xl border border-[var(--border-subtle)] space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[10px] font-mono text-[var(--primary-light)] font-bold">
                  INCIDENT DETAILS
                </span>
                <h3 className="text-xl font-bold text-white">#{inspectAlert.id} — {inspectAlert.description || "SOS Distress Signal"}</h3>
              </div>
              <button onClick={() => setInspectAlert(null)} className="text-[var(--text-muted)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[var(--text-muted)]">Citizen / Victim:</span>
                <p className="text-white font-semibold text-sm">{inspectAlert.user?.name || "Anonymous Citizen"}</p>
                <p className="text-emerald-400 font-mono">{inspectAlert.user?.phone || "No phone listed"}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
                <span className="text-[var(--text-muted)]">Current Status:</span>
                <p className="text-white font-semibold uppercase text-sm">{inspectAlert.status}</p>
                <p className="text-[var(--text-muted)] font-mono">{inspectAlert.priority.toUpperCase()} PRIORITY</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Exact Latitude / Longitude:</span>
                <span className="text-[var(--info)] font-mono">
                  {inspectAlert.location?.latitude.toFixed(6)}°, {inspectAlert.location?.longitude.toFixed(6)}°
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Approximate Address:</span>
                <span className="text-white">{inspectAlert.location?.address || "GPS Position Logged"}</span>
              </div>
            </div>

            {/* Quick Status Control Buttons */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Update Incident Status:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusChange(inspectAlert, "dispatched")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    inspectAlert.status === "dispatched"
                      ? "bg-[var(--primary)] text-white shadow-md"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  Dispatched
                </button>
                <button
                  onClick={() => handleStatusChange(inspectAlert, "resolved")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    inspectAlert.status === "resolved"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  Resolved
                </button>
                <button
                  onClick={() => handleStatusChange(inspectAlert, "false_alarm")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    inspectAlert.status === "false_alarm"
                      ? "bg-red-900/50 text-red-300 shadow-md"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  False Alarm
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/dashboard/map"
                onClick={() => {
                  setSelectedAlertId(inspectAlert.id)
                  setInspectAlert(null)
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#353FAB] to-[#4E59D4] text-white text-xs font-bold text-center shadow-lg shadow-[var(--primary-glow)] flex items-center justify-center gap-2"
              >
                <Map className="w-4 h-4" />
                Track Live on Vector Map
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
