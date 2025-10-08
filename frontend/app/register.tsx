// RegisterScreen.tsx
import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async () => {
    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        phone,
      });

      const token = response.data.token;

      await AsyncStorage.setItem("userToken", token);

      // Redirige directamente a Home
      navigation.replace("Home");
    } catch (error: any) {
      // Si el backend devuelve un error de validación, se muestra
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
