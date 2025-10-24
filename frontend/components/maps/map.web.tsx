/* global google */
import { useEffect, useRef } from "react";
import { getMarkers } from "../../api/api";

export default function MapWeb() {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const init = async () => {
      const markers = await getMarkers();

      // Mapa inicial (por defecto: Buenos Aires)
      const map = new google.maps.Map(mapRef.current!, {
        center: { lat: -34.6037, lng: -58.3816 },
        zoom: 12,
      });

      // Intentar centrar en la ubicación actual del usuario
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

      // Mostrar los marcadores desde la API
      markers.forEach((m: any) =>
        new google.maps.Marker({
          map,
          position: { lat: Number(m.lat), lng: Number(m.lng) },
          title: m.title || "Marcador",
        })
      );
    };

    // Cargar script de Google Maps solo si no existe
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAtwZ-PkbNa2gbR4apeuxg2cOdQXK9AUqo&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.body.appendChild(script);
    } else {
      init();
    }
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
