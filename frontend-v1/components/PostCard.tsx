import React from "react";
import { Pressable, View, Text, StyleSheet, Image } from "react-native";
import { WebView } from "react-native-webview";
import { API_ORIGIN } from "../constants/config";

export type Post = {
  id: number;
  title: string;
  body?: string;
  content?: string;
  image?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  category_id?: number;
  state_id?: number;
  created_at?: string;
  category?: { id: number; name: string };
  state?: { id: number; name: string };
  type?: string;
};

function excerpt(t?: string, n = 120) {
  if (!t) return "";
  const s = t.trim().replace(/\s+/g, " ");
  return s.length > n ? s.slice(0, n) + "…" : s;
}

export default function PostCard({
  item,
  onPress,
}: {
  item: Post;
  onPress: () => void;
}) {
  const body = item.content ?? item.body ?? "";

  // ✅ Normalizamos la URL de la imagen
  const imageUrl = (() => {
    if (item.image_url) {
      let url = item.image_url;
      url = url
        .replace("http://127.0.0.1:8000", API_ORIGIN)
        .replace("http://localhost:8000", API_ORIGIN);
      return url;
    }

    if (item.image) {
      return item.image.startsWith("http")
        ? item.image
        : `${API_ORIGIN}/storage/imagenes/${item.image}`;
    }

    return null;
  })();

  // ✅ Si no hay imagen, pero sí coordenadas, generamos un mapa embebido
  const mapUrl =
    !imageUrl && item.latitude && item.longitude
      ? `https://maps.google.com/maps?q=${item.latitude},${item.longitude}&z=15&output=embed`
      : null;

  return (
    <Pressable onPress={onPress} style={styles.card} accessibilityRole="button">
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={(e) =>
            console.log("Error al cargar la imagen:", e.nativeEvent.error)
          }
        />
      ) : mapUrl ? (
        <View style={styles.image}>
          <WebView
            style={{ flex: 1, borderRadius: 10 }}
            source={{ uri: mapUrl }}
            javaScriptEnabled
            scrollEnabled={false}
          />
        </View>
      ) : (
        <View style={[styles.image, { alignItems: "center", justifyContent: "center" }]}>
          <Text style={{ color: "#888" }}>Sin imagen ni ubicación</Text>
        </View>
      )}

      <Text style={styles.title}>{item.title}</Text>
      {!!body && <Text style={styles.body}>{excerpt(body)}</Text>}

      <View style={styles.metaRow}>
        {!!item.category?.name && (
          <Text style={[styles.badge, styles.badgeSpacing]}>
            #{item.category.name}
          </Text>
        )}
        {!!item.type && (
          <Text style={[styles.badge, styles.badgeSpacing]}>{item.type}</Text>
        )}
        {!!item.created_at && (
          <Text style={[styles.date, styles.badgeSpacing]}>
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    color: "#f9fafb",
    backgroundColor: "#1e1e1e",
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#2a2a2a",
    overflow: "hidden",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    color: "#f9fafb",
  },
  body: { color: "#fff" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  badgeSpacing: { marginRight: 8, marginBottom: 6 },
  badge: {
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: "#eef2ff",
    color: "#3730a3",
  },
  date: { marginLeft: "auto", fontSize: 12, color: "#9ca3af" },
});
