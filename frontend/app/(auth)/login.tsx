// app/(auth)/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/login", { email, password });
      const token = res.data?.token;
      const user = res.data?.user;

      if (!token) {
        Alert.alert("Error", "El backend no devolvió token");
        return;
      }

      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userId", String(user.id));
      router.replace("/home");
    } catch (err: any) {
      console.log("LOGIN ERR ->", err?.response?.data || err?.message);
      Alert.alert("Error", err?.response?.data?.message || "No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Iniciar Sesión</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
          placeholder="correo@ejemplo.com"
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
          <ActivityIndicator size="large" color="#4f9cff" style={{ marginVertical: 10 }} />
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.registerButton]}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1c1c", // fondo gris oscuro
    alignItems: "center",
    justifyContent: "center",
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  loginButton: {
    backgroundColor: "#4f9cff", // azul sutil de acento
  },
  registerButton: {
    backgroundColor: "#3fa36b", // verde grisáceo
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
