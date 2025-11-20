import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import api from "../../api/api"; // 
import NavBar from "../../components/NavBar";

export default function ProfileScreen() {
  const [profile, setProfile] = useState<{ name: string; email: string; image?: string }>({
    name: "",
    email: "",
    image: "",
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");

 
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) {
          Alert.alert("Error", "No hay token de usuario almacenado");
          return;
        }

        const res = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfile({
          name: res.data.name || "",
          email: res.data.email || "",
          image: res.data.image || "",
        });

        setNewName(res.data.name || "");
      } catch (err: any) {
        console.log("Error al cargar perfil:", err?.response?.data || err);
        Alert.alert("Error", "No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        setProfile((prev) => ({ ...prev, image: imageUri }));
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo acceder a la galería");
    }
  };

  
  const saveChanges = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "El nombre no puede estar vacío");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) return;

      const res = await api.put(
        "/user",
        { name: newName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setProfile((prev) => ({ ...prev, name: res.data.name }));
      setEditing(false);
      Alert.alert("✅", "Perfil actualizado correctamente");
    } catch (err) {
      console.log("Error al actualizar perfil:", err);
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4f9cff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage}>
        {profile.image ? (
          <Image source={{ uri: profile.image }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              {profile.name ? profile.name[0] : "?"}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {editing ? (
        <>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Nuevo nombre"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveChanges}>
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.email}>{profile.email}</Text>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditing(true)}
          >
            <Text style={styles.editButtonText}>Editar perfil</Text>
          </TouchableOpacity>
        </>
        
      )}
      <NavBar />
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#1c1c1c",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#444",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  placeholderText: { fontSize: 42, color: "#fff" },
  name: { fontSize: 22, fontWeight: "700", color: "#fff" },
  email: { fontSize: 16, color: "#aaa", marginTop: 6 },
  editButton: {
    marginTop: 20,
    backgroundColor: "#4f9cff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  editButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#666",
    backgroundColor: "#2a2a2a",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: 250,
    textAlign: "center",
  },
  saveButton: {
    marginTop: 12,
    backgroundColor: "#3fa36b",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  saveButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
