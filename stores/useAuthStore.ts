import { create } from "zustand"
import type { Agency } from "@/types"

interface AuthState {
  token: string | null
  agency: Agency | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, agency: Agency) => void
  logout: () => void
  hydrate: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  agency: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token, agency) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("besafe_agency_token", token)
      localStorage.setItem("besafe_agency_profile", JSON.stringify(agency))
      document.cookie = `besafe_agency_token=${token}; path=/; max-age=2592000; SameSite=Lax`
    }
    set({ token, agency, isAuthenticated: true, isLoading: false })
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("besafe_agency_token")
      localStorage.removeItem("besafe_agency_profile")
      document.cookie = "besafe_agency_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }
    set({ token: null, agency: null, isAuthenticated: false, isLoading: false })
  },

  hydrate: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("besafe_agency_token")
      const agencyRaw = localStorage.getItem("besafe_agency_profile")
      if (token && agencyRaw) {
        try {
          const agency = JSON.parse(agencyRaw) as Agency
          set({ token, agency, isAuthenticated: true, isLoading: false })
          return
        } catch {
          // parse failed
        }
      }
    }
    set({ token: null, agency: null, isAuthenticated: false, isLoading: false })
  },
}))
