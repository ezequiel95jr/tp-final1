// app/(app)/home.tsx
import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import PostCard from "../../components/PostCard";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import OverflowMenu from "../../components/OverFlowMenu";

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        router.replace("/login"); 
        return;
      }
      const res = await api.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data?.data ?? res.data ?? []);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "No se pudieron cargar los posts");
    }
  }, []);

  const handleLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        await api.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      }
    } catch (error: any) {
      console.log("LOGOUT ERR ->", error?.response?.data || error?.message);
    } finally {
      await AsyncStorage.removeItem("userToken");
      if (api.defaults.headers?.common?.Authorization) {
        delete api.defaults.headers.common.Authorization;
      }
      router.replace("/login");
      setLoggingOut(false);
    }
  }, [loggingOut]);

  useFocusEffect(useCallback(() => { fetchPosts(); }, [fetchPosts]));

  return (
    <View style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <OverflowMenu
          items={[
            { label: "Crear post", onPress: () => router.push("/crearpost") },
            { label: "Cerrar sesión", onPress: handleLogout },
          ]}
        />
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item: any, idx) => item?.id?.toString?.() ?? String(idx)}
        renderItem={({ item }) => (
          <PostCard
            item={item}
            onPress={() => router.push(`/detailPost?id=${item.id}`)}
          />
        )}
        ListEmptyComponent={<Text>No hay posts aún</Text>}
        contentContainerStyle={{ paddingTop: 8 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 24, fontWeight: "bold", flex: 1 },
});
