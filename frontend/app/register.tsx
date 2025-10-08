import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import api from "../api";

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const response = await api.post("/register", { name, email, password });
      Alert.alert("Éxito", "Usuario registrado");
      navigation.navigate("login");
    } catch (error: any) {
      Alert.alert("Error", error.response?.data?.message || "No se pudo registrar");
    }
  };

  return (
    <View style={{ flex:1, justifyContent:"center", padding:20 }}>
      <Text>Nombre</Text>
      <TextInput value={name} onChangeText={setName} style={{ borderWidth:1, marginBottom:10, padding:5 }} />
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} style={{ borderWidth:1, marginBottom:10, padding:5 }} />
      <Text>Password</Text>
      <TextInput value={password} onChangeText={setPassword} secureTextEntry style={{ borderWidth:1, marginBottom:10, padding:5 }} />
      <Button title="Registrarse" onPress={handleRegister} />
      <Button title="Login" onPress={() => navigation.navigate("login")} />
    </View>
  );
}
