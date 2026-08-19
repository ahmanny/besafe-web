"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { Alert } from "@/types";

const DEFAULT_MAPBOX_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

interface MapboxViewProps {
  alerts?: Alert[];
  selectedAlertId?: number | string | null;
  onSelectAlert?: (alert: Alert) => void;
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  mapStyle?: "dark" | "satellite" | "streets";
  interactive?: boolean;
  showControls?: boolean;
  className?: string;
  agencyLocation?: { latitude: number; longitude: number; name?: string };
}

const STYLE_URLS = {
  dark: "mapbox://styles/mapbox/dark-v11",
  satellite: "mapbox://styles/mapbox/satellite-streets-v12",
  streets: "mapbox://styles/mapbox/streets-v12",
};

export function getAlertCoords(alert: Alert | null | undefined): { lat: number; lng: number } | null {
  if (!alert) return null;
  const lat = alert.gps_lat ?? alert.location?.latitude ?? alert.location?.lat;
  const lng = alert.gps_lng ?? alert.location?.longitude ?? alert.location?.lng;
  if (lat === null || lat === undefined || lng === null || lng === undefined) return null;
  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (isNaN(parsedLat) || isNaN(parsedLng)) return null;
  return { lat: parsedLat, lng: parsedLng };
}

export default function MapboxView({
  alerts = [],
  selectedAlertId,
  onSelectAlert,
  center,
  zoom = 12,
  mapStyle = "dark",
  interactive = true,
  showControls = true,
  className = "w-full h-full",
  agencyLocation,
}: MapboxViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: mapboxgl.Marker }>({});
  const agencyMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Compute Initial Center: Prioritize passed center, then agencyLocation, then fallback
  const initialCenter: [number, number] = center || (
    agencyLocation && agencyLocation.longitude && agencyLocation.latitude
      ? [agencyLocation.longitude, agencyLocation.latitude]
      : [7.515401, 8.92997] // Minna HQ Base
  );

  // 1. Initialize Map Canvas
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = DEFAULT_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_URLS[mapStyle] || STYLE_URLS.dark,
      center: initialCenter,
      zoom: zoom,
      interactive: interactive,
      attributionControl: false,
    });

    if (showControls && interactive) {
      map.addControl(
        new mapboxgl.NavigationControl({ showCompass: true }),
        "top-right"
      );
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");
    }

    map.on("load", () => {
      setMapLoaded(true);
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // 2. Handle Map Style Switcher
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const styleUrl = STYLE_URLS[mapStyle] || STYLE_URLS.dark;
    mapRef.current.setStyle(styleUrl);
  }, [mapStyle]);

  // 3. Render Station Headquarters Base Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !agencyLocation) return;

    const lat = agencyLocation.latitude;
    const lng = agencyLocation.longitude;
    if (!lat || !lng) return;

    if (agencyMarkerRef.current) {
      agencyMarkerRef.current.remove();
    }

    const hqEl = document.createElement("div");
    hqEl.className = "flex items-center justify-center cursor-pointer select-none transition-transform hover:scale-110";
    hqEl.style.width = "40px";
    hqEl.style.height = "40px";
    hqEl.style.borderRadius = "14px";
    hqEl.style.backgroundColor = "#353FAB";
    hqEl.style.border = "2.5px solid #FFFFFF";
    hqEl.style.boxShadow = "0 8px 20px rgba(53, 63, 171, 0.6)";
    hqEl.style.display = "flex";
    hqEl.style.alignItems = "center";
    hqEl.style.justifyContent = "center";
    hqEl.style.fontSize = "20px";
    hqEl.innerHTML = "🏛️";
    hqEl.title = agencyLocation.name || "Station Headquarters";

    const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
      <div style="color: #0F172A; padding: 6px 10px; font-family: sans-serif;">
        <div style="font-weight: 800; font-size: 13px; color: #1E293B;">${agencyLocation.name || "Station HQ"}</div>
        <div style="font-size: 11px; color: #64748B; margin-top: 2px;">Station Command Headquarters & Dispatch</div>
      </div>
    `);

    agencyMarkerRef.current = new mapboxgl.Marker({ element: hqEl })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);
  }, [mapLoaded, agencyLocation]);

  // 4. Render Emergency Distress Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Clear removed markers
    const currentAlertIds = new Set(alerts.map((a) => String(a.id)));
    Object.keys(markersRef.current).forEach((id) => {
      if (!currentAlertIds.has(id)) {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      }
    });

    // Add or update markers
    alerts.forEach((alert) => {
      const coords = getAlertCoords(alert);
      if (!coords) return;

      const isSelected = String(alert.id) === String(selectedAlertId);
      const isResolved = alert.status === "resolved";
      const isAcknowledged = alert.status === "acknowledged";

      let marker = markersRef.current[String(alert.id)];

      if (!marker) {
        const el = document.createElement("div");
        el.className = "cursor-pointer select-none transition-transform duration-200 hover:scale-125";
        el.style.width = isSelected ? "36px" : "28px";
        el.style.height = isSelected ? "36px" : "28px";
        el.style.borderRadius = "50%";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.color = "#FFFFFF";
        el.style.fontWeight = "bold";
        el.style.fontSize = isSelected ? "14px" : "11px";
        el.style.border = isSelected ? "3px solid #FFFFFF" : "2px solid #FFFFFF";

        const bg = isResolved
          ? "#10B981"
          : isAcknowledged
          ? "#F59E0B"
          : "#EF4444";
        el.style.backgroundColor = bg;
        el.style.boxShadow = isSelected
          ? `0 0 20px ${bg}, 0 0 40px ${bg}`
          : `0 4px 12px ${bg}80`;

        el.innerHTML = isResolved ? "✓" : "SOS";

        el.addEventListener("click", () => {
          if (onSelectAlert) onSelectAlert(alert);
        });

        const callerName = alert.user?.name || alert.user_name || "Citizen SOS";
        const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(`
          <div style="color: #0F172A; padding: 6px 10px; font-family: sans-serif;">
            <div style="font-weight: bold; font-size: 12px;">🚨 ${callerName}</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">${alert.transcribed_text || alert.description || "Distress Beacon Active"}</div>
            <div style="font-size: 10px; font-weight: 700; color: ${bg}; margin-top: 4px; text-transform: uppercase;">Status: ${alert.status}</div>
          </div>
        `);

        marker = new mapboxgl.Marker({ element: el })
          .setLngLat([coords.lng, coords.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current[String(alert.id)] = marker;
      } else {
        // Update marker style on state change
        const el = marker.getElement();
        const bg = isResolved
          ? "#10B981"
          : isAcknowledged
          ? "#F59E0B"
          : "#EF4444";
        el.style.width = isSelected ? "36px" : "28px";
        el.style.height = isSelected ? "36px" : "28px";
        el.style.fontSize = isSelected ? "14px" : "11px";
        el.style.border = isSelected ? "3px solid #FFFFFF" : "2px solid #FFFFFF";
        el.style.backgroundColor = bg;
        el.style.boxShadow = isSelected
          ? `0 0 20px ${bg}, 0 0 40px ${bg}`
          : `0 4px 12px ${bg}80`;
        marker.setLngLat([coords.lng, coords.lat]);
      }
    });
  }, [alerts, selectedAlertId, mapLoaded]);

  // 5. Reactivity: Camera Focus & FlyTo when an alert is selected
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded || !selectedAlertId) return;

    const selected = alerts.find((a) => String(a.id) === String(selectedAlertId));
    const coords = getAlertCoords(selected);

    if (coords) {
      map.flyTo({
        center: [coords.lng, coords.lat],
        zoom: 15,
        essential: true,
        duration: 1000,
      });

      const marker = markersRef.current[String(selectedAlertId)];
      if (marker) {
        const popup = marker.getPopup();
        if (popup && !popup.isOpen()) {
          marker.togglePopup();
        }
      }
    }
  }, [selectedAlertId, mapLoaded, alerts]);


  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
}
