import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import NavBar from "../NavBar";
import * as Location from "expo-location";
import { apiPath } from "../../constants/config";

export default function MapNative() {
  const [markers, setMarkers] = useState<any[]>([]);
  const [region, setRegion] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log("[MAP] permiso ubicación:", status);

        if (status !== "granted") {
          Alert.alert("Error", "Permiso de ubicación denegado.");
          const fallbackRegion = {
            latitude: -34.6037,
            longitude: -58.3816,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          };
          console.log("[MAP] usando región fallback:", fallbackRegion);
          setRegion(fallbackRegion);
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const userRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };

        console.log("[MAP] región usuario:", userRegion);
        setRegion(userRegion);

        const url = apiPath("/markers");
        console.log("[MAP] fetch markers:", url);
        const res = await fetch(url);

        console.log("[MAP] res.status markers:", res.status);
        if (!res.ok) {
          const txt = await res.text();
          console.log("[MAP] ERROR BODY markers:", txt);
          throw new Error(`Error HTTP ${res.status}`);
        }

        const data = await res.json();
        console.log("[MAP] raw markers:", data);

        const cleanData = data
          .filter((m: any) => m.latitude && m.longitude)
          .map((m: any) => ({
            ...m,
            latitude: Number(m.latitude),
            longitude: Number(m.longitude),
          }));

        console.log("[MAP] clean markers:", cleanData);
        setMarkers(cleanData);
      } catch (err) {
        console.log("[MAP ERROR JS]", err);
        Alert.alert("Error", "No se pudo obtener la ubicación o los datos.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !region) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
  provider={PROVIDER_GOOGLE}
  style={styles.map}
  region={region}
  showsUserLocation={true}
  showsMyLocationButton={true}
  onMapReady={() => {
    console.log("[MAP] onMapReady. Region actual:", region);
  }}
  onRegionChangeComplete={(r) => {
    console.log("[MAP] onRegionChangeComplete:", r);
  }}
>

        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{
              latitude: m.latitude,
              longitude: m.longitude,
            }}
            title={m.title || "Reporte"}
            description={m.description || ""}
          />
        ))}
      </MapView>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  map: { flex: 1, backgroundColor: "#fff" },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
