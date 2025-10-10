// app/(app)/detailPost.tsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import api from "../../api";
import Button from "../../components/Button";

// comentarios
import CommentInput from "../../components/Comments/CommentInput";
import CommentList from "../../components/Comments/CommentList";
import { useComments } from "../../components/Comments/useComments";

export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const postId = useMemo(() => Number(id), [id]);

  const [post, setPost] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [me, setMe] = useState<{ id: number; name?: string } | null>(null);

  // Hook de comentarios
  const { comments, loading: loadingComments, load, add, remove } = useComments(postId);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setLoadingPost(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Sesión", "Tenés que iniciar sesión");
        router.replace("/(auth)/login");
        return;
      }
      const res = await api.get(`/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const payload = res.data?.data ?? res.data;
      setPost(payload);
    } catch (error: any) {
      console.log("ERROR POST DETAIL ->", error?.response?.data || error?.message);
      Alert.alert("Error", "No se pudo cargar el post");
      router.back();
    } finally {
      setLoadingPost(false);
    }
  }, [postId]);

  // Trae datos del usuario autenticado para permisos de borrado
  const fetchMe = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;
      // 1) intentar endpoint estándar de Sanctum/Laravel
      try {
        const r1 = await api.get("/user", { headers: { Authorization: `Bearer ${token}` } });
        setMe(r1.data);
        return;
      } catch {
        // 2) fallback si tenés /users/me
        const r2 = await api.get("/users/me", { headers: { Authorization: `Bearer ${token}` } });
        setMe(r2.data);
      }
    } catch (e) {
      // si no existe ninguno, me queda null; igual se verán comentarios sin botón eliminar
      console.log("ME ERR ->", (e as any)?.response?.data || (e as any)?.message);
    }
  }, []);

  useEffect(() => {
    if (!postId) return;
    fetchPost();
    load();      // comentarios del post
    fetchMe();   // usuario actual
  }, [postId, fetchPost, load, fetchMe]);

  if (loadingPost) {
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
        <View style={{ marginTop: 12 }}>
          <Button title="← Volver" onPress={() => router.back()} />
        </View>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="← Volver" onPress={() => router.back()} color="#007bff" />

      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>Por {post.user?.name ?? "Autor desconocido"}</Text>
      <Text style={styles.content}>{post.content}</Text>

      {/* Comentarios */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>Comentarios</Text>

        <CommentInput onSubmit={add} />

        <CommentList
          items={comments}
          loading={loadingComments}
          currentUserId={me?.id}
          postOwnerId={post?.user_id}   // dueño del post también puede borrar
          onDelete={remove}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 10, marginBottom: 6 },
  author: { color: "#555", marginBottom: 16, fontStyle: "italic" },
  content: { fontSize: 16, lineHeight: 22 },
});
