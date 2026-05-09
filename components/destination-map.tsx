"use client";

import { useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";

import type {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
} from "geojson";

type DestinationMapProps = {
  latitude: string;
  longitude: string;
  address: string;
  onLocationChange: (lat: string, lng: string) => void;
  onAddressChange: (address: string) => void;
  onAreaValidChange: (isValid: boolean) => void;
};

export default function DestinationMap({
  latitude,
  longitude,
  address,
  onLocationChange,
  onAddressChange,
  onAreaValidChange,
}: DestinationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const bandungRayaGeoJsonRef = useRef<FeatureCollection | null>(null);

  function getRegionName(feature: Feature) {
    const props = feature.properties || {};

    return String(
      props.KABKOT ||
        props.KAB_KOTA ||
        props.WADMKK ||
        props.wadmkk ||
        props.NAME_2 ||
        props.name_2 ||
        props.nama ||
        props.NAMA ||
        ""
    )
      .toUpperCase()
      .trim();
  }

  function isBandungRayaRegion(feature: Feature) {
    const allowedRegions = [
      "BANDUNG",
      "BANDUNG BARAT",
      "KOTA BANDUNG",
      "KOTA CIMAHI",
    ];

    return allowedRegions.includes(getRegionName(feature));
  }

  function isPointInsideBandungRaya(lat: number, lng: number) {
    const geoJson = bandungRayaGeoJsonRef.current;

    if (!geoJson || geoJson.features.length === 0) return true;

    const point = turf.point([lng, lat]);

    return geoJson.features.some((feature) => {
      try {
        if (
          feature.geometry.type !== "Polygon" &&
          feature.geometry.type !== "MultiPolygon"
        ) {
          return false;
        }

        return turf.booleanPointInPolygon(
          point,
          feature as Feature<Polygon | MultiPolygon>
        );
      } catch {
        return false;
      }
    });
  }

  function setMarkerAndInputs(lat: number, lng: number) {
    const leaflet = leafletRef.current;

    onLocationChange(lat.toFixed(7), lng.toFixed(7));

    if (!mapRef.current || !leaflet) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else {
      markerRef.current = leaflet.marker([lat, lng]).addTo(mapRef.current);
    }

    mapRef.current.setView([lat, lng], 14);
    onAreaValidChange(isPointInsideBandungRaya(lat, lng));
  }

  async function getAddressFromLatLng(lat: number, lng: number) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );

      const data = await response.json();

      if (data?.display_name) {
        onAddressChange(data.display_name);
      }
    } catch (error) {
      console.error("Reverse geocoding gagal:", error);
    }
  }

  async function searchAddress() {
    const trimmedAddress = address.trim();

    if (!trimmedAddress) {
      alert("Isi alamat terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          trimmedAddress
        )}`
      );

      const data = await response.json();

      if (!data || data.length === 0) {
        alert("Alamat tidak ditemukan.");
        return;
      }

      const result = data[0];
      const lat = Number(result.lat);
      const lng = Number(result.lon);

      onAddressChange(result.display_name);
      setMarkerAndInputs(lat, lng);
    } catch {
      alert("Terjadi kesalahan saat mencari alamat.");
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapContainerRef.current) return;
    if (mapRef.current) return;

    async function initMap() {
      const leaflet = await import("leaflet");
      leafletRef.current = leaflet;

      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;

      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      if (!mapContainerRef.current) return;

      const map = leaflet.map(mapContainerRef.current).setView(
        [-6.9175, 107.6191],
        10
      );

      mapRef.current = map;

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        })
        .addTo(map);

      async function loadGeoJson() {
        try {
          const response = await fetch("/geojson/Jabar_By_Kab.geojson");

          if (!response.ok) {
            alert("GeoJSON gagal dimuat. Cek nama/path file.");
            return;
          }

          const data = await response.json();

          const filteredFeatures = data.features.filter(isBandungRayaRegion);

          const featureCollection: FeatureCollection = {
            type: "FeatureCollection",
            features: filteredFeatures,
          };

          bandungRayaGeoJsonRef.current = featureCollection;

          const layer = leaflet
            .geoJSON(featureCollection, {
              style: {
                color: "#285260",
                weight: 3,
                fillColor: "#285260",
                fillOpacity: 0.05,
              },
            })
            .addTo(map);

          map.fitBounds(layer.getBounds(), {
            padding: [20, 20],
          });

          setTimeout(() => {
            map.invalidateSize();
          }, 300);

          if (latitude && longitude) {
            setMarkerAndInputs(Number(latitude), Number(longitude));
          }
        } catch {
          alert("GeoJSON gagal dimuat.");
        }
      }

      map.on("click", async (event: any) => {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;

        setMarkerAndInputs(lat, lng);
        await getAddressFromLatLng(lat, lng);
      });

      loadGeoJson();
    }

    initMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={searchAddress}
        className="mb-3 w-full rounded-2xl bg-[#F09A43] px-4 py-3 font-semibold text-white hover:opacity-90"
      >
        Cari Alamat di Map
      </button>

      <div className="min-h-[520px] flex-1 overflow-hidden rounded-2xl bg-gray-200">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
}