import React, { useEffect, useMemo, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, StyleSheet, Alert, Image, ScrollView, TouchableOpacity, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, router } from "expo-router";
import api from "../../api/api";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";
// Comentarios
import CommentInput from "../../components/Comments/CommentInput";
import CommentList from "../../components/Comments/CommentList";
import { useComments } from "../../components/Comments/useComments";

function confirmDelete(title: string, message: string): Promise<boolean> {
  if (Platform.OS === "web") {
    // confirm() devuelve true/false
    return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  }
  // En móvil mostramos Alert con 2 botones y resolvemos una promesa
  return new Promise((resolve) => {
    Alert.alert(
      title,
      message,
      [
        { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
        { text: "Eliminar", style: "destructive", onPress: () => resolve(true) },
      ],
      { cancelable: true }
    );
  });
}

export default function DetailPost() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const postId = useMemo(() => Number(id), [id]);

  const [post, setPost] = useState<any>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [me, setMe] = useState<{ id: number; name?: string } | null>(null);
  const [userLiked, setUserLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [deleting, setDeleting] = useState(false);
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
      const userId = await AsyncStorage.getItem("userId");
      if (!token || !userId) return;


      const r = await api.get(`/users/${Number(userId)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleDeletePost = useCallback(async () => {
    if (!post?.id || !me) return;

    // seguridad extra en el front (el back también valida)
    if (me.id !== post.user_id) {
      Alert.alert("Acceso denegado", "Solo el dueño del post puede eliminarlo");
      return;
    }

    try {
      setDeleting(true);
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Sesión", "Tenés que iniciar sesión para eliminar posts");
        router.replace("/(auth)/login");
        return;
      }

      await api.delete(`/posts/${post.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert("Eliminado", "El post se eliminó correctamente");
      router.replace("/(app)/home");
    } catch (err: any) {
      console.log("DELETE ERR ->", err?.response?.data || err?.message);
      Alert.alert("Error", "No se pudo eliminar el post");
    } finally {
      setDeleting(false);
    }
  }, [me, post]);

  const handleConfirmDelete = useCallback(() => {
    Alert.alert(
      "Eliminar post",
      "¿Seguro que querés eliminar este post?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => handleDeletePost(),
        },
      ]
    );
  }, []);

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
      {post.image && (
        <Image
          source={{ uri: post.image_url ?? post.image }}
          style={styles.postImage}
          resizeMode="cover"
        />

      )}

      {/* Likes */}
      <View style={styles.likesContainer}>
        <TouchableOpacity onPress={toggleLike}>
          <Text style={{ fontSize: 16, color: userLiked ? "#ff4444" : "#555" }}>
            {userLiked ? "❤️" : "🤍"} {likesCount} Like{likesCount !== 1 ? "s" : ""}
          </Text>
        </TouchableOpacity>
        {me?.id === post?.user_id && (
          <View style={{ marginVertical: 12 }}>
            <Button
              title={deleting ? "Eliminando..." : "Eliminar post"}
              color="#d9534f"
              disabled={deleting}
              onPress={async () => {
                const ok = await confirmDelete("Eliminar post", "¿Seguro que querés eliminar este post?");
                if (ok) handleDeletePost();
              }}
            />
          </View>
        )}
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
      <View style={styles.container}>
        <NavBar />
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
  likesContainer: { marginTop: 12, marginBottom: 16 },
  postImage: {
    width: "100%",
    height: 250,
    borderRadius: 10,
    marginVertical: 16,
    backgroundColor: "#eee", // fondo gris claro mientras carga
  },

});

