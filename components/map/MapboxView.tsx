"use client"

import { useEffect, useRef, useState } from "react"
import mapboxgl from "mapbox-gl"
import type { Alert } from "@/types"

const DEFAULT_MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""

interface MapboxViewProps {
  alerts?: Alert[]
  selectedAlertId?: number | null
  onSelectAlert?: (alert: Alert) => void
  center?: [number, number] // [lng, lat]
  zoom?: number
  interactive?: boolean
  showControls?: boolean
  className?: string
  agencyLocation?: { latitude: number; longitude: number; name?: string }
}

export default function MapboxView({
  alerts = [],
  selectedAlertId,
  onSelectAlert,
  center = [32.5599, 15.5007], // Default center [lng, lat]
  zoom = 12,
  interactive = true,
  showControls = true,
  className = "w-full h-full",
  agencyLocation,
}: MapboxViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<{ [id: number]: mapboxgl.Marker }>({})
  const agencyMarkerRef = useRef<mapboxgl.Marker | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return

    mapboxgl.accessToken = DEFAULT_MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: center,
      zoom: zoom,
      interactive: interactive,
      attributionControl: false,
    })

    if (showControls && interactive) {
      map.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right")
      map.addControl(new mapboxgl.FullscreenControl(), "top-right")
    }

    map.on("load", () => {
      setMapLoaded(true)
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  // Update Agency HQ Marker
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || !agencyLocation) return

    if (agencyMarkerRef.current) {
      agencyMarkerRef.current.remove()
    }

    const el = document.createElement("div")
    el.className = "flex items-center justify-center w-9 h-9 rounded-full bg-[#353FAB] border-2 border-white shadow-lg text-white text-xs font-bold"
    el.innerHTML = "🏛️"

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([agencyLocation.longitude, agencyLocation.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="color: #0F141F; font-weight: 600;">${agencyLocation.name || "Agency Command Station"}</div>`
        )
      )
      .addTo(mapRef.current)

    agencyMarkerRef.current = marker
  }, [agencyLocation, mapLoaded])

  // Update Alert Markers & Trails
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return

    const map = mapRef.current

    // Remove obsolete markers
    const currentAlertIds = new Set(alerts.map((a) => a.id))
    Object.keys(markersRef.current).forEach((idStr) => {
      const id = Number(idStr)
      if (!currentAlertIds.has(id)) {
        markersRef.current[id].remove()
        delete markersRef.current[id]
      }
    })

    alerts.forEach((alert) => {
      const lat = alert.location?.latitude
      const lng = alert.location?.longitude
      if (lat === undefined || lng === undefined) return

      const isSelected = alert.id === selectedAlertId
      const isHighPriority = alert.priority === "high" || alert.status === "active"

      let marker = markersRef.current[alert.id]

      if (!marker) {
        const el = document.createElement("div")
        el.className = `cursor-pointer transition-transform duration-200 ${
          isHighPriority ? "animate-sos-pulse" : ""
        }`
        el.style.width = isSelected ? "40px" : "32px"
        el.style.height = isSelected ? "40px" : "32px"
        el.style.borderRadius = "50%"
        el.style.display = "flex"
        el.style.alignItems = "center"
        el.style.justifyContent = "center"
        el.style.border = isSelected ? "3px solid #FFFFFF" : "2px solid rgba(255,255,255,0.8)"
        el.style.backgroundColor = isHighPriority ? "var(--emergency)" : "var(--warning)"
        el.style.color = "#FFFFFF"
        el.style.fontWeight = "bold"
        el.style.fontSize = "14px"
        el.innerHTML = "🚨"

        el.addEventListener("click", () => {
          onSelectAlert?.(alert)
        })

        marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map)

        markersRef.current[alert.id] = marker
      } else {
        marker.setLngLat([lng, lat])
      }
    })

    // Auto-center on selected alert
    if (selectedAlertId) {
      const selected = alerts.find((a) => a.id === selectedAlertId)
      if (selected?.location) {
        map.flyTo({
          center: [selected.location.longitude, selected.location.latitude],
          zoom: 15,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        })
      }
    }
  }, [alerts, selectedAlertId, mapLoaded])

  return (
    <div className={`relative overflow-hidden rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[300px]" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-base)]/80 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3 text-[var(--text-secondary)]">
            <div className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Initializing Mapbox Vector Engine...</span>
          </div>
        </div>
      )}
    </div>
  )
}
