// app/(auth)/register.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import api from "../../api";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const res = await api.post("/register", {
        name,
        email,
        password,
        phone,
      });

      const token = res.data?.token;
      if (!token) throw new Error("No se recibió token del servidor.");

      await AsyncStorage.setItem("userToken", token);

      // Ir directo a Home
      router.replace("/(app)/home");
    } catch (error: any) {
      console.log("REGISTER ERROR ->", error.response?.data || error.message);
      const message =
        error.response?.data?.message ||
        "No se pudo registrar el usuario. Revisa los campos.";
      Alert.alert("Error", message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Teléfono"
        value={phone}
        onChangeText={setPhone}
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ marginBottom: 10, borderWidth: 1, padding: 8 }}
      />
      <Button title="Registrarse" onPress={handleRegister} />
    </View>
  );
}
