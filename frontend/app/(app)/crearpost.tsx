import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import { router } from "expo-router";

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreatePost = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No estás autenticado");
        router.replace("/(auth)/login" as any);
        return;
      }

      await api.post(
        "/posts",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Éxito", "Post creado correctamente");
      setTitle("");
      setContent("");
      router.replace("/(app)/home" as any);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "No se pudo crear el post");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Crear Post</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Contenido"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={4}
      />

      <Button title="Crear Post" onPress={handleCreatePost} color="#28a745" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});
