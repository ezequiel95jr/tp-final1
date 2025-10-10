// app/(app)/detailPost.tsx
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import api from "../../api";

export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPost = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Sesión", "Tenés que iniciar sesión");
        router.replace("/(auth)/login");
        return;
      }

      const res = await api.get(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // si el backend devuelve { data: {...} } usar eso, si no, usar res.data
      const payload = res.data?.data ?? res.data;
      setPost(payload);
    } catch (error: any) {
      console.log("ERROR POST DETAIL ->", error.response?.data || error.message);
      Alert.alert("Error", "No se pudo cargar el post");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPost();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text>Cargando post...</Text>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={styles.center}>
        <Text>No se encontró el post.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>Por {post.user?.name ?? "Autor desconocido"}</Text>
      <Text style={styles.content}>{post.content}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  author: { color: "#555", marginBottom: 20, fontStyle: "italic" },
  content: { fontSize: 16, lineHeight: 22 },
});
