// app/(app)/home.tsx
import React, { useCallback, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import PostCard from "../../components/PostCard";
import { router } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import OverflowMenu from "../../components/OverFlowMenu";
import Button from "../../components/Button";
import NavBar from "../../components/NavBar";


export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loggingOut, setLoggingOut] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = useCallback(async (nextPage = 1) => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;
      const res = await api.get(`/posts?page=${nextPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data?.data ?? [];
      if (nextPage === 1) setPosts(data);
      else setPosts(prev => [...prev, ...data]);

      const meta = res.data?.meta ?? res.data;
      if (meta?.last_page && nextPage >= meta.last_page) setHasMore(false);
      else setHasMore(true);
    } catch (error) {
      console.log("ERROR AL CARGAR POSTS ->", error);
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
        <Text style={styles.title}>Feed</Text>
        <OverflowMenu
          items={[
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
      {hasMore && (
        <Button
          title="Ver más"
          onPress={() => {
            const next = page + 1;
            setPage(next);
            fetchPosts(next);
          }}
        />
      )}
      <View style={styles.container}>

        <NavBar />
      </View>
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
  title: { fontSize: 24, fontWeight: "bold", flex: 1, color: '#ffffff' },
});
