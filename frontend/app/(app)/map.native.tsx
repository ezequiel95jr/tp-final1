import React, { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { WebView } from "react-native-webview";
import { getMarkers } from "../../api/api";

export default function MapNative() {
  const [region, setRegion] = useState<{lat:number;lng:number} | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const TOKEN = "PON_TU_TOKEN_ACÁ";

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } else {
        setRegion({ lat: -38.9517, lng: -68.0591 });
      }
    })();
    (async () => {
      try {
        const data = await getMarkers(TOKEN);
        setMarkers(data);
      } catch {}
    })();
  }, []);

  const html = useMemo(() => {
    if (!region) return "";
    const points = JSON.stringify(
      (markers || []).map((m:any) => ({
        id: m.id,
        lat: Number(m.lat),
        lng: Number(m.lng),
        title: m.title || "",
        description: m.description || ""
      }))
    );
    return `
<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#map{height:100%;margin:0;padding:0}</style>
</head><body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
 const center = [${region.lat}, ${region.lng}];
 const map = L.map('map').setView(center, 14);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
 const markers = ${points};
 markers.forEach(m=>{
   const mk = L.marker([m.lat, m.lng]).addTo(map);
   const txt = (m.title||"") + (m.description? ("<br/>"+m.description):"");
   if (txt) mk.bindPopup(txt);
 });
</script>
</body></html>`;
  }, [region, markers]);

  if (!region || !html) {
    return <View style={styles.center}><ActivityIndicator/></View>;
  }

  return <WebView originWhitelist={["*"]} source={{ html }} />;
}

const styles = StyleSheet.create({ center: { flex:1, alignItems:"center", justifyContent:"center" }});
