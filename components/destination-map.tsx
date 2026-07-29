"use client";

import { useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";

import type { CoveragePolygon } from "@/types/coverage-polygon";
import type {
  Feature,
  FeatureCollection,
  Polygon,
  MultiPolygon,
} from "geojson";

type AddressFields = {
  addressStreet: string;
  addressVillage: string;
  addressDistrict: string;
  addressCity: string;
  addressProvince: string;
};

type LeafletPoint = [number, number];

type DestinationMapProps = {
  latitude: string;
  longitude: string;
  address: string;
  addressFields?: AddressFields;

  onLocationChange: (lat: string, lng: string) => void;
  onAddressChange: (address: string) => void;
  onAreaValidChange: (isValid: boolean) => void;

  coverageEnabled?: boolean;

  // Polygon yang sudah disetujui (read only)
  approvedCoveragePolygon?: CoveragePolygon | null;

  // Polygon usulan yang dapat diedit
  coveragePolygon?: CoveragePolygon | null;

  onCoverageChange?: (polygon: CoveragePolygon | null) => void;
  onCoverageValidChange?: (isValid: boolean) => void;
  readOnlyCoverage?: boolean;
};

export default function DestinationMap({
  latitude,
  longitude,
  address,
  addressFields,
  onLocationChange,
  onAddressChange,
  onAreaValidChange,

  coverageEnabled = false,
  approvedCoveragePolygon = null,
  coveragePolygon = null,
  onCoverageChange,
  onCoverageValidChange,
  readOnlyCoverage = false,
}: DestinationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const bandungRayaGeoJsonRef = useRef<FeatureCollection | null>(null);

  const approvedCoveragePointsRef = useRef<LeafletPoint[]>([]);
  const approvedCoveragePolygonLayerRef = useRef<any>(null);

  const coveragePointsRef = useRef<LeafletPoint[]>([]);
  const coveragePolygonLayerRef = useRef<any>(null);
  const coveragePolylineLayerRef = useRef<any>(null);
  const coverageVertexLayersRef = useRef<any[]>([]);

  const coverageEnabledRef = useRef(coverageEnabled);
  const readOnlyCoverageRef = useRef(readOnlyCoverage);
  const onCoverageChangeRef = useRef(onCoverageChange);
  const onCoverageValidChangeRef = useRef(onCoverageValidChange);

  useEffect(() => {
    coverageEnabledRef.current = coverageEnabled;
  }, [coverageEnabled]);

  useEffect(() => {
    readOnlyCoverageRef.current = readOnlyCoverage;
  }, [readOnlyCoverage]);

  useEffect(() => {
    onCoverageChangeRef.current = onCoverageChange;
  }, [onCoverageChange]);

  useEffect(() => {
    onCoverageValidChangeRef.current = onCoverageValidChange;
  }, [onCoverageValidChange]);

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

  function geoJsonToLeaflet(
    polygon: CoveragePolygon | null
  ): LeafletPoint[] {
    const ring = polygon?.coordinates?.[0];

    if (!ring || ring.length === 0) return [];

    const points = ring.map(([lng, lat]) => [lat, lng] as LeafletPoint);

    if (points.length >= 2) {
      const first = points[0];
      const last = points[points.length - 1];

      const isClosed =
        first[0] === last[0] &&
        first[1] === last[1];

      if (isClosed) {
        points.pop();
      }
    }

    return points;
  }

  function leafletToGeoJson(
    points: LeafletPoint[]
  ): CoveragePolygon | null {
    if (points.length < 3) return null;

    const coordinates = points.map(([lat, lng]) => [lng, lat]);

    coordinates.push([...coordinates[0]]);

    return {
      type: "Polygon",
      coordinates: [coordinates],
    };
  }

  function validateCoveragePoints(points: LeafletPoint[]) {
    if (points.length === 0) return true;
    if (points.length < 3) return false;

    return points.every(([lat, lng]) =>
      isPointInsideBandungRaya(lat, lng)
    );
  }

  function clearCoverageLayers() {
    const map = mapRef.current;

    if (!map) return;

    if (approvedCoveragePolygonLayerRef.current) {
      map.removeLayer(approvedCoveragePolygonLayerRef.current);
      approvedCoveragePolygonLayerRef.current = null;
    }

    if (coveragePolygonLayerRef.current) {
      map.removeLayer(coveragePolygonLayerRef.current);
      coveragePolygonLayerRef.current = null;
    }

    if (coveragePolylineLayerRef.current) {
      map.removeLayer(coveragePolylineLayerRef.current);
      coveragePolylineLayerRef.current = null;
    }

    coverageVertexLayersRef.current.forEach((layer) => {
      map.removeLayer(layer);
    });

    coverageVertexLayersRef.current = [];
  }

  function renderCoverageLayers() {
    const map = mapRef.current;
    const leaflet = leafletRef.current;

    if (!map || !leaflet) return;

    clearCoverageLayers();

    if (!coverageEnabledRef.current) return;

    // Polygon lama yang sudah disetujui
    const approvedPoints = approvedCoveragePointsRef.current;

    if (approvedPoints.length >= 3) {
      approvedCoveragePolygonLayerRef.current = leaflet
        .polygon(approvedPoints, {
          color: "#F09A43",
          weight: 3,
          fillColor: "#F09A43",
          fillOpacity: 0.2,
          interactive: false,
        })
        .addTo(map);

      approvedCoveragePolygonLayerRef.current.bindTooltip(
        "Cakupan wilayah saat ini"
      );
    }

    // Polygon baru/usulan
    const proposedPoints = coveragePointsRef.current;

    if (proposedPoints.length >= 3) {
      coveragePolygonLayerRef.current = leaflet
        .polygon(proposedPoints, {
          color: "#DC2626",
          weight: 3,
          fillColor: "#EF4444",
          fillOpacity: 0.2,
        })
        .addTo(map);
    } else if (proposedPoints.length >= 2) {
      coveragePolylineLayerRef.current = leaflet
        .polyline(proposedPoints, {
          color: "#DC2626",
          weight: 3,
          dashArray: "6, 6",
        })
        .addTo(map);
    }

    proposedPoints.forEach(([lat, lng], index) => {
      const vertex = leaflet
        .circleMarker([lat, lng], {
          radius: 7,
          color: "#FFFFFF",
          weight: 2,
          fillColor: "#DC2626",
          fillOpacity: 1,
        })
        .addTo(map);

      if (!readOnlyCoverageRef.current) {
        vertex.on("click", (event: any) => {
          event.originalEvent?.stopPropagation();
          removeCoveragePoint(index);
        });
      }

      vertex.bindTooltip(`Titik usulan ${index + 1}`);

      coverageVertexLayersRef.current.push(vertex);
    });
  }

  function updateCoverage(points: LeafletPoint[]) {
    coveragePointsRef.current = points;

    const isValid = validateCoveragePoints(points);

    onCoverageValidChangeRef.current?.(isValid);
    onCoverageChangeRef.current?.(leafletToGeoJson(points));

    renderCoverageLayers();
  }

  function addCoveragePoint(lat: number, lng: number) {
    const currentPoints = coveragePointsRef.current;

    if (currentPoints.length >= 30) {
      alert("Cakupan wilayah maksimal terdiri dari 30 titik.");
      return;
    }

    if (!isPointInsideBandungRaya(lat, lng)) {
      alert("Titik cakupan harus berada di wilayah Bandung Raya.");
      return;
    }

    updateCoverage([...currentPoints, [lat, lng]]);
  }

  function removeCoveragePoint(index: number) {
    const updatedPoints = coveragePointsRef.current.filter(
      (_, pointIndex) => pointIndex !== index
    );

    updateCoverage(updatedPoints);
  }

  function resetCoverage() {
    coveragePointsRef.current = [];

    onCoverageChangeRef.current?.(null);
    onCoverageValidChangeRef.current?.(true);

    renderCoverageLayers();
  }

  function buildAddressQueries() {
    if (!addressFields) {
      return [address.trim()].filter(Boolean);
    }

    const {
      addressStreet,
      addressVillage,
      addressDistrict,
      addressCity,
      addressProvince,
    } = addressFields;

    const streetOrPlace = addressStreet.trim();
    const city = addressCity.trim() || "Bandung";
    const province = addressProvince.trim() || "Jawa Barat";

    const queries = [
      [streetOrPlace],
      [streetOrPlace, "Bandung"],
      [streetOrPlace, "Jawa Barat"],
      [streetOrPlace, "Indonesia"],
      [streetOrPlace, "Bandung", "Jawa Barat", "Indonesia"],

      [streetOrPlace, city, province, "Indonesia"],
      [streetOrPlace, addressDistrict, city, province, "Indonesia"],
      [
        streetOrPlace,
        addressVillage,
        addressDistrict,
        city,
        province,
        "Indonesia",
      ],

      [addressVillage, addressDistrict, city, province, "Indonesia"],
      [addressDistrict, city, province, "Indonesia"],
      [city, province, "Indonesia"],
      [address.trim()],
    ];

    return queries
      .map((parts) => parts.filter(Boolean).join(", "))
      .filter(Boolean)
      .filter((query, index, self) => self.indexOf(query) === index);
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
    const queries = buildAddressQueries();

    if (queries.length === 0) {
      alert("Isi alamat terlebih dahulu.");
      return;
    }

    try {
      for (const query of queries) {
        console.log("NOMINATIM QUERY:", query);

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
            query
          )}`
        );

        const data = await response.json();

        console.log("NOMINATIM RESULT:", data);

        if (data && data.length > 0) {
          const result = data[0];
          const lat = Number(result.lat);
          const lng = Number(result.lon);

          onAddressChange(result.display_name);
          setMarkerAndInputs(lat, lng);

          return;
        }
      }

      alert(
        "Alamat tidak ditemukan otomatis. Silakan tentukan titik lokasi secara manual pada peta."
      );
    } catch {
      alert("Terjadi kesalahan saat mencari alamat.");
    }
  }

  useEffect(() => {
    approvedCoveragePointsRef.current =
      geoJsonToLeaflet(approvedCoveragePolygon);

    if (mapRef.current) {
      renderCoverageLayers();
    }
  }, [approvedCoveragePolygon]);

  useEffect(() => {
    coveragePointsRef.current = geoJsonToLeaflet(coveragePolygon);

    if (mapRef.current) {
      renderCoverageLayers();
    }

    if (coverageEnabled) {
      onCoverageValidChangeRef.current?.(
        validateCoveragePoints(coveragePointsRef.current)
      );
    } else {
      onCoverageValidChangeRef.current?.(true);
    }
  }, [coveragePolygon, coverageEnabled]);

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

      const map = leaflet
        .map(mapContainerRef.current)
        .setView([-6.9175, 107.6191], 10);

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

          renderCoverageLayers();
        } catch {
          alert("GeoJSON gagal dimuat.");
        }
      }

      map.on("click", async (event: any) => {
        const lat = event.latlng.lat;
        const lng = event.latlng.lng;

        if (
          coverageEnabledRef.current &&
          !readOnlyCoverageRef.current
        ) {
          addCoveragePoint(lat, lng);
          return;
        }

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

      approvedCoveragePolygonLayerRef.current = null;
      approvedCoveragePointsRef.current = [];

      coveragePolygonLayerRef.current = null;
      coveragePolylineLayerRef.current = null;
      coverageVertexLayersRef.current = [];
    };
  }, []);

  return (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={searchAddress}
        className="mb-3 w-full rounded-2xl bg-[#F09A43] px-4 py-3 font-semibold text-white hover:opacity-90"
      >
        Cari Lokasi di Map
      </button>

      {coverageEnabled && !readOnlyCoverage && (
        <div className="mb-3 rounded-2xl border border-orange-200 bg-orange-50 p-4">
          <p className="text-sm font-semibold text-gray-800">
            Mode gambar cakupan wilayah aktif
          </p>

          <p className="mt-1 text-sm text-gray-600">
            Klik peta untuk menggambar cakupan wilayah baru.
            Klik titik berwarna merah untuk menghapusnya.
            Cakupan wilayah berwarna oranye merupakan data yang telah disetujui dan tidak dapat diubah.
          </p>

          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm text-gray-700">
              Jumlah titik: {coveragePointsRef.current.length}/30
            </span>

            <button
              type="button"
              onClick={resetCoverage}
              className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Hapus Cakupan
            </button>
          </div>
        </div>
      )}

      <div className="min-h-[520px] flex-1 overflow-hidden rounded-2xl bg-gray-200">
        <div ref={mapContainerRef} className="h-full w-full" />
      </div>
    </div>
  );
}