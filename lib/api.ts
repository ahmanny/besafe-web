import axios from "axios"
import type { Agency, Alert, AlertStatus, DashboardStats, Report } from "@/types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://besafe-server-production.up.railway.app/v1"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
})

// Request interceptor to attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("besafe_agency_token")
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor to handle session expiration
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("besafe_agency_token")
      localStorage.removeItem("besafe_agency_profile")
      if (window.location.pathname.startsWith("/dashboard")) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error)
  }
)

/* API Service Endpoints */

export const authApi = {
  login: async (credentials: { email: string; password?: string; access_code?: string }) => {
    const res = await apiClient.post<{ token: string; agency: Agency }>("/agency/login", credentials)
    return res.data
  },
  register: async (agencyData: Partial<Agency> & { password?: string }) => {
    const res = await apiClient.post<{ token: string; agency: Agency }>("/agency/register", agencyData)
    return res.data
  },
  getProfile: async () => {
    const res = await apiClient.get<Agency>("/agency/profile")
    return res.data
  },
}

export const alertsApi = {
  getAlerts: async (params?: { status?: AlertStatus; priority?: string; limit?: number }) => {
    const res = await apiClient.get<Alert[]>("/alerts", { params })
    return res.data
  },
  getAlertById: async (id: number) => {
    const res = await apiClient.get<Alert>(`/alerts/${id}`)
    return res.data
  },
  updateStatus: async (id: number, status: AlertStatus, notes?: string) => {
    const res = await apiClient.put<Alert>(`/alerts/${id}/status`, { status, notes })
    return res.data
  },
  getLiveCoords: async (alertId: number) => {
    const res = await apiClient.get<{ latitude: number; longitude: number; speed?: number; heading?: number }>(`/alerts/${alertId}/live`)
    return res.data
  }
}

export const reportsApi = {
  getReports: async (params?: { status?: string; category?: string; limit?: number }) => {
    const res = await apiClient.get<Report[]>("/agency/reports", { params })
    return res.data
  },
  getReportById: async (id: number) => {
    const res = await apiClient.get<Report>(`/agency/reports/${id}`)
    return res.data
  },
  updateStatus: async (id: number, status: "pending" | "investigating" | "closed") => {
    const res = await apiClient.patch<Report>(`/agency/reports/${id}/status`, { status })
    return res.data
  }
}

export const statsApi = {
  getStats: async () => {
    const res = await apiClient.get<DashboardStats>("/agency/stats")
    return res.data
  }
}
