// app/api/pengunjung/weather/route.ts
// API cuaca real-time menggunakan OpenWeatherMap
// Daftarkan API key gratis di: https://openweathermap.org/api

import { NextRequest, NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (!lat || !lng) {
      return NextResponse.json(
        { success: false, error: "lat dan lng diperlukan" },
        { status: 400 }
      );
    }

    if (!WEATHER_API_KEY) {
      // Return mock data jika API key belum diset
      return NextResponse.json({
        success: true,
        data: {
          temp: 22,
          feelsLike: 21,
          description: "Berawan sebagian",
          icon: "02d",
          humidity: 75,
          windSpeed: 3.2,
          cityName: "Bandung",
          isReal: false,
        },
      });
    }

    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${WEATHER_API_KEY}&units=metric&lang=id`,
      { next: { revalidate: 600 } } // Cache 10 menit
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data: {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description:
          data.weather[0].description.charAt(0).toUpperCase() +
          data.weather[0].description.slice(1),
        icon: data.weather[0].icon,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        cityName: data.name,
        isReal: true,
      },
    });
  } catch (error) {
    console.error("Weather API error:", error);
    // Fallback ke data mock jika API gagal
    return NextResponse.json({
      success: true,
      data: {
        temp: 22,
        feelsLike: 21,
        description: "Data cuaca tidak tersedia",
        icon: "01d",
        humidity: 70,
        windSpeed: 2.5,
        cityName: "Bandung",
        isReal: false,
      },
    });
  }
}
