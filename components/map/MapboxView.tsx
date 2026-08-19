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

export default function MapboxView({
  alerts = [],
  selectedAlertId,
  onSelectAlert,
  center = [32.5599, 15.5007],
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

  // 1. Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken = DEFAULT_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: STYLE_URLS[mapStyle] || STYLE_URLS.dark,
      center: center,
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

  // 3. Render Markers & Vector Trail
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Render Agency HQ Base Marker
    if (agencyLocation) {
      const lat = agencyLocation.latitude;
      const lng = agencyLocation.longitude;

      if (!agencyMarkerRef.current && lat && lng) {
        const hqEl = document.createElement("div");
        hqEl.className = "flex items-center justify-center cursor-pointer";
        hqEl.style.width = "38px";
        hqEl.style.height = "38px";
        hqEl.style.borderRadius = "12px";
        hqEl.style.backgroundColor = "#353FAB";
        hqEl.style.border = "2px solid #FFFFFF";
        hqEl.style.color = "#FFFFFF";
        hqEl.style.fontSize = "18px";
        hqEl.style.boxShadow = "0 8px 16px rgba(53, 63, 171, 0.4)";
        hqEl.innerHTML = "🏛️";
        hqEl.title = agencyLocation.name || "Station Headquarters";

        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div style="color: #0F172A; padding: 6px; font-family: sans-serif;">
            <div style="font-weight: bold; font-size: 12px;">${agencyLocation.name || "HQ Base"}</div>
            <div style="font-size: 10px; color: #64748B;">Station Headquarters & Dispatch</div>
          </div>
        `);

        agencyMarkerRef.current = new mapboxgl.Marker({ element: hqEl })
          .setLngLat([lng, lat])
          .setPopup(popup)
          .addTo(map);
      }
    }

    // Render Emergency Distress Markers
    alerts.forEach((alert) => {
      const lat = alert.location?.latitude || alert.location?.lat;
      const lng = alert.location?.longitude || alert.location?.lng;
      if (!lat || !lng) return;

      const isSelected = alert.id === selectedAlertId;
      const isHighPriority = alert.priority === "high" || alert.status === "active";

      let marker = markersRef.current[String(alert.id)];

      if (!marker) {
        const el = document.createElement("div");
        el.className = `cursor-pointer transition-transform duration-200 hover:scale-110 ${
          isHighPriority ? "animate-pulse" : ""
        }`;
        el.style.width = isSelected ? "40px" : "32px";
        el.style.height = isSelected ? "40px" : "32px";
        el.style.borderRadius = "50%";
        el.style.display = "flex";
        el.style.alignItems = "center";
        el.style.justifyContent = "center";
        el.style.border = isSelected ? "3px solid #FFFFFF" : "2px solid rgba(255,255,255,0.8)";
        el.style.backgroundColor = isHighPriority ? "#EF4444" : "#F59E0B";
        el.style.color = "#FFFFFF";
        el.style.fontWeight = "bold";
        el.style.fontSize = "14px";
        el.style.boxShadow = isHighPriority
          ? "0 0 16px rgba(239, 68, 68, 0.6)"
          : "0 0 8px rgba(245, 158, 11, 0.4)";
        el.innerHTML = "🚨";

        el.addEventListener("click", () => {
          onSelectAlert?.(alert);
        });

        marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .addTo(map);

        markersRef.current[String(alert.id)] = marker;
      } else {
        marker.setLngLat([lng, lat]);
      }
    });

    // Auto-center and Vector Polyline Trail on selected alert
    if (selectedAlertId) {
      const selected = alerts.find((a) => a.id === selectedAlertId);
      const lat = selected?.location?.latitude || selected?.location?.lat;
      const lng = selected?.location?.longitude || selected?.location?.lng;

      if (lat && lng) {
        map.flyTo({
          center: [lng, lat],
          zoom: 15,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        });

        // Dynamic GPS Polyline Trail
        if (selected?.gps_trail && selected.gps_trail.length > 1) {
          const coords = selected.gps_trail.map((p) => [p.lng, p.lat]);
          const geojson: any = {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          };

          const source = map.getSource("vector-trail") as mapboxgl.GeoJSONSource;
          if (source) {
            source.setData(geojson);
          } else {
            map.addSource("vector-trail", {
              type: "geojson",
              data: geojson,
            });
            map.addLayer({
              id: "vector-trail-line",
              type: "line",
              source: "vector-trail",
              layout: {
                "line-join": "round",
                "line-cap": "round",
              },
              paint: {
                "line-color": "#EF4444",
                "line-width": 4,
                "line-opacity": 0.85,
                "line-dasharray": [2, 1],
              },
            });
          }
        }
      }
    }
  }, [alerts, selectedAlertId, mapLoaded, agencyLocation]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-card border border-border/80 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="flex items-center space-x-3 text-muted-foreground">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Initializing Vector Radar Map...</span>
          </div>
        </div>
      )}
    </div>
  );
}
