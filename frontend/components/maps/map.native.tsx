import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
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
        // 🧭 Pedir permiso para usar ubicación
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Error", "No se pudo obtener permiso para la ubicación.");
          setRegion({
            latitude: -34.6037,
            longitude: -58.3816,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          });
          setLoading(false);
          return;
        }

        // 📍 Obtener ubicación actual
        const location = await Location.getCurrentPositionAsync({});
        const userRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        };
        setRegion(userRegion);

        // 📡 Obtener marcadores desde tu API
        const res = await fetch(apiPath("/markers"));
        const data = await res.json();

        // 🧹 Asegurar que las coordenadas sean numéricas
        const cleanData = data
          .filter((m: any) => m.latitude && m.longitude)
          .map((m: any) => ({
            ...m,
            latitude: Number(m.latitude),
            longitude: Number(m.longitude),
          }));

        setMarkers(cleanData);
      } catch (err) {
        console.log("[MAP ERROR]", err);
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
      
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
