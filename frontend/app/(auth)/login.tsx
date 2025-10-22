// app/(auth)/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import Button from "../../components/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
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
      router.replace("/home"); // <- sin grupos
    } catch (err: any) {
      console.log("LOGIN ERR ->", err?.response?.data || err?.message);
      Alert.alert("Error", err?.response?.data?.message || "No se pudo iniciar sesión");
    }
  };
  return (
    <View style={[styles.container]}>
      <View style={styles.box}>
      <Text style={styles.inputText}>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <Text style={styles.inputText}>Password</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <View style={styles.buttonRow}>

        <TouchableOpacity
          style={[styles.button, styles.loginButton]}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => router.push("/register")}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

      </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  input: {
  borderWidth: 1, marginBottom: 10, padding: 5, borderRadius: 7, width: 250, backgroundColor: "#fff"
  },
  box: {
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#080808ff",
    backgroundColor: "#cff51344",
    borderRadius: 20, 
    padding: 50,

  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,

  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,

  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
  },
  loginButton: {
    backgroundColor: "#2196F3",
  },
  registerButton: {
    backgroundColor: "#4CAF50",
  },
  inputText:{
    color: "#000",
    textAlign: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});