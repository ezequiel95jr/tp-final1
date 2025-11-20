import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { apiPath } from "../../constants/config";

export default function MapWeb({ selectable = false, onSelect }: any) {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Error", "No se pudo obtener permisos de ubicación.");
          setCoords({ lat: -38.9516, lng: -68.0591 }); // Neuquén por defecto
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        setCoords({
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        });

        // 📡 Cargar marcadores desde API
        const res = await fetch(apiPath("/markers"));
        const data = await res.json();
        const cleanData = data
          .filter((m: any) => m.latitude && m.longitude)
          .map((m: any) => ({
            ...m,
            latitude: Number(m.latitude),
            longitude: Number(m.longitude),
          }));

        setMarkers(cleanData);
      } catch (err) {
        console.error("MAP ERROR:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !coords) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // HTML dinámico para el iframe
  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0">
        <div id="map" style="width:100%;height:100%"></div>
        <script src="https://maps.googleapis.com/maps/api/js?key=TU_API_KEY&callback=initMap" async defer></script>
        <script>
          let map;
          function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: ${coords.lat}, lng: ${coords.lng} },
              zoom: 13,
            });
            new google.maps.Marker({
              position: { lat: ${coords.lat}, lng: ${coords.lng} },
              map,
              title: "Tu ubicación",
            });
            ${markers
              .map(
                (m) => `
              new google.maps.Marker({
                position: { lat: ${m.latitude}, lng: ${m.longitude} },
                map,
                title: "${m.title || "Post"}"
              });
            `
              )
              .join("")}
            ${
              selectable
                ? `
              map.addListener("click", (e) => {
                const pos = e.latLng.toJSON();
                window.ReactNativeWebView.postMessage(JSON.stringify(pos));
              });
            `
                : ""
            }
          }
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      style={styles.map}
      originWhitelist={["*"]}
      source={{ html }}
      onMessage={(e) => {
        if (selectable && onSelect) {
          const pos = JSON.parse(e.nativeEvent.data);
          onSelect(pos);
        }
      }}
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
});
