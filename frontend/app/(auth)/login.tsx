// app/(auth)/login.tsx
import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity,Platform } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../../api/api";
import Button from "../../components/Button";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //const TAG = `[${Platform.OS}]`;

/**const testPing = async () => {
  try {
    const response = await fetch("http://192.168.1.7:8000/api/prueba");
    const data = await response.json();
    console.log("✅ PING FETCH OK ->", data);
    Alert.alert("Conexión OK", JSON.stringify(data));
  } catch (error: any) {
    console.log("❌ PING FETCH ERR ->", error?.message || error);
    Alert.alert("Error de conexión", error?.message || "No se pudo conectar al backend");
  }
};*/

  const handleLogin = async () => {
    try {
      const payload = { email: email.trim(), password: password.trim() };
/**console.log(TAG, "LOGIN PAYLOAD", payload);

try {
  const r = await api.post("/login", payload);
  console.log(TAG, "LOGIN RES", r.status, r.data);
} catch (e: any) {
  console.log(TAG, "LOGIN ERR", e?.message, e?.response?.status, e?.config?.baseURL + (e?.config?.url ?? ""));
}*/

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
  /**console.log("PING1 axios GET /prueba");
api.get("/prueba")
  .then(r => console.log("OK1", r.status, r.data))
  .catch(e => console.log("ERR1", e.message));

console.log("PING2 fetch GET /prueba");
fetch("http://192.168.1.7:8000/api/prueba")
  .then(async r => console.log("OK2", r.status, await r.text()))
  .catch(e => console.log("ERR2", String(e)));

console.log("PING3 fetch POST /login");
fetch("http://192.168.1.7:8000/api/login", {
  method: "POST",
  headers: { Accept: "application/json", "Content-Type": "application/json" },
  body: JSON.stringify({ email: "test@test.com", password: "123456" }),
})
  .then(async r => console.log("OK3", r.status, await r.text()))
  .catch(e => console.log("ERR3", String(e)));*/
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