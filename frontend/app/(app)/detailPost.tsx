import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import api from "../../api";
import Button from "../../components/Button";

// Comentarios
import CommentInput from "../../components/Comments/CommentInput";
import CommentList from "../../components/Comments/CommentList";
import { useComments } from "../../components/Comments/useComments";

export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const postId = useMemo(() => Number(id), [id]);

  const [post, setPost] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [me, setMe] = useState<{ id: number; name?: string } | null>(null);
  const [userLiked, setUserLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const { comments, loading: loadingComments, load, add, remove } = useComments(postId);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setLoadingPost(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await api.get(`/posts/${postId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const payload = res.data?.data ?? res.data;
      setPost(payload);

      // Inicializamos likes
      setLikesCount(payload.likes_count ?? 0);
      setUserLiked(payload.user_liked ?? false);

    } catch (error: any) {
      console.log("ERROR POST DETAIL ->", error?.response?.data || error?.message);
      Alert.alert("Error", "No se pudo cargar el post");
      router.back();
    } finally {
      setLoadingPost(false);
    }
  }, [postId]);

  const fetchMe = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;
      const r = await api.get("/user", { headers: { Authorization: `Bearer ${token}` } });
      setMe(r.data);
    } catch (e) {
      console.log("ME ERR ->", (e as any)?.response?.data || (e as any)?.message);
    }
  }, []);

  const toggleLike = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Tenés que iniciar sesión para dar like");
        router.replace("/(auth)/login");
        return;
      }

      const res = await api.post(`/likes/toggle`, { post_id: postId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { liked, likes_count } = res.data;
      setUserLiked(liked);
      setLikesCount(likes_count);

    } catch (error: any) {
      console.log("LIKE ERR ->", error?.response?.data || error?.message);
      Alert.alert("Error", "No se pudo actualizar el like");
    }
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    fetchPost();
    load();
    fetchMe();
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
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.author}>Por {post.user?.name ?? "Autor desconocido"}</Text>
      <Text style={styles.content}>{post.content}</Text>

      {/* Likes */}
      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={toggleLike}>
          <Text style={{ fontSize: 16, color: userLiked ? "#ff4444" : "#555" }}>
            {userLiked ? "❤️" : "🤍"} {likesCount} Like{likesCount !== 1 ? "s" : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comentarios */}
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 8 }}>Comentarios</Text>
        <CommentInput onSubmit={add} />
        <CommentList
          items={comments}
          loading={loadingComments}
          currentUserId={me?.id}
          postOwnerId={post?.user_id}
          onDelete={remove}
        />
      </View>

      <Button title="← Volver" onPress={() => router.back()} color="#007bff" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingBottom: 40 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginTop: 10, marginBottom: 6 },
  author: { color: "#555", marginBottom: 16, fontStyle: "italic" },
  content: { fontSize: 16, lineHeight: 22 },
  likesContainer: { marginTop: 12, marginBottom: 16 },
});
