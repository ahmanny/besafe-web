export type AlertStatus = "active" | "dispatched" | "resolved" | "false_alarm"
export type AlertPriority = "high" | "medium" | "low"
export type IncidentType = "sos" | "harassment" | "abuse" | "assault" | "accident" | "medical" | "other"

export interface Agency {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  coverage_radius_km?: number
  latitude?: number
  longitude?: number
  is_verified?: boolean
  created_at?: string
}

export interface UserSummary {
  id?: number
  name?: string
  phone?: string
  emergency_contacts?: Array<{
    name: string
    phone: string
    relationship?: string
  }>
}

export interface GPSCoordinate {
  lat: number
  lng: number
  timestamp?: string
  accuracy?: number
  speed?: number
  heading?: number
}

export interface Alert {
  id: number
  user_id: number
  agency_id?: number
  status: AlertStatus
  priority: AlertPriority
  incident_type?: IncidentType
  description?: string
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  user?: UserSummary
  gps_trail?: GPSCoordinate[]
  created_at: string
  updated_at?: string
  resolved_at?: string
  notes?: string
}

export interface EvidenceAttachment {
  id: string
  file_url: string
  file_type: "audio" | "image" | "video" | "document"
  filename: string
  created_at?: string
  duration_seconds?: number
}

export interface SafeChatAnswer {
  question: string
  answer: string
}

export interface Report {
  id: number
  user_id?: number
  agency_id?: number
  category: string
  incident_type?: string
  description: string
  answers?: SafeChatAnswer[]
  status: "pending" | "investigating" | "closed"
  location?: {
    latitude: number
    longitude: number
    address?: string
  }
  attachments?: EvidenceAttachment[]
  created_at: string
  updated_at?: string
}

export interface DashboardStats {
  active_emergencies: number
  total_today: number
  resolved_today: number
  avg_response_minutes: number
  safe_chat_reports_count: number
  dispatch_units_available: number
}

export interface LiveLocationUpdate {
  alert_id: number
  latitude: number
  longitude: number
  timestamp: string
  speed?: number
  heading?: number
}
