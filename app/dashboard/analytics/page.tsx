"use client"

import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Calendar,
  Download,
} from "lucide-react"

export default function AnalyticsPage() {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const weeklyIncidents = [14, 22, 18, 29, 45, 52, 38]
  const maxWeekly = Math.max(...weeklyIncidents)

  const categories = [
    { label: "Voice Threat SOS", count: 48, percentage: "42%", color: "bg-[var(--emergency)]" },
    { label: "Harassment Reports", count: 28, percentage: "25%", color: "bg-[var(--primary)]" },
    { label: "Domestic Disturbance", count: 21, percentage: "18%", color: "bg-amber-500" },
    { label: "Unsafe Ride Distress", count: 17, percentage: "15%", color: "bg-[var(--info)]" },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Agency Response & Safety Analytics</h1>
          <p className="text-sm text-[var(--text-secondary)]">
            Incident distribution patterns, dispatch response efficiency, and sector risk trends
          </p>
        </div>

        <button className="px-4 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-card-hover)] text-xs font-semibold text-white border border-[var(--border-subtle)] flex items-center gap-2 transition-all">
          <Download className="w-4 h-4 text-[var(--primary-light)]" />
          Export Incident CSV
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Weekly Total</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">218</div>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">94.2% resolution rate</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Median Arrival Time</span>
            <Clock className="w-4 h-4 text-[var(--primary-light)]" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">2.4 <span className="text-base text-[var(--text-muted)] font-normal">min</span></div>
          <p className="text-xs text-emerald-400 mt-1 font-semibold">-18s faster than city avg</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">False Alarm Rate</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">4.8%</div>
          <p className="text-xs text-[var(--text-muted)] mt-1">Filtered by 3s countdown</p>
        </div>

        <div className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase">Evidence Vaulted</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white">86</div>
          <p className="text-xs text-[var(--text-muted)] mt-1">Audio & photo files secured</p>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Weekly Incident Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Weekly Emergency Volume</h3>
              <p className="text-xs text-[var(--text-muted)]">Incidents recorded over the past 7 days</p>
            </div>
            <span className="text-xs font-mono text-[var(--primary-light)]">Peak: Saturday Night</span>
          </div>

          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2">
            {weeklyIncidents.map((val, idx) => {
              const heightPct = Math.round((val / maxWeekly) * 100)
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:text-white transition-colors">
                    {val}
                  </span>
                  <div className="w-full bg-[var(--bg-base)] rounded-xl h-44 flex items-end p-1">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-lg bg-gradient-to-t from-[#353FAB] to-[#4E59D4] group-hover:from-[var(--emergency)] group-hover:to-red-400 transition-all duration-300 shadow-md"
                    />
                  </div>
                  <span className="text-xs font-medium text-[var(--text-secondary)]">{daysOfWeek[idx]}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-6">
          <div>
            <h3 className="text-base font-bold text-white">Incident Category Distribution</h3>
            <p className="text-xs text-[var(--text-muted)]">Classification by trigger source</p>
          </div>

          <div className="space-y-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-white font-medium">{cat.label}</span>
                  <span className="text-[var(--text-muted)] font-mono">
                    {cat.count} ({cat.percentage})
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-base)] overflow-hidden">
                  <div
                    style={{ width: cat.percentage }}
                    className={`h-full rounded-full ${cat.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
