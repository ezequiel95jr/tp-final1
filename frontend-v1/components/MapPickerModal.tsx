import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: (coords: { latitude: number; longitude: number }) => void;
  initial?: { latitude: number; longitude: number } | null;
};

export default function MapPickerModal({ visible, onClose, onConfirm, initial }: Props) {
  const [selected, setSelected] = useState<{ latitude: number; longitude: number } | null>(
    initial ?? null
  );
  const [loading, setLoading] = useState(true);

  const apiKey = "AIzaSyAtwZ-PkbNa2gbR4apeuxg2cOdQXK9AUqo"; // 🔑 poné tu Google Maps API key válida
  const lat = initial?.latitude ?? -38.9516;
  const lng = initial?.longitude ?? -68.0591;

  const html = `
    <!DOCTYPE html>
    <html>
      <body style="margin:0">
        <div id="map" style="width:100%;height:100%"></div>
        <script src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap" async defer></script>
        <script>
          let map, marker;
          function initMap() {
            map = new google.maps.Map(document.getElementById("map"), {
              center: { lat: ${lat}, lng: ${lng} },
              zoom: 13
            });
            ${selected ? `
              marker = new google.maps.Marker({
                position: { lat: ${selected?.latitude}, lng: ${selected?.longitude} },
                map
              });
            ` : ""}
            map.addListener("click", (e) => {
              const pos = e.latLng.toJSON();
              if (marker) marker.setMap(null);
              marker = new google.maps.Marker({ position: pos, map });
              window.ReactNativeWebView.postMessage(JSON.stringify(pos));
            });
          }
        </script>
      </body>
    </html>
  `;

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Elegí un punto en el mapa</Text>

          {loading && <ActivityIndicator color="#4f9cff" style={{ marginTop: 16 }} />}

          <WebView
            style={styles.map}
            originWhitelist={["*"]}
            source={{ html }}
            onLoadEnd={() => setLoading(false)}
            onMessage={(e) => {
              const data = JSON.parse(e.nativeEvent.data);
              setSelected({ latitude: data.lat, longitude: data.lng });
            }}
          />

          {selected && (
            <Text style={styles.coords}>
              {selected.latitude.toFixed(4)}, {selected.longitude.toFixed(4)}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity onPress={onClose} style={[styles.btn, styles.btnGhost]}>
              <Text style={styles.btnGhostText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => selected && onConfirm(selected)}
              disabled={!selected}
              style={[
                styles.btn,
                !selected ? styles.btnDisabled : styles.btnPrimary,
              ]}
            >
              <Text style={styles.btnText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#1f1f1f",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    gap: 12,
    maxHeight: "88%",
  },
  title: { color: "#fff", fontSize: 18, fontWeight: "700", textAlign: "center" },
  map: { width: "100%", height: 380, borderRadius: 12 },
  coords: {
    color: "#9f9",
    textAlign: "center",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-end",
    marginTop: 8,
  },
  btn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10 },
  btnGhost: { backgroundColor: "#2b2b2b" },
  btnGhostText: { color: "#ddd", fontWeight: "600" },
  btnPrimary: { backgroundColor: "#4f9cff" },
  btnDisabled: { backgroundColor: "#2b2b2b", opacity: 0.6 },
  btnText: { color: "#fff", fontWeight: "700" },
});
