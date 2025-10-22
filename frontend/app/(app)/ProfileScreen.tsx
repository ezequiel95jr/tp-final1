import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import NavBar from "../../components/NavBar";
import api from "../../api/api"; 

export default function ProfileScreen() {
  type User = {
  id?: number;
  name: string;
  email: string;
  created_at: string;
  posts_count?: number;
  avatar?: string | null;
};
const [user, setUser] = useState<User | null>(null);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 1. Cargar datos del usuario autenticado
  const loadUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "No estás autenticado");
        return;
      }

      const res = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setNewName(res.data.name);
    } catch (error) {
      console.error("Error al cargar usuario:", error);
      Alert.alert("Error", "No se pudieron cargar tus datos.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async () => {
    if (newName.trim() === "") {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const res = await api.put(
        "/user",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data.user);
      setEditing(false);
      Alert.alert("Éxito", "Nombre actualizado correctamente ✅");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "No se pudo actualizar el nombre");
    } finally {
      setSaving(false);
    }
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && user) {
      setUser({ ...user, avatar: result.assets[0].uri });
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4f9cff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "#fff" }}>No se encontraron datos del usuario.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickAvatar}>
            <Image
              source={{
                uri:
                  user.avatar ||
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>

          {editing ? (
            <TextInput
              style={styles.nameInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nuevo nombre"
              placeholderTextColor="#888"
            />
          ) : (
            <Text style={styles.name}>{user.name}</Text>
          )}

          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.infoText}>
            📅 Miembro desde: {new Date(user.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.infoText}>
            📝 Publicaciones: {user.posts_count ?? 0}
          </Text>

          {editing ? (
            <TouchableOpacity
              onPress={handleUpdateName}
              style={[styles.button, { backgroundColor: "#3fa36b" }]}
              disabled={saving}
            >
              <Text style={styles.buttonText}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Editar nombre</Text>
            </TouchableOpacity>
          )}

        </View>
      </ScrollView>

      <NavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
    alignItems: "center",
  },
  profileCard: {
    backgroundColor: "#2a2a2a",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#4f9cff",
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    textAlign: "center",
    marginBottom: 6,
  },
  email: {
    color: "#ccc",
    marginBottom: 8,
  },
  infoText: {
    color: "#b0b0b0",
    fontSize: 15,
    marginVertical: 2,
  },
  button: {
    backgroundColor: "#4f9cff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
