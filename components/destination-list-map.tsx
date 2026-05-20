"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

type Destination = {
  id: number;
  name: string;
  address: string;
  latitude: number | string;
  longitude: number | string;
};

type DestinationListMapProps = {
  destinations: Destination[];
};

export default function DestinationListMap({
  destinations,
}: DestinationListMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerGroupRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapContainerRef.current) return;

    let isMounted = true;

    async function initMap() {
      const L = await import("leaflet");

      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      delete (L.Icon.Default.prototype as any)._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      const map = L.map(mapContainerRef.current).setView(
        [-6.9175, 107.6191],
        11
      );

      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      markerGroupRef.current = L.featureGroup().addTo(map);

      setTimeout(() => {
        map.invalidateSize();
        renderMarkers();
      }, 200);
    }

    async function renderMarkers() {
      const L = await import("leaflet");

      if (!mapRef.current || !markerGroupRef.current) return;

      const map = mapRef.current;
      const markerGroup = markerGroupRef.current;

      markerGroup.clearLayers();

      destinations.forEach((destination) => {
        const lat = Number(destination.latitude);
        const lng = Number(destination.longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        const marker = L.marker([lat, lng]).bindPopup(`
          <strong>${destination.name}</strong><br/>
          <span>${destination.address}</span>
        `);

        markerGroup.addLayer(marker);
      });

      if (markerGroup.getLayers().length > 0) {
        map.fitBounds(markerGroup.getBounds(), {
          padding: [30, 30],
          maxZoom: 14,
        });
      }
    }

    initMap();

    return () => {
      isMounted = false;

      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerGroupRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    async function updateMarkers() {
      const L = await import("leaflet");

      if (!mapRef.current || !markerGroupRef.current) return;

      const map = mapRef.current;
      const markerGroup = markerGroupRef.current;

      markerGroup.clearLayers();

      destinations.forEach((destination) => {
        const lat = Number(destination.latitude);
        const lng = Number(destination.longitude);

        if (isNaN(lat) || isNaN(lng)) return;

        const marker = L.marker([lat, lng]).bindPopup(`
          <strong>${destination.name}</strong><br/>
          <span>${destination.address}</span>
        `);

        markerGroup.addLayer(marker);
      });

      if (markerGroup.getLayers().length > 0) {
        map.fitBounds(markerGroup.getBounds(), {
          padding: [30, 30],
          maxZoom: 14,
        });
      }
    }

    updateMarkers();
  }, [destinations]);

  return (
    <div className="h-[330px] overflow-hidden rounded-lg bg-gray-200">
      <div ref={mapContainerRef} className="h-full w-full" />
    </div>
  );
}