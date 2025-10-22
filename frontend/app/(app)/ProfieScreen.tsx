import React, { useState, useEffect } from "react";
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
import NavBar from "../../components/NavBar";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const [user, setUser] = useState({
    name: "Usuario Demo",
    email: "usuario@ejemplo.com",
    createdAt: "2025-01-10",
    postsCount: 12,
    avatar:
      "https://cdn-icons-png.flaticon.com/512/149/149071.png", // avatar por defecto
  });
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user.name);
  const [loading, setLoading] = useState(false);

  // Simulación de carga (cuando haya backend, reemplazás esto por un fetch)
  useEffect(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  }, []);

  const handleEditToggle = () => {
    if (editing) {
      if (newName.trim() === "") {
        Alert.alert("Error", "El nombre no puede estar vacío");
        return;
      }
      setUser({ ...user, name: newName });
      // Acá iría el POST o PATCH al backend para guardar el cambio
    }
    setEditing(!editing);
  };

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setUser({ ...user, avatar: result.assets[0].uri });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#4f9cff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickAvatar}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
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
            📅 Miembro desde: {user.createdAt}
          </Text>
          <Text style={styles.infoText}>📝 Publicaciones: {user.postsCount}</Text>

          <TouchableOpacity
            onPress={handleEditToggle}
            style={[styles.button, editing && styles.buttonSave]}
          >
            <Text style={styles.buttonText}>
              {editing ? "Guardar cambios" : "Editar nombre"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.removeItem("userToken");
              Alert.alert("Sesión cerrada", "Has cerrado sesión correctamente.");
              // Redirigí al login
            }}
            style={[styles.button, { backgroundColor: "#b53737", marginTop: 10 }]}
          >
            <Text style={styles.buttonText}>Cerrar sesión</Text>
          </TouchableOpacity>
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
  buttonSave: {
    backgroundColor: "#3fa36b",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
});
