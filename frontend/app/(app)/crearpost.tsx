import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import api from "../api"; // tu archivo de axios
import * as Location from "expo-location";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const getCurrentLocation = async () => {
    if (Platform.OS === "web") {
      // Ubicación dummy para web
      return { coords: { latitude: 0, longitude: 0 } };
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "No se puede acceder a la ubicación");
      return { coords: { latitude: 0, longitude: 0 } }; // fallback
    }
    const location = await Location.getCurrentPositionAsync({});
    return location;
  };

  const handleCreatePost = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No estás autenticado");
        router.replace("/(auth)/login");
        return;
      }

      const location = await getCurrentLocation();

      await api.post(
        "/posts",
        {
          title,
          content,
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Éxito", "Post creado correctamente");
      setTitle("");
      setContent("");
      router.replace("/(app)/home");
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "No se pudo crear el post");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Título</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Contenido</Text>
      <TextInput
        value={content}
        onChangeText={setContent}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Crear Post" onPress={handleCreatePost} />
    </View>
  );
}
