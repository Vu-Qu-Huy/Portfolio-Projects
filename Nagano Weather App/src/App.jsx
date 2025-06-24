import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import {
  MapPin,
  Clock,
  Coffee,
  Lightbulb,
  Cloud,
  Sun,
  CloudRain,
  SunSnow as Snow,
  Thermometer,
  Wind,
  Droplet,
  Sunrise,
  Sunset,
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

const App = () => {
  const [selectedCafe, setSelectedCafe] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [sunUvData, setSunUvData] = useState(null);
  const [weatherNote, setWeatherNote] = useState("");
  const [tipOfDay, setTipOfDay] = useState("");
  const [cafes, setCafes] = useState([]);

  const SUPABASE_URL = "https://ouodmggezpbzmagenapm.supabase.co";
  const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91b2RtZ2dlenBiem1hZ2VuYXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NTE5MTcsImV4cCI6MjA2NDQyNzkxN30.M70PStYMWya9skxr09Rac9KSMh-xvFPYFIKaudkHtbI";

  const initialCafes = [
    {
      id: 1,
      name: "Book & Brew Café",
      address: "1-1-3 Wakasato",
      hours: "7 AM–9 PM",
      description:
        "Cozy café with English study group sessions every Tuesday and Thursday evening. Perfect for language learners and book enthusiasts.",
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&h=300&fit=crop",
    },
    {
      id: 2,
      name: "Station Study Lounge",
      address: "3-2-5 Nagano Station",
      hours: "24/7",
      description:
        "Open 24 hours with free Wi-Fi, lockers, and quiet study zones. Popular among students and remote workers.",
      image:
        "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=300&h=300&fit=crop",
    },
    {
      id: 3,
      name: "Zen Library Café",
      address: "4-10 Hayashi-machi",
      hours: "9 AM–6 PM",
      description:
        "Quiet reading zone located next to the public library. Serves traditional Japanese tea and light meals.",
      image:
        "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=300&h=300&fit=crop",
    },
  ];

  useEffect(() => {
    fetchWeatherDataViaFunction();
    fetchWeatherNoteViaFunction();
    fetchSunAndUVDataViaFunction();
    fetchTipOfDayViaFunction();
    fetchCafes();
  }, []);

  const invokeSupabaseFunction = async (functionName, body = {}) => {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: JSON.stringify(body),
      headers: {
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    });
    if (error) throw error;
    return data;
  };

  const fetchWeatherDataViaFunction = async () => {
    try {
      const data = await invokeSupabaseFunction("getWeather");
      setWeatherData({
        name: "Nagano",
        temp: data.temp,
        high: data.high,
        low: data.low,
        description: data.weather,
        icon: data.icon,
        // humidity and aqi might come from getSunAndUV if that function is more comprehensive
        // or could be separate. Assuming getWeather focuses on temp, conditions, icon.
      });
    } catch (error) {
      toast({
        title: "Weather Error",
        description: `Unable to fetch weather data: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const fetchSunAndUVDataViaFunction = async () => {
    try {
      const data = await invokeSupabaseFunction("getSunAndUV");
      setSunUvData({
        sunrise: data.sunrise,
        sunset: data.sunset,
        uvi: data.uvi,
        humidity: data.humidity, // Assuming getSunAndUV also returns humidity
        aqi: data.aqi, // Assuming getSunAndUV also returns AQI
      });
      // If getWeather doesn't include humidity, update weatherData here
      if (data.humidity && weatherData && !weatherData.humidity) {
        setWeatherData((prev) => ({ ...prev, humidity: data.humidity }));
      }
    } catch (error) {
      toast({
        title: "Sun & UV Data Error",
        description: `Unable to fetch sun/UV data, my API is limited`,
        variant: "destructive",
      });
    }
  };

  const fetchWeatherNoteViaFunction = async () => {
    try {
      const data = await invokeSupabaseFunction("getWeatherNote");
      setWeatherNote(data.note || "No forecast note for today.");
    } catch (error) {
      toast({
        title: "Forecast Note Error",
        description: `Unable to fetch forecast note: ${error.message}`,
        variant: "destructive",
      });
      setWeatherNote("No forecast note for today.");
    }
  };

  const fetchTipOfDayViaFunction = async () => {
    try {
      const data = await invokeSupabaseFunction("getTodayTip");
      setTipOfDay(data.tip || "No tip for today—stay tuned!");
    } catch (error) {
      toast({
        title: "Tip of the Day Error",
        description: `Unable to fetch tip of the day: ${error.message}`,
        variant: "destructive",
      });
      setTipOfDay("No tip for today—stay tuned!");
    }
  };

  const fetchCafes = async () => {
    // For now, using initialCafes. Replace with Supabase fetch if needed.
    // Example: const { data, error } = await supabase.from('nagano_favorites').select('*');
    // if (error) toast({ title: "Cafes Error", description: error.message, variant: "destructive" });
    // else setCafes(data);
    setCafes(initialCafes);
  };

  const getWeatherIcon = (iconCode) => {
    if (iconCode?.includes("01")) return <Sun className="w-12 h-12" />;
    if (
      iconCode?.includes("02") ||
      iconCode?.includes("03") ||
      iconCode?.includes("04")
    )
      return <Cloud className="w-12 h-12" />;
    if (iconCode?.includes("09") || iconCode?.includes("10"))
      return <CloudRain className="w-12 h-12" />;
    if (iconCode?.includes("13")) return <Snow className="w-12 h-12" />;
    return <Cloud className="w-12 h-12" />;
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50 h-[70px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#0066CC]">Nagano Life Hub</h1>
          <nav className="hidden md:flex space-x-4">
            {[
              { id: "weather", label: "Weather Overview" },
              { id: "forecast-note", label: "Forecast Note" },
              { id: "suggestions", label: "Suggestions" },
              { id: "favorites", label: "Favorites" },
              { id: "tip-of-the-day", label: "Tip of the Day" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm text-gray-600 hover:text-[#0066CC] transition-colors px-2 py-1 rounded-md"
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-[70px]">
        {/* Weather Overview Section */}
        <section
          id="weather"
          className="py-12 px-5 md:px-20 bg-gradient-to-br from-sky-400 to-blue-600 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Nagano Weather</h2>
            {weatherData ? (
              <div className="bg-white/20 backdrop-blur-md p-8 rounded-xl shadow-lg">
                <h3 className="text-3xl font-semibold mb-2">
                  {weatherData.name}
                </h3>
                <div className="flex items-center justify-center my-4">
                  <div className="text-white/80">
                    {getWeatherIcon(weatherData.icon)}
                  </div>
                  <span className="text-6xl font-bold ml-4">
                    {Math.round(weatherData.temp)}°C
                  </span>
                </div>
                <p className="text-2xl capitalize mb-2">
                  {weatherData.description}
                </p>
                <p className="text-xl">
                  High: {Math.round(weatherData.high)}°C / Low:{" "}
                  {Math.round(weatherData.low)}°C
                </p>
              </div>
            ) : (
              <p className="text-xl">Loading weather data...</p>
            )}
          </div>
        </section>

        {/* Forecast Note Section */}
        <section id="forecast-note" className="py-12 px-5 md:px-20 bg-slate-50">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0066CC] mb-6 text-center">
              Forecast Note
            </h2>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-md">
              <p className="text-gray-700 italic text-lg">{weatherNote}</p>
            </div>
          </div>
        </section>

        {/* Clothing & Activity Suggestions Section */}
        <section id="suggestions" className="py-12 px-5 md:px-20 bg-white">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0066CC] mb-6 text-center">
              Suggestions
            </h2>
            {weatherData ? (
              <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 shadow-md text-gray-700 text-lg">
                <p className="mb-2">
                  {weatherData.temp <= 5 &&
                    `It’s cold (${Math.round(
                      weatherData.temp
                    )}°C). Wear a heavy coat, scarf, and gloves.`}
                  {weatherData.temp > 5 &&
                    weatherData.temp <= 15 &&
                    `Cool (${Math.round(
                      weatherData.temp
                    )}°C). Wear a light jacket and long pants.`}
                  {weatherData.temp > 15 &&
                    weatherData.temp <= 25 &&
                    `Mild (${Math.round(
                      weatherData.temp
                    )}°C). A long-sleeve shirt is fine.`}
                  {weatherData.temp > 25 &&
                    `Warm (${Math.round(
                      weatherData.temp
                    )}°C). Wear short sleeves, sunglasses, and a hat.`}
                </p>
                {weatherData.description?.toLowerCase().includes("rain") && (
                  <p className="mt-2">Carry an umbrella. ☔</p>
                )}
                {weatherData.description?.toLowerCase().includes("snow") && (
                  <p className="mt-2">Wear waterproof boots. ❄️</p>
                )}
              </div>
            ) : (
              <p className="text-center">Loading suggestions...</p>
            )}
          </div>
        </section>

        {/* Sunrise, Sunset & UV Index Section */}

        {/* Cafes Section */}
        <section id="favorites" className="py-16 px-5 md:px-20 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#0066CC] mb-8 text-center">
              Top Café & Study Spots
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
              {cafes.map((cafe) => (
                <div
                  key={cafe.id}
                  className="cafe-card bg-white border border-gray-200 rounded-xl p-5 shadow-lg hover:shadow-xl transition-shadow cursor-pointer flex flex-col"
                  onClick={() => setSelectedCafe(cafe)}
                >
                  <img
                    alt={cafe.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                    src="https://images.unsplash.com/photo-1597923710278-c3550ed5d8fd"
                  />
                  <h3 className="font-bold text-xl text-[#0052A3] mb-2">
                    {cafe.name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{cafe.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-3">
                    <Clock className="w-4 h-4 mr-2 text-gray-500" />
                    <span>{cafe.hours}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-3 flex-grow">
                    {cafe.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tip of the Day Section */}
        <section
          id="tip-of-the-day"
          className="py-16 px-5 md:px-20 bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Tip of the Day</h2>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-10 shadow-lg min-h-[150px] flex flex-col justify-center items-center">
              <Lightbulb className="w-12 h-12 text-yellow-300 mx-auto mb-4" />
              <p className="text-2xl leading-relaxed">{tipOfDay}</p>
            </div>
          </div>
        </section>
      </main>

      {/* Cafe Modal */}
      {selectedCafe && (
        <div className="modal-overlay" onClick={() => setSelectedCafe(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={() => setSelectedCafe(null)}
            >
              ×
            </button>

            <img
              alt={selectedCafe.name}
              className="w-full h-72 object-cover rounded-t-lg"
              src="https://images.unsplash.com/photo-1655732329733-dd771dc518cd"
            />

            <div className="p-6">
              <h3 className="text-3xl font-bold text-[#0066CC] mb-4">
                {selectedCafe.name}
              </h3>

              <div className="flex items-start text-gray-700 mb-3">
                <MapPin className="w-5 h-5 mr-3 mt-1 text-gray-500 flex-shrink-0" />
                <span>{selectedCafe.address}</span>
              </div>

              <div className="flex items-center text-gray-700 mb-5">
                <Clock className="w-5 h-5 mr-3 text-gray-500 flex-shrink-0" />
                <span>{selectedCafe.hours}</span>
              </div>

              <p className="text-gray-700 leading-relaxed text-base">
                {selectedCafe.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </div>
  );
};

export default App;
