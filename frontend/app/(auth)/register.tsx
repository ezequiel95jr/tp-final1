// app/(auth)/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../../api/api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/register", { name, email, password, phone });

      const token = res.data?.token;
      const user = res.data?.user;
      if (!token) throw new Error("No se recibió token del servidor.");

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userId", String(user.id));
      router.replace("/home");
    } catch (error: any) {
      console.log("REGISTER ERROR ->", error.response?.data || error.message);
      const message =
        error.response?.data?.message ||
        "No se pudo registrar el usuario. Revisa los campos.";
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="Tu nombre"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholder="correo@ejemplo.com"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          style={styles.input}
          placeholder="Tu número"
          placeholderTextColor="#999"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor="#999"
        />

        {loading ? (
          <ActivityIndicator size="large" color="#4f9cff" style={{ marginVertical: 20 }} />
        ) : (
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.buttonText}>Registrarse</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.linkText}>¿Ya tienes una cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c", // fondo principal oscuro
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#2a2a2a", // gris intermedio
    borderRadius: 16,
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    fontSize: 15,
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#3a3a3a",
    backgroundColor: "#333",
    borderRadius: 8,
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: "#4f9cff",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkText: {
    color: "#aaa",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
});
