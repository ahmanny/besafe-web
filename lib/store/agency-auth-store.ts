import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AgencyProfile, AgencyRole } from "@/types/auth"

interface AgencyAuthStore {
  agency: AgencyProfile | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (token: string, agency: AgencyProfile) => void
  setAgency: (agency: AgencyProfile) => void
  clearAuth: () => void
  isRole: (role: AgencyRole) => boolean
  hasAnyRole: (roles: AgencyRole[]) => boolean
}

export const useAgencyAuthStore = create<AgencyAuthStore>()(
  persist(
    (set, get) => ({
      agency: null,
      token: null,
      isAuthenticated: false,

      setAuth: (token, agency) => {
        set({ token, agency, isAuthenticated: true })
      },

      setAgency: (agency) => {
        set({ agency })
      },

      clearAuth: () => {
        set({ agency: null, token: null, isAuthenticated: false })
      },

      isRole: (role) => {
        const agency = get().agency
        if (!agency) return false
        return agency.role === role
      },

      hasAnyRole: (roles) => {
        const agency = get().agency
        if (!agency) return false
        return roles.includes(agency.role)
      },
    }),
    {
      name: "besafe-agency-auth",
    }
  )
)
