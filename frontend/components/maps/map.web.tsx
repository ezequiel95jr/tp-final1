/* global google */
import { useEffect, useRef } from "react";
import { getMarkers } from "../../api/api";
import NavBar from "../NavBar";
import { GOOGLE_MAPS_API_KEY } from "../../constants/config";

export default function MapWeb() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const markers = await getMarkers();

      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: -34.6037, lng: -58.3816 },
        zoom: 12,
      });

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(pos);
            new google.maps.Marker({
              map,
              position: pos,
              title: "Tu ubicación actual",
            });
          },
          () => {
            console.warn("No se pudo obtener la ubicación del usuario.");
          }
        );
      }

      markers.forEach((m: any) =>
        new google.maps.Marker({
          map,
          position: { lat: Number(m.lat), lng: Number(m.lng) },
          title: m.title || "Marcador",
        })
      );
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      if (!GOOGLE_MAPS_API_KEY) {
        console.warn("Missing EXPO_PUBLIC_GOOGLE_MAPS_API_KEY env var for Google Maps.");
      }
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.body.appendChild(script);
    } else {
      init();
    }
  }, []);

    return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%", zoom:"80%" }} />
      <NavBar />
    </div>
  );
}

