"use client"

import { useEffect, useRef } from "react"
import { io, Socket } from "socket.io-client"
import { useAuthStore } from "@/stores/useAuthStore"
import { useAlertStore } from "@/stores/useAlertStore"
import type { Alert, LiveLocationUpdate } from "@/types"

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://besafe-server-production.up.railway.app"

let globalSocket: Socket | null = null

export function useSocket() {
  const { agency, token } = useAuthStore()
  const { addAlert, updateLocation, updateAlert, soundAlertsEnabled } = useAlertStore()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/emergency-alert.mp3")
    }
  }, [])

  const playChime = () => {
    if (soundAlertsEnabled && audioRef.current) {
      audioRef.current.play().catch(() => {
        // audio playback was prevented by browser autoplay policy
      })
    }
  }

  useEffect(() => {
    if (!agency?.id || !token) {
      if (globalSocket) {
        globalSocket.disconnect()
        globalSocket = null
      }
      return
    }

    if (!globalSocket) {
      globalSocket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
        auth: { token },
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      })
    }

    const socket = globalSocket

    socket.on("connect", () => {
      console.log("🟢 [Socket.IO] Connected to BeSafe Emergency Dispatcher")
      socket.emit("join_agency", { agency_id: agency.id })
    })

    socket.on("new_alert", (alert: Alert) => {
      console.log("🚨 [Socket.IO] New Incoming Emergency Alert:", alert)
      addAlert(alert)
      playChime()
    })

    socket.on("location_update", (update: LiveLocationUpdate) => {
      updateLocation(update)
    })

    socket.on("alert_status_changed", (updatedAlert: Alert) => {
      updateAlert(updatedAlert)
    })

    socket.on("disconnect", (reason) => {
      console.warn("🔴 [Socket.IO] Disconnected:", reason)
    })

    return () => {
      socket.off("connect")
      socket.off("new_alert")
      socket.off("location_update")
      socket.off("alert_status_changed")
      socket.off("disconnect")
    }
  }, [agency?.id, token])

  return { socket: globalSocket }
}
