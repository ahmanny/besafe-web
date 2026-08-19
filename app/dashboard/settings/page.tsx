"use client"

import { useState } from "react"
import {
  Settings,
  Building2,
  Phone,
  Mail,
  MapPin,
  Radio,
  Bell,
  Save,
  CheckCircle2,
  Shield,
} from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"

export default function SettingsPage() {
  const { agency, login, token } = useAuthStore()

  const [name, setName] = useState(agency?.name || "Central Metropolitan Safety Command")
  const [email, setEmail] = useState(agency?.email || "dispatch@besafe.org")
  const [phone, setPhone] = useState(agency?.phone || "+1 (800) 555-0199")
  const [radiusKm, setRadiusKm] = useState(agency?.coverage_radius_km?.toString() || "25")
  const [address, setAddress] = useState(agency?.address || "120 Central Plaza, Sector 4")
  const [latitude, setLatitude] = useState(agency?.latitude?.toString() || "15.5007")
  const [longitude, setLongitude] = useState(agency?.longitude?.toString() || "32.5599")
  const [webhookUrl, setWebhookUrl] = useState("https://dispatch-api.police.gov/webhooks/besafe")
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (agency && token) {
      const updated = {
        ...agency,
        name,
        email,
        phone,
        coverage_radius_km: Number(radiusKm) || 25,
        address,
        latitude: Number(latitude) || 15.5007,
        longitude: Number(longitude) || 32.5599,
      }
      login(token, updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[var(--border-subtle)]">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Agency Station Settings</h1>
          <p className="text-sm text-[var(--text-secondary)]">Manage dispatch radius, headquarters geocodes, and webhook integrations</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-400 font-semibold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Station profile & coverage configurations saved successfully.</span>
          </div>
        )}

        {/* General Agency Profile */}
        <div className="p-6 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[var(--border-subtle)]">
            <Building2 className="w-4 h-4 text-[var(--primary-light)]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Station Identity</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                Official Agency Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                  Official Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                  Dispatch Hotline
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Geofence & Dispatch Radius */}
        <div className="p-6 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[var(--border-subtle)]">
            <Radio className="w-4 h-4 text-[var(--emergency)]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Jurisdiction & Geofencing</h3>
          </div>

          <div className="space-y-4">
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                  Coverage Radius (km)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={radiusKm}
                  onChange={(e) => setRadiusKm(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                  Station Latitude
                </label>
                <input
                  type="text"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                  Station Longitude
                </label>
                <input
                  type="text"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[var(--primary)]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
                Headquarters Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
          </div>
        </div>

        {/* Integration Webhooks */}
        <div className="p-6 rounded-2xl glass-panel border border-[var(--border-subtle)] space-y-4">
          <div className="flex items-center space-x-2 pb-2 border-b border-[var(--border-subtle)]">
            <Bell className="w-4 h-4 text-[#8B93FF]" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Automated Dispatch Webhook</h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase mb-1.5">
              Incident Broadcast Webhook URL
            </label>
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-cad-system.gov/webhook"
              className="w-full px-4 py-2.5 bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[var(--primary)]"
            />
            <p className="text-[11px] text-[var(--text-muted)] mt-1.5">
              BeSafe will POST real-time JSON alerts to this endpoint whenever high-priority emergencies trigger in your sector.
            </p>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#353FAB] to-[#4E59D4] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-[var(--primary-glow)] flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            Save Station Settings
          </button>
        </div>
      </form>
    </div>
  )
}
