"use client";

import { Globe3D, type GlobeMarker } from "@/components/ui/3d-globe";

const MARKER_DOT_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="10" fill="#d4af37" stroke="#ffffff" stroke-width="2"/></svg>';
const MARKER_SRC = `data:image/svg+xml,${encodeURIComponent(MARKER_DOT_SVG)}`;

const WVFA_TOWNS: GlobeMarker[] = [
  { lat: -37.5622, lng: 143.8503, src: MARKER_SRC, label: "Ballarat" },
  { lat: -38.1499, lng: 144.3617, src: MARKER_SRC, label: "Geelong" },
  { lat: -38.3818, lng: 142.4894, src: MARKER_SRC, label: "Warrnambool" },
  { lat: -38.3382, lng: 143.585, src: MARKER_SRC, label: "Colac" },
  { lat: -37.7457, lng: 142.0198, src: MARKER_SRC, label: "Hamilton" },
  { lat: -37.2833, lng: 142.9333, src: MARKER_SRC, label: "Ararat" },
];

export function LandingGlobe() {
  return (
    <Globe3D
      markers={WVFA_TOWNS}
      className="h-[420px] w-full"
      config={{
        radius: 2,
        showAtmosphere: true,
        atmosphereColor: "#d4af37",
        atmosphereIntensity: 0.45,
        autoRotateSpeed: 0.6,
        enableZoom: false,
        enablePan: false,
        markerSize: 0.08,
        backgroundColor: null,
      }}
    />
  );
}
