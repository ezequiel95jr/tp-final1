// app/(auth)/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api";
import Button from "../../components/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/login", { email, password });
      const token = res.data?.token;
      if (!token) {
        Alert.alert("Error", "El backend no devolvió token");
        return;
      }
      await AsyncStorage.setItem("userToken", token);
      router.replace("/home"); // <- sin grupos
    } catch (err: any) {
      console.log("LOGIN ERR ->", err?.response?.data || err?.message);
      Alert.alert("Error", err?.response?.data?.message || "No se pudo iniciar sesión");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button title="Registrarse" onPress={() => router.push("/register")} />
    </View>
  );
}
