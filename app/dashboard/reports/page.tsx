"use client"

import { useState } from "react"
import {
  MessageSquare,
  Search,
  Filter,
  Mic,
  Image as ImageIcon,
  Clock,
  Shield,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  Volume2,
} from "lucide-react"
import { reportsApi } from "@/lib/api"
import type { Report, EvidenceAttachment } from "@/types"

export default function SafeChatReportsPage() {
  const [reports, setReports] = useState<Report[]>([
    {
      id: 501,
      category: "harassment",
      description: "Repeated stalking and intimidation near the downtown library square.",
      status: "investigating",
      answers: [
        { question: "What occurred?", answer: "An unknown individual followed me for 4 blocks shouting threats." },
        { question: "When did this take place?", answer: "Approx 8:45 PM tonight." },
        { question: "Are you in a safe location now?", answer: "Yes, I managed to enter a store." },
      ],
      location: { latitude: 15.5007, longitude: 32.5599, address: "Downtown Library Square" },
      attachments: [
        {
          id: "att-1",
          filename: "incident-voice-evidence.mp3",
          file_type: "audio",
          file_url: "/sounds/sample-evidence.mp3",
          duration_seconds: 18,
        },
      ],
      created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    },
    {
      id: 502,
      category: "abuse-home",
      description: "Domestic dispute disturbance reported anonymously by neighbor.",
      status: "pending",
      answers: [
        { question: "Nature of abuse?", answer: "Aggressive shouting and sounds of physical altercation next door." },
        { question: "Any children present?", answer: "Yes, two young children." },
      ],
      location: { latitude: 15.515, longitude: 32.538, address: "Apt 4B, North Oak Heights" },
      created_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    },
    {
      id: 503,
      category: "unsafe-ride",
      description: "Rideshare driver deviated from highway route onto unlit unpaved roads.",
      status: "closed",
      answers: [
        { question: "Vehicle details?", answer: "Silver Toyota Sedan, License #TX-9821" },
      ],
      location: { latitude: 15.485, longitude: 32.572, address: "Bypass Expressway Exit 9" },
      created_at: new Date(Date.now() - 1000 * 60 * 340).toISOString(),
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toString().includes(searchQuery)

    const matchesCategory = categoryFilter === "all" || r.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleStatusChange = async (report: Report, newStatus: Report["status"]) => {
    const updated = { ...report, status: newStatus }
    setReports(reports.map((r) => (r.id === report.id ? updated : r)))
    if (selectedReport?.id === report.id) setSelectedReport(updated)
    try {
      await reportsApi.updateStatus(report.id, newStatus)
    } catch {
      // local update kept
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Safe Chat & Evidence Vault</h1>
          <p className="text-sm text-[var(--text-secondary)]">Review anonymous guided citizen reports, audio recordings, and incident evidence</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl glass-panel border border-[var(--border-subtle)] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report descriptions, categories, or keywords..."
            className="block w-full pl-10 pr-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--primary)]"
        >
          <option value="all">All Categories</option>
          <option value="harassment">Harassment</option>
          <option value="abuse-home">Domestic Abuse</option>
          <option value="unsafe-ride">Unsafe Rides</option>
          <option value="threats">Threats</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Reports Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReport(report)}
            className="p-5 rounded-2xl glass-panel border border-[var(--border-subtle)] hover:border-[var(--border-hover)] cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[var(--primary)]/20 text-[#A5B4FC] uppercase border border-[var(--primary)]/30">
                  {report.category}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    report.status === "pending"
                      ? "bg-amber-500/20 text-amber-400"
                      : report.status === "investigating"
                      ? "bg-[var(--info)]/20 text-[var(--info)]"
                      : "bg-emerald-500/20 text-emerald-400"
                  }`}
                >
                  {report.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-[#8B93FF] transition-colors line-clamp-2">
                {report.description}
              </h4>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">
                {report.answers?.[0]?.answer || "Structured transcript attached."}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)]">
              <div className="flex items-center space-x-2">
                {report.attachments && report.attachments.length > 0 && (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                    <Mic className="w-3.5 h-3.5" /> Audio Evidence
                  </span>
                )}
              </div>
              <span>
                {new Date(report.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Evidence Vault Inspection Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-2xl w-full rounded-2xl glass-panel p-6 shadow-2xl border border-[var(--border-subtle)] space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <span className="text-[10px] font-mono text-[var(--primary-light)] font-bold">
                  SAFE CHAT EVIDENCE VAULT #{selectedReport.id}
                </span>
                <h3 className="text-xl font-bold text-white capitalize">{selectedReport.category.replace("-", " ")} Report</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} className="text-[var(--text-muted)] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="p-4 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1">
              <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                Citizen Initial Summary
              </span>
              <p className="text-sm text-white">{selectedReport.description}</p>
            </div>

            {/* Question and Answer Transcripts */}
            {selectedReport.answers && selectedReport.answers.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-light)]">
                  Guided Questionnaire Transcripts
                </span>
                <div className="space-y-2">
                  {selectedReport.answers.map((ans, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-[var(--bg-base)] border border-[var(--border-subtle)] space-y-1 text-xs">
                      <span className="text-[var(--text-muted)] font-medium">{ans.question}</span>
                      <p className="text-white font-semibold">{ans.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audio & File Evidence */}
            {selectedReport.attachments && selectedReport.attachments.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Attached Audio Evidence
                </span>
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 space-y-3">
                  <div className="flex items-center justify-between text-xs text-white font-semibold">
                    <span className="flex items-center gap-2">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      Voice Recording ({selectedReport.attachments[0].filename})
                    </span>
                    <span className="text-emerald-400 font-mono">
                      {selectedReport.attachments[0].duration_seconds || 18}s
                    </span>
                  </div>
                  <audio controls className="w-full h-8 rounded-lg" src={selectedReport.attachments[0].file_url}>
                    Your browser does not support audio playback.
                  </audio>
                </div>
              </div>
            )}

            {/* Status Update Controls */}
            <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Case Status:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleStatusChange(selectedReport, "pending")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedReport.status === "pending"
                      ? "bg-amber-500 text-white shadow-md"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => handleStatusChange(selectedReport, "investigating")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedReport.status === "investigating"
                      ? "bg-[var(--info)] text-white shadow-md"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  Investigating
                </button>
                <button
                  onClick={() => handleStatusChange(selectedReport, "closed")}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedReport.status === "closed"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-white"
                  }`}
                >
                  Closed / Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
