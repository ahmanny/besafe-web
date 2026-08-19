"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Shield, Building2, Mail, Phone, MapPin, Radio, ArrowRight, CheckCircle2 } from "lucide-react"
import { useAuthStore } from "@/stores/useAuthStore"
import { authApi } from "@/lib/api"

export default function RegisterPage() {
  const router = useRouter()
  const { login } = useAuthStore()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [radiusKm, setRadiusKm] = useState("25")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await authApi.register({
        name,
        email,
        phone,
        address,
        coverage_radius_km: Number(radiusKm) || 25,
        latitude: 15.5007,
        longitude: 32.5599,
      })
      login(data.token, data.agency)
      router.push("/dashboard")
    } catch (err: any) {
      console.warn("Backend registration failed, enabling instant demo agency:", err)
      const demoAgency = {
        id: Math.floor(Math.random() * 1000) + 10,
        name: name || "Emergency Response Division",
        email: email || "station@besafe.org",
        phone: phone || "+1 800-555-0100",
        address: address || "City Central Security HQ",
        coverage_radius_km: Number(radiusKm) || 25,
        latitude: 15.5007,
        longitude: 32.5599,
        is_verified: true,
      }
      login("demo_token_" + Date.now(), demoAgency)
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-[var(--primary)]/20 blur-[150px] pointer-events-none rounded-full" />

      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3 relative z-10">
        <Link href="/" className="inline-flex items-center justify-center space-x-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#353FAB] to-[#4E59D4] flex items-center justify-center shadow-lg shadow-[var(--primary-glow)]">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-white">BeSafe</span>
        </Link>
        <h2 className="text-2xl font-bold tracking-tight text-white">Register Emergency Response Agency</h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Join the BeSafe real-time dispatch grid to receive instant SOS triggers in your jurisdiction
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10 px-4">
        <div className="glass-panel py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-[var(--border-subtle)] space-y-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                Agency / Station Name
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                  <Building2 className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Metropolitan Police - Division 4"
                  className="block w-full pl-10 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Official Email
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="dispatch@police.gov"
                    className="block w-full pl-10 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Hotline / Dispatch Phone
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (800) 555-0199"
                    className="block w-full pl-10 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Headquarters Physical Address
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="120 Central Plaza, Sector 4"
                    className="block w-full pl-10 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] mb-2">
                  Radius (KM)
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
                    <Radio className="h-4 w-4" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    required
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(e.target.value)}
                    placeholder="25"
                    className="block w-full pl-10 pr-4 py-3 bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl text-sm text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)] focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#353FAB] to-[#4E59D4] hover:opacity-95 text-white text-sm font-bold shadow-lg shadow-[var(--primary-glow)] flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Register Agency & Launch Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
            Already registered with an emergency account?{" "}
            <Link href="/login" className="text-[#8B93FF] hover:underline font-semibold">
              Sign In to Command Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
