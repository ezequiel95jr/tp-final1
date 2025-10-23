import { useEffect, useState, useMemo } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import * as Location from "expo-location";
import { getMarkers } from "../../api/api";

const GOOGLE_KEY = "AIzaSyAtwZ-PkbNa2gbR4apeuxg2cOdQXK9AUqo";

export default function MapNative() {
  const [region, setRegion] = useState<{ lat: number; lng: number } | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        setRegion({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      } else setRegion({ lat: -34.6037, lng: -58.3816 });
    })();
    getMarkers().then(setMarkers).catch(console.error);
  }, []);

  const html = useMemo(() => {
    if (!region) return "";
    const pts = JSON.stringify(markers);
    return `
    <!DOCTYPE html><html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>html,body,#map{height:100%;margin:0;padding:0}</style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_KEY}&libraries=places"></script>
    </head><body><div id="map"></div>
      <script>
        const center=${JSON.stringify(region)};
        const map=new google.maps.Map(document.getElementById('map'),{center,zoom:14});
        const markers=${pts};
        markers.forEach(m=>{
          const mk=new google.maps.Marker({map,position:{lat:m.lat,lng:m.lng},title:m.title||'Marcador'});
        });
      </script>
    </body></html>`;
  }, [region, markers]);

  if (!region || !html) return <View style={styles.center}><ActivityIndicator/></View>;
  return <WebView originWhitelist={["*"]} source={{ html }} />;
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
