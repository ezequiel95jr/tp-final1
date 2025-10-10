// app/(app)/home.tsx
import React, { useCallback, useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import Button from "../../components/Button";
import PostCard from "../../components/PostCard";
import { router } from "expo-router";

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);

  const ensureAuth = useCallback(async () => {
    const token = await AsyncStorage.getItem("userToken");
    if (!token) router.replace("/login");
    return token;
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const token = await ensureAuth();
      if (!token) return;
      const res = await api.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data?.data ?? res.data ?? []);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "No se pudieron cargar los posts");
    }
  }, [ensureAuth]);

  const handleLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        await api.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (e: any) {
      console.log("LOGOUT ERR ->", e?.response?.data || e?.message);
    } finally {
      await AsyncStorage.removeItem("userToken");
      if (api.defaults.headers?.common?.Authorization) {
        delete api.defaults.headers.common.Authorization;
      }
      router.replace("/login");
      setLoggingOut(false);
    }
  }, [loggingOut]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>

      <Button title="Crear Post" onPress={() => router.push("/crearpost")} color="#007bff" />
      <Button title="Cerrar sesión" onPress={handleLogout} color="#d9534f" />

      <FlatList
        data={posts}
        keyExtractor={(item: any, idx) => item?.id?.toString?.() ?? String(idx)}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            onPress={() => router.push(`/detailPost?id=${item.id}`)}
          />
        )}
        ListEmptyComponent={<Text>No hay posts aún</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
});
