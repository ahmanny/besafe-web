import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useAgencyAuthStore } from "@/lib/store/agency-auth-store"
import { setCookie, destroyCookie } from "nookies"
import type { AgencyLoginFormData, AgencyRegisterFormData } from "@/lib/validations/auth.schema"
import { agencyAuthService } from "@/lib/api/services/auth.service"
import { useRouter } from "next/navigation"
import type { AgencyProfile } from "@/types/auth"

export function useAgencyGetMe(options = {}) {
  const setAgency = useAgencyAuthStore((s) => s.setAgency)
  const clearAuth = useAgencyAuthStore((s) => s.clearAuth)

  return useQuery({
    queryKey: ["agency", "me"],
    queryFn: async () => {
      try {
        const profile = await agencyAuthService.me()
        if (!profile) {
          throw new Error("No agency data found in response")
        }
        setAgency(profile)
        return profile
      } catch (error: any) {
        if (error.response?.status === 401) {
          clearAuth()
          destroyCookie(null, "agencyAccessToken", { path: "/" })
          destroyCookie(null, "agencyRefreshToken", { path: "/" })
        }
        throw error
      }
    },
    staleTime: 60 * 1000,
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 401) return false
      return failureCount < 2
    },
    refetchOnWindowFocus: false,
    ...options,
  })
}

export function useAgencyLogin() {
  const setAuth = useAgencyAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AgencyLoginFormData) => {
      const response = await agencyAuthService.login(payload)
      if (!response?.token) {
        throw new Error("Invalid response structure: missing token")
      }
      return response
    },
    onSuccess: (data) => {
      const token = data.token
      const agencyProfile: AgencyProfile = {
        id: String(data.agency?.id || data.user?.id || ""),
        name: data.agency?.name || data.user?.name || "Safety Agency",
        email: data.agency?.email || data.user?.email || "",
        phone_number: data.agency?.phone_number || data.user?.phone_number || "",
        region: data.agency?.region || data.user?.region || "",
        role: data.agency?.role || data.user?.role || "AGENCY_ADMIN",
        location: data.agency?.location || data.user?.location,
        coverage_radius_km: data.agency?.coverage_radius_km || 25,
        is_verified: true,
      }

      setCookie(null, "agencyAccessToken", token, {
        maxAge: 86400,
        path: "/",
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      })

      if (data.refreshToken) {
        setCookie(null, "agencyRefreshToken", data.refreshToken, {
          maxAge: 2592000,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
        })
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("besafe_agency_token", token)
        localStorage.setItem("besafe_agency_profile", JSON.stringify(agencyProfile))
      }

      setAuth(token, agencyProfile)
      queryClient.invalidateQueries({ queryKey: ["agency", "me"] })
    },
  })
}

export function useAgencyRegister() {
  return useMutation({
    mutationFn: async (payload: AgencyRegisterFormData) => {
      const response = await agencyAuthService.register(payload)
      return response
    },
  })
}

export function useChangeInitialPassword() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: { new_password: string; staff_id?: string; email?: string }) => {
      return await agencyAuthService.changeInitialPassword(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agency", "me"] })
    },
  })
}

export function useAgencyLogout() {
  const clearAuth = useAgencyAuthStore((s) => s.clearAuth)
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async () => {
      await agencyAuthService.logout()
    },
    onSettled: () => {
      clearAuth()
      destroyCookie(null, "agencyAccessToken", { path: "/" })
      destroyCookie(null, "agencyRefreshToken", { path: "/" })
      if (typeof window !== "undefined") {
        localStorage.removeItem("besafe_agency_token")
        localStorage.removeItem("besafe_agency_profile")
      }
      queryClient.clear()
      router.push("/login")
    },
  })
}

