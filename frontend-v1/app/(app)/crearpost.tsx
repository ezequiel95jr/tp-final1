import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as Location from "expo-location";
import api from "../../api/api";
import * as ImagePicker from "expo-image-picker";
import NavBar from "../../components/NavBar";
import { Platform } from "react-native";
import MapPickerModal from "../../components/MapPickerModal";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [address, setAddress] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("❌ Error al seleccionar imagen:", error);
    }
  };


  const handleCreatePost = async () => {
    if (!title || !content) {
      Alert.alert("Completa todos los campos");
      return;
    }

    setUploading(true);

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No estás autenticado");
        router.replace("/(auth)/login");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (location?.lat && location?.lng) {
        formData.append("latitude", String(location.lat));
        formData.append("longitude", String(location.lng));
      }
      if (address) formData.append("address", address);

      if (image) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? "");
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append("image", {
          uri: image,
          name: filename ?? "photo.jpg",
          type,
        } as any);
      }

      const res = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Post creado correctamente:", res.data);
      Alert.alert("Éxito", "Post creado correctamente 🎉");

      setTitle("");
      setContent("");
      setImage(null);
      setLocation(null);
      setAddress(null);

      router.replace("/(app)/home");
    } catch (error: any) {
      console.error("❌ Error al crear post:", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo crear el post");
    } finally {
      setUploading(false);
    }
  };


  const handleSetLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No se pudo acceder a la ubicación.");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
      setLocation({ lat: coords.latitude, lng: coords.longitude });

      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const place = geocode[0];
        const readableAddress = `${place.street ?? ""} ${place.name ?? ""}, ${place.city ?? ""
          }, ${place.region ?? ""}`;
        setAddress(readableAddress);
      }

      Alert.alert("Ubicación establecida ✅", "Se ha guardado tu ubicación actual.");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo obtener la ubicación actual.");
    }
  };

  const handleConfirmFromMap = async (coords: { latitude: number; longitude: number }) => {
    setShowPicker(false);
    setLocation({ lat: coords.latitude, lng: coords.longitude });


    try {
      const geocode = await Location.reverseGeocodeAsync(coords);
      if (geocode.length > 0) {
        const p = geocode[0];
        const readable = `${p.street ?? ""} ${p.name ?? ""}, ${p.city ?? ""}, ${p.region ?? ""}`.trim();
        setAddress(readable || null);
      } else {
        setAddress(null);
      }
    } catch {
      setAddress(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Crear Post</Text>

        <Text style={styles.label}>Título</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Título del post"
          placeholderTextColor="#aaa"
        />

        <Text style={styles.label}>Contenido</Text>
        <TextInput
          value={content}
          onChangeText={setContent}
          style={[styles.input, { height: 100 }]}
          placeholder="Escribí el contenido"
          placeholderTextColor="#aaa"
          multiline
        />

        <TouchableOpacity onPress={handleSetLocation} style={styles.button}>
          <Text style={styles.buttonText}>Usar mi ubicación actual 📍</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (Platform.OS === "web") {
              Alert.alert("No disponible en Web", "Abrí el selector en Android/iOS.");
            } else {
              setShowPicker(true);
            }
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Elegir punto en el mapa 🗺️</Text>
        </TouchableOpacity>

        {location && (
          <Text style={{ color: "#9f9", marginTop: 8 }}>
            Ubicación guardada:{" "}
            {address ??
              `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
          </Text>
        )}

        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Text style={styles.buttonText}>Seleccionar imagen</Text>
        </TouchableOpacity>

        {image && (
          <Image
            source={{ uri: image }}
            style={styles.preview}
            resizeMode="cover"
          />
        )}

        {uploading ? (
          <ActivityIndicator
            size="large"
            color="#4f9cff"
            style={{ marginVertical: 16 }}
          />
        ) : (
          <TouchableOpacity
            onPress={handleCreatePost}
            style={styles.publishButton}
          >
            <Text style={styles.publishText}>Publicar Post</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
      <MapPickerModal
        visible={showPicker}
        onClose={() => setShowPicker(false)}
        onConfirm={handleConfirmFromMap}
        initial={location ? { latitude: location.lat, longitude: location.lng } : null}
      />
      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3a3a3a",
    backgroundColor: "#2a2a2a",
    borderRadius: 10,
    color: "#fff",
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#333",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#f1f1f1",
    fontWeight: "600",
    fontSize: 16,
  },
  preview: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    marginVertical: 12,
  },
  publishButton: {
    backgroundColor: "#4f9cff",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  publishText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
