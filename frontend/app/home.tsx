import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api"; // tu instancia de Axios

export default function HomeScreen({ navigation }: any) {
  const [posts, setPosts] = useState([]);

  // Obtener posts desde el backend
  const fetchPosts = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        navigation.replace("login");
        return;
      }

      const res = await api.get("/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(res.data);
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "No se pudieron cargar los posts");
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      await api.post("/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      await AsyncStorage.removeItem("userToken");
      navigation.replace("login"); // volver a login
    } catch (error: any) {
      console.log(error.response?.data || error.message);
      Alert.alert("Error", "No se pudo cerrar sesión");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Button title="Crear Post" onPress={() => navigation.navigate("CreatePost")} color="#007bff" />
      <Button title="Cerrar sesión" onPress={handleLogout} color="#d9534f" />
      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.id.toString()}
        style={{ marginTop: 20 }}
        renderItem={({ item }) => (
          <View style={styles.post}>
            <Text style={styles.postTitle}>{item.title}</Text>
            <Text>{item.content}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No hay posts aún</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  post: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
  postTitle: { fontWeight: "bold", marginBottom: 5 },
});
